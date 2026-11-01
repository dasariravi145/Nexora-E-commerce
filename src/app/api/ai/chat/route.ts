import { checkRateLimit } from "@/lib/server/rate-limit";
import type { AiChatResponseBody, AiChatErrorResponse } from "@/types";

/**
 * Server-only route handler.
 * Dynamically handles POST requests without static caching.
 */
const NO_CACHE_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

const MAX_PAYLOAD_BYTES = 16 * 1024; // 16 KB request body limit
const DEFAULT_TIMEOUT_MS = 45000; // 45 seconds default upstream timeout

/**
 * Safely derives an identifier for local development rate limiting.
 *
 * SECURITY NOTICE:
 * Client-supplied headers like 'x-forwarded-for' or 'x-real-ip' CANNOT be trusted
 * as verified identity without an authenticating reverse proxy that strips spoofed headers.
 * For local development and single-node instances, we sanitize the header or fall back
 * to a local identifier. In-memory rate limiting is not production-grade across multiple
 * horizontal instances.
 */
function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const rawIp = forwarded.split(",")[0]?.trim();
    if (rawIp && /^[a-zA-Z0-9.:%-]{1,45}$/.test(rawIp)) {
      return `ip:${rawIp}`;
    }
  }
  return "client:local";
}

/**
 * POST /api/ai/chat
 *
 * Server-side secure proxy for local n8n AI Assistant integrations.
 *
 * Responsibilities:
 * 1. Enforces local rate limiting (HTTP 429).
 * 2. Enforces request size bounds (HTTP 413) and payload validation (HTTP 400).
 * 3. Safely forwards user prompts to n8n webhook using the private authentication header 'x-nexora-api-key'.
 * 4. Never exposes n8n webhook URLs or credentials to client code or responses.
 * 5. Handles timeouts (HTTP 504), network errors (HTTP 502), and invalid replies (HTTP 502).
 */
export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  return Response.json({
    status: "static_export_showcase",
    message: "NEXORA AI Assistant chat endpoint operates in static demonstration mode.",
  });
}

export async function POST(request?: Request): Promise<Response> {
  if (process.env.NEXT_EXPORT === "true" || !request) {
    return Response.json({
      reply: "NEXORA AI Assistant is operating in portfolio showcase mode. Local n8n automation is offline.",
      sessionId: "showcase",
    });
  }

  // 1. Rate Limiting Check
  const clientId = getClientIdentifier(request);
  const rateLimit = checkRateLimit(clientId);

  if (!rateLimit.allowed) {
    return Response.json(
      {
        error: "Too many chat requests. Please slow down and try again.",
        code: "RATE_LIMITED",
      } satisfies AiChatErrorResponse,
      {
        status: 429,
        headers: {
          ...NO_CACHE_HEADERS,
          "Retry-After": String(rateLimit.retryAfterSeconds),
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // 2. Request Size Validation (Header & Buffer limits)
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return Response.json(
      {
        error: "Payload too large. Maximum request size is 16 KB.",
        code: "PAYLOAD_TOO_LARGE",
      } satisfies AiChatErrorResponse,
      { status: 413, headers: NO_CACHE_HEADERS }
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return Response.json(
      {
        error: "Unable to read request payload.",
        code: "BAD_REQUEST",
      } satisfies AiChatErrorResponse,
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  if (rawBody.length > MAX_PAYLOAD_BYTES) {
    return Response.json(
      {
        error: "Payload too large. Maximum request size is 16 KB.",
        code: "PAYLOAD_TOO_LARGE",
      } satisfies AiChatErrorResponse,
      { status: 413, headers: NO_CACHE_HEADERS }
    );
  }

  // 3. JSON Parsing & Structure Validation
  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return Response.json(
      {
        error: "Malformed JSON payload.",
        code: "INVALID_JSON",
      } satisfies AiChatErrorResponse,
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json(
      {
        error: "Request body must be a JSON object containing 'message' and 'sessionId'.",
        code: "INVALID_BODY",
      } satisfies AiChatErrorResponse,
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  const { message, sessionId } = body as Record<string, unknown>;

  // Validate 'message'
  if (typeof message !== "string" || message.trim().length === 0) {
    return Response.json(
      {
        error: "The 'message' field is required and must not be empty.",
        code: "INVALID_MESSAGE",
      } satisfies AiChatErrorResponse,
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  if (message.length > 1000) {
    return Response.json(
      {
        error: "The 'message' field exceeds the maximum limit of 1,000 characters.",
        code: "MESSAGE_TOO_LONG",
      } satisfies AiChatErrorResponse,
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  // Validate 'sessionId' (alphanumeric, hyphens, underscores, 1-100 characters)
  if (typeof sessionId !== "string" || sessionId.trim().length === 0) {
    return Response.json(
      {
        error: "The 'sessionId' field is required and must not be empty.",
        code: "INVALID_SESSION_ID",
      } satisfies AiChatErrorResponse,
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  const cleanSessionId = sessionId.trim();
  if (cleanSessionId.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(cleanSessionId)) {
    return Response.json(
      {
        error: "Invalid 'sessionId'. Must be between 1 and 100 alphanumeric characters, hyphens, or underscores.",
        code: "INVALID_SESSION_ID",
      } satisfies AiChatErrorResponse,
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  // 4. Verify Server Upstream Configuration (Fail closed without exposing secrets)
  const upstreamUrl = process.env.N8N_WEBHOOK_URL;
  const upstreamSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!upstreamUrl || upstreamUrl.trim().length === 0 || !upstreamSecret || upstreamSecret.trim().length === 0) {
    return Response.json(
      {
        error: "AI Assistant service is not configured on this server.",
        code: "SERVICE_UNCONFIGURED",
      } satisfies AiChatErrorResponse,
      { status: 503, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const parsed = new URL(upstreamUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Invalid protocol");
    }
  } catch {
    return Response.json(
      {
        error: "AI Assistant service configuration is invalid.",
        code: "SERVICE_MISCONFIGURED",
      } satisfies AiChatErrorResponse,
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }

  // 5. Configurable Upstream Timeout
  let timeoutMs = DEFAULT_TIMEOUT_MS;
  if (process.env.N8N_TIMEOUT_MS) {
    const parsedTimeout = parseInt(process.env.N8N_TIMEOUT_MS, 10);
    if (!isNaN(parsedTimeout) && parsedTimeout > 0) {
      timeoutMs = parsedTimeout;
    }
  }

  // 6. Forward to n8n Webhook
  const upstreamStartTime = Date.now();
  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(upstreamUrl.trim(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-nexora-api-key": upstreamSecret.trim(),
      },
      body: JSON.stringify({
        message: message.trim(),
        sessionId: cleanSessionId,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err: unknown) {
    const upstreamDurationMs = Date.now() - upstreamStartTime;
    if (process.env.NODE_ENV !== "production") {
      console.error(
        `[NEXORA AI Proxy] Upstream fetch failure: reason=${err instanceof Error ? err.name : "unknown"}, duration=${upstreamDurationMs}ms`
      );
    }

    if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
      return Response.json(
        {
          error: "The AI assistant took too long to respond. Please try again.",
          code: "UPSTREAM_TIMEOUT",
        } satisfies AiChatErrorResponse,
        { status: 504, headers: NO_CACHE_HEADERS }
      );
    }

    return Response.json(
      {
        error: "The AI assistant service is temporarily unavailable. Please try again shortly.",
        code: "UPSTREAM_UNAVAILABLE",
      } satisfies AiChatErrorResponse,
      { status: 502, headers: NO_CACHE_HEADERS }
    );
  }

  const upstreamDurationMs = Date.now() - upstreamStartTime;

  // 7. Handle Upstream HTTP Errors
  if (!upstreamResponse.ok) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        `[NEXORA AI Proxy] Upstream returned non-200 status: ${upstreamResponse.status}, duration=${upstreamDurationMs}ms`
      );
    }

    if (upstreamUrl.includes("/webhook-test/") && (upstreamResponse.status === 404 || upstreamResponse.status === 500)) {
      return Response.json(
        {
          error: "The AI assistant test listener is inactive. Please click 'Test workflow' in the automation workflow editor or activate the production workflow.",
          code: "UPSTREAM_TEST_WEBHOOK_INACTIVE",
        } satisfies AiChatErrorResponse,
        { status: 502, headers: NO_CACHE_HEADERS }
      );
    }

    return Response.json(
      {
        error: "The AI assistant service returned an error. Please try again later.",
        code: "UPSTREAM_ERROR",
      } satisfies AiChatErrorResponse,
      { status: 502, headers: NO_CACHE_HEADERS }
    );
  }

  // 8. Validate n8n Response JSON ({ reply: string })
  let responseData: unknown;
  try {
    responseData = await upstreamResponse.json();
  } catch {
    return Response.json(
      {
        error: "Received an unparseable response from the assistant service.",
        code: "UPSTREAM_MALFORMED",
      } satisfies AiChatErrorResponse,
      { status: 502, headers: NO_CACHE_HEADERS }
    );
  }

  if (
    !responseData ||
    typeof responseData !== "object" ||
    Array.isArray(responseData) ||
    typeof (responseData as Record<string, unknown>).reply !== "string"
  ) {
    return Response.json(
      {
        error: "Received an invalid response format from the assistant service.",
        code: "UPSTREAM_MALFORMED",
      } satisfies AiChatErrorResponse,
      { status: 502, headers: NO_CACHE_HEADERS }
    );
  }

  const replyText = (responseData as Record<string, unknown>).reply as string;

  return Response.json(
    {
      reply: replyText,
      sessionId: cleanSessionId,
    } satisfies AiChatResponseBody,
    {
      status: 200,
      headers: {
        ...NO_CACHE_HEADERS,
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": String(rateLimit.remaining),
      },
    }
  );
}

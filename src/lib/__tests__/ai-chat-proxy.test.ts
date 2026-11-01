import { POST } from "../../app/api/ai/chat/route";
import { resetRateLimits } from "../server/rate-limit";
import type { AiChatResponseBody, AiChatErrorResponse } from "@/types";

/**
 * NEXORA AI Chat Proxy Focused Test Suite
 *
 * Validates:
 * 1. Payload validation (message presence, 1-1,000 char bounds, session ID bounds, size limits)
 * 2. Fail-closed server behavior when n8n configuration is absent
 * 3. Exact forwarding of 'x-nexora-api-key' authentication header and body
 * 4. Successful upstream replies ({ reply: string })
 * 5. Sanitized handling of upstream errors (500s), timeouts (504), and malformed payloads (502)
 * 6. Local in-memory sliding-window rate limiting (429)
 */
async function runTests() {
  console.log("================================================================================");
  console.log("   NEXORA — AI CHAT PROXY & RATE LIMITING TEST SUITE                           ");
  console.log("================================================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed += 1;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed += 1;
    }
  }

  const originalEnvUrl = process.env.N8N_WEBHOOK_URL;
  const originalEnvSecret = process.env.N8N_WEBHOOK_SECRET;
  const originalEnvTimeout = process.env.N8N_TIMEOUT_MS;
  const originalFetch = globalThis.fetch;

  const TEST_WEBHOOK_URL = "https://internal-n8n.example.local/webhook/chat";
  const TEST_WEBHOOK_SECRET = "n8n-secret-super-secure-key-12345";

  // Helper to construct POST requests
  function makeRequest(
    body: unknown,
    headers: Record<string, string> = { "Content-Type": "application/json" }
  ): Request {
    return new Request("http://localhost:3000/api/ai/chat", {
      method: "POST",
      headers,
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
  }

  try {
    resetRateLimits();

    // =========================================================================
    // 1. INPUT & BOUNDS VALIDATION
    // =========================================================================
    {
      // Missing message
      const res1 = await POST(makeRequest({ sessionId: "session-01" }));
      assert(res1.status === 400, "Test 1a: Missing message returns 400 Bad Request");
      const data1 = (await res1.json()) as AiChatErrorResponse;
      assert(data1.code === "INVALID_MESSAGE", "Test 1b: Returns INVALID_MESSAGE code");

      // Empty whitespace message
      const res2 = await POST(makeRequest({ message: "   ", sessionId: "session-01" }));
      assert(res2.status === 400, "Test 1c: Blank whitespace message returns 400 Bad Request");

      // Message exceeding 1,000 characters
      const longMessage = "a".repeat(1001);
      const res3 = await POST(makeRequest({ message: longMessage, sessionId: "session-01" }));
      assert(res3.status === 400, "Test 1d: Message > 1,000 chars returns 400 Bad Request");
      const data3 = (await res3.json()) as AiChatErrorResponse;
      assert(data3.code === "MESSAGE_TOO_LONG", "Test 1e: Returns MESSAGE_TOO_LONG code");

      // Missing sessionId
      const res4 = await POST(makeRequest({ message: "Hello" }));
      assert(res4.status === 400, "Test 1f: Missing sessionId returns 400 Bad Request");
      const data4 = (await res4.json()) as AiChatErrorResponse;
      assert(data4.code === "INVALID_SESSION_ID", "Test 1g: Returns INVALID_SESSION_ID code");

      // Invalid characters in sessionId
      const res5 = await POST(makeRequest({ message: "Hello", sessionId: "bad session with spaces!" }));
      assert(res5.status === 400, "Test 1h: Invalid characters in sessionId returns 400 Bad Request");

      // SessionId exceeding 100 characters
      const res6 = await POST(makeRequest({ message: "Hello", sessionId: "s".repeat(101) }));
      assert(res6.status === 400, "Test 1i: SessionId > 100 chars returns 400 Bad Request");

      // Malformed JSON
      const res7 = await POST(makeRequest("{ broken json", { "Content-Type": "application/json" }));
      assert(res7.status === 400, "Test 1j: Malformed JSON syntax returns 400 Bad Request");

      // Payload > 16KB
      const hugeString = "x".repeat(17 * 1024);
      const res8 = await POST(new Request("http://localhost:3000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "content-length": String(hugeString.length) },
        body: hugeString,
      }));
      assert(res8.status === 413, "Test 1k: Body exceeding 16KB returns 413 Payload Too Large");
    }

    // =========================================================================
    // 2. FAIL-CLOSED CONFIGURATION CHECKS
    // =========================================================================
    {
      delete process.env.N8N_WEBHOOK_URL;
      delete process.env.N8N_WEBHOOK_SECRET;

      const resNoUrl = await POST(makeRequest({ message: "Hello", sessionId: "sess-01" }));
      assert(resNoUrl.status === 503, "Test 2a: Missing n8n config returns 503 Service Unavailable");
      const dataNoUrl = (await resNoUrl.json()) as AiChatErrorResponse;
      assert(dataNoUrl.code === "SERVICE_UNCONFIGURED", "Test 2b: Returns SERVICE_UNCONFIGURED code");

      process.env.N8N_WEBHOOK_URL = "ftp://invalid-protocol.example.com";
      process.env.N8N_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;
      const resBadProtocol = await POST(makeRequest({ message: "Hello", sessionId: "sess-01" }));
      assert(resBadProtocol.status === 500, "Test 2c: Non-HTTP protocol returns 500 Configuration Error");
    }

    // Configure valid test environment
    process.env.N8N_WEBHOOK_URL = TEST_WEBHOOK_URL;
    process.env.N8N_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;

    // =========================================================================
    // 3. UPSTREAM FORWARDING & AUTHENTICATION HEADER
    // =========================================================================
    {
      let capturedUrl = "";
      let capturedHeaderKey = "";
      let capturedBody: Record<string, unknown> = {};

      globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
        capturedUrl = url.toString();
        const headers = new Headers(init?.headers);
        capturedHeaderKey = headers.get("x-nexora-api-key") || "";
        capturedBody = JSON.parse((init?.body as string) || "{}");

        return Response.json({
          reply: "Welcome to NEXORA. How may I assist your hardware inquiry today?",
        });
      }) as typeof fetch;

      const res = await POST(makeRequest({
        message: "Tell me about the Nova 1 Pro",
        sessionId: "session-client-99",
      }));

      assert(res.status === 200, "Test 3a: Successful upstream call returns 200 OK");
      assert(
        capturedUrl === TEST_WEBHOOK_URL,
        "Test 3b: Upstream URL matches configured N8N_WEBHOOK_URL"
      );
      assert(
        capturedHeaderKey === TEST_WEBHOOK_SECRET,
        "Test 3c: Forwards exact 'x-nexora-api-key' header with N8N_WEBHOOK_SECRET"
      );
      assert(
        capturedBody.message === "Tell me about the Nova 1 Pro" &&
        capturedBody.sessionId === "session-client-99",
        "Test 3d: Forwards trimmed message and bounded sessionId in JSON payload"
      );

      const data = (await res.json()) as AiChatResponseBody;
      assert(
        data.reply.includes("Nova 1 Pro") || data.reply.length > 0,
        "Test 3e: Response contains validated reply string"
      );
      assert(
        data.sessionId === "session-client-99",
        "Test 3f: Response echoes verified sessionId"
      );
    }

    // =========================================================================
    // 4. SANITIZED UPSTREAM ERROR HANDLING
    // =========================================================================
    {
      // Upstream 500 Error
      globalThis.fetch = (async () => {
        return new Response("Internal Server Error in n8n", { status: 500 });
      }) as typeof fetch;

      const res500 = await POST(makeRequest({ message: "Hello", sessionId: "sess-err" }));
      assert(res500.status === 502, "Test 4a: Upstream 500 error mapped to sanitized 502 Bad Gateway");
      const data500 = (await res500.json()) as AiChatErrorResponse;
      assert(
        !data500.error.includes("n8n") && data500.code === "UPSTREAM_ERROR",
        "Test 4b: Upstream error message never exposes internal service names"
      );

      // Malformed Non-JSON upstream reply
      globalThis.fetch = (async () => {
        return new Response("<html>Gateway timeout or proxy crash</html>", {
          status: 200,
          headers: { "Content-Type": "text/html" },
        });
      }) as typeof fetch;

      const resMalformed = await POST(makeRequest({ message: "Hello", sessionId: "sess-err" }));
      assert(resMalformed.status === 502, "Test 4c: Non-JSON upstream reply mapped to 502 Bad Gateway");
      const dataMalformed = (await resMalformed.json()) as AiChatErrorResponse;
      assert(dataMalformed.code === "UPSTREAM_MALFORMED", "Test 4d: Malformed JSON flagged with UPSTREAM_MALFORMED");

      // Missing 'reply' field in JSON
      globalThis.fetch = (async () => {
        return Response.json({ status: "success", randomField: 123 });
      }) as typeof fetch;

      const resNoReply = await POST(makeRequest({ message: "Hello", sessionId: "sess-err" }));
      assert(resNoReply.status === 502, "Test 4e: Missing reply field in JSON mapped to 502 Bad Gateway");

      // Upstream Timeout (simulating AbortSignal timeout)
      globalThis.fetch = (async () => {
        const timeoutError = new Error("The operation was aborted due to timeout");
        timeoutError.name = "TimeoutError";
        throw timeoutError;
      }) as typeof fetch;

      const resTimeout = await POST(makeRequest({ message: "Hello", sessionId: "sess-err" }));
      assert(resTimeout.status === 504, "Test 4f: Timeout error mapped to 504 Gateway Timeout");
      const dataTimeout = (await resTimeout.json()) as AiChatErrorResponse;
      assert(dataTimeout.code === "UPSTREAM_TIMEOUT", "Test 4g: Timeout flagged with UPSTREAM_TIMEOUT");
    }

    // =========================================================================
    // 5. LOCAL-DEVELOPMENT RATE LIMITING
    // =========================================================================
    {
      resetRateLimits();

      // Mock fast success
      globalThis.fetch = (async () => {
        return Response.json({ reply: "Acknowledged." });
      }) as typeof fetch;

      const testIpHeaders = {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.100",
      };

      // Send 20 permitted requests under default limit of 20
      let allPassed = true;
      for (let i = 0; i < 20; i++) {
        const res = await POST(makeRequest({ message: `Message ${i}`, sessionId: "sess-limit" }, testIpHeaders));
        if (res.status !== 200) {
          allPassed = false;
          break;
        }
      }
      assert(allPassed, "Test 5a: First 20 consecutive requests succeed within sliding window");

      // 21st request must trigger 429 Too Many Requests
      const resBlocked = await POST(makeRequest({ message: "Message 21", sessionId: "sess-limit" }, testIpHeaders));
      assert(resBlocked.status === 429, "Test 5b: 21st request is blocked with HTTP 429 Too Many Requests");

      const retryAfter = resBlocked.headers.get("retry-after");
      assert(
        typeof retryAfter === "string" && parseInt(retryAfter, 10) > 0,
        "Test 5c: 429 response includes valid Retry-After header",
        `Retry-After: ${retryAfter}`
      );

      const dataBlocked = (await resBlocked.json()) as AiChatErrorResponse;
      assert(dataBlocked.code === "RATE_LIMITED", "Test 5d: Blocked response returns RATE_LIMITED code");

      // Verify a different IP is not blocked (partitioned by client identifier)
      const otherIpHeaders = {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.101",
      };
      const resOther = await POST(makeRequest({ message: "Message from other client", sessionId: "sess-limit" }, otherIpHeaders));
      assert(resOther.status === 200, "Test 5e: Separate client partition is not affected by blocked identifier");
    }

  } finally {
    // Restore environment and fetch
    process.env.N8N_WEBHOOK_URL = originalEnvUrl;
    process.env.N8N_WEBHOOK_SECRET = originalEnvSecret;
    process.env.N8N_TIMEOUT_MS = originalEnvTimeout;
    globalThis.fetch = originalFetch;
  }

  console.log("================================================================================");
  console.log(`   TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}    `);
  console.log("================================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner threw unexpected error:", err);
  process.exit(1);
});

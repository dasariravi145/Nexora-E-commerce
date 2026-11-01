import { timingSafeEqual, createHash } from "node:crypto";

/**
 * Constant-time comparison of two strings using SHA-256 digests.
 * Prevents timing attacks and buffer length mismatch exceptions.
 * Never logs or reveals secret contents.
 *
 * @param provided The token provided in the request
 * @param expected The server secret stored in process.env
 * @returns boolean indicating whether the tokens match exactly
 */
export function safeCompareKeys(provided: string, expected: string): boolean {
  if (!provided || !expected) {
    return false;
  }
  const hashProvided = createHash("sha256").update(provided).digest();
  const hashExpected = createHash("sha256").update(expected).digest();
  return timingSafeEqual(hashProvided, hashExpected);
}

export interface AuthValidationResult {
  authorized: boolean;
  status?: number;
  errorCode?: "AUTH_MISCONFIGURED" | "UNAUTHORIZED";
  errorMessage?: string;
}

/**
 * Validates the incoming agent API request against the server's NEXORA_AGENT_API_KEY.
 * Fails closed (status 500) if the server environment variable is not configured or empty.
 * Returns 401 if the provided key is missing or invalid.
 *
 * @param headerKey The value extracted from the X-Nexora-Agent-Key request header
 * @returns AuthValidationResult
 */
export function validateAgentApiKey(headerKey?: string | null): AuthValidationResult {
  const serverKey = process.env.NEXORA_AGENT_API_KEY;

  // Fail closed if the server environment variable is missing or blank
  if (!serverKey || serverKey.trim().length === 0) {
    return {
      authorized: false,
      status: 500,
      errorCode: "AUTH_MISCONFIGURED",
      errorMessage: "AI Agent API authentication is not configured on this server.",
    };
  }

  // Reject missing or malformed header
  if (!headerKey || !safeCompareKeys(headerKey.trim(), serverKey.trim())) {
    return {
      authorized: false,
      status: 401,
      errorCode: "UNAUTHORIZED",
      errorMessage: "Unauthorized: A valid 'X-Nexora-Agent-Key' header is required.",
    };
  }

  return { authorized: true };
}

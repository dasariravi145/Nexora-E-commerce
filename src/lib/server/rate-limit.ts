/**
 * NEXORA In-Memory Rate Limiter (Local & Single-Node Development)
 *
 * ARCHITECTURAL NOTICE:
 * 1. Multi-Instance Limitation:
 *    This in-memory rate limiter stores request timestamps in local process memory.
 *    It is designed for local development and single-node evaluation. It is NOT
 *    production-grade across multiple horizontal instances, auto-scaled containers,
 *    or serverless environments where state is not synchronized. For distributed
 *    production deployments, use a centralized token-bucket store (e.g., Redis).
 *
 * 2. Client Identity & Forwarding Headers:
 *    Arbitrary client-supplied headers (e.g., x-forwarded-for, x-real-ip) CANNOT
 *    be trusted as verified IP addresses because untrusted clients can forge them.
 *    In production, client IPs must be derived strictly from a trusted edge reverse
 *    proxy that strips or validates untrusted upstream headers.
 */

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds (default: 60,000 = 1 minute)
  maxRequests?: number; // Max requests allowed per window (default: 20)
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute
const DEFAULT_MAX_REQUESTS = 20;
const MAX_TRACKED_ENTRIES = 5000;

// Internal in-memory store: identifier -> array of request timestamps (epoch ms)
const hitLog = new Map<string, number[]>();

/**
 * Periodically prunes expired entries to prevent memory exhaustion in long-running processes.
 */
function pruneStaleEntries(now: number, windowMs: number): void {
  if (hitLog.size > MAX_TRACKED_ENTRIES) {
    for (const [key, timestamps] of hitLog.entries()) {
      const valid = timestamps.filter((t) => now - t < windowMs);
      if (valid.length === 0) {
        hitLog.delete(key);
      } else {
        hitLog.set(key, valid);
      }
    }
  }
}

/**
 * Evaluates whether a request from the given identifier is permitted under the sliding window.
 *
 * @param identifier Unique client key (e.g. sanitized IP or session identifier)
 * @param options Window duration and request threshold
 * @returns RateLimitResult with remaining allowance and retry duration
 */
export function checkRateLimit(
  identifier: string,
  options?: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS;
  const maxRequests = options?.maxRequests ?? DEFAULT_MAX_REQUESTS;

  pruneStaleEntries(now, windowMs);

  const cleanId = identifier.trim() || "anonymous";
  const existingHits = hitLog.get(cleanId) || [];

  // Filter hits to only those within the active sliding window
  const activeHits = existingHits.filter((timestamp) => now - timestamp < windowMs);

  if (activeHits.length >= maxRequests) {
    const oldestHit = activeHits[0];
    const resetTime = oldestHit + windowMs;
    const retryAfterMs = Math.max(0, resetTime - now);
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);

    // Persist current active hits
    hitLog.set(cleanId, activeHits);

    return {
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  // Record this hit
  activeHits.push(now);
  hitLog.set(cleanId, activeHits);

  return {
    allowed: true,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - activeHits.length),
    retryAfterSeconds: 0,
  };
}

/**
 * Reset all tracked rate limits. Useful for test suites and benchmark isolation.
 */
export function resetRateLimits(): void {
  hitLog.clear();
}

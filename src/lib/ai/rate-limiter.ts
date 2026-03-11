const TOKENS_PER_MINUTE = 20;
const REFILL_INTERVAL_MS = 60_000;

interface Bucket {
  tokens: number;
  lastRefill: number;
}

// In-memory store keyed by IP address
const buckets = new Map<string, Bucket>();

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  let bucket = buckets.get(ip);

  if (!bucket) {
    bucket = { tokens: TOKENS_PER_MINUTE, lastRefill: now };
    buckets.set(ip, bucket);
  }

  // Refill tokens based on elapsed time
  const elapsed = now - bucket.lastRefill;
  if (elapsed >= REFILL_INTERVAL_MS) {
    const refillCount = Math.floor(elapsed / REFILL_INTERVAL_MS);
    bucket.tokens = Math.min(TOKENS_PER_MINUTE, bucket.tokens + refillCount * TOKENS_PER_MINUTE);
    bucket.lastRefill = now - (elapsed % REFILL_INTERVAL_MS);
  }

  if (bucket.tokens <= 0) {
    return { allowed: false, remaining: 0 };
  }

  bucket.tokens -= 1;
  return { allowed: true, remaining: bucket.tokens };
}

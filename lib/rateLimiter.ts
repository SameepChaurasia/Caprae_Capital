/**
 * Sliding-Window Token Bucket Rate Limiter
 * Enforces per-client IP and per-target domain rate limits to protect external targets
 * from aggressive scraping and protect the API from denial-of-service degradation.
 */

interface Bucket {
  tokens: number;
  lastRefillTimestamp: number;
}

export class SlidingWindowRateLimiter {
  private capacity: number;
  private refillRatePerSecond: number;
  private buckets: Map<string, Bucket>;
  private maxBuckets: number;

  /**
   * @param capacity Maximum burst tokens allowed
   * @param refillRatePerSecond Token replenishment rate per second
   * @param maxBuckets LRU cleanup threshold to prevent unbounded memory growth
   */
  constructor(capacity: number = 10, refillRatePerSecond: number = 2, maxBuckets: number = 5000) {
    this.capacity = capacity;
    this.refillRatePerSecond = refillRatePerSecond;
    this.buckets = new Map<string, Bucket>();
    this.maxBuckets = maxBuckets;
  }

  /**
   * Evaluates if a request from the given key is allowed.
   * Decrements 1 token if available, returns false with retryAfterMs if exhausted.
   */
  public tryConsume(key: string, tokensToConsume: number = 1): { allowed: boolean; remaining: number; retryAfterMs: number } {
    const now = Date.now();

    // Prevent Map memory leaks: clean oldest bucket when size threshold reached
    if (this.buckets.size >= this.maxBuckets && !this.buckets.has(key)) {
      const oldestKey = this.buckets.keys().next().value;
      if (oldestKey) this.buckets.delete(oldestKey);
    }

    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: this.capacity,
        lastRefillTimestamp: now
      };
      this.buckets.set(key, bucket);
    } else {
      // Calculate token replenishment based on elapsed time
      const elapsedSeconds = (now - bucket.lastRefillTimestamp) / 1000;
      const tokensToAdd = elapsedSeconds * this.refillRatePerSecond;

      bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
      bucket.lastRefillTimestamp = now;
    }

    if (bucket.tokens >= tokensToConsume) {
      bucket.tokens -= tokensToConsume;
      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        retryAfterMs: 0
      };
    }

    // Calculate time until next token is available
    const neededTokens = tokensToConsume - bucket.tokens;
    const retryAfterMs = Math.ceil((neededTokens / this.refillRatePerSecond) * 1000);

    return {
      allowed: false,
      remaining: 0,
      retryAfterMs
    };
  }
}

// Global singletons for API route rate limiting (e.g. 15 requests per 10s burst window)
export const globalScrapeRateLimiter = new SlidingWindowRateLimiter(15, 3, 2000);
export const globalBatchRateLimiter = new SlidingWindowRateLimiter(5, 1, 500);

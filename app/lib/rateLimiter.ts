import Redis from 'ioredis';

// Initialize Redis client with fallback to localhost for development
const redis = new Redis(process.env.NEXT_PUBLIC_VALKEY_ENDPOINT || 'redis://localhost:6379', {
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
    connectTimeout: 5000, // 5 second connection timeout
    commandTimeout: 3000, // 3 second command timeout
    enableOfflineQueue: false, // Don't queue commands when offline
});

// Handle connection errors gracefully
redis.on('error', (err) => {
    console.error('Redis connection error:', err);
    // Don't throw the error, just log it
    // This allows the app to continue running even if Redis is not available
});

redis.on('connect', () => {
    console.log('Successfully connected to Redis');
});

redis.on('ready', () => {
    console.log('Redis client is ready');
});

export interface RateLimitConfig {
    maxRequests: number;  // Maximum number of requests allowed
    windowMs: number;     // Time window in milliseconds
}

export class RateLimiter {
    private config: RateLimitConfig;

    constructor(config: RateLimitConfig) {
        this.config = config;
    }

    async isRateLimited(identifier: string): Promise<boolean> {
        try {
            const key = `ratelimit:${identifier}`;
            const now = Date.now();
            const windowStart = now - this.config.windowMs;

            // Use Redis pipeline for atomic operations
            const pipeline = redis.pipeline();
            
            // Remove old entries
            pipeline.zremrangebyscore(key, 0, windowStart);
            
            // Count requests in current window
            pipeline.zcard(key);
            
            // Add current request
            pipeline.zadd(key, now, `${now}`);
            
            // Set expiry on the key
            pipeline.expire(key, Math.ceil(this.config.windowMs / 1000));

            // Add timeout to the pipeline execution
            const results = await Promise.race([
                pipeline.exec(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Redis operation timed out')), 2000)
                )
            ]) as [Error | null, any][] | null;

            if (!results) return false; // If Redis fails, don't rate limit

            const requestCount = results[1][1] as number;
            return requestCount >= this.config.maxRequests;
        } catch (error) {
            console.error('Rate limit check failed:', error);
            // If Redis is not available or times out, don't rate limit
            return false;
        }
    }
}

// Create a rate limiter instance for ratings
// Allow 5 requests per hour per IP
export const ratingLimiter = new RateLimiter({
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
}); 
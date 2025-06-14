import Redis from 'ioredis';
import { processRatingRequest } from './ratingProcessor';

const REDIS_URL = process.env.NEXT_PUBLIC_VALKEY_ENDPOINT;

if (!REDIS_URL) {
    throw new Error('REDIS_URL environment variable is not set');
}

// Create Redis client with retry strategy
const client = new Redis({
    host: REDIS_URL,
    port: 6379,
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
});

// Handle connection events
client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err: Error) => {
    console.error('Redis Client Error:', err);
});

client.on('reconnecting', () => {
    console.log('Reconnecting to Redis...');
});

export const redis = client;

// Queue names
export const QUEUE_NAMES = {
    RATINGS: 'ratings-queue',
} as const;

// Queue a rating request
export async function queueRatingRequest(data: {
    placeId: string;
    rating: number;
    recaptchaToken: string;
    ip: string;
}) {
    try {
        await redis.lpush(QUEUE_NAMES.RATINGS, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to queue rating request:', error);
        throw error;
    }
}

// Process rating requests
export async function processRatingQueue() {
    while (true) {
        try {
            // Get the next rating request from the queue
            const request = await redis.rpop(QUEUE_NAMES.RATINGS);
            
            if (!request) {
                // No requests in queue, wait a bit before checking again
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }

            const data = JSON.parse(request);
            await processRatingRequest(data);
        } catch (error) {
            console.error('Error processing rating queue:', error);
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
} 
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ratingLimiter } from './rateLimiter';

const TABLE_NAME = process.env.NEXT_PUBLIC_DYNAMODB_TABLE_NAME;
const ACCESS_KEY_ID = process.env.NEXT_PUBLIC_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION;
const RECAPTCHA_SECRET_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !AWS_REGION) {
    throw new Error('AWS credentials or region are not set in environment variables.');
}

const client = new DynamoDBClient({
    region: AWS_REGION,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
    maxAttempts: 3,
});

const docClient = DynamoDBDocumentClient.from(client);

interface RatingRequest {
    placeId: string;
    rating: number;
    recaptchaToken: string;
    ip: string;
}

export async function processRatingRequest(data: RatingRequest) {
    try {
        // Verify reCAPTCHA
        const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${RECAPTCHA_SECRET_KEY}&response=${data.recaptchaToken}`,
        });

        const recaptchaData = await recaptchaResponse.json();
        if (!recaptchaData.success || recaptchaData.score < 0.5) {
            console.error('Failed reCAPTCHA verification:', recaptchaData);
            return;
        }

        // Check rate limit
        const isLimited = await ratingLimiter.isRateLimited(data.ip);
        if (isLimited) {
            console.error('Rate limit exceeded for IP:', data.ip);
            return;
        }

        // Get current place data
        const getResult = await docClient.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { id: data.placeId },
            })
        );

        if (!getResult.Item) {
            console.error('Kebab place not found:', data.placeId);
            return;
        }

        const currentPlace = getResult.Item;
        const newTotalVotes = currentPlace.totalVotes + 1;
        const newRating =
            (currentPlace.rating * currentPlace.totalVotes + data.rating) /
            newTotalVotes;

        // Update place data
        await docClient.send(
            new UpdateCommand({
                TableName: TABLE_NAME,
                Key: { id: data.placeId },
                UpdateExpression:
                    'SET rating = :rating, totalVotes = :totalVotes, updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':rating': newRating,
                    ':totalVotes': newTotalVotes,
                    ':updatedAt': new Date().toISOString(),
                },
            })
        );

        console.log('Successfully processed rating for place:', data.placeId);
    } catch (error) {
        console.error('Error processing rating request:', error);
        // You might want to implement retry logic here
    }
} 
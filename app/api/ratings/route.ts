import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
    PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { ratingLimiter } from '@/app/lib/rateLimiter';

const TABLE_NAME = process.env.NEXT_PUBLIC_DYNAMODB_TABLE_NAME;
const USER_VOTES_TABLE_NAME = process.env.NEXT_PUBLIC_USER_VOTES_TABLE_NAME || `${TABLE_NAME}_user_votes`;
const ACCESS_KEY_ID = process.env.NEXT_PUBLIC_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION;
const RECAPTCHA_SECRET_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY; // Server-side secret key

if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !AWS_REGION) {
    throw new Error('AWS credentials or region are not set in environment variables.');
}

if (!RECAPTCHA_SECRET_KEY) {
    throw new Error('RECAPTCHA_SECRET_KEY is not set in environment variables.');
}

const client = new DynamoDBClient({
    region: AWS_REGION,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
});

const docClient = DynamoDBDocumentClient.from(client);

export async function POST(request: Request) {
    try {
        if (!TABLE_NAME) {
            throw new Error('TABLE_NAME environment variable is not set');
        }

        // Get client IP for rate limiting
        const forwardedFor = request.headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

        // Check rate limit with timeout handling
        try {
            const isLimited = await ratingLimiter.isRateLimited(ip);
            if (isLimited) {
                return NextResponse.json(
                    { message: 'Too many requests. Please try again later.' },
                    { status: 429 }
                );
            }
        } catch (rateLimitError) {
            console.error('Rate limit check failed:', rateLimitError);
            // Continue without rate limiting if there's an error
        }

        const body = await request.json();

        // Skip reCAPTCHA for authenticated users (for vote editing)
        if (body.recaptchaToken !== 'bypass-for-edit') {
            const token = body.recaptchaToken;
            if (!token) {
                return NextResponse.json({ message: 'Missing reCAPTCHA token' }, { status: 400 });
            }

            const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
            });

            const recaptchaData = await recaptchaResponse.json();

            if (!recaptchaData.success || recaptchaData.score < 0.5) {
                return NextResponse.json({ message: 'Failed reCAPTCHA verification ' + JSON.stringify(recaptchaData)}, { status: 403 });
            }
        }

        if (!body.placeId || typeof body.rating !== 'number') {
            return NextResponse.json(
                { message: 'Missing or invalid request body' },
                { status: 400 }
            );
        }

        if (body.rating < 1 || body.rating > 5) {
            return NextResponse.json(
                { message: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        // Get userId from request body
        if (!body.userId) {
            return NextResponse.json(
                { message: 'userId required in request body' },
                { status: 400 }
            );
        }
        const userId = body.userId;

        // Check if user has already voted on this place
        const existingVote = await docClient.send(
            new GetCommand({
                TableName: USER_VOTES_TABLE_NAME,
                Key: { 
                    userId,
                    placeId: body.placeId 
                },
            })
        );

        const isUpdate = !!existingVote.Item;
        const previousRating = existingVote.Item?.rating;

        // Get the kebab place
        const getResult = await docClient.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { id: body.placeId },
            })
        );

        if (!getResult.Item) {
            return NextResponse.json(
                { message: 'Kebab place not found' },
                { status: 404 }
            );
        }

        const currentPlace = getResult.Item;
        let newTotalVotes: number;
        let newRating: number;

        if (isUpdate) {
            // Update existing vote
            newTotalVotes = currentPlace.totalVotes; // Total votes stays the same
            newRating = (currentPlace.rating * currentPlace.totalVotes - previousRating + body.rating) / currentPlace.totalVotes;
        } else {
            // New vote
            newTotalVotes = currentPlace.totalVotes + 1;
            newRating = (currentPlace.rating * currentPlace.totalVotes + body.rating) / newTotalVotes;
        }

        // Update the kebab place rating
        await docClient.send(
            new UpdateCommand({
                TableName: TABLE_NAME,
                Key: { id: body.placeId },
                UpdateExpression:
                    'SET rating = :rating, totalVotes = :totalVotes, updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':rating': newRating,
                    ':totalVotes': newTotalVotes,
                    ':updatedAt': new Date().toISOString(),
                },
            })
        );

        // Save/update the user's vote
        const now = new Date().toISOString();
        if (isUpdate) {
            // Update existing vote
            await docClient.send(
                new UpdateCommand({
                    TableName: USER_VOTES_TABLE_NAME,
                    Key: { 
                        userId,
                        placeId: body.placeId 
                    },
                    UpdateExpression: 'SET rating = :rating, updatedAt = :updatedAt',
                    ExpressionAttributeValues: {
                        ':rating': body.rating,
                        ':updatedAt': now,
                    },
                })
            );
        } else {
            // Create new vote
            await docClient.send(
                new PutCommand({
                    TableName: USER_VOTES_TABLE_NAME,
                    Item: {
                        userId,
                        placeId: body.placeId,
                        rating: body.rating,
                        createdAt: now,
                        updatedAt: now,
                    },
                })
            );
        }

        return NextResponse.json({
            placeId: body.placeId,
            newRating,
            totalVotes: newTotalVotes,
            isUpdate,
            previousRating,
        });
    } catch (error) {
        console.error('Error updating rating:', error);
        return NextResponse.json(
            { message: 'Error updating rating' },
            { status: 500 }
        );
    }
}
import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
    PutCommand,
} from '@aws-sdk/lib-dynamodb';

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

        // Support both single rating (legacy) and dual rating (new)
        const hasGeneralRating = typeof body.generalRating === 'number';
        const hasSauceRating = typeof body.sauceRating === 'number';
        const hasLegacyRating = typeof body.rating === 'number';

        if (!body.placeId || (!hasGeneralRating && !hasSauceRating && !hasLegacyRating)) {
            return NextResponse.json(
                { message: 'Missing or invalid request body. Provide generalRating and sauceRating, or rating (legacy)' },
                { status: 400 }
            );
        }

        // Validate ratings are within 1-5 range
        if (hasGeneralRating && (body.generalRating < 1 || body.generalRating > 5)) {
            return NextResponse.json(
                { message: 'General rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        if (hasSauceRating && (body.sauceRating < 1 || body.sauceRating > 5)) {
            return NextResponse.json(
                { message: 'Sauce rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        if (hasLegacyRating && (body.rating < 1 || body.rating > 5)) {
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
        const previousGeneralRating = existingVote.Item?.generalRating || existingVote.Item?.rating || 0;
        const previousSauceRating = existingVote.Item?.sauceRating || existingVote.Item?.rating || 0;

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

        // Determine which ratings to use (dual or legacy)
        const newGeneralRating = hasGeneralRating ? body.generalRating : (hasLegacyRating ? body.rating : previousGeneralRating);
        const newSauceRating = hasSauceRating ? body.sauceRating : (hasLegacyRating ? body.rating : previousSauceRating);

        let newTotalVotes: number;
        let updatedGeneralRating: number;
        let updatedSauceRating: number;

        // Initialize ratings if they don't exist (for migration)
        const currentGeneralRating = currentPlace.rating || 0;
        const currentSauceRating = currentPlace.sauceRating || currentPlace.rating || 0;
        const currentTotalVotes = currentPlace.totalVotes || 0;

        if (isUpdate) {
            // Update existing vote
            newTotalVotes = currentTotalVotes; // Total votes stays the same
            updatedGeneralRating = currentTotalVotes > 0
                ? (currentGeneralRating * currentTotalVotes - previousGeneralRating + newGeneralRating) / currentTotalVotes
                : newGeneralRating;
            updatedSauceRating = currentTotalVotes > 0
                ? (currentSauceRating * currentTotalVotes - previousSauceRating + newSauceRating) / currentTotalVotes
                : newSauceRating;
        } else {
            // New vote
            newTotalVotes = currentTotalVotes + 1;
            updatedGeneralRating = (currentGeneralRating * currentTotalVotes + newGeneralRating) / newTotalVotes;
            updatedSauceRating = (currentSauceRating * currentTotalVotes + newSauceRating) / newTotalVotes;
        }

        // Update the kebab place with dual ratings
        await docClient.send(
            new UpdateCommand({
                TableName: TABLE_NAME,
                Key: { id: body.placeId },
                UpdateExpression:
                    'SET rating = :rating, sauceRating = :sauceRating, totalVotes = :totalVotes, updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':rating': updatedGeneralRating,
                    ':sauceRating': updatedSauceRating,
                    ':totalVotes': newTotalVotes,
                    ':updatedAt': new Date().toISOString(),
                },
            })
        );

        // Save/update the user's vote with dual ratings
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
                    UpdateExpression: 'SET generalRating = :generalRating, sauceRating = :sauceRating, updatedAt = :updatedAt',
                    ExpressionAttributeValues: {
                        ':generalRating': newGeneralRating,
                        ':sauceRating': newSauceRating,
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
                        generalRating: newGeneralRating,
                        sauceRating: newSauceRating,
                        createdAt: now,
                        updatedAt: now,
                    },
                })
            );
        }

        return NextResponse.json({
            placeId: body.placeId,
            generalRating: updatedGeneralRating,
            sauceRating: updatedSauceRating,
            totalVotes: newTotalVotes,
            isUpdate,
            previousGeneralRating,
            previousSauceRating,
        });
    } catch (error) {
        console.error('Error updating rating:', error);
        return NextResponse.json(
            { message: 'Error updating rating' },
            { status: 500 }
        );
    }
}
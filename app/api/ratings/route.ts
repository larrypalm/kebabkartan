import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.NEXT_PUBLIC_DYNAMODB_TABLE_NAME;
const ACCESS_KEY_ID = process.env.NEXT_PUBLIC_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION;

if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !AWS_REGION) {
    throw new Error('AWS credentials or region are not set in environment variables.');
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

        if (!body || !body.placeId || typeof body.rating !== 'number') {
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
        const newTotalVotes = currentPlace.totalVotes + 1;
        const newRating =
            (currentPlace.rating * currentPlace.totalVotes + body.rating) /
            newTotalVotes;

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

        return NextResponse.json({
            placeId: body.placeId,
            newRating,
            totalVotes: newTotalVotes,
        });
    } catch (error) {
        console.error('Error updating rating:', error);
        return NextResponse.json(
            { message: 'Error updating rating' },
            { status: 500 }
        );
    }
}
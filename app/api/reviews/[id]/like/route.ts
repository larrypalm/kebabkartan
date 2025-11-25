import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

const REVIEWS_TABLE_NAME = process.env.NEXT_PUBLIC_REVIEWS_TABLE_NAME || `${process.env.NEXT_PUBLIC_DYNAMODB_TABLE_NAME}_reviews`;
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

// POST - Toggle like on a review
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const reviewId = params.id;
        const body = await request.json();

        if (!body.userId) {
            return NextResponse.json(
                { message: 'userId is required' },
                { status: 400 }
            );
        }

        const userId = body.userId;

        // Get the review
        const result = await docClient.send(
            new GetCommand({
                TableName: REVIEWS_TABLE_NAME,
                Key: { id: reviewId },
            })
        );

        if (!result.Item) {
            return NextResponse.json(
                { message: 'Review not found' },
                { status: 404 }
            );
        }

        const review = result.Item;
        const likedBy = review.likedBy || [];
        const isLiked = likedBy.includes(userId);

        let updateExpression: string;
        let expressionValues: any;

        if (isLiked) {
            // Unlike: remove userId from likedBy array and decrement likes
            const updatedLikedBy = likedBy.filter((id: string) => id !== userId);
            updateExpression = 'SET likedBy = :likedBy, likes = :likes';
            expressionValues = {
                ':likedBy': updatedLikedBy,
                ':likes': Math.max(0, (review.likes || 0) - 1),
            };
        } else {
            // Like: add userId to likedBy array and increment likes
            const updatedLikedBy = [...likedBy, userId];
            updateExpression = 'SET likedBy = :likedBy, likes = :likes';
            expressionValues = {
                ':likedBy': updatedLikedBy,
                ':likes': (review.likes || 0) + 1,
            };
        }

        await docClient.send(
            new UpdateCommand({
                TableName: REVIEWS_TABLE_NAME,
                Key: { id: reviewId },
                UpdateExpression: updateExpression,
                ExpressionAttributeValues: expressionValues,
            })
        );

        return NextResponse.json({
            success: true,
            isLiked: !isLiked,
            likes: expressionValues[':likes'],
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        return NextResponse.json(
            { message: 'Error toggling like', error: String(error) },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
    UpdateCommand,
    DeleteCommand,
    GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const REVIEWS_TABLE_NAME = process.env.NEXT_PUBLIC_REVIEWS_TABLE_NAME || `${process.env.NEXT_PUBLIC_DYNAMODB_TABLE_NAME}_reviews`;
const RESTAURANTS_TABLE_NAME = process.env.NEXT_PUBLIC_DYNAMODB_TABLE_NAME;
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
});

const docClient = DynamoDBDocumentClient.from(client);

// GET - Fetch reviews for a restaurant
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const restaurantId = searchParams.get('restaurantId');

        if (!restaurantId) {
            return NextResponse.json(
                { message: 'restaurantId query parameter is required' },
                { status: 400 }
            );
        }

        // Query reviews by restaurantId (assuming GSI or proper key structure)
        const result = await docClient.send(
            new QueryCommand({
                TableName: REVIEWS_TABLE_NAME,
                IndexName: 'restaurantId-index', // You'll need to create this GSI in DynamoDB
                KeyConditionExpression: 'restaurantId = :restaurantId',
                ExpressionAttributeValues: {
                    ':restaurantId': restaurantId,
                },
                ScanIndexForward: false, // Most recent first
            })
        );

        return NextResponse.json({
            reviews: result.Items || [],
            count: result.Count || 0,
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { message: 'Error fetching reviews', error: String(error) },
            { status: 500 }
        );
    }
}

// POST - Create a new review
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Verify reCAPTCHA
        if (body.recaptchaToken) {
            const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${RECAPTCHA_SECRET_KEY}&response=${body.recaptchaToken}`,
            });

            const recaptchaData = await recaptchaResponse.json();

            if (!recaptchaData.success || recaptchaData.score < 0.5) {
                return NextResponse.json(
                    { message: 'Failed reCAPTCHA verification' },
                    { status: 403 }
                );
            }
        }

        // Validate required fields
        if (!body.restaurantId || !body.userId || !body.username) {
            return NextResponse.json(
                { message: 'Missing required fields: restaurantId, userId, username' },
                { status: 400 }
            );
        }

        // Validate ratings
        if (
            typeof body.generalRating !== 'number' ||
            body.generalRating < 1 ||
            body.generalRating > 5
        ) {
            return NextResponse.json(
                { message: 'generalRating must be a number between 1 and 5' },
                { status: 400 }
            );
        }

        if (
            typeof body.sauceRating !== 'number' ||
            body.sauceRating < 1 ||
            body.sauceRating > 5
        ) {
            return NextResponse.json(
                { message: 'sauceRating must be a number between 1 and 5' },
                { status: 400 }
            );
        }

        const reviewId = uuidv4();
        const now = new Date().toISOString();

        const review = {
            id: reviewId,
            restaurantId: body.restaurantId,
            userId: body.userId,
            username: body.username,
            userAvatar: body.userAvatar || undefined,
            generalRating: body.generalRating,
            sauceRating: body.sauceRating,
            generalText: body.generalText || undefined,
            sauceText: body.sauceText || undefined,
            likes: 0,
            likedBy: [],
            isEdited: false,
            createdAt: now,
        };

        // Save review to DynamoDB
        await docClient.send(
            new PutCommand({
                TableName: REVIEWS_TABLE_NAME,
                Item: review,
            })
        );

        // Update restaurant's review count
        await docClient.send(
            new UpdateCommand({
                TableName: RESTAURANTS_TABLE_NAME,
                Key: { id: body.restaurantId },
                UpdateExpression: 'ADD reviewCount :inc SET updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':inc': 1,
                    ':updatedAt': now,
                },
            })
        );

        return NextResponse.json({
            success: true,
            review,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json(
            { message: 'Error creating review', error: String(error) },
            { status: 500 }
        );
    }
}

// PUT - Update an existing review
export async function PUT(request: Request) {
    try {
        const body = await request.json();

        if (!body.id || !body.userId) {
            return NextResponse.json(
                { message: 'Missing required fields: id, userId' },
                { status: 400 }
            );
        }

        // Verify the review belongs to the user
        const existingReview = await docClient.send(
            new GetCommand({
                TableName: REVIEWS_TABLE_NAME,
                Key: { id: body.id },
            })
        );

        if (!existingReview.Item) {
            return NextResponse.json(
                { message: 'Review not found' },
                { status: 404 }
            );
        }

        if (existingReview.Item.userId !== body.userId) {
            return NextResponse.json(
                { message: 'Unauthorized: You can only edit your own reviews' },
                { status: 403 }
            );
        }

        const now = new Date().toISOString();
        const updateExpressions: string[] = ['isEdited = :isEdited', 'editedAt = :editedAt'];
        const expressionValues: any = {
            ':isEdited': true,
            ':editedAt': now,
        };

        // Update ratings if provided
        if (typeof body.generalRating === 'number') {
            if (body.generalRating < 1 || body.generalRating > 5) {
                return NextResponse.json(
                    { message: 'generalRating must be between 1 and 5' },
                    { status: 400 }
                );
            }
            updateExpressions.push('generalRating = :generalRating');
            expressionValues[':generalRating'] = body.generalRating;
        }

        if (typeof body.sauceRating === 'number') {
            if (body.sauceRating < 1 || body.sauceRating > 5) {
                return NextResponse.json(
                    { message: 'sauceRating must be between 1 and 5' },
                    { status: 400 }
                );
            }
            updateExpressions.push('sauceRating = :sauceRating');
            expressionValues[':sauceRating'] = body.sauceRating;
        }

        // Update text if provided
        if (body.generalText !== undefined) {
            updateExpressions.push('generalText = :generalText');
            expressionValues[':generalText'] = body.generalText;
        }

        if (body.sauceText !== undefined) {
            updateExpressions.push('sauceText = :sauceText');
            expressionValues[':sauceText'] = body.sauceText;
        }

        await docClient.send(
            new UpdateCommand({
                TableName: REVIEWS_TABLE_NAME,
                Key: { id: body.id },
                UpdateExpression: 'SET ' + updateExpressions.join(', '),
                ExpressionAttributeValues: expressionValues,
            })
        );

        return NextResponse.json({
            success: true,
            message: 'Review updated successfully',
        });
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json(
            { message: 'Error updating review', error: String(error) },
            { status: 500 }
        );
    }
}

// DELETE - Delete a review
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const reviewId = searchParams.get('id');
        const userId = searchParams.get('userId');

        if (!reviewId || !userId) {
            return NextResponse.json(
                { message: 'Missing required parameters: id, userId' },
                { status: 400 }
            );
        }

        // Verify the review belongs to the user
        const existingReview = await docClient.send(
            new GetCommand({
                TableName: REVIEWS_TABLE_NAME,
                Key: { id: reviewId },
            })
        );

        if (!existingReview.Item) {
            return NextResponse.json(
                { message: 'Review not found' },
                { status: 404 }
            );
        }

        if (existingReview.Item.userId !== userId) {
            return NextResponse.json(
                { message: 'Unauthorized: You can only delete your own reviews' },
                { status: 403 }
            );
        }

        const restaurantId = existingReview.Item.restaurantId;

        // Delete the review
        await docClient.send(
            new DeleteCommand({
                TableName: REVIEWS_TABLE_NAME,
                Key: { id: reviewId },
            })
        );

        // Decrement restaurant's review count
        const now = new Date().toISOString();
        await docClient.send(
            new UpdateCommand({
                TableName: RESTAURANTS_TABLE_NAME,
                Key: { id: restaurantId },
                UpdateExpression: 'ADD reviewCount :dec SET updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':dec': -1,
                    ':updatedAt': now,
                },
            })
        );

        return NextResponse.json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json(
            { message: 'Error deleting review', error: String(error) },
            { status: 500 }
        );
    }
}

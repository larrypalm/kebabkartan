import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
    QueryCommand,
} from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.NEXT_PUBLIC_DYNAMODB_TABLE_NAME;
const USER_VOTES_TABLE_NAME = process.env.NEXT_PUBLIC_USER_VOTES_TABLE_NAME || `${TABLE_NAME}_user_votes`;
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

// Helper function to get user ID from query params (for GET) or body (for POST)
async function getUserIdFromRequest(request: Request, method: string, body?: any): Promise<string | null> {
    try {
        if (method === 'GET') {
            const { searchParams } = new URL(request.url);
            return searchParams.get('userId');
        } else {
            return body?.userId || null;
        }
    } catch (error) {
        console.error('Error getting user ID from request:', error);
        return null;
    }
}

// GET: Fetch user's votes
export async function GET(request: Request) {
    try {
        const userId = await getUserIdFromRequest(request, 'GET');
        
        if (!userId) {
            return NextResponse.json(
                { message: 'Authentication required' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const placeId = searchParams.get('placeId');

        if (placeId) {
            // Get specific vote for a place
            const result = await docClient.send(
                new GetCommand({
                    TableName: USER_VOTES_TABLE_NAME,
                    Key: { 
                        userId,
                        placeId 
                    },
                })
            );

            return NextResponse.json({
                vote: result.Item || null
            });
        } else {
            // Get all votes for the user
            const result = await docClient.send(
                new QueryCommand({
                    TableName: USER_VOTES_TABLE_NAME,
                    KeyConditionExpression: 'userId = :userId',
                    ExpressionAttributeValues: {
                        ':userId': userId,
                    },
                })
            );

            return NextResponse.json({
                votes: result.Items || []
            });
        }
    } catch (error) {
        console.error('Error fetching user votes:', error);
        return NextResponse.json(
            { message: 'Error fetching user votes' },
            { status: 500 }
        );
    }
}

// POST: Create or update a user's vote
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const userId = await getUserIdFromRequest(request, 'POST', body);
        
        if (!userId) {
            return NextResponse.json(
                { message: 'Authentication required' },
                { status: 401 }
            );
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

        const now = new Date().toISOString();
        const voteId = `${userId}_${body.placeId}`;

        // Check if vote already exists
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

        // Create or update the vote
        await docClient.send(
            new PutCommand({
                TableName: USER_VOTES_TABLE_NAME,
                Item: {
                    userId,
                    placeId: body.placeId,
                    rating: body.rating,
                    createdAt: existingVote.Item?.createdAt || now,
                    updatedAt: now,
                },
            })
        );

        return NextResponse.json({
            success: true,
            isUpdate,
            previousRating,
            newRating: body.rating,
            placeId: body.placeId,
        });
    } catch (error) {
        console.error('Error creating/updating user vote:', error);
        return NextResponse.json(
            { message: 'Error creating/updating user vote' },
            { status: 500 }
        );
    }
}

// DELETE: Remove a user's vote
export async function DELETE(request: Request) {
    try {
        const userId = await getUserIdFromRequest(request, 'GET');
        
        if (!userId) {
            return NextResponse.json(
                { message: 'Authentication required' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const placeId = searchParams.get('placeId');

        if (!placeId) {
            return NextResponse.json(
                { message: 'placeId is required' },
                { status: 400 }
            );
        }

        // Get the vote before deleting to return the rating
        const existingVote = await docClient.send(
            new GetCommand({
                TableName: USER_VOTES_TABLE_NAME,
                Key: { 
                    userId,
                    placeId 
                },
            })
        );

        if (!existingVote.Item) {
            return NextResponse.json(
                { message: 'Vote not found' },
                { status: 404 }
            );
        }

        // Delete the vote
        await docClient.send(
            new UpdateCommand({
                TableName: USER_VOTES_TABLE_NAME,
                Key: { 
                    userId,
                    placeId 
                },
                UpdateExpression: 'SET deletedAt = :deletedAt',
                ExpressionAttributeValues: {
                    ':deletedAt': new Date().toISOString(),
                },
            })
        );

        return NextResponse.json({
            success: true,
            deletedRating: existingVote.Item.rating,
            placeId,
        });
    } catch (error) {
        console.error('Error deleting user vote:', error);
        return NextResponse.json(
            { message: 'Error deleting user vote' },
            { status: 500 }
        );
    }
}

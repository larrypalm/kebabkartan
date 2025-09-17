import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
} from '@aws-sdk/lib-dynamodb';

const USER_VOTES_TABLE_NAME = process.env.NEXT_PUBLIC_USER_VOTES_TABLE_NAME || `${process.env.NEXT_PUBLIC_DYNAMODB_TABLE_NAME}_user_votes`;
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

// GET: Fetch user's vote for a specific place
export async function GET(
    request: Request,
    { params }: { params: { placeId: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        
        if (!userId) {
            return NextResponse.json(
                { message: 'userId parameter required' },
                { status: 400 }
            );
        }
        
        const result = await docClient.send(
            new GetCommand({
                TableName: USER_VOTES_TABLE_NAME,
                Key: { 
                    userId,
                    placeId: params.placeId 
                },
            })
        );

        return NextResponse.json({
            vote: result.Item || null
        });
    } catch (error) {
        console.error('Error fetching user vote:', error);
        return NextResponse.json(
            { message: 'Error fetching user vote' },
            { status: 500 }
        );
    }
}

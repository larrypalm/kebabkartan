import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
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

// GET: Fetch a specific kebab place by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        if (!TABLE_NAME) {
            throw new Error('TABLE_NAME environment variable is not set');
        }

        const result = await docClient.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { id: params.id },
            })
        );

        if (!result.Item) {
            return NextResponse.json(
                { message: 'Kebab place not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.Item);
    } catch (error) {
        console.error('Error fetching kebab place:', error);
        return NextResponse.json(
            { message: 'Error fetching kebab place' },
            { status: 500 }
        );
    }
}

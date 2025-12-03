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
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_LAMBDA_PASSWORD;

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

// PUT: Update a specific kebab place by ID
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        if (!TABLE_NAME || !ADMIN_PASSWORD) {
            throw new Error('Environment variables TABLE_NAME or ADMIN_PASSWORD are not set');
        }

        const body = await request.json();

        if (!body || body.adminPassword !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // First, check if the place exists
        const getResult = await docClient.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { id: params.id },
            })
        );

        if (!getResult.Item) {
            return NextResponse.json(
                { message: 'Kebab place not found' },
                { status: 404 }
            );
        }

        const now = new Date().toISOString();

        // Validate required fields
        if (!body.name || !body.address || body.latitude === undefined || body.longitude === undefined) {
            return NextResponse.json(
                { message: 'Missing required fields: name, address, latitude, longitude' },
                { status: 400 }
            );
        }

        // Convert latitude and longitude to numbers
        const latitude = parseFloat(body.latitude);
        const longitude = parseFloat(body.longitude);

        if (isNaN(latitude) || isNaN(longitude)) {
            return NextResponse.json(
                { message: 'Invalid latitude or longitude values' },
                { status: 400 }
            );
        }

        // Update the kebab place
        await docClient.send(
            new UpdateCommand({
                TableName: TABLE_NAME,
                Key: { id: params.id },
                UpdateExpression: 'SET #name = :name, address = :address, latitude = :latitude, longitude = :longitude, openingHours = :openingHours, priceRange = :priceRange, slug = :slug, city = :city, tags = :tags, updatedAt = :updatedAt',
                ExpressionAttributeNames: {
                    '#name': 'name'
                },
                ExpressionAttributeValues: {
                    ':name': body.name,
                    ':address': body.address,
                    ':latitude': latitude,
                    ':longitude': longitude,
                    ':openingHours': body.openingHours || '',
                    ':priceRange': body.priceRange || '',
                    ':slug': body.slug || '',
                    ':city': body.city || '',
                    ':tags': body.tags || [],
                    ':updatedAt': now,
                },
            })
        );

        // Return the updated place
        const updatedResult = await docClient.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { id: params.id },
            })
        );

        return NextResponse.json(updatedResult.Item, { status: 200 });

    } catch (error) {
        console.error('Error updating kebab place:', error);
        return NextResponse.json(
            { 
                message: 'Error updating kebab place',
                error: error instanceof Error ? error.message : 'Unknown error',
                details: process.env.NODE_ENV === 'development' ? error : undefined
            },
            { status: 500 }
        );
    }
}

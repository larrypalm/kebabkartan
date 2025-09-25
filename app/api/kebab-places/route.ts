import { NextResponse } from 'next/server';
import { getKebabPlaces } from '@/lib/getKebabPlaces';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

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

export async function GET() {
    try {
        const kebabPlaces = await getKebabPlaces();
        return NextResponse.json(kebabPlaces, { status: 200 });
    } catch (error) {
        console.error('Error fetching kebab places:', error);
        return NextResponse.json(
            {
                message: 'Error fetching kebab places',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
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

        const now = new Date().toISOString();

        const kebabPlace = {
            id: uuidv4(),
            name: body.name,
            address: body.address,
            latitude: body.latitude,
            longitude: body.longitude,
            openingHours: body.openingHours || '',
            priceRange: body.priceRange || '',
            slug: body.slug || '',
            city: body.city || '',
            rating: 0,
            totalVotes: 0,
            createdAt: now,
            updatedAt: now,
        };

        await docClient.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: kebabPlace,
            })
        );

        return NextResponse.json(kebabPlace, { status: 201 });

    } catch (error) {
        console.error('Error adding kebab place:', error);
        return NextResponse.json(
            { message: 'Error adding kebab place' },
            { status: 500 }
        );
    }
}
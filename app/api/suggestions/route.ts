import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = process.env.NEXT_PUBLIC_DYNAMODB_TABLE_NAME;
const SUGGESTIONS_TABLE_NAME = process.env.NEXT_PUBLIC_SUGGESTIONS_TABLE_NAME || 'kebab-suggestions';
const ACCESS_KEY_ID = process.env.NEXT_PUBLIC_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION;
const RECAPTCHA_SECRET_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

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

export async function GET() {
    try {
        const result = await docClient.send(
            new ScanCommand({
                TableName: SUGGESTIONS_TABLE_NAME,
            })
        );

        return NextResponse.json(result.Items || [], { status: 200 });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return NextResponse.json(
            { message: 'Ett fel uppstod när förslagen hämtades.' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        console.log('Suggestions API: Starting request processing');
        const body = await request.json();
        console.log('Suggestions API: Request body received:', { 
            hasRestaurantName: !!body.restaurantName,
            hasAddress: !!body.address,
            hasCity: !!body.city,
            hasRecaptchaToken: !!body.recaptchaToken
        });

        // Validate reCAPTCHA token
        const token = body.recaptchaToken;
        if (!token) {
            return NextResponse.json({ message: 'Missing reCAPTCHA token' }, { status: 400 });
        }

        console.log('Suggestions API: Verifying reCAPTCHA token');
        const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
        });

        const recaptchaData = await recaptchaResponse.json();
        console.log('Suggestions API: reCAPTCHA response:', recaptchaData);

        if (!recaptchaData.success || recaptchaData.score < 0.5) {
            console.log('Suggestions API: reCAPTCHA verification failed');
            return NextResponse.json({ message: 'Failed reCAPTCHA verification' }, { status: 403 });
        }

        // Validate required fields
        if (!body.restaurantName || !body.address || !body.city) {
            return NextResponse.json(
                { message: 'Restaurangens namn, adress och stad är obligatoriska fält.' },
                { status: 400 }
            );
        }

        const now = new Date().toISOString();

        const suggestion = {
            id: uuidv4(),
            restaurantName: body.restaurantName,
            address: body.address,
            city: body.city,
            status: 'pending', // pending, approved, rejected
            createdAt: now,
            updatedAt: now,
        };

        console.log('Suggestions API: Saving suggestion to DynamoDB:', { 
            tableName: SUGGESTIONS_TABLE_NAME,
            suggestionId: suggestion.id 
        });

        await docClient.send(
            new PutCommand({
                TableName: SUGGESTIONS_TABLE_NAME,
                Item: suggestion,
            })
        );

        console.log('Suggestions API: Successfully saved suggestion');

        return NextResponse.json({ 
            message: 'Förslag mottaget!',
            suggestionId: suggestion.id 
        }, { status: 201 });

    } catch (error) {
        console.error('Suggestions API: Error saving suggestion:', error);
        console.error('Suggestions API: Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        return NextResponse.json(
            { 
                message: 'Ett fel uppstod när förslaget sparades.',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

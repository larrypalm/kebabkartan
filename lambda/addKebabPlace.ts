import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { AddKebabPlaceRequest, KebabPlace } from './types';

const dynamodb = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Missing request body' }),
      };
    }

    const request: AddKebabPlaceRequest = JSON.parse(event.body);

    // Verify admin password
    if (request.adminPassword !== ADMIN_PASSWORD) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    const now = new Date().toISOString();
    const kebabPlace: KebabPlace = {
      id: uuidv4(),
      name: request.name,
      address: request.address,
      latitude: request.latitude,
      longitude: request.longitude,
      rating: 0,
      totalVotes: 0,
      createdAt: now,
      updatedAt: now,
    };

    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: kebabPlace,
    }).promise();

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(kebabPlace),
    };
  } catch (error) {
    console.error('Error adding kebab place:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Error adding kebab place' }),
    };
  }
}; 
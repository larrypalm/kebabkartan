import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { UpdateRatingRequest } from './types';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME!;

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

    const request: UpdateRatingRequest = JSON.parse(event.body);

    if (request.rating < 1 || request.rating > 5) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Rating must be between 1 and 5' }),
      };
    }

    // Get the current item
    const getResult = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id: request.placeId },
      })
    );

    if (!getResult.Item) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Kebab place not found' }),
      };
    }

    const currentPlace = getResult.Item;
    const newTotalVotes = currentPlace.totalVotes + 1;
    const newRating = ((currentPlace.rating * currentPlace.totalVotes) + request.rating) / newTotalVotes;

    // Update the item
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id: request.placeId },
        UpdateExpression: 'SET rating = :rating, totalVotes = :totalVotes, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':rating': newRating,
          ':totalVotes': newTotalVotes,
          ':updatedAt': new Date().toISOString(),
        },
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        placeId: request.placeId,
        newRating: newRating,
        totalVotes: newTotalVotes,
      }),
    };
  } catch (error) {
    console.error('Error updating rating:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Error updating rating' }),
    };
  }
}; 
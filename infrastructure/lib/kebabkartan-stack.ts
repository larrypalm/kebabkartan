import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';

export class KebabkartanStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table for kebab places
    const kebabPlacesTable = new dynamodb.Table(this, 'KebabPlacesTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Cost optimal
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development - change for production
    });

    // Add GSI for ratings
    kebabPlacesTable.addGlobalSecondaryIndex({
      indexName: 'RatingIndex',
      partitionKey: { name: 'rating', type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    const commonLambdaConfig = {
      runtime: lambda.Runtime.NODEJS_22_X,
      bundling: {
        platform: 'linux/arm64',
        target: 'node18',
        sourceMap: true,
        externalModules: [
          '@aws-sdk/client-dynamodb',
          '@aws-sdk/lib-dynamodb',
        ],
      },
    };

    // Lambda function for getting all kebab places
    const getKebabPlacesFunction = new NodejsFunction(this, 'GetKebabPlacesFunction', {
      ...commonLambdaConfig,
      handler: 'handler',
      entry: path.join(__dirname, '../lambda/getKebabPlaces.ts'),
      environment: {
        TABLE_NAME: kebabPlacesTable.tableName,
      },
      functionName: 'kebabkartan-get-kebab-places',
      description: 'Retrieves all kebab places from the database'
    });

    // Lambda function for adding a new kebab place (admin only)
    const addKebabPlaceFunction = new NodejsFunction(this, 'AddKebabPlaceFunction', {
      ...commonLambdaConfig,
      handler: 'handler',
      entry: path.join(__dirname, '../lambda/addKebabPlace.ts'),
      environment: {
        TABLE_NAME: kebabPlacesTable.tableName,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'defaultpassword',
      },
      functionName: 'kebabkartan-add-kebab-place',
      description: 'Adds a new kebab place to the database (admin only)',
    });

    // Lambda function for updating ratings
    const updateRatingFunction = new NodejsFunction(this, 'UpdateRatingFunction', {
      ...commonLambdaConfig,
      handler: 'handler',
      entry: path.join(__dirname, '../lambda/updateRating.ts'),
      environment: {
        TABLE_NAME: kebabPlacesTable.tableName,
      },
      functionName: 'kebabkartan-update-rating',
      description: 'Updates the rating for a kebab place',
    });

    // Grant DynamoDB permissions to Lambda functions
    kebabPlacesTable.grantReadData(getKebabPlacesFunction);
    kebabPlacesTable.grantWriteData(addKebabPlaceFunction);
    kebabPlacesTable.grantReadWriteData(updateRatingFunction);

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'KebabkartanApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // API endpoints
    const kebabPlaces = api.root.addResource('kebab-places');
    kebabPlaces.addMethod('GET', new apigateway.LambdaIntegration(getKebabPlacesFunction));
    kebabPlaces.addMethod('POST', new apigateway.LambdaIntegration(addKebabPlaceFunction));

    const ratings = api.root.addResource('ratings');
    ratings.addMethod('POST', new apigateway.LambdaIntegration(updateRatingFunction));

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });
  }
} 
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

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

        // DynamoDB table for user votes
        const userVotesTable = new dynamodb.Table(this, 'UserVotesTable', {
            partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'placeId', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Cost optimal
            removalPolicy: cdk.RemovalPolicy.DESTROY, // For development - change for production
        });

        // Add GSI for place-based queries
        userVotesTable.addGlobalSecondaryIndex({
            indexName: 'PlaceIndex',
            partitionKey: { name: 'placeId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
        });


        // Output table names for environment variables
        new cdk.CfnOutput(this, 'KebabPlacesTableName', {
            value: kebabPlacesTable.tableName,
            description: 'Kebab Places table name',
        });

        new cdk.CfnOutput(this, 'UserVotesTableName', {
            value: userVotesTable.tableName,
            description: 'User Votes table name',
        });
    }
} 
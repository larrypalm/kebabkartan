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
    }
} 
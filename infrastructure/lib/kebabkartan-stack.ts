import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class KebabkartanStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create a minimal VPC with a single private subnet
        const vpc = new ec2.Vpc(this, 'KebabkartanVPC', {
            maxAzs: 1,
            natGateways: 0,
            subnetConfiguration: [
                {
                    name: 'PrivateIsolatedSubnet',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                }
            ],
        });

        const isolatedSubnets = vpc.selectSubnets({
            subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        });

        // Create a security group for Valkey
        const valkeySecurityGroup = new ec2.SecurityGroup(this, 'ValkeySecurityGroup', {
            vpc,
            description: 'Security group for Valkey',
            allowAllOutbound: true,
        });

        // Allow inbound Valkey traffic from within the VPC
        valkeySecurityGroup.addIngressRule(
            ec2.Peer.ipv4(vpc.vpcCidrBlock),
            ec2.Port.tcp(6379),
            'Allow Valkey traffic from within VPC'
        );

        // Create Valkey subnet group
        const valkeySubnetGroup = new elasticache.CfnSubnetGroup(this, 'ValkeySubnetGroup', {
            description: 'Subnet group for Valkey',
            subnetIds: isolatedSubnets.subnetIds,
        });

        // Create single-node Valkey instance
        const valkeyReplicationGroup = new elasticache.CfnReplicationGroup(this, 'Valkey', {
            replicationGroupDescription: 'Single-node Valkey instance',
            engine: 'valkey',
            cacheNodeType: 'cache.t3.micro', // Smallest instance type
            numCacheClusters: 1,
            port: 6379,
            automaticFailoverEnabled: false,
            multiAzEnabled: false,
            cacheSubnetGroupName: valkeySubnetGroup.ref,
            securityGroupIds: [valkeySecurityGroup.securityGroupId],
            transitEncryptionEnabled: false,
            atRestEncryptionEnabled: false,
        });

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

        // Output Valkey endpoint for Amplify configuration
        new cdk.CfnOutput(this, 'ValkeyEndpoint', {
            value: valkeyReplicationGroup.attrPrimaryEndPointAddress,
            description: 'Valkey endpoint',
        });
    }
} 
#!/bin/bash

# Hardcoded AWS configuration
AWS_PROFILE="larry"
AWS_REGION="eu-west-1"
AWS_ACCOUNT="104508147915"

# Exit on error
set -e

# Print current configuration
echo "Deploying with configuration:"
echo "AWS Profile: $AWS_PROFILE"
echo "AWS Region: $AWS_REGION"
echo "AWS Account: $AWS_ACCOUNT"
echo "Admin Password is set: ✓"

# Install dependencies
echo "Installing dependencies..."
npm install

# Install infrastructure dependencies
echo "Installing infrastructure dependencies..."
cd infrastructure
npm install
npm install -D ts-node typescript

# Build the project
echo "Building the project..."
cd ..
npm run build

# Bootstrap CDK (if not already done)
echo "Bootstrapping CDK in account $AWS_ACCOUNT region $AWS_REGION..."
cd infrastructure
npx cdk bootstrap aws://$AWS_ACCOUNT/$AWS_REGION --profile $AWS_PROFILE

# Deploy the stack
echo "Deploying the stack..."
npx cdk deploy --profile $AWS_PROFILE

# Create or update .env.local with the API URL
echo "Updating .env.local with API URL..."

echo "Deployment complete! 🎉"
echo "API URL: $API_URL"
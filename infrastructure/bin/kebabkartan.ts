#!/usr/bin/env node
import 'source-map-support/register';
import { KebabkartanStack } from '../lib/kebabkartan-stack';
import { App } from 'aws-cdk-lib';

const app = new App;
new KebabkartanStack(app, 'KebabkartanStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
}); 
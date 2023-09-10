#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {AppSyncStack} from '../lib/app-sync-stack';

const app = new cdk.App();
const appSyncStack = new AppSyncStack(app, 'GraphqlApiStack', {
  env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
});

// new WafStack(app, 'wafStack', {
//   env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
//   apiArn: appSyncStack.api.attrArn
// } as unknown as StackProps);

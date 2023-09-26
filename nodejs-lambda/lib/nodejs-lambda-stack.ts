import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { CfnOutput } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';

export class NodejsLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFunction = new NodejsFunction(this, 'NodejsFunction', {
      entry: 'src/lambda/index.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_18_X,
      bundling: {
        externalModules: ['@aws-sdk/'],
        minify: true,
        sourceMap: true,
      } as NodejsFunctionProps['bundling'],
      environment: {
        POWERTOOLS_SERVICE_NAME: 'helloWorld',
        LOG_LEVEL: 'INFO',
        NODE_OPTIONS: '--enable-source-maps',
      },
      logRetention: RetentionDays.ONE_WEEK,
      tracing: Tracing.ACTIVE,
    } as NodejsFunctionProps);

    const api = new LambdaRestApi(this, 'apigw', {
      handler: lambdaFunction,
    });

    new CfnOutput(this, 'apiUrl', {
      exportName: 'apiUrl',
      value: api.url,
    });
  }
}

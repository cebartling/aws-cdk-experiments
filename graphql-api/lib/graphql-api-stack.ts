import {CfnApiKey, CfnDataSource, CfnGraphQLApi, CfnGraphQLSchema, CfnResolver} from 'aws-cdk-lib/aws-appsync';
import {Effect, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import {CfnOutput, RemovalPolicy, Stack, StackProps} from "aws-cdk-lib";
import {AttributeType, BillingMode, Table, TableClass} from "aws-cdk-lib/aws-dynamodb";
import {Construct} from 'constructs';
import {readFileSync} from "fs";

export class GraphqlApiStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const tableProps = {
      partitionKey: {
        name: 'Id',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'CreatedDate',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED,
      readCapacity: 2,
      writeCapacity: 2,
      removalPolicy: RemovalPolicy.DESTROY,
      tableClass: TableClass.STANDARD
    };
    const table = new Table(
      this,
      'Foobars',
      tableProps
    );

    table
      .autoScaleWriteCapacity({
        minCapacity: 2,
        maxCapacity: 10
      })
      .scaleOnUtilization({
        targetUtilizationPercent: 75
      });

    new CfnOutput(this, 'FoobarsTableName', {
      value: table.tableName
    });

    // Add AppSync GraphQL API, generate an API key for use and a schema
    const api = new CfnGraphQLApi(this, "graphql-api-id", {
      name: "graphql-api-name",
      authenticationType: "API_KEY",
      xrayEnabled: true
    });

    const apiKey = new CfnApiKey(this, 'graphql-api-key', {
      apiId: api.attrApiId,
    });

    const schema = new CfnGraphQLSchema(this, "graphql-api-schema", {
      apiId: api.attrApiId,
      definition: readFileSync("./graphql/schema.graphql").toString(),
    });

    // Add lambda, plus the required datasource and resolvers, as well as create an invoke lambda role for AppSync
    const invokeLambdaRole = new Role(this, "AppSync-InvokeLambdaRole", {
      assumedBy: new ServicePrincipal("appsync.amazonaws.com"),
    });

    const messagesLambdaFunction = new NodejsFunction(this, "messages-lambda-id", {
      entry: "./src/lambda/index.ts",
      handler: "handler",
      functionName: "lambda-function-name",
      runtime: Runtime.NODEJS_14_X,
    });

    const messagesDataSource = new CfnDataSource(this, "messages-datasource", {
      apiId: api.attrApiId,
      // Note: property 'name' cannot include hyphens
      name: "MessagesDataSource",
      type: "AWS_LAMBDA",
      lambdaConfig: {
        lambdaFunctionArn: messagesLambdaFunction.functionArn
      },
      serviceRoleArn: invokeLambdaRole.roleArn
    });

    const messagesResolver = new CfnResolver(this, "messages-resolver", {
      apiId: api.attrApiId,
      typeName: "Query",
      fieldName: "messages",
      dataSourceName: messagesDataSource.name,
    });

    const welcomeMessageResolver = new CfnResolver(this, "welcomeMessage-resolver", {
      apiId: api.attrApiId,
      typeName: "MessageQuery",
      fieldName: "welcomeMessage",
      dataSourceName: messagesDataSource.name,
    });

    const farewellMessageResolver = new CfnResolver(this, "farewellMessage-resolver", {
      apiId: api.attrApiId,
      typeName: "MessageQuery",
      fieldName: "farewellMessage",
      dataSourceName: messagesDataSource.name,
    });

    // Ensures that the resolvers are created after the schema.
    messagesResolver.addDependsOn(schema);
    welcomeMessageResolver.addDependsOn(schema);
    farewellMessageResolver.addDependsOn(schema);

    // Ensures that AppSync is able to invoke the lambda function.
    invokeLambdaRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [messagesLambdaFunction.functionArn],
      actions: ["lambda:InvokeFunction"]
    }));
  }
}

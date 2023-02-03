import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import {Construct} from 'constructs';

export class GraphqlApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tableProps = {
      partitionKey: {
        name: 'Id',
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: 'CreatedDate',
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 2,
      writeCapacity: 2,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableClass: dynamodb.TableClass.STANDARD
    };
    const table = new dynamodb.Table(
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

    new cdk.CfnOutput(this, 'FoobarsTableName', {
      value: table.tableName
    });
  }
}

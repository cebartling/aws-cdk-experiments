import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class CognitoUserPoolStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userpool = new cognito.UserPool(this, 'experiment-user-pool', {
      userPoolName: 'experiment-user-pool',
      signInAliases: {
        email: true,
      },
      selfSignUpEnabled: true,
      autoVerify: {
        email: true,
      },
      userVerification: {
        emailSubject: 'You need to verify your email',
        emailBody: 'Thanks for signing up! Your verification code is {####}.', // # This placeholder is a must if code is selected as preferred verification method
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      standardAttributes: {
        familyName: {
          mutable: false,
          required: true,
        },
        address: {
          mutable: true,
          required: false,
        },
      },
      customAttributes: {
        tenantId: new cognito.StringAttribute({
          mutable: false,
          minLen: 10,
          maxLen: 30,
        }),
        createdAt: new cognito.DateTimeAttribute(),
        employeeId: new cognito.NumberAttribute({
          mutable: false,
          min: 1,
          max: 100,
        }),
        isAdmin: new cognito.BooleanAttribute({
          mutable: false,
        }),
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    } as cognito.UserPoolProps);

    const appClient = userpool.addClient('experiment-app-client', {
      userPoolClientName: 'experiment-app-client',
      authFlows: {
        adminUserPassword: false,
        custom: false,
        userPassword: true,
        userSrp: false,
      } as cognito.AuthFlow,
    } as cognito.UserPoolClientOptions);
  }
}

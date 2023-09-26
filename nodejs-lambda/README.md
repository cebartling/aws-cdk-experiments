# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Tools

### AWS SAM CLI

```shell
brew install aws-sam-cli
```

## Testing commands

```shell
aws cloudformation describe-stacks --stack-name NodejsLambdaStack --query 'Stacks[0].Outputs[?ExportName==`apiUrl`].OutputValue' --output text
```

```shell
curl [LAMBDA_URL]
```

```shell
sam logs --stack-name NodejsLambdaStack
```


```shell
sam traces
```


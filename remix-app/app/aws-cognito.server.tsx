import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient([
  {
    region: process.env.AWS_REGION,
    // credentials: {
    //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // },
  },
]);

export async function signIn(
  username: string,
  password: string,
): Promise<InitiateAuthCommandOutput> {
  return await client.send(
    new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.AWS_USER_POOL_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    } as unknown as InitiateAuthCommandInput),
  );
}

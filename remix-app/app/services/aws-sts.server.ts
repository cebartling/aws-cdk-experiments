import {
  AssumeRoleCommand,
  AssumeRoleCommandInput,
  GetCallerIdentityCommand,
  STSClient,
} from '@aws-sdk/client-sts';

const client = new STSClient({ region: process.env.AWS_REGION! });

export const getCallerIdentity = async () => {
  return await client.send(new GetCallerIdentityCommand({}));
};

export const assumeRole = async () => {
  const input = {} as AssumeRoleCommandInput;
  const output = await client.send(new AssumeRoleCommand(input));
};

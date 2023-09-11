import { Amplify, Auth, Hub, Logger } from 'aws-amplify';
import { HubCallback, HubCapsule } from '@aws-amplify/core';

export const logger = new Logger('AmplifyLogger');

const listener: HubCallback = (data: HubCapsule) => {
  switch (data?.payload?.event) {
    case 'configured':
      logger.info('the Auth module is configured');
      break;
    case 'signIn':
      logger.info('user signed in');
      break;
    case 'signIn_failure':
      logger.error(
        'user sign in failed',
        JSON.stringify(data.payload.data, null, 2),
      );
      break;
    case 'signUp':
      logger.info('user signed up');
      break;
    case 'signUp_failure':
      logger.error('user sign up failed');
      break;
    case 'confirmSignUp':
      logger.info('user confirmation successful');
      break;
    case 'completeNewPassword_failure':
      logger.error('user did not complete new password flow');
      break;
    case 'autoSignIn':
      logger.info('auto sign in successful');
      break;
    case 'autoSignIn_failure':
      logger.error('auto sign in failed');
      break;
    case 'forgotPassword':
      logger.info('password recovery initiated');
      break;
    case 'forgotPassword_failure':
      logger.error('password recovery failed');
      break;
    case 'forgotPasswordSubmit':
      logger.info('password confirmation successful');
      break;
    case 'forgotPasswordSubmit_failure':
      logger.error('password confirmation failed');
      break;
    case 'verify':
      logger.info('TOTP token verification successful');
      break;
    case 'tokenRefresh':
      logger.info('token refresh succeeded');
      break;
    case 'tokenRefresh_failure':
      logger.error('token refresh failed');
      break;
    case 'cognitoHostedUI':
      logger.info('Cognito Hosted UI sign in successful');
      break;
    case 'cognitoHostedUI_failure':
      logger.error('Cognito Hosted UI sign in failed');
      break;
    case 'customOAuthState':
      logger.info('custom state returned from CognitoHosted UI');
      break;
    case 'customState_failure':
      logger.error('custom state failure');
      break;
    case 'parsingCallbackUrl':
      logger.info('Cognito Hosted UI OAuth url parsing initiated');
      break;
    case 'userDeleted':
      logger.info('user deletion successful');
      break;
    case 'updateUserAttributes':
      logger.info('user attributes update successful');
      break;
    case 'updateUserAttributes_failure':
      logger.info('user attributes update failed');
      break;
    case 'signOut':
      logger.info('user signed out');
      break;
    default:
      logger.info('unknown event type');
      break;
  }
};

Hub.listen('auth', listener);

export const amplifyAuthOptions = Amplify.configure({
  Auth: {
    region: process.env.AWS_REGION,
    userPoolId: process.env.AWS_USER_POOL_ID,
    userPoolWebClientId: process.env.AWS_USER_POOL_CLIENT_ID,
    // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
    // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
    // signUpVerificationMethod: 'code', // 'code' | 'link'

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    cookieStorage: {
      // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      domain: '.pintailconsultingllc.com',
      // OPTIONAL - Cookie path
      path: '/',
      // OPTIONAL - Cookie expiration in days
      expires: 365,
      // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
      sameSite: 'lax',
      // OPTIONAL - Cookie secure flag
      // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
      secure: false,
    },

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
});

export async function signIn(username: string, password: string): Promise<any> {
  return Auth.signIn(username, password);
}

export async function signOut(): Promise<any> {
  return Auth.signOut();
}

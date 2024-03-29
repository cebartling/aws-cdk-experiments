# AWS Cognito Experiment

## Implementation

1. Configure your AWS configuration for the AWS CLI.
1. Deploy the stack: `cdk deploy`
1. Obtain a temporary email address from https://temp-mail.org/en. For this experiment, I generated `detefig360@horsgit.com`
1. Sign in to the AWS Management Console and go the Cognito resource. 
   1. You can find the `user_pool_id` on the User Pool details page.
   1. You will find the `app_client_id` on the App Client details page.
1. Add a user through the AWS. 
   CLI: `aws cognito-idp sign-up --client-id <app_client_id> --username detefig360@horsgit.com --password "P4$$word*12345" --user-attributes Name="email",Value="detefig360@horsgit.com" Name="family_name",Value="Foobar" Name="custom:tenantId",Value="1234567890" name="custom:createdAt",Value="2023-09-09" Name="custom:employeeId",Value="10" Name="custom:isAdmin",Value="false" --region us-east-1`
1. Confirm the user. This is an admin command, so we do not have to provide the verification code that was sent to the user's email account. This will toggle the user’s confirmation state from `Unconfirmed` to `Confirmed`: `aws cognito-idp admin-confirm-sign-up --user-pool-id <user_pool_id> --username detefig360@horsgit.com --region us-east-1`
1. Update the email verified attribute on the user: `aws cognito-idp admin-update-user-attributes --user-pool-id <user_pool_id> --username detefig360@horsgit.com --user-attributes Name=email_verified,Value=true --region us-east-1`
1. List the users from the AWS CLI: `aws cognito-idp list-users --user-pool-id <user_pool_id> --region us-east-1`
1. Authenticate the user from the AWS CLI: `aws cognito-idp initiate-auth --auth-flow USER_PASSWORD_AUTH --client-id <app_client_id> --auth-parameters USERNAME="detefig360@horsgit.com",PASSWORD="P4$$word*12345" --region us-east-1`

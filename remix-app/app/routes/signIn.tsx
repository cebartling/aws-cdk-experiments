import type {
  ActionFunction,
  DataFunctionArgs,
  LoaderFunction,
  V2_MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/router';
import { Form } from '@remix-run/react';
import { signIn } from '~/aws-cognito.server';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Remix/AWS Amplify' },
    { name: 'description', content: 'Welcome to Remix/AWS Amplify!' },
  ];
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  return json({});
};

export const action: ActionFunction = async ({ request }: DataFunctionArgs) => {
  try {
    const formData = await request.formData();
    const username = formData.get('email') as string;
    const password = formData.get('password') as string;
    console.info('username', username);
    console.info('password', password);
    const output = await signIn(username, password);
    console.info('Command output', JSON.stringify(output, null, 2));
    return redirect('/protected', {
      // headers: {
      //   'Set-Cookie': `session=${user.signInUserSession.accessToken.jwtToken}; Max-Age=86400; Path=/; HttpOnly`,
      // },
    });
  } catch (error) {
    console.error(error);
    return redirect('/error');
  }
};

export default function SignIn() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Sign In</h1>
      <Form method="POST">
        <div className="flex flex-col p-4">
          <div className="flex p-4">
            <label htmlFor="email" className="font-bold text-lg">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input-field"
            />
          </div>
          <div className="flex p-4">
            <label htmlFor="password" className="font-bold text-lg">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input-field"
            />
          </div>
          <div>
            <button type="submit" role="button" className="btn">
              Sign In
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}

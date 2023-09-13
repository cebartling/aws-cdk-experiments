import type {
  DataFunctionArgs,
  LoaderFunction,
  V2_MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/router';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Remix/AWS Amplify' },
    { name: 'description', content: 'Welcome to Remix/AWS Amplify!' },
  ];
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  return json({});
};

// export const action: ActionFunction = async ({ request }: DataFunctionArgs) => {
//
// };

export default function SignOut() {
  return (
    <div>
      <h1>Signed out</h1>
    </div>
  );
}

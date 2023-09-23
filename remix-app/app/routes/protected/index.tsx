import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix/AWS Amplify' },
    { name: 'description', content: 'Welcome to Remix/AWS Amplify!' },
  ];
};

export const loader: LoaderFunction = async () => {
  return json({});
};

export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Protected resource</h1>
    </div>
  );
}

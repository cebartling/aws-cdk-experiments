import type { V2_MetaFunction } from '@remix-run/node';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Remix/AWS Amplify' },
    { name: 'description', content: 'Welcome to Remix/AWS Amplify!' },
  ];
};

export default function Index() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome to Remix/AWS</h1>
    </div>
  );
}

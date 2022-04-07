import { getSession, useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { GetServerSideProps } from 'next';

export default function Home() {
  const { user } = useUser();

  return (
    <div>
      <h1>Title</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <a href="/api/auth/logout">Logout</a>
    </div>
  );
}

const getServerSideProps2: GetServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res);

  console.log('session', session);

  return {
    props: {},
  };
};

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getServerSideProps2,
});

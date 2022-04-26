import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useMeQuery } from '../../graphql/generated/graphql';
import { ssrGetProducts } from '../../graphql/generated/page';
import { withApollo } from '../../lib/withApollo';

function Home({ data }) {
  const { data: me } = useMeQuery();
  return (
    <div className="text-violet-500">
      <h1>Title</h1>
      <pre>{JSON.stringify(me, null, 2)}</pre>
      {/* <pre>{JSON.stringify(data.products, null, 2)}</pre> */}
    </div>
  );
}

export default withApollo(ssrGetProducts.withPage()(Home));

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {
    return {
      props: {},
    };
    // return getServerPageGetProducts(null, ctx);
  },
});

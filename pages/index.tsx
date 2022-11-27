
import { ThirdwebSDK } from '@thirdweb-dev/sdk/solana';
import type { GetServerSideProps, NextPage } from 'next'
import { getUser } from '../auth.config';
import { network } from './_app';


export const getServersideProps: GetServerSideProps = async ({ req, res}) => {
  const sdk = ThirdwebSDK.fromNetwork(network);
  const user = await getUser(req);

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const program = await sdk.getNFTDrop(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS!,
  );

  const nfts = await program.getAllClaimed();

  const nft = nfts.find((nft) => nft.owner === user.address);

  console.log(nft);

  if (!nft) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  return { 
    props: {}
  }
}

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">

    </div>
  )
}

export default Home

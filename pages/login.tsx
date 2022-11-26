import { useWallet } from "@solana/wallet-adapter-react";
import {
  useClaimNFT,
  useDropUnclaimedSupply,
  useLogin,
  useLogout,
  useNFTs,
  useProgram,
  useUser,
} from "@thirdweb-dev/react/solana";
import { NFT } from "@thirdweb-dev/sdk";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { wallet } from "./_app";
import logo from "../public/images/Noobs.gif";
import Link from "next/link";

function LoginPage() {
  const [usersNft, setUsersNFT] = useState<NFT | undefined>();
  const login = useLogin();
  const logout = useLogout();
  const router = useRouter();
  const { user } = useUser();
  const { publicKey, connect, select } = useWallet();

  const { program } = useProgram(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS,
    "nft-drop"
  );

  const { data: unclaimedSupply } = useDropUnclaimedSupply(program);
  const { data: nfts, isLoading } = useNFTs(program);
  const { mutateAsync: claim } = useClaimNFT(program);

  // Prompt user to sign in with their wallet when navigating to this page
  useEffect(() => {
    if (!publicKey) {
      select(wallet.name);
      connect();
    }
  }, [publicKey, wallet]);

  useEffect(() => {
    if (!user || !nfts) return;

    const userNFT = nfts.find((nft) => nft.owner === user?.address);

    console.log(nfts);

    if (userNFT) {
      setUsersNFT(userNFT);
    }
  }, [nfts, user]);

  const handleLogin = async () => {
    await login();
    router.push("/");
  };

  const handlePurchase = async () => {
    await claim({
      amount: 1,
    });

    router.replace("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center bg-black">
      <div className="absolute top-56 left-0 w-full h-1/4 bg-[#F5AB0B] -skew-y-6 overflow-hidden shadow" />
      <Image
        className="mt-5 z-30 shadow-2xl mb-10 rounded-full"
        src={logo}
        alt="logo"
        width={400}
        height={400}
      />

      <main className="z-30 text-white">
        <h1 className="text-4xl font-bold mb-5">
          Welcome <span className="text-[#F5AB0B]">Noobs!</span>
        </h1>

        {!user && (
          <div>
            <button
              onClick={handleLogin}
              className="text-2xl font-bold mb-5 bg-[#F5AB0B] text-white py-4 px-10 border-2 border-black animate-pulse rounded-md transition duration-200 mt-5"
            >
              Login / Connect Wallet
            </button>
          </div>
        )}

        {user && (
          <div>
            <p className="text-lg text-[#F5AB0B] font-bold mb-10">
              Welcome {user?.address.slice(0, 5)}...{user?.address.slice(-5)}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="text-2xl font-bold mb-5 bg-[#F5AB0B] text-white py-4 px-10 border-2 border-black animate-pulse rounded-md transition duration-200">
            Hold on, We are looking for your Noobs Memebership Pass...
          </div>
        )}

        {usersNft && (
          <div>
            <Link
              href="/"
              className="text-2xl font-bold mb-5 bg-[#F5AB0B] text-white py-4 px-10 border-2 border-black animate-pulse rounded-md transition duration-200 mt-5"
            >
              HELLO NOOB! YOU MAY ENTER!
            </Link>
          </div>
        )}

        {!usersNft &&
        user &&
          !isLoading &&
          (unclaimedSupply && unclaimedSupply > 0 ? (
            <div>
              <button
                onClick={handlePurchase}
                className="text-2xl font-bold mb-5 bg-[#F5AB0B] text-white py-4 px-10 border-2 border-black animate-pulse rounded-md transition duration-200 mt-5"
              >
                Buy A Noobs Membership Pass!
              </button>
            </div>
          ) : (
            <div>
              <p className="text-2xl font-bold mb-5 bg-red-500 text-white py-4 px-10 border-2 border-red-500 rounded-md uppercase transition duration-200">
                Sorry, you missed out on the Noobs Membership Pass!
              </p>
            </div>
          ))}

        {user && (
          <button
          onClick={logout}
          className="text-2xl font-bold mb-5 bg-[#F5AB0B] text-white py-4 px-10 border-2 border-black animate-pulse rounded-md transition duration-200 mt-5"
        >
            Logout
        </button>
        )}
      </main>
    </div>
  );
}

export default LoginPage;

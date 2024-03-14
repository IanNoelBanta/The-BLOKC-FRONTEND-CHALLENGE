"use client";
import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [walletKey, setWalletKey] = useState("");
  const [nativeBalance, setNativeBalance] = useState("");
  const [tokenBalance, setTokenBalance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nftCount, setNftCount] = useState(0);
  const [nftNames, setNftNames] = useState([]);
  const [userWallet, setUserWallet] = useState("");

  const connectWallet = async () => {
    const { ethereum } = window as any;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    setWalletKey(accounts[0]);
    setConnected(true);

    getData();
  };

  const getData = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const userAddress = signer.address;
    setUserWallet(userAddress);

    try {
      setLoading(true);

      const balance = await fetch(
        `https://ian-the-blokc-backend-challenge.onrender.com/balance/${userAddress}`
      );
      if (!balance.ok) {
        throw new Error("Failed to fetch balance");
      }

      const dataBalance = await balance.json();
      const tokens = dataBalance["tokens"].map((token: string) => {
        return token;
      });

      setNativeBalance(dataBalance["native"]);
      setTokenBalance(tokens);

      const NFTs = await fetch(
        `https://ian-the-blokc-backend-challenge.onrender.com/nft/${userAddress}`
      );
      if (!balance.ok) {
        throw new Error("Failed to fetch NFTs");
      }

      const dataNFTs = await NFTs.json();
      const nftNames = dataNFTs
        .map((nft: any) => {
          return nft.metadata;
        })
        .map((metadata: any) => {
          return metadata.name;
        });

      setNftCount(dataNFTs.length);
      setNftNames(nftNames);

      setLoading(false);
      console.log("Successfully Fetched All Data!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen flex items-center flex flex-col items-center justify-center">
      {connected ? (
        loading ? (
          <>loading...</>
        ) : (
          <div className="items-center flex flex-col space-y-5">
            <div>
              <h1 className="text-4xl font-bold mb-8 flex items-center flex flex-col">
                {userWallet}
              </h1>
            </div>

            <div className="space-x-40 flex justify-center">
              <div>
                <h1 className="text-4xl font-bold mb-8 flex items-center flex flex-col">
                  Balance
                </h1>
                <h2 className="text-2xl mb-4">
                  Native Balance: {nativeBalance}
                </h2>
                <h2 className="text-2xl mb-4">Token Balances: </h2>
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  <ul>
                    {tokenBalance.map((token, index) => (
                      <li key={index}>- {token}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h1 className="text-4xl font-bold mb-8 flex items-center flex flex-col">
                  NFTs
                </h1>
                <h2 className="text-2xl mb-4">NFT Count: {nftCount}</h2>
                <h2 className="text-2xl mb-4">NFT Names: </h2>
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  <ul>
                    {nftNames.map((name, index) => (
                      <li key={index}>- {name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setConnected(false)}
            >
              Home
            </button>
          </div>
        )
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-8">Connect with MetaMask</h1>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={connectWallet}
          >
            Connect with MetaMask
          </button>
        </>
      )}
    </main>
  );
}

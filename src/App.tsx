import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const App: React.FC = () => {
  const [balance, setBalance] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to connect to the blockchain and fetch balance
  const connectToBlockchain = async () => {
    try {
      // Initialize provider
      const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_GNOSIS_RPC_URL);
      // const provider = new ethers.providers.Web3Provider(window.ethereum)


      // Initialize signer from private key (not ideal for production, use Metamask or wallet connect instead)
      const privateKey = process.env.REACT_APP_PRIVATE_KEY;
      if (!privateKey) {
        throw new Error('Private key is missing');
      }

      const wallet = new ethers.Wallet(privateKey, provider);

      // Set the address of the wallet
      setAddress(wallet.address);

      // Fetch and format balance
      const balance = await provider.getBalance(wallet.address);
      setBalance(ethers.formatEther(balance)); // Converts Wei to Ether
    } catch (err) {
      console.error('Error connecting to blockchain:', err);
      setError('Failed to connect to blockchain.');
    }
  };

  // Use effect to run once on component mount
  useEffect(() => {
    connectToBlockchain();
  }, []);

  return (
      <div style={{ padding: '20px' }}>
        <h1>Gnosis Chain React dApp</h1>
        {error ? (
            <p style={{ color: 'red' }}>{error}</p>
        ) : (
            <>
              <p>Connected to: {address || 'Loading...'}</p>
              <p>Balance: {balance ? `${balance} ETH` : 'Loading...'}</p>
            </>
        )}
      </div>
  );
};

export default App;

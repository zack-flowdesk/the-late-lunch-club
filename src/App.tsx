import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

const App: React.FC = () => {
    const [balance, setBalance] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [networkError, setNetworkError] = useState<string | null>(null);

    // Function to prompt user to switch to Gnosis Chain
    const switchToGnosisChain = async (provider: any) => {
        try {
            await provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: '0x64', // Gnosis Chain's chain ID
                        chainName: 'Gnosis Chain',
                        rpcUrls: ['https://rpc.gnosischain.com/'],
                        nativeCurrency: {
                            name: 'xDAI',
                            symbol: 'xDAI',
                            decimals: 18,
                        },
                        blockExplorerUrls: ['https://gnosisscan.io/'],
                    },
                ],
            });
            setNetworkError(null); // Clear network error once switched
        } catch (switchError) {
            console.error('Failed to switch network:', switchError);
            setNetworkError('Could not switch to Gnosis Chain.');
        }
    };

    // Connect MetaMask and check the network
    const connectToMetaMask = async () => {
        try {
            const provider: any = await detectEthereumProvider();

            if (provider) {
                await provider.request({method: 'eth_requestAccounts'});

                // Check the current network
                const chainId = await provider.request({method: 'eth_chainId'});
                if (chainId !== '0x64') {
                    setNetworkError('Please switch to the Gnosis Chain.');
                    await switchToGnosisChain(provider);
                    return;
                }

                // Initialize ethers provider and get the signer
                const ethersProvider = new ethers.BrowserProvider(provider);
                const signer = await ethersProvider.getSigner();
                const userAddress = await signer.getAddress();
                setAddress(userAddress);

                // Get the user's balance
                const userBalance = await ethersProvider.getBalance(userAddress);
                setBalance(ethers.formatEther(userBalance)); // Convert to Ether
            } else {
                setError('MetaMask not detected. Please install MetaMask to use this dApp.');
            }
        } catch (err) {
            console.error('Error connecting to MetaMask:', err);
            setError('Failed to connect to MetaMask.');
        }
    };

    useEffect(() => {
        connectToMetaMask();
    }, []);

    return (
        <div style={{padding: '20px'}}>
            <h1>Gnosis Chain React dApp with MetaMask</h1>
            {error ? (
                <p style={{color: 'red'}}>{error}</p>
            ) : networkError ? (
                <div>
                    <p style={{color: 'orange'}}>{networkError}</p>
                    <button onClick={() => connectToMetaMask()}>Switch to Gnosis Chain</button>
                </div>
            ) : (
                <>
                    <p>Connected to: {address || 'Connecting...'}</p>
                    <p>Balance: {balance ? `${balance} xDAI` : 'Fetching balance...'}</p>
                </>
            )}
        </div>
    );
};

export default App;

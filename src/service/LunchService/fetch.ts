import {ethers} from "ethers";
import contractABI from './IdeaVoting.json'; // Adjust the path if necessary


export const mockLunchIdeas = ['Pizza', 'Sushi', 'Burgers'];

export const newFetchLunchIdeas = async (): Promise<string[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockLunchIdeas);
        }, 1000);
    });
};

export const fetchLunchIdeas = async (): Promise<string[]> => {
    const providerUrl = 'https://gnosis-mainnet.public.blastapi.io';
    const provider = new ethers.JsonRpcProvider(providerUrl);

    // Create a contract instance
    const contractAddress = '0x98ea56b8afa5ebb886084a8eb6bd6d47c38fa046';

    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // Example: Call a function on the contract
    try {
        const result = await contract.getIdeasForCurrentRound(); // Replace with your actual function

        const formattedResult: IdeaContract[] = [];
        for (let i = 0; i < result[0].length; i++) {
            formattedResult.push({
                ideaIds: result[0][i],
                proposer: result[1][i],
                title: result[2][i],
                voteCount: result[3][i],
            })
        }

        return formattedResult.map((idea) => idea.title);
    } catch (error) {
        console.error('Error calling contract function:', error);
        return [];
    }
}

interface IdeaContract {
    ideaIds: number;
    proposer: string;
    title: string;
    voteCount: number;
}
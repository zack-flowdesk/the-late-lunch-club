import { Contract } from "ethers";

export const mockIdeas = ['Pizza', 'Sushi', 'Burgers'];

export const newFetchIdeas = async (): Promise<string[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockIdeas);
        }, 1000);
    });
};

export const fetchRoundTitle = async (contract: Contract): Promise<string | null> => {
    const isActive = await contract.isRoundActive();
    if (!isActive) { return null; }
    return await contract.getRoundTitle();
}

export const fetchIdeas = async (contract: Contract): Promise<string[]> => {
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
        console.log({formattedResult})

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
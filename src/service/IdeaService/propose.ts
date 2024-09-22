import { Contract } from "ethers";

export const proposeIdea = async (contract: Contract, newIdea: string): Promise<any> => {
    return contract.propose(newIdea);
};

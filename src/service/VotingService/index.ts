import { Contract } from "ethers";

const getVotingStatus = async (contract: Contract): Promise<boolean> => {
    const status = await contract.isRoundActive();
    return status !== undefined ? status : false;
};

const getVotingTitle = async (contract: Contract): Promise<string> => {
    const title = await contract.roundTitle();
    return title !== undefined ? title : '';
}

const startVoting = async (contract: Contract, title: string): Promise<void> => {
    return contract.start(title);
};

const endVoting = async (contract: Contract): Promise<void> => {
    return contract.end();
};

// You can add future API interaction functions here
// e.g., syncVotingWithAPI, fetchVotingStatusFromAPI, etc.

const VotingService = {
    getVotingStatus,
    getVotingTitle,
    startVoting,
    endVoting,
};

export default VotingService;

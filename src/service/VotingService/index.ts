// src/service/VotingService.ts

const storageKey = 'isVotingActive';

const getVotingStatus = (): boolean => {
    return JSON.parse(localStorage.getItem(storageKey) || 'false');
};

const startVoting = (): void => {
    localStorage.setItem(storageKey, JSON.stringify(true));
};

const endVoting = (): void => {
    localStorage.setItem(storageKey, JSON.stringify(false));
};

// You can add future API interaction functions here
// e.g., syncVotingWithAPI, fetchVotingStatusFromAPI, etc.

const VotingService = {
    getVotingStatus,
    startVoting,
    endVoting,
};

export default VotingService;

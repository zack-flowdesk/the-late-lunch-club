// src/service/VotingService.ts

class VotingService {
    private storageKey = 'isVotingActive';

    constructor() {
        // Initialize local storage if needed
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify(false));
        }
    }

    getVotingStatus(): boolean {
        return JSON.parse(localStorage.getItem(this.storageKey) || 'false');
    }

    startVoting(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(true));
    }

    endVoting(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(false));
    }

    // Add future API interaction methods here
    // e.g., syncVotingWithAPI(), fetchVotingStatusFromAPI(), etc.
}

const votingService = new VotingService();
export default votingService;

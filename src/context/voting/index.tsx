import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import VotingService from '../../service/VotingService';
import CirclesSDKContext from '../../CirclesSDKContext';

interface VotingContextType {
    getVotingStatus: () => Promise<boolean>;
    getVotingTitle: () => Promise<string>;
    startVoting: (title: string) => void
    endVoting: () => void;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export const VotingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [voteTitle, setVoteTitle] = useState<string>('');
    const { contract } = useContext(CirclesSDKContext);

    const startVoting = useCallback(async (title: string) => {
        if (!contract) return;
        setVoteTitle(title);
        await VotingService.startVoting(contract, title);
    }, [contract]);

    const endVoting = useCallback(async () => {
        if (!contract) return;
        await VotingService.endVoting(contract);
    }, [contract]);

    const getVotingStatus = useCallback(async () => {
        if (!contract) return false;
        return await VotingService.getVotingStatus(contract);
    }, [contract]);

    const getVotingTitle = useCallback(async () => {
        if (!contract) return '';
        return await VotingService.getVotingTitle(contract);
    }, [contract]);
    

    return (
        <VotingContext.Provider value={{ getVotingStatus, getVotingTitle, startVoting, endVoting }}>
            {children}
        </VotingContext.Provider>
    );
};

export const useVoting = () => {
    const context = useContext(VotingContext);
    if (!context) {
        throw new Error('useVoting must be used within a VotingProvider');
    }
    return context;
};

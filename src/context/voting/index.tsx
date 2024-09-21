import React, {createContext, useContext, useState, useEffect} from 'react';

interface VotingContextType {
    isVotingActive: boolean;
    startVoting: () => void;
    endVoting: () => void;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export const VotingProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isVotingActive, setIsVotingActive] = useState<boolean>(() => {
        // Initialize state from local storage
        const storedState = localStorage.getItem('isVotingActive');
        return storedState ? JSON.parse(storedState) : false;
    });

    const startVoting = () => {
        setIsVotingActive(true);
        localStorage.setItem('isVotingActive', JSON.stringify(true)); // Save to local storage
    };

    const endVoting = () => {
        setIsVotingActive(false);
        localStorage.setItem('isVotingActive', JSON.stringify(false)); // Save to local storage
    };

    useEffect(() => {
        // Update local storage whenever the voting state changes
        localStorage.setItem('isVotingActive', JSON.stringify(isVotingActive));
    }, [isVotingActive]);

    return (
        <VotingContext.Provider value={{isVotingActive, startVoting, endVoting}}>
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

import React from 'react';
import {useVoting} from '../../context/voting';

const HomePage: React.FC = () => {
    const {isVotingActive} = useVoting();

    const handleVote = (place: string) => {
        // Logic to handle voting for a place
        console.log(`Voted for: ${place}`);
    };

    return (
        <div>
            <h1>Home Page</h1>
            {isVotingActive ? (
                <div>
                    <h2>Select a Lunch Place</h2>
                    <button onClick={() => handleVote('Pizza')}>Vote for Pizza</button>
                    <button onClick={() => handleVote('Sushi')}>Vote for Sushi</button>
                    <button onClick={() => handleVote('Burgers')}>Vote for Burgers</button>
                </div>
            ) : (
                <p>No active voting round. Please wait for the admin to start a voting round.</p>
            )}
        </div>
    );
};

export default HomePage;

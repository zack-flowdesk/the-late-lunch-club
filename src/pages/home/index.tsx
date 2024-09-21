import React, {useState} from 'react';
import {useVoting} from '../../context/voting';

const HomePage: React.FC = () => {
    const {isVotingActive} = useVoting();
    const [ideas, setIdeas] = useState<string[]>(['Pizza', 'Sushi', 'Burgers']);
    const [newIdea, setNewIdea] = useState('');
    const [message, setMessage] = useState('');

    const handleVote = (place: string) => {
        // Logic to handle voting for a place
        console.log(`Voted for: ${place}`);
        setMessage(`You voted for ${place}!`);
        // Here you can update the state or send the vote to the backend
    };

    const handleProposeIdea = () => {
        if (newIdea.trim()) {
            if (ideas.includes(newIdea.trim())) {
                setMessage(`"${newIdea}" is already on the list!`);
            } else {
                setIdeas((prevIdeas) => [...prevIdeas, newIdea.trim()]);
                setMessage(`Proposed new idea: "${newIdea.trim()}"`);
                setNewIdea('');
            }
        } else {
            setMessage('Please enter a valid idea.');
        }
    };

    return (
        <div>
            <h1>Home Page</h1>
            {isVotingActive ? (
                <div>
                    <h2>Select a Lunch Place</h2>
                    <ul>
                        {ideas.map((idea) => (
                            <li key={idea}>
                                {idea}
                                <button onClick={() => handleVote(idea)}>Vote</button>
                            </li>
                        ))}
                    </ul>
                    <div>
                        <input
                            type="text"
                            value={newIdea}
                            onChange={(e) => setNewIdea(e.target.value)}
                            placeholder="Propose a new idea"
                        />
                        <button onClick={handleProposeIdea}>Propose Idea</button>
                    </div>
                </div>
            ) : (
                <p>No active voting round. Please wait for the admin to start a voting round.</p>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default HomePage;

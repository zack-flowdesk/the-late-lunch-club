import React, {useEffect, useState} from 'react';
import {useVoting} from '../../context/voting';
import {fetchLunchIdeas, proposeLunchIdea} from "../../service/lunchService";

const HomePage: React.FC = () => {
    const {isVotingActive} = useVoting();
    const [ideas, setIdeas] = useState<string[]>([]);
    const [newIdea, setNewIdea] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadLunchIdeas = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedIdeas = await fetchLunchIdeas();
                setIdeas(fetchedIdeas);
            } catch (err) {
                setError('Failed to fetch lunch ideas. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        loadLunchIdeas();
    }, []);

    const handleVote = (place: string) => {
        console.log(`Voted for: ${place}`);
        setMessage(`You voted for ${place}!`);
    };

    const handleProposeIdea = async () => {
        if (newIdea.trim()) {
            if (ideas.includes(newIdea.trim())) {
                setMessage(`"${newIdea}" is already on the list!`);
            } else {
                setLoading(true);
                setError(null);
                try {
                    await proposeLunchIdea(newIdea.trim());
                    setMessage(`Proposed new idea: "${newIdea.trim()}"`);
                    setNewIdea('');
                    // Fetch the updated list after proposing
                    const updatedIdeas = await fetchLunchIdeas();
                    setIdeas(updatedIdeas);
                } catch (err) {
                    setError('Failed to propose new idea. Please try again.');
                } finally {
                    setLoading(false);
                }
            }
        } else {
            setMessage('Please enter a valid idea.');
        }
    };

    return (
        <div>
            <h1>Home Page</h1>
            {loading ? (
                <p>Loading lunch ideas...</p>
            ) : error ? (
                <p style={{color: 'red'}}>{error}</p>
            ) : isVotingActive ? (
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

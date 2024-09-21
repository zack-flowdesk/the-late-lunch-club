import React, {useEffect, useState} from 'react';
import {useVoting} from '../../context/voting';
import {fetchLunchIdeas, proposeLunchIdea} from "../../service/LunchService";
import {Button, Input, List, Spin, Typography, message as antdMessage} from 'antd';

const {Title, Text} = Typography;

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
        antdMessage.success(`You voted for ${place}!`);
    };

    const handleProposeIdea = async () => {
        if (newIdea.trim()) {
            if (ideas.includes(newIdea.trim())) {
                antdMessage.warning(`"${newIdea}" is already on the list!`);
            } else {
                setLoading(true);
                setError(null);
                try {
                    await proposeLunchIdea(newIdea.trim());
                    antdMessage.success(`Proposed new idea: "${newIdea.trim()}"`);
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
            antdMessage.error('Please enter a valid idea.');
        }
    };

    return (
        <div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
            <Title level={2}>Home Page</Title>
            {loading ? (
                <Spin tip="Loading lunch ideas..." size="large"/>
            ) : error ? (
                <Text type="danger">{error}</Text>
            ) : isVotingActive ? (
                <div>
                    <Title level={3}>Select a Lunch Place</Title>
                    <List
                        bordered
                        dataSource={ideas}
                        renderItem={idea => (
                            <List.Item
                                actions={[
                                    <Button type="primary" onClick={() => handleVote(idea)}>
                                        Vote
                                    </Button>
                                ]}
                            >
                                {idea}
                            </List.Item>
                        )}
                    />
                    <div style={{marginTop: '20px'}}>
                        <Input
                            value={newIdea}
                            onChange={(e) => setNewIdea(e.target.value)}
                            placeholder="Propose a new idea"
                            style={{width: '70%', marginRight: '10px'}}
                        />
                        <Button type="dashed" onClick={handleProposeIdea}>
                            Propose Idea
                        </Button>
                    </div>
                </div>
            ) : (
                <Text>No active voting round. Please wait for the admin to start a voting round.</Text>
            )}
            {message && <Text>{message}</Text>}
        </div>
    );
};

export default HomePage;

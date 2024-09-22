import React, {useEffect, useState} from 'react';
import {useVoting} from '../../context/voting';
import {Button, Input, List, Spin, Typography, message as antdMessage} from 'antd';
import CrcComponent from './../../CrcComponent';
import { useContext } from "react";
import CirclesSDKContext from "../../CirclesSDKContext";
import { Contract } from "ethers";
import {fetchIdeas, proposeIdea} from "../../service/IdeaService";

const {Title, Text} = Typography;

const HomePage: React.FC = () => {
    const {getVotingStatus, getVotingTitle} = useVoting();
    const [ideas, setIdeas] = useState<string[]>([]);
    const [newIdea, setNewIdea] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isVotingActive, setisVotingActive] = useState<boolean>(false);
    const [voteTitle, setVoteTitle] = useState('');

    const { contract } = useContext(CirclesSDKContext);

    useEffect(() => {
        if (!contract) return;

        const loadIdeas = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedIdeas = await fetchIdeas(contract as Contract);
                setIdeas(fetchedIdeas);
            } catch (err) {
                setError('Failed to fetch ideas. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        loadIdeas();

        const loadVotingStatus = async () => {
            if (!contract) return;
            try {
                const status = await getVotingStatus();
                setisVotingActive(status);
            } catch (err) {
                setError('Failed to fetch voting status.');
            }
        };

        loadVotingStatus();

        const loadVotingTitle = async () => {
            if (!contract) return;
            try {
                const title = await getVotingTitle();
                setVoteTitle(title);
            } catch (err) {
                setError('Failed to fetch voting title.');
            }
        }
        loadVotingTitle();
    }, [contract]);

    const proposeNewIdea = async () => {
        if (!contract || !newIdea.trim()) {
            antdMessage.error('Please enter a valid idea.');
            return;
        }

        if (ideas.includes(newIdea.trim())) {
            antdMessage.warning(`"${newIdea}" is already on the list!`);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await proposeIdea(contract, newIdea.trim());
            antdMessage.success(`Proposed new idea: "${newIdea.trim()}"`);
            setNewIdea(''); // Clear input after successful proposal
            const updatedIdeas = await fetchIdeas(contract as unknown as Contract);
            setIdeas(updatedIdeas);
        } catch (err) {
            setError('Failed to propose new idea. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = (place: string) => {
        antdMessage.success(`You voted for ${place}!`);
    };

    const handleNewIdeaChange = (e: any) => {
        setNewIdea(e.target.value);
    };

    return (
        <div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
            <Title level={2}>Welcome!</Title>
            {loading ? (
                <Spin tip="Loading ideas..." size="large"/>
            ) : error ? (
                <Text type="danger">{error}</Text>
            ) : isVotingActive ? (
                <div>
                    <Title level={3}>{ voteTitle }</Title>
                    <List
                        bordered
                        dataSource={ideas}
                        renderItem={(idea: any) => (
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
                            onChange={handleNewIdeaChange}
                            placeholder="Propose a new idea"
                            style={{width: '70%', marginRight: '10px'}}
                        />
                        <Button
                            type="dashed"
                            onClick={proposeNewIdea} // Call the proposal function on button click
                        >
                            Propose Idea
                        </Button>
                    </div>
                </div>
            ) : (
                <Text>No active voting round. Please wait for the admin to start a voting round.</Text>
            )}
            {message && <Text>{message}</Text>}
            <CrcComponent/>
        </div>
    );
};

interface IdeaContract {
    ideaIds: number;
    proposer: string;
    title: string;
    voteCount: number;
}

export default HomePage;
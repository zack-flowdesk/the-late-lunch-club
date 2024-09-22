import React, {useEffect, useState, useContext} from 'react';
import {useVoting} from '../../context/voting';
import {addMember, fetchMembers, removeMember} from "../../service/MemberService";
import {Button, Input, List, Typography, message as antdMessage, Space, Switch, Spin} from 'antd';
import CirclesSDKContext, { CirclesSDK } from '../../CirclesSDKContext';

const {Title, Text} = Typography;

const AdminPage: React.FC = () => {
    const {startVoting, endVoting, getVotingStatus, getVotingTitle} = useVoting();
    const [members, setMembers] = useState<string[]>([]);
    const [newMember, setNewMember] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [voteTitle, setVoteTitle] = useState('');
    const [isVotingActive, setIsVotingActive] = useState<boolean>(false);

    const { avatar } = useContext(CirclesSDKContext);

    useEffect(() => {
        const loadMembers = async () => {
            setIsUpdating(true);
            const fetchedMembers = await fetchMembers(avatar);
            setIsUpdating(false);
            setMembers(fetchedMembers);
        };
        loadMembers();

        const loadVotingStatus = async () => {
            try {
                const status = await getVotingStatus();
                setIsVotingActive(status);
            } catch (err) {
                antdMessage.error('Failed to fetch voting status.');
            }
        };
        loadVotingStatus();
    }, [avatar]);

    const handleAddMember = async () => {
        if (newMember.trim()) {
            setIsUpdating(true);
            await addMember(avatar, newMember.trim());
            setIsUpdating(false);
            setMembers((prevMembers) => [...prevMembers, newMember.trim()]);
            antdMessage.success(`Added new member: ${newMember}`);
            setNewMember('');
        } else {
            antdMessage.error('Please enter a valid member name.');
        }
    };

    const handleRemoveMember = async (memberToRemove: string) => {
        setIsUpdating(true);
        await removeMember(avatar, memberToRemove);
        setIsUpdating(false);
        setMembers((prevMembers) => prevMembers.filter(member => member !== memberToRemove));
        antdMessage.success(`Removed member: ${memberToRemove}`);
    };

    const activateVoting = (title: string) => {
        startVoting(title);
        setIsVotingActive(true);
        antdMessage.success('Voting round started!');
    }

    const deactivateVoting = () => {
        setIsVotingActive(false);
        endVoting();
        antdMessage.success('Voting round ended!');
    }

    return (
        <div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
            <Title level={2}>Admin Page</Title>

            <div style={{marginBottom: '30px'}}>
                <Title level={3}>Add Members</Title>
                <Space direction="vertical" style={{width: '100%'}}>
                    <Input
                        placeholder="Enter member name"
                        value={newMember}
                        onChange={(e) => setNewMember(e.target.value)}
                        style={{width: '100%'}}
                    />
                    <Button type="primary" onClick={handleAddMember}>
                        Add Member
                    </Button>
                </Space>

                <List
                    header={<Text strong>Members List {isUpdating ? (<Spin></Spin>) : (<Text></Text>)} </Text>}
                    bordered
                    dataSource={members}
                    renderItem={(member) => (
                        <List.Item
                            actions={[
                                <Button danger onClick={() => handleRemoveMember(member)}>
                                    Remove
                                </Button>
                            ]}
                        >
                            {member}
                        </List.Item>
                    )}
                    style={{marginTop: '20px'}}
                />
            </div>

            <div>
                <Title level={3}>Vote Management</Title>
                {isVotingActive ? (
                    <Space direction="vertical">
                        <Button type="primary" onClick={deactivateVoting}>
                            End Voting Round
                        </Button>
                    </Space>
                ) : (
                    <Space direction="vertical">
                        <Input
                            placeholder="Enter vote title"
                            onChange={(e) => setVoteTitle(e.target.value)}
                            style={{width: '100%'}}
                        />
                        <Button type="primary" onClick={() => activateVoting(voteTitle)}>
                            Start Voting Round
                        </Button>
                    </Space>
                )}
            </div>
        </div>
    );
};

export default AdminPage;

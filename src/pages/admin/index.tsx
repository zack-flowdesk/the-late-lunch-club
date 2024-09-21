import React, {useEffect, useState} from 'react';
import {useVoting} from '../../context/voting';
import {addMember, fetchMembers, removeMember} from "../../service/MemberService";
import {Button, Input, List, Typography, message as antdMessage, Space, Switch} from 'antd';

const {Title, Text} = Typography;

const AdminPage: React.FC = () => {
    const {startVoting, endVoting, isVotingActive} = useVoting();
    const [members, setMembers] = useState<string[]>([]);
    const [newMember, setNewMember] = useState('');

    useEffect(() => {
        const loadMembers = async () => {
            const fetchedMembers = await fetchMembers();
            setMembers(fetchedMembers);
        };
        loadMembers();
    }, []);

    const handleAddMember = async () => {
        if (newMember.trim()) {
            await addMember(newMember.trim());
            setMembers((prevMembers) => [...prevMembers, newMember.trim()]);
            antdMessage.success(`Added new member: ${newMember}`);
            setNewMember('');
        } else {
            antdMessage.error('Please enter a valid member name.');
        }
    };

    const handleRemoveMember = async (memberToRemove: string) => {
        await removeMember(memberToRemove);
        setMembers((prevMembers) => prevMembers.filter(member => member !== memberToRemove));
        antdMessage.success(`Removed member: ${memberToRemove}`);
    };

    // Handle the toggle for voting
    const handleToggleVoting = (checked: boolean) => {
        if (checked) {
            startVoting();
            antdMessage.success('Voting round started!');
        } else {
            endVoting();
            antdMessage.success('Voting round ended!');
        }
    };

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
                    header={<Text strong>Members List</Text>}
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
                <Title level={3}>Voting Round Status</Title>
                <Space direction="vertical">
                    <Switch
                        checked={isVotingActive}
                        onChange={handleToggleVoting}
                        checkedChildren="ON"
                        unCheckedChildren="OFF"
                    />
                    {isVotingActive ? (
                        <Text type="success">Voting is currently active!</Text>
                    ) : (
                        <Text type="warning">No active voting round.</Text>
                    )}
                </Space>
            </div>
        </div>
    );
};

export default AdminPage;

import React, {useState} from 'react';
import {useVoting} from '../../context/voting';

const AdminPage: React.FC = () => {
    const {startVoting, endVoting, isVotingActive} = useVoting();
    const [members, setMembers] = useState<string[]>([]);
    const [newMember, setNewMember] = useState('');

    const handleAddMember = () => {
        if (newMember) {
            setMembers([...members, newMember]);
            setNewMember('');
        }
    };

    return (
        <div>
            <h1>Admin Page</h1>
            <div>
                <h2>Add Members</h2>
                <input
                    type="text"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    placeholder="Enter member name"
                />
                <button onClick={handleAddMember}>Add Member</button>
                <ul>
                    {members.map((member, index) => (
                        <li key={index}>{member}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Voting Round</h2>
                <button onClick={startVoting} disabled={isVotingActive}>
                    Start Voting Round
                </button>
                <button onClick={endVoting} disabled={!isVotingActive}>
                    End Voting Round
                </button>
                {isVotingActive ? <p>Voting is currently active!</p> : <p>No active voting round.</p>}
            </div>
        </div>
    );
};

export default AdminPage;

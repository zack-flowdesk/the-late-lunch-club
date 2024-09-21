// src/service/memberService.ts
const MEMBER_KEY = 'members';

export const fetchMembers = async (): Promise<string[]> => {
    const members = localStorage.getItem(MEMBER_KEY);
    return members ? JSON.parse(members) : [];
};

export const addMember = async (member: string): Promise<void> => {
    const members = await fetchMembers();
    members.push(member);
    localStorage.setItem(MEMBER_KEY, JSON.stringify(members));
};

export const removeMember = async (memberToRemove: string): Promise<void> => {
    const members = await fetchMembers();
    const updatedMembers = members.filter(member => member !== memberToRemove);
    localStorage.setItem(MEMBER_KEY, JSON.stringify(updatedMembers));
};

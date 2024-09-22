import { Avatar } from "@circles-sdk/sdk";

// src/service/memberService.ts

export const fetchMembers = async (avatar: any): Promise<string[]> => {
    if (!avatar) return [];
    
    const relations = await (avatar as unknown as Avatar).getTrustRelations();
    const members = relations.filter(({relation}) => ['trusts', 'mutuallyTrusts'].includes(relation)).map(({objectAvatar}) => objectAvatar);
    return members;
};

export const addMember = async (avatar: any, member: string): Promise<void> => {
    await (avatar as unknown as Avatar).trust(member);
};

export const removeMember = async (avatar: any, memberToRemove: string): Promise<void> => {
    await (avatar as unknown as Avatar).untrust(memberToRemove);
};

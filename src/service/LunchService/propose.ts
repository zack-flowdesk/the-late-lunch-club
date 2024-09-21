// src/services/lunchService.ts

import {mockLunchIdeas} from "./fetch";

export const proposeLunchIdea = async (newIdea: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate a random failure
            if (Math.random() < 0.2) {
                reject(new Error('Failed to propose new idea.'));
            } else {
                mockLunchIdeas.push(newIdea); // Simulate adding to the list
                resolve();
            }
        }, 500);
    });
};

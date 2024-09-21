export const mockLunchIdeas = ['Pizza', 'Sushi', 'Burgers'];

export const fetchLunchIdeas = async (): Promise<string[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockLunchIdeas);
        }, 1000);
    });
};
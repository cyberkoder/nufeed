// This file provides authentication utility functions
// Note: This is a simple client-side implementation
// In a production app, you would use a proper authentication system

export interface User {
    id?: string;
    name: string;
    email: string;
}

export const login = async (email: string, password: string): Promise<User> => {
    // In a real app, you would call an API endpoint here
    return new Promise((resolve, reject) => {
        // Mock implementation
        setTimeout(() => {
            if (email && password) {
                const user = { name: email.split("@")[0], email };
                localStorage.setItem("user", JSON.stringify(user));
                resolve(user);
            } else {
                reject(new Error("Invalid credentials"));
            }
        }, 500);
    });
};

export const signup = async (
    name: string,
    email: string,
    password: string
): Promise<User> => {
    // In a real app, you would call an API endpoint here
    return new Promise((resolve, reject) => {
        // Mock implementation
        setTimeout(() => {
            if (name && email && password) {
                const user = { name, email };
                localStorage.setItem("user", JSON.stringify(user));
                resolve(user);
            } else {
                reject(new Error("Invalid information"));
            }
        }, 500);
    });
};

export const logout = (): void => {
    localStorage.removeItem("user");
};

export const getCurrentUser = (): User | null => {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch (e) {
        console.error("Failed to parse user data", e);
        return null;
    }
};

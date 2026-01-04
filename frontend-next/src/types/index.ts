// User Types
export interface User {
    _id: string;
    fullName: string;
    email: string;
    profilePic: string;
}

// Message Types
export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text?: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

// Auth Types
export interface SignupData {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    _id: string;
    fullName: string;
    email: string;
    profilePic: string;
}

// API Response Types
export interface ApiError {
    message: string;
}

// Socket Events
export interface ServerToClientEvents {
    getOnlineUsers: (userIds: string[]) => void;
    newMessage: (message: Message) => void;
}

export interface ClientToServerEvents {
    setup: (userId: string) => void;
}

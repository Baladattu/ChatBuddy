import { Document } from 'mongoose';

// User Types
export interface IUser extends Document {
    _id: string;
    email: string;
    fullName: string;
    password: string;
    profilePic: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SignupData {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

// Message Types
export interface IMessage extends Document {
    _id: string;
    senderId: string;
    receiverId: string;
    text?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Auth Types
export interface AuthRequest extends Request {
    userId?: string;
}

// Environment Types
export interface EnvironmentVariables {
    PORT: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    NODE_ENV: 'development' | 'production';
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends EnvironmentVariables { }
    }
}

export { };

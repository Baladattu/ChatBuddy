import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import type { User, Message } from "../types";

interface MessageData {
    text?: string;
    image?: string;
}

interface ChatState {
    messages: Message[];
    users: User[];
    selectedUser: User | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;

    getUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    sendMessage: (messageData: MessageData) => Promise<void>;
    subscribeToMessages: () => void;
  un subscribeFromMessages: () => void;
setSelectedUser: (selectedUser: User | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get<User[]>("/messages/users");
            set({ users: res.data });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get<Message[]>(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) return;

        try {
            const res = await axiosInstance.post<Message>(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

import { create } from "zustand";

interface ThemeState {
    theme: string;
    setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: (typeof window !== "undefined" ? localStorage.getItem("chat-theme") : null) || "dark",
    setTheme: (theme) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("chat-theme", theme);
        }
        set({ theme });
    },
}));

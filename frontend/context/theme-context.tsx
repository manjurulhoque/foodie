"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

function updateThemeClass(theme: Theme) {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

    root.classList.remove("light", "dark");
    root.classList.add(theme === "system" ? systemTheme : theme);
}

export function ThemeProvider({
    children,
    defaultTheme = "light",
    storageKey = "ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(defaultTheme);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const savedTheme = localStorage.getItem(storageKey) as Theme;
        if (savedTheme) {
            setThemeState(savedTheme);
            updateThemeClass(savedTheme);
        } else {
            updateThemeClass(defaultTheme);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            if (theme === "system") {
                updateThemeClass("system");
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme, mounted]);

    useEffect(() => {
        if (!mounted) return;
        updateThemeClass(theme);
    }, [theme, mounted]);

    const setTheme = (newTheme: Theme) => {
        try {
            if (typeof window !== "undefined") {
                localStorage.setItem(storageKey, newTheme);
            }
            setThemeState(newTheme);
            updateThemeClass(newTheme);
        } catch (error) {
            console.warn("Error saving theme to localStorage:", error);
        }
    };

    const value = {
        theme,
        setTheme,
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};

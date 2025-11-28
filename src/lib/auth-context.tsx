'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/api-client';

interface User {
    userId: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token on mount
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            // Fetch user info
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await apiClient.get('/auth/me');
            setUser(response.data.data.user);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            localStorage.removeItem('token');
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const { token: newToken, user: newUser } = response.data.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(newUser);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (email: string, password: string) => {
        try {
            const response = await apiClient.post('/auth/register', { email, password });
            const { token: newToken, user: newUser } = response.data.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(newUser);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/shared/api/client';
import { UserDto, UserRole, SellerStatus } from '@gsnake/shared-types';
import { getRoleRedirectRoute } from '@/utils/role-redirect';

// Extended User interface for auth context (includes additional fields from /auth/me endpoint)
// Note: Backend returns snake_case fields in /auth/me response
interface User extends Omit<UserDto, 'id'> {
    userId: string; // Backend returns userId in /auth/me
    seller_status?: string | null; // Backend returns snake_case
    seller_approved_at?: string | null; // Backend returns snake_case
    seller_rejection_reason?: string | null; // Backend returns snake_case
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    getRedirectRoute: () => string; // Get redirect route based on user role
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
            const response = await apiClient.get<{ user: any }>('/auth/me');
            // apiClient.get() already unwraps response.data, so response is already the data
            setUser(response.user);
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
            const response = await apiClient.post<{ token: string; refreshToken?: string; user: any }>('/auth/login', { email, password });
            // apiClient.post() already unwraps response.data, so response is already the data
            const { token: newToken, refreshToken, user: newUser } = response;

            localStorage.setItem('token', newToken);
            if (refreshToken) {
                localStorage.setItem('refresh_token', refreshToken);
            }
            setToken(newToken);
            setUser({
                userId: newUser.id,
                email: newUser.email,
                role: newUser.role,
            });
        } catch (error: any) {
            // apiClient formats errors as ErrorResponse, so error.message is available directly
            throw new Error(error.message || error.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    const register = async (email: string, password: string) => {
        try {
            const response = await apiClient.post<{ token: string; refreshToken?: string; user: any }>('/auth/register', { email, password });
            // apiClient.post() already unwraps response.data, so response is already the data
            const { token: newToken, refreshToken, user: newUser } = response;

            localStorage.setItem('token', newToken);
            if (refreshToken) {
                localStorage.setItem('refresh_token', refreshToken);
            }
            setToken(newToken);
            setUser({
                userId: newUser.id,
                email: newUser.email,
                role: newUser.role,
            });
        } catch (error: any) {
            // apiClient formats errors as ErrorResponse, so error.message is available directly
            // Check for validation errors details
            if (error.details && Array.isArray(error.details)) {
                const details = error.details.map((d: any) => d.message).join(', ');
                throw new Error(`${error.message || 'Đăng ký thất bại'}: ${details}`);
            }
            throw new Error(error.message || error.response?.data?.message || 'Đăng ký thất bại');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUser(null);
        // Redirect to login page
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    };

    /**
     * Get the default redirect route based on user role
     */
    const getRedirectRoute = (): string => {
        if (!user || !user.role) {
            return '/'; // Default to home if no user or role
        }
        return getRoleRedirectRoute(user.role);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, getRedirectRoute }}>
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

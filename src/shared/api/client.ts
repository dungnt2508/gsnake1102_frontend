import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '@gsnake/shared-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Enhanced API client with better error handling
 */
class ApiClient {
    private client = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    private refreshingToken: Promise<string> | null = null;

    constructor() {
        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError<ApiResponse<any> | ErrorResponse>) => {
                const originalRequest = error.config as any;

                // Handle 401 with token refresh
                if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
                    originalRequest._retry = true;

                    // For now, just redirect to login
                    // Can be extended to support refresh tokens
                    localStorage.removeItem('token');
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(error);
                }

                // Format error response
                const errorResponse: ErrorResponse = {
                    error: true,
                    code: error.response?.data?.code || 'UNKNOWN_ERROR',
                    message: error.response?.data?.message || 'An error occurred',
                    details: (error.response?.data as any)?.details,
                    requestId: (error.response?.data as any)?.requestId,
                };

                return Promise.reject(errorResponse);
            }
        );
    }

    async get<T>(url: string, config?: any): Promise<T> {
        const response = await this.client.get<{ success?: boolean; data?: T; message?: string }>(url, config);
        // Backend returns { success: true, data: {...} } or { error: true, ... }
        // Unwrap to return just the data
        if (response.data.success && response.data.data !== undefined) {
            return response.data.data as T;
        }
        // Fallback: assume response.data is already the data
        return response.data as T;
    }

    async post<T>(url: string, data?: any, config?: any): Promise<T> {
        const response = await this.client.post<{ success?: boolean; data?: T; message?: string }>(url, data, config);
        if (response.data.success && response.data.data !== undefined) {
            return response.data.data as T;
        }
        return response.data as T;
    }

    async put<T>(url: string, data?: any, config?: any): Promise<T> {
        const response = await this.client.put<{ success?: boolean; data?: T; message?: string }>(url, data, config);
        if (response.data.success && response.data.data !== undefined) {
            return response.data.data as T;
        }
        return response.data as T;
    }

    async delete<T>(url: string, config?: any): Promise<T> {
        const response = await this.client.delete<{ success?: boolean; data?: T; message?: string }>(url, config);
        if (response.data.success && response.data.data !== undefined) {
            return response.data.data as T;
        }
        return response.data as T;
    }
}

export const apiClient = new ApiClient();


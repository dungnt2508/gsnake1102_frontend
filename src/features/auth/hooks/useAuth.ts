import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginDto, RegisterDto, UserDto } from '@gsnake/shared-types';
import { apiClient } from '@/shared/api/client';

/**
 * Get current user
 */
export function useMe() {
    return useQuery({
        queryKey: ['auth', 'me'],
        queryFn: async () => {
            // apiClient.get() already unwraps response.data, so response is already the data
            const response = await apiClient.get<{ user: UserDto }>('/auth/me');
            return response?.user;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: false, // Don't retry on 401
    });
}

/**
 * Login mutation
 */
export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: LoginDto) => {
            // apiClient.post() already unwraps response.data, so response is already the data
            const response = await apiClient.post<{ user: UserDto; token: string }>('/auth/login', data);
            const { token, user } = response;
            
            // Store token
            localStorage.setItem('token', token);
            
            return { user, token };
        },
        onSuccess: () => {
            // Invalidate and refetch user data
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        },
    });
}

/**
 * Register mutation
 */
export function useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: RegisterDto) => {
            // apiClient.post() already unwraps response.data, so response is already the data
            const response = await apiClient.post<{ user: UserDto; token: string }>('/auth/register', data);
            const { token, user } = response;
            
            // Store token
            localStorage.setItem('token', token);
            
            return { user, token };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        },
    });
}

/**
 * Logout mutation
 */
export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            localStorage.removeItem('token');
        },
        onSuccess: () => {
            // Clear all queries
            queryClient.clear();
        },
    });
}


import apiClient from '@/lib/api-client';

export interface Schedule {
    id: string;
    user_id: string;
    source_type: 'url' | 'rss' | 'file';
    source_value: string;
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    last_fetched?: string;
    next_fetch: string;
    workflow_id?: string;
    active: boolean;
    created_at: string;
}

export interface CreateScheduleInput {
    source_type: 'url' | 'rss' | 'file';
    source_value: string;
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export const scheduleService = {
    /**
     * Get all schedules for current user
     */
    async getSchedules(): Promise<Schedule[]> {
        const response = await apiClient.get('/schedules');
        return response.data.data.schedules || [];
    },

    /**
     * Create a new schedule
     */
    async createSchedule(data: CreateScheduleInput): Promise<Schedule> {
        const response = await apiClient.post('/schedules', data);
        return response.data.data.schedule;
    },

    /**
     * Update a schedule
     */
    async updateSchedule(id: string, data: Partial<CreateScheduleInput & { frequency: string }>): Promise<Schedule> {
        const response = await apiClient.put(`/schedules/${id}`, data);
        return response.data.data.schedule;
    },

    /**
     * Delete a schedule
     */
    async deleteSchedule(id: string): Promise<void> {
        await apiClient.delete(`/schedules/${id}`);
    },
};


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';

interface DashboardStats {
    articles: {
        total: number;
        newThisWeek: number;
    };
    tools: {
        total: number;
        processing: number;
    };
    schedules: {
        total: number;
        nextFetch?: string;
    };
    persona: {
        tone?: string;
        language_style?: string;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [recentActivities, setRecentActivities] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch articles
            const articlesRes = await apiClient.get('/articles?limit=100');
            const articles = articlesRes.data.data.articles || [];
            
            // Calculate new articles this week
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const newThisWeek = articles.filter((a: any) => 
                new Date(a.created_at) > oneWeekAgo
            ).length;

            // Fetch tools
            const toolsRes = await apiClient.get('/tools?limit=100');
            const tools = toolsRes.data.data.tools || [];
            const processingTools = tools.filter((t: any) => 
                t.status === 'processing' || t.status === 'pending'
            ).length;

            // Fetch schedules
            const schedulesRes = await apiClient.get('/schedules');
            const schedules = schedulesRes.data.data.schedules || [];
            
            // Find next fetch time
            const activeSchedules = schedules.filter((s: any) => s.active);
            const nextFetch = activeSchedules.length > 0 
                ? activeSchedules.sort((a: any, b: any) => 
                    new Date(a.next_fetch).getTime() - new Date(b.next_fetch).getTime()
                  )[0]?.next_fetch
                : undefined;

            // Fetch persona
            let persona = { tone: '', language_style: '' };
            try {
                const personaRes = await apiClient.get('/personas');
                persona = personaRes.data.data.persona || {};
            } catch (err) {
                // Persona might not exist
            }

            setStats({
                articles: {
                    total: articles.length,
                    newThisWeek,
                },
                tools: {
                    total: tools.length,
                    processing: processingTools,
                },
                schedules: {
                    total: schedules.length,
                    nextFetch,
                },
                persona,
            });

            // Get recent activities (last 3 articles and tools)
            const recentArticles = articles
                .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 2)
                .map((a: any) => ({
                    type: 'article',
                    text: `Đã tóm tắt bài báo "${a.title || a.url?.substring(0, 30)}"`,
                    status: a.status,
                    time: a.created_at,
                }));

            const recentTools = tools
                .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 1)
                .map((t: any) => ({
                    type: 'tool',
                    text: `Hoàn thành yêu cầu tool "${t.request_payload?.description?.substring(0, 30) || 'Tool request'}"`,
                    status: t.status,
                    time: t.created_at,
                }));

            setRecentActivities([...recentArticles, ...recentTools].sort((a, b) => 
                new Date(b.time).getTime() - new Date(a.time).getTime()
            ).slice(0, 3));

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        return `${diffDays} ngày trước`;
    };

    const formatNextFetch = (dateString?: string) => {
        if (!dateString) return 'Không có';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);

        if (diffMs < 0) return 'Đã quá hạn';
        if (diffHours > 0) return `${diffHours}h ${diffMins}m nữa`;
        return `${diffMins} phút nữa`;
    };

    const getPersonaDisplay = () => {
        if (!stats?.persona.tone && !stats?.persona.language_style) {
            return 'Chưa cấu hình';
        }
        const toneMap: Record<string, string> = {
            professional: 'Chuyên nghiệp',
            casual: 'Thoải mái',
            witty: 'Hóm hỉnh',
            friendly: 'Thân thiện',
            academic: 'Học thuật',
            sarcastic: 'Châm biếm',
        };
        const styleMap: Record<string, string> = {
            concise: 'Ngắn gọn',
            detailed: 'Chi tiết',
            simple: 'Đơn giản',
            technical: 'Kỹ thuật',
            storytelling: 'Kể chuyện',
        };
        return `${toneMap[stats.persona.tone || ''] || stats.persona.tone} / ${styleMap[stats.persona.language_style || ''] || stats.persona.language_style}`;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tổng số bài báo</h3>
                        <span className="text-2xl">📰</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.articles.total || 0}</p>
                    {stats && stats.articles.newThisWeek > 0 && (
                        <p className="text-xs text-green-500 mt-2">↑ {stats.articles.newThisWeek} bài mới tuần này</p>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Yêu cầu công cụ</h3>
                        <span className="text-2xl">🛠️</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.tools.total || 0}</p>
                    {stats && stats.tools.processing > 0 && (
                        <p className="text-xs text-blue-500 mt-2">{stats.tools.processing} đang xử lý</p>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Lịch trình hoạt động</h3>
                        <span className="text-2xl">⏰</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.schedules.total || 0}</p>
                    {stats?.schedules.nextFetch && (
                        <p className="text-xs text-gray-500 mt-2">Lần tới: {formatNextFetch(stats.schedules.nextFetch)}</p>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Persona</h3>
                        <span className="text-2xl">🎭</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">{getPersonaDisplay()}</p>
                    <Link href="/dashboard/settings?tab=bot" className="text-xs text-indigo-500 hover:underline mt-2 block">
                        Chỉnh sửa Persona →
                    </Link>
                </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Hoạt động gần đây</h3>
                    <div className="space-y-4">
                        {recentActivities.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                                Chưa có hoạt động nào
                            </p>
                        ) : (
                            recentActivities.map((activity, i) => (
                                <div key={i} className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${
                                        activity.status === 'done' ? 'bg-green-500' : 
                                        activity.status === 'processing' ? 'bg-yellow-500' : 
                                        'bg-blue-500'
                                    }`} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {activity.text}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatTimeAgo(activity.time)}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        activity.status === 'done' 
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                            : activity.status === 'processing'
                                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>
                                        {activity.status === 'done' ? 'Xong' : 
                                         activity.status === 'processing' ? 'Đang xử lý' : 
                                         'Mới'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Thao tác nhanh</h3>
                    <div className="space-y-3">
                        <Link href="/dashboard/articles" className="block w-full text-left px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium">
                            + Tóm tắt bài báo mới
                        </Link>
                        <Link href="/dashboard/tools" className="block w-full text-left px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors font-medium">
                            + Yêu cầu công cụ mới
                        </Link>
                        <Link href="/dashboard/chat" className="block w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium">
                            💬 Bắt đầu trò chuyện
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

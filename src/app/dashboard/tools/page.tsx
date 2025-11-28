'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { ToolRequest } from '@/types';

export default function ToolsPage() {
    const [tools, setTools] = useState<ToolRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [requestText, setRequestText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        try {
            const res = await apiClient.get('/tools');
            setTools(res.data.data.tools);
        } catch (err) {
            console.error('Failed to fetch tools', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestText) return;
        setSubmitting(true);
        try {
            await apiClient.post('/tools', {
                request_payload: { description: requestText }
            });
            setRequestText('');
            fetchTools();
        } catch (err) {
            alert('Lỗi khi gửi yêu cầu');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🛠️ Hộp thư công cụ</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Request Form */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 h-fit">
                    <h2 className="text-lg font-semibold mb-4">Yêu cầu công cụ mới</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Mô tả công cụ bạn cần
                            </label>
                            <textarea
                                value={requestText}
                                onChange={(e) => setRequestText(e.target.value)}
                                placeholder="Ví dụ: Tôi cần một công cụ để đọc file PDF hóa đơn và trích xuất tổng tiền..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        >
                            {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                    </form>
                </div>

                {/* Requests List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold">Yêu cầu của bạn</h2>
                    {loading ? (
                        <div>Đang tải...</div>
                    ) : tools.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            Chưa có yêu cầu công cụ nào.
                        </div>
                    ) : (
                        tools.map((tool) => (
                            <div key={tool.id} className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-2 py-1 text-xs rounded-full ${tool.status === 'done' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            tool.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                        {tool.status.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-500">{new Date(tool.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 mb-4">
                                    {tool.request_payload.description}
                                </p>

                                {tool.result && (
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm font-mono overflow-x-auto">
                                        {JSON.stringify(tool.result, null, 2)}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

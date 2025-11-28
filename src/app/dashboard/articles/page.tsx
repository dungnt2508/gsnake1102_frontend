'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { Article } from '@/types';
import Link from 'next/link';

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await apiClient.get('/articles');
            setArticles(res.data.data.articles);
        } catch (err) {
            console.error('Failed to fetch articles', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        setSubmitting(true);
        try {
            await apiClient.post('/articles', { url });
            setUrl('');
            fetchArticles(); // Refresh list
        } catch (err) {
            alert('Lỗi khi gửi bài báo');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
        try {
            await apiClient.delete(`/articles/${id}`);
            setArticles(articles.filter(a => a.id !== id));
        } catch (err) {
            alert('Lỗi khi xóa');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📰 Tóm tắt bài báo</h1>

                {/* Quick Add Form */}
                <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Dán URL bài báo vào đây..."
                        className="flex-1 md:w-80 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
                    >
                        {submitting ? 'Đang xử lý...' : 'Tóm tắt'}
                    </button>
                </form>
            </div>

            {/* Articles List */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div>Đang tải danh sách bài báo...</div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        Chưa có bài báo nào. Dán URL phía trên để bắt đầu!
                    </div>
                ) : (
                    articles.map((article) => (
                        <div key={article.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                                    {article.title || article.url}
                                </h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${article.status === 'done' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        article.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}>
                                    {article.status.toUpperCase()}
                                </span>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                                {article.summary || 'Đang chờ tóm tắt...'}
                            </p>

                            <div className="flex items-center justify-between text-sm">
                                <a href={article.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                                    Xem bài gốc
                                </a>
                                <div className="flex gap-3">
                                    {/* <button className="text-gray-500 hover:text-blue-500">🔄 Refetch</button> */}
                                    <button onClick={() => handleDelete(article.id)} className="text-red-500 hover:text-red-700">Xóa</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

'use client';

import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tổng số bài báo</h3>
                        <span className="text-2xl">📰</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
                    <p className="text-xs text-green-500 mt-2">↑ 2 bài mới tuần này</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Yêu cầu công cụ</h3>
                        <span className="text-2xl">🛠️</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">5</p>
                    <p className="text-xs text-blue-500 mt-2">2 đang xử lý</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Lịch trình hoạt động</h3>
                        <span className="text-2xl">⏰</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
                    <p className="text-xs text-gray-500 mt-2">Lần tới: 2h nữa</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Persona</h3>
                        <span className="text-2xl">🎭</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">Chuyên nghiệp / Hóm hỉnh</p>
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
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                                <div className={`w-2 h-2 mt-2 rounded-full ${i === 1 ? 'bg-green-500' : 'bg-blue-500'}`} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {i === 1 ? 'Đã tóm tắt bài báo "Xu hướng AI 2025"' : 'Hoàn thành yêu cầu tool "PDF Parser"'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">2 giờ trước</p>
                                </div>
                                <span className={`ml-auto text-xs px-2 py-1 rounded-full ${i === 1 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>
                                    {i === 1 ? 'Xong' : 'Mới'}
                                </span>
                            </div>
                        ))}
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

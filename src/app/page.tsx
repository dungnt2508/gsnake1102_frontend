'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/marketplace/Navbar';
import Hero from '@/components/marketplace/Hero';
import TemplateCard from '@/components/marketplace/TemplateCard';
import Footer from '@/components/marketplace/Footer';
import productService, { Product } from '@/services/product.service';

const COLOR_MAP = [
    'from-orange-500 to-red-500',
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-yellow-500 to-orange-500',
    'from-green-500 to-emerald-500',
    'from-red-500 to-pink-600',
];

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const products = await productService.getFeaturedProducts(6);
            setFeaturedProducts(products);
        } catch (error) {
            console.error('Failed to fetch featured products:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-white dark:bg-[#0B0C10] text-gray-900 dark:text-slate-200 font-sans selection:bg-primary/30">
            <Navbar />

            <main>
                <Hero />

                <section className="container mx-auto px-4 py-20">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sản phẩm nổi bật</h2>
                            <p className="text-gray-600 dark:text-slate-400">Các workflow và tool được chọn lọc để bạn bắt đầu.</p>
                        </div>
                        <Link 
                            href="/products"
                            className="hidden sm:block text-orange-400 dark:text-orange-300 hover:text-orange-300 dark:hover:text-orange-200 font-medium transition-colors"
                        >
                            Xem tất cả sản phẩm →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 bg-white dark:bg-[#111218] border border-gray-200 dark:border-slate-800 rounded-2xl">
                            <div className="h-8 w-8 border-2 border-primary/30 dark:border-primary/30 border-t-primary dark:border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 dark:text-slate-400">Đang tải sản phẩm...</p>
                        </div>
                    ) : featuredProducts.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-[#111218] border border-gray-200 dark:border-slate-800 rounded-2xl">
                            <p className="text-slate-500 dark:text-slate-400 mb-4">Chưa có sản phẩm nổi bật</p>
                            <Link
                                href="/products"
                                className="text-primary dark:text-[#FF8559] hover:text-[#FF8559] dark:hover:text-orange-200 transition-colors"
                            >
                                Xem tất cả sản phẩm →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProducts.map((product, index) => (
                                <TemplateCard
                                    key={product.id}
                                    id={product.id}
                                    title={product.title}
                                    description={product.description}
                                    price={product.isFree ? 'Miễn phí' : `${product.price?.toLocaleString('vi-VN')} VNĐ`}
                                    author="Team gsnake"
                                    downloads={product.downloads}
                                    rating={product.rating}
                                    tags={product.tags}
                                    color={COLOR_MAP[index % COLOR_MAP.length]}
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-12 text-center sm:hidden">
                        <Link 
                            href="/products"
                            className="text-orange-400 dark:text-orange-300 hover:text-orange-300 dark:hover:text-orange-200 font-medium transition-colors"
                        >
                            Xem tất cả sản phẩm →
                        </Link>
                    </div>
                </section>

                <section className="bg-gray-50 dark:bg-[#111218] py-20 border-y border-gray-200 dark:border-slate-800/50">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Tham gia cộng đồng</h2>
                        <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
                            Gia nhập chợ giải pháp tự động hóa.
                            Kiếm tiền từ kiến thức của bạn hoặc chọn giải pháp đáp ứng đúng nhu cầu.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link
                                href="/seller/upload"
                                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-slate-200 transition-colors"
                            >
                                Trở thành nhà sáng tạo
                            </Link>
                            <Link
                                href="/about"
                                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-slate-200 transition-colors"
                            >
                                Xem tài liệu hướng dẫn
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

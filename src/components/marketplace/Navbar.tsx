'use client';

import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0B0C10]/80 backdrop-blur-md">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/20 transition-all">
                                <span className="font-bold text-white">n8n</span>
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">Market</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                            <Link href="#" className="hover:text-white transition-colors">Workflows</Link>
                            <Link href="#" className="hover:text-white transition-colors">Nodes</Link>
                            <Link href="#" className="hover:text-white transition-colors">Creators</Link>
                            <Link href="#" className="hover:text-white transition-colors">Resources</Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                type="search"
                                placeholder="Search workflows..."
                                className="h-10 w-64 rounded-full bg-slate-900/50 border border-slate-800 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="h-6 w-px bg-slate-800 mx-2"></div>
                        <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link
                            href="/register"
                            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-900 hover:bg-slate-200 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>

                    <button className="md:hidden text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
        </nav>
    );
}

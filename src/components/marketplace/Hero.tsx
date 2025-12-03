import { Search, ArrowRight, Zap, Globe, Shield, Cpu } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-[#0B0C10] py-20 sm:py-32">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

            <div className="relative container mx-auto px-4 text-center z-10">
                <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-400 mb-8 backdrop-blur-sm animate-fade-in-up">
                    <span className="flex h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
                    New: AI Agent Templates Available
                    <ArrowRight className="ml-2 h-4 w-4" />
                </div>

                <h1 className="mx-auto max-w-5xl text-5xl font-bold tracking-tight text-white sm:text-7xl mb-8 leading-tight">
                    Automate your work with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600">
                        premium n8n workflows
                    </span>
                </h1>

                <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-12 leading-relaxed">
                    The largest marketplace for n8n templates. Discover, buy, and sell high-quality workflows to save time and scale your operations.
                </p>

                <div className="mx-auto max-w-2xl relative mb-12 group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-2xl border border-slate-800 bg-slate-900/60 py-5 pl-14 pr-4 text-white shadow-2xl shadow-black/50 ring-1 ring-inset ring-slate-800/50 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 focus:bg-slate-900/80 sm:text-lg transition-all backdrop-blur-xl"
                        placeholder="Search for 'Instagram automation', 'SEO', or 'Lead Gen'..."
                    />
                    <div className="absolute right-3 top-3 hidden sm:block">
                        <button className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors">
                            Search
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    {[
                        { name: 'Marketing', icon: Zap },
                        { name: 'Sales', icon: Globe },
                        { name: 'AI & LLMs', icon: Cpu },
                        { name: 'Security', icon: Shield },
                    ].map((category) => (
                        <button key={category.name} className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/40 px-5 py-2 text-sm font-medium text-slate-300 hover:border-orange-500/50 hover:text-orange-400 hover:bg-slate-800/60 transition-all">
                            <category.icon className="h-4 w-4" />
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

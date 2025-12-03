import Navbar from '@/components/marketplace/Navbar';
import Hero from '@/components/marketplace/Hero';
import TemplateCard from '@/components/marketplace/TemplateCard';
import Footer from '@/components/marketplace/Footer';

const MOCK_TEMPLATES = [
    {
        id: 1,
        title: 'Advanced SEO Article Generator',
        description: 'Generate SEO-optimized articles with keyword research, outlining, and writing using GPT-4 and Google Search.',
        price: 29,
        author: 'SEO Master',
        downloads: 1240,
        rating: 4.9,
        tags: ['Marketing', 'AI'],
        color: 'from-orange-500 to-red-500'
    },
    {
        id: 2,
        title: 'Instagram Auto-Reply Bot',
        description: 'Automatically reply to Instagram DMs and comments using AI to increase engagement and sales.',
        price: 19,
        author: 'SocialGrowth',
        downloads: 850,
        rating: 4.7,
        tags: ['Social Media', 'Support'],
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: 3,
        title: 'Lead Enrichment & Scoring',
        description: 'Enrich leads from LinkedIn and Clearbit, score them based on fit, and sync to HubSpot.',
        price: 49,
        author: 'SalesOps Pro',
        downloads: 530,
        rating: 4.8,
        tags: ['Sales', 'CRM'],
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 4,
        title: 'Crypto Trading Bot',
        description: 'Automated crypto trading bot that analyzes market trends and executes trades on Binance.',
        price: 'Free',
        author: 'CryptoWhale',
        downloads: 2100,
        rating: 4.5,
        tags: ['Crypto', 'Finance'],
        color: 'from-yellow-500 to-orange-500'
    },
    {
        id: 5,
        title: 'Customer Support Ticket Router',
        description: 'Classify incoming support tickets using AI and route them to the correct department in Zendesk.',
        price: 35,
        author: 'SupportHero',
        downloads: 420,
        rating: 4.6,
        tags: ['Support', 'AI'],
        color: 'from-green-500 to-emerald-500'
    },
    {
        id: 6,
        title: 'YouTube Video Summarizer',
        description: 'Get concise summaries of long YouTube videos sent directly to your Notion workspace.',
        price: 15,
        author: 'ProductivityKing',
        downloads: 980,
        rating: 4.8,
        tags: ['Productivity', 'AI'],
        color: 'from-red-500 to-pink-600'
    }
];

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0B0C10] text-slate-200 font-sans selection:bg-orange-500/30">
            <Navbar />

            <main>
                <Hero />

                <section className="container mx-auto px-4 py-20">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Featured Workflows</h2>
                            <p className="text-slate-400">Hand-picked templates to get you started.</p>
                        </div>
                        <button className="hidden sm:block text-orange-400 hover:text-orange-300 font-medium transition-colors">
                            View all templates →
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {MOCK_TEMPLATES.map((template) => (
                            <TemplateCard
                                key={template.id}
                                title={template.title}
                                description={template.description}
                                price={template.price}
                                author={template.author}
                                downloads={template.downloads}
                                rating={template.rating}
                                tags={template.tags}
                                color={template.color}
                            />
                        ))}
                    </div>

                    <div className="mt-12 text-center sm:hidden">
                        <button className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                            View all templates →
                        </button>
                    </div>
                </section>

                <section className="bg-[#111218] py-20 border-y border-slate-800/50">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Join the Community</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto mb-10">
                            Join thousands of automation experts sharing their workflows.
                            Monetize your expertise or find the perfect solution for your business.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors">
                                Become a Creator
                            </button>
                            <button className="bg-slate-800 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-700 transition-colors border border-slate-700">
                                Browse Documentation
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

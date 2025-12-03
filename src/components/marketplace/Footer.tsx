import Link from 'next/link';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#050608] border-t border-slate-900 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
                                <span className="font-bold text-white">n8n</span>
                            </div>
                            <span className="text-xl font-bold text-white">Market</span>
                        </div>
                        <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
                            The premium marketplace for n8n automation templates.
                            Save time, reduce costs, and scale your business with battle-tested workflows.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all">
                                <Github className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-orange-400 transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-orange-400 transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-orange-400 transition-colors">Community</Link></li>
                            <li><Link href="#" className="hover:text-orange-400 transition-colors">Help Center</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-orange-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-orange-400 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-orange-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Stay Updated</h4>
                        <p className="text-sm text-slate-400 mb-4">Subscribe to our newsletter for the latest workflows.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-orange-500"
                            />
                            <button className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors">
                                Go
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">© 2024 n8n Market. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <span>Made with ❤️ for automation</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

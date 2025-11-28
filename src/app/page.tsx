import Link from "next/link";

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Personalized Bot
                </h1>

                <p className="text-xl text-gray-700 dark:text-gray-300 mb-12">
                    Your AI assistant that adapts to your unique style, tone, and interests
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-2 text-blue-600">🎭 Personal Persona</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Customize your AI's tone, style, and focus areas
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-2 text-indigo-600">📰 Article Summaries</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Get personalized summaries of articles tailored to you
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-2 text-purple-600">🛠️ Tool Generation</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Request custom tools generated just for your needs
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <Link
                        href="/login"
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="px-8 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors shadow-lg"
                    >
                        Register
                    </Link>
                </div>

                <div className="mt-12 text-sm text-gray-500">
                    <p>Powered by OpenAI • Automated with n8n • Built with Next.js</p>
                </div>
            </div>
        </main>
    );
}

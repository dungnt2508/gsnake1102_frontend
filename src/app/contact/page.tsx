import Navbar from "@/components/marketplace/Navbar";
import Footer from "@/components/marketplace/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-200">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-3">
            Liên hệ team
          </h1>
          <p className="text-slate-400 mb-8">
            Mô tả nhanh nhu cầu của bạn, team sẽ hỗ trợ tư vấn và cài đặt
            workflow/tool phù hợp.
          </p>

          <form className="space-y-5 bg-[#111218] border border-slate-800 rounded-2xl p-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Tên
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                placeholder="Tên của bạn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Nhu cầu
              </label>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                placeholder="Bạn muốn tự động hoá quy trình nào? Đang dùng Notion, Telegram, Email hay hệ thống khác?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Gửi yêu cầu
            </button>

            <div className="text-xs text-slate-500">
              Hoặc liên hệ trực tiếp qua Telegram / Zalo nếu cần trao đổi nhanh.
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}



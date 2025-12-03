import Navbar from "@/components/marketplace/Navbar";
import Footer from "@/components/marketplace/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-200">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-white mb-4">
            Về team & dự án
          </h1>
          <p className="text-slate-400 mb-6">
            Đây là catalog nội bộ các workflow n8n, tool UI và integration pack
            mà team xây dựng để phục vụ các use case thực tế: tóm tắt đa nguồn,
            cá nhân hoá bot, dashboard, và tự động hoá nghiệp vụ.
          </p>

          <div className="space-y-4 text-sm text-slate-200">
            <p>
              Mục tiêu của catalog là giúp mọi người trong team (hoặc khách hàng
              nội bộ) có thể:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Dễ dàng tra cứu workflow đã có.</li>
              <li>Hiểu nhanh giá trị, yêu cầu tích hợp, cách cài đặt cơ bản.</li>
              <li>Đề xuất thêm workflow/tool mới nếu còn thiếu.</li>
            </ul>
            <p>
              Về lâu dài, cấu trúc này có thể nâng cấp thành marketplace (có
              seller, pricing, review) mà không cần thay đổi routing hay UI
              quá nhiều.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



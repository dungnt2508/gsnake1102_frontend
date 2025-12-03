import Navbar from "@/components/marketplace/Navbar";
import Footer from "@/components/marketplace/Footer";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-200">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-white mb-4">
            Điều khoản & chính sách
          </h1>
          <p className="text-slate-400 mb-6">
            Mục này dùng để mô tả cách sử dụng workflow, quyền truy cập dữ
            liệu và phạm vi hỗ trợ của team.
          </p>

          <div className="space-y-4 text-sm text-slate-200">
            <section>
              <h2 className="text-lg font-semibold text-white mb-2">
                1. Phạm vi sử dụng
              </h2>
              <p>
                Các workflow/tool trong catalog hiện được dùng cho mục đích
                nội bộ, phục vụ thử nghiệm và vận hành các use case cụ thể.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">
                2. Dữ liệu & bảo mật
              </h2>
              <p>
                Khi tích hợp với hệ thống thật (CRM, Email, Notion...), cần đảm
                bảo đã được cấp quyền và tuân thủ chính sách bảo mật của công
                ty/khách hàng.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">
                3. Hỗ trợ kỹ thuật
              </h2>
              <p>
                Team hỗ trợ cài đặt cơ bản cho từng workflow/tool, phần tuỳ biến
                thêm sẽ được trao đổi riêng theo nhu cầu.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



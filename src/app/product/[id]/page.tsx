'use client';

import Navbar from "@/components/marketplace/Navbar";
import Footer from "@/components/marketplace/Footer";
import { ArrowLeft, Check, Shield } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const MOCK_PRODUCT = {
  id: 1,
  title: "Workflow: Tóm tắt đa nguồn (URL/RSS/File)",
  description:
    "Pipeline n8n nhận URL/RSS/File, crawl nội dung, làm sạch, gửi LLM cùng persona user và lưu summary.",
  features: [
    "Hỗ trợ nhiều nguồn: URL, RSS, file upload",
    "Chuẩn hóa text trước khi gửi LLM",
    "Lưu summary + insights + data_points vào DB",
    "Có thể trigger thủ công hoặc qua schedule",
  ],
  requirements: [
    "n8n self-host hoặc cloud",
    "OpenAI API key",
    "Backend đã expose webhook nhận callback",
  ],
  isFree: true,
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id;

  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-200">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <Link
          href="/products"
          className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách sản phẩm
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <section className="lg:col-span-2 space-y-6">
            <header>
              <h1 className="text-3xl font-bold text-white mb-3">
                {MOCK_PRODUCT.title}
              </h1>
              <p className="text-slate-400 max-w-2xl">
                {MOCK_PRODUCT.description}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                ID: {productId as string}
              </p>
            </header>

            <div className="bg-[#111218] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Ảnh / preview workflow
              </h2>
              <div className="aspect-video rounded-xl border border-dashed border-slate-700 bg-slate-900/40 flex items-center justify-center text-slate-500 text-sm">
                Khu vực hiển thị ảnh workflow hoặc video demo
              </div>
            </div>

            <div className="bg-[#111218] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Tính năng chính
              </h2>
              <ul className="space-y-3 text-sm text-slate-200">
                {MOCK_PRODUCT.features.map((f) => (
                  <li key={f} className="flex gap-3 items-start">
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#111218] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Hướng dẫn cài đặt cơ bản
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-200">
                <li>Import workflow vào n8n.</li>
                <li>Cấu hình các credential (OpenAI, webhook backend, ...).</li>
                <li>Test với 1 URL hoặc RSS feed mẫu.</li>
                <li>
                  Kết nối với backend hiện tại thông qua webhook đã mô tả trong
                  README.
                </li>
              </ol>
            </div>
          </section>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-[#111218] border border-slate-800 rounded-2xl p-6">
                <p className="text-sm text-slate-400 mb-2">Trạng thái</p>
                <p className="text-2xl font-bold text-white mb-4">
                  {MOCK_PRODUCT.isFree ? "Miễn phí" : "Trả phí"}
                </p>

                <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl mb-3 transition-colors">
                  Tải workflow
                </button>
                <button className="w-full border border-slate-700 hover:border-orange-500 text-slate-100 hover:text-white font-semibold py-3 rounded-xl transition-colors">
                  Liên hệ team để cài đặt
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-500 mt-4">
                  <Shield className="h-3 w-3 text-emerald-400" />
                  <span>Workflow nội bộ, có thể chỉnh sửa theo yêu cầu.</span>
                </div>
              </div>

              <div className="bg-[#111218] border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Yêu cầu tích hợp
                </h3>
                <ul className="space-y-2 text-sm text-slate-200">
                  {MOCK_PRODUCT.requirements.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}



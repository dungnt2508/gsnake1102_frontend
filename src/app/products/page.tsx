import Navbar from "@/components/marketplace/Navbar";
import Footer from "@/components/marketplace/Footer";
import TemplateCard from "@/components/marketplace/TemplateCard";

const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "Workflow: Tóm tắt đa nguồn (URL/RSS/File)",
    description:
      "Workflow n8n cho phép lấy nội dung từ nhiều nguồn, làm sạch, gửi qua LLM và lưu summary + insights.",
    price: "Miễn phí",
    author: "Team gsnake",
    downloads: 120,
    rating: 4.9,
    tags: ["Workflow", "Summarization"],
  },
  {
    id: 2,
    title: "Tool: Dashboard xem lịch tóm tắt",
    description:
      "UI dashboard để xem danh sách bài đã tóm tắt theo user, filter theo nguồn và thời gian.",
    price: "Miễn phí",
    author: "Team gsnake",
    downloads: 80,
    rating: 4.7,
    tags: ["Tool", "Dashboard"],
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-200">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Catalog workflow & tool n8n
          </h1>
          <p className="text-slate-400">
            Danh sách template nội bộ: workflow, tool UI, integration pack có
            thể plug-and-play.
          </p>
        </header>

        <section className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-3 py-1 rounded-full border border-slate-700 text-slate-300">
              Tất cả
            </span>
            <span className="px-3 py-1 rounded-full border border-slate-800 text-slate-500">
              Workflow
            </span>
            <span className="px-3 py-1 rounded-full border border-slate-800 text-slate-500">
              Tool
            </span>
            <span className="px-3 py-1 rounded-full border border-slate-800 text-slate-500">
              Integration pack
            </span>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_PRODUCTS.map((p) => (
              <TemplateCard
                key={p.id}
                id={p.id}
                title={p.title}
                description={p.description}
                price={p.price}
                author={p.author}
                downloads={p.downloads}
                rating={p.rating}
                tags={p.tags}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}



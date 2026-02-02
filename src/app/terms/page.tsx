 "use client";

 import { Header } from "@/components/Header";
 import { Footer } from "@/components/Footer";
 import { useLanguage } from "@/contexts/LanguageContext";

 export default function TermsPage() {
  const { t } = useLanguage();

  const content = t('terms.content') || '';
  const paragraphs = content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold text-white mb-6">{t("terms.title")}</h1>
          <div className="prose prose-invert text-gray-300 space-y-4">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
 }



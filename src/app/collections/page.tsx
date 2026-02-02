import { Metadata } from 'next';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import CollectionsClient from "@/components/CollectionsClient";
import { getCollections } from "@/lib/data";

export const metadata: Metadata = {
  title: 'Workflow Collections - N8N Workflows',
  description: 'Explore curated collections of automation workflows designed for specific business scenarios and use cases.',
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <CollectionsClient collections={collections} />
      </main>
      <Footer />
    </div>
  );
}













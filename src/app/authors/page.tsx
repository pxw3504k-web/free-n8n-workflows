import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import AuthorsClient from "@/components/AuthorsClient";
import { getAuthors } from "@/lib/authors";

export default async function AuthorsPage() {
  // Fetch real authors from database
  const dbAuthors = await getAuthors();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <AuthorsClient dbAuthors={dbAuthors} />
      </main>
      <Footer />
    </div>
  );
}



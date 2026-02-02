import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a1e]">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800/50 mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-100 mb-2">
                Integration Not Found
              </h1>
              <p className="text-gray-400 text-lg">
                The integration you're looking for doesn't exist or has been removed.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
              >
                Browse All Workflows
              </Link>
              <div>
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/10 text-gray-300 font-semibold hover:bg-white/5 transition-colors"
                >
                  Search Workflows
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}




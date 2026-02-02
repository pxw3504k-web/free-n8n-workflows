import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { WorkflowGrid } from '@/components/WorkflowGrid';
import { Pagination } from '@/components/Pagination';
import { PageHeader } from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import { getWorkflows, getCategories } from '@/lib/data';

interface SearchParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchParams) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const categoryParam = typeof params.category === 'string' ? params.category.split(',') : [];
  const sort = typeof params.sort === 'string' ? params.sort : 'Most Popular';
  const page = typeof params.page === 'string' ? Number(params.page) : 1;
  const itemsPerPage = 12;
  const lang = typeof params.lang === 'string' ? (params.lang === 'zh' ? 'zh' : 'en') : 'en';

  // Fetch categories to map IDs to names
  const categoriesData = await getCategories();

  const categoryNames = categoryParam.length > 0
    ? categoryParam.map(categoryId => {
        const category = categoriesData.find(cat => cat.id === categoryId);
        if (category) return category.name;
        return categoryId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }).filter((name): name is string => !!name)
    : undefined;

  const categoriesWithCounts = categoriesData.filter(cat => cat.count > 0);

  const workflowsData = await getWorkflows({
    page,
    limit: itemsPerPage,
    category: categoryNames,
    sort,
    search: q || undefined,
    language: lang,
  });

  const { data: workflows, count: totalCount } = workflowsData;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <Sidebar categories={categoriesWithCounts} />

            <div className="flex-1 min-w-0">
              {/* Inline search bar for refinements */}
              <div className="mb-6">
                <SearchBar initialQuery={q} />
              </div>
              <PageHeader showing={Math.min(workflows.length, itemsPerPage)} total={totalCount} />

              <WorkflowGrid workflows={workflows} />

              <Pagination totalItems={totalCount} itemsPerPage={itemsPerPage} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



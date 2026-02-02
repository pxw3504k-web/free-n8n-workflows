import { getCollections } from "@/lib/data";
import CollectionsAdminPanel from "@/components/admin/CollectionsAdminPanel";

export default async function AdminCollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin — Collections</h1>
        <p className="text-sm text-gray-400 mb-6">Generate ZIP archives for collections.</p>

        <CollectionsAdminPanel initialCollections={collections} />
      </div>
    </div>
  );
}



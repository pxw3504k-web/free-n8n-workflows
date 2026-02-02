import { supabase } from "@/lib/supabase";
import SubmissionDetailClient from "@/components/SubmissionDetail";

type PageProps = {
  params: { id: string };
};

export default async function SubmissionPage({ params }: PageProps) {
  try {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !data) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">Submission not found</h2>
          </div>
        </div>
      );
    }

    return <SubmissionDetailClient submission={data} />;
  } catch (err) {
    console.error("Error fetching submission:", err);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Error loading submission</h2>
        </div>
      </div>
    );
  }
}



import { SubmitWorkflowForm } from '@/components/SubmitWorkflowForm';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function SubmitPage() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-gradient-to-b from-[#030315] to-[#06061a]">
        <div className="max-w-5xl mx-auto py-16 px-4">
          <SubmitWorkflowForm />
        </div>
      </main>
    </LanguageProvider>
  );
}



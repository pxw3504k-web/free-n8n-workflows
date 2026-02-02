import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CustomWorkflowForm } from '@/components/CustomWorkflowForm';
import { TeamSection } from '@/components/TeamSection';
import { MissionSection } from '@/components/MissionSection';

export const metadata: Metadata = {
  title: 'Get Your Custom Workflow | Free N8N',
  description: 'Fill the form and receive a tailored offer from our experts',
};

export default function CustomWorkflowPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Custom Workflow Form Section */}
          <CustomWorkflowForm />

          {/* Team Section */}
          <TeamSection />

          {/* Mission Section */}
          <MissionSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}


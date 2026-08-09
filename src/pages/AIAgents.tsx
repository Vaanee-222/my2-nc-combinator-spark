import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdvisorPanel from "@/components/AdvisorPanel";
import { BrainCircuit } from "lucide-react";

const AIAgents = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <main className="container mx-auto px-4 pt-20 pb-12">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Startup Advisor</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get instant expert advice from our AI-powered startup advisors. Practice pitches, get legal guidance, plan your GTM strategy, or just talk through your challenges.
        </p>
      </div>
      <AdvisorPanel />
    </main>
    <Footer />
  </div>
);

export default AIAgents;

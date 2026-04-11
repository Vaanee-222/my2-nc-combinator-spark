import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WeeklyShowcase from "@/components/WeeklyShowcase";
import ProgramOverview from "@/components/ProgramOverview";
import CohortInfo from "@/components/CohortInfo";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <WeeklyShowcase />
        <ProgramOverview />
        <CohortInfo />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

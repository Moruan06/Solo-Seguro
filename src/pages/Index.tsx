import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/hero-section";
import { DashboardSection } from "@/components/dashboard-section";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <DashboardSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/NavBar";
import { PollGrid } from "@/components/PollGrid";

export default function VoterLanding() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      <div id="polls-section" className="scroll-mt-4">
        <PollGrid />
      </div>
      <Footer />
    </div>
  );
}

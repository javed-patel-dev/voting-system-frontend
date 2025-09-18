import { CandidateCard } from "@/components/CandidateCard";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/NavBar";
import { PollGrid } from "@/components/PollGrid";

export default function VoterLanding() {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <div>
                <PollGrid />
            </div>
            <CandidateCard />
            <Footer />
        </div>
    );  
}

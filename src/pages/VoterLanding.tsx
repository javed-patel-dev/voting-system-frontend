import { CandidateCard } from "@/components/CandidateCard";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/NavBar";
import { PollCard } from "@/components/PollCard";

export default function VoterLanding() {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <PollCard />
            <CandidateCard />
            <Footer />
        </div>
    );  
}

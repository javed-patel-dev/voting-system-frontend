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
            <Footer />
        </div>
    );  
}

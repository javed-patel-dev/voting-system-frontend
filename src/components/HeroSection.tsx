import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";


export const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const banners = [
        {
            title: "Secure Digital Voting",
            subtitle: "Your voice matters. Vote with confidence using our secure platform.",
            image: "🗳️",
            gradient: "from-blue-600 to-cyan-600"
        },
        {
            title: "Transparent Democracy",
            subtitle: "Real-time results and complete transparency in every election.",
            image: "🔒",
            gradient: "from-emerald-600 to-teal-600"
        },
        {
            title: "Easy & Accessible",
            subtitle: "Vote from anywhere, anytime. Democracy made simple.",
            image: "📱",
            gradient: "from-purple-600 to-pink-600"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    return (
        <div className="relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
            {banners.map((banner, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                        ? 'opacity-100 transform translate-x-0'
                        : index < currentSlide
                            ? 'opacity-0 transform -translate-x-full'
                            : 'opacity-0 transform translate-x-full'
                        }`}
                >
                    <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} opacity-90`} />
                    <div className="relative z-10 h-full flex items-center justify-center">
                        <div className="text-center text-white px-4">
                            <div className="text-6xl md:text-8xl mb-6">{banner.image}</div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-4">{banner.title}</h1>
                            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                                {banner.subtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                                    View All Polls
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-20"
                onClick={prevSlide}
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-20"
                onClick={nextSlide}
            >
                <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                            }`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};
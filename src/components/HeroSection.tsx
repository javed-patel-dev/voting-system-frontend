import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Users, Vote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Slide {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  ctaText: string;
  ctaAction: string;
}

export const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides: Slide[] = [
    {
      title: "Make Your Voice Heard",
      subtitle: "Secure Digital Voting Platform",
      description:
        "Participate in elections that matter. Your vote is secured with state-of-the-art encryption and complete transparency.",
      icon: <Vote className="h-16 w-16" />,
      gradient: "from-blue-600 via-blue-700 to-indigo-800",
      ctaText: "Browse Active Polls",
      ctaAction: "scroll",
    },
    {
      title: "Become a Candidate",
      subtitle: "Run for Your Community",
      description:
        "Have a vision? Register as a candidate in upcoming polls and let the community decide. Your campaign starts here.",
      icon: <Users className="h-16 w-16" />,
      gradient: "from-purple-600 via-purple-700 to-pink-700",
      ctaText: "Find Upcoming Polls",
      ctaAction: "scroll",
    },
    {
      title: "100% Transparent",
      subtitle: "Results You Can Trust",
      description:
        "Every vote counts and every result is verifiable. Real-time tracking and tamper-proof records ensure fair elections.",
      icon: <Shield className="h-16 w-16" />,
      gradient: "from-emerald-600 via-teal-600 to-cyan-700",
      ctaText: "View Past Results",
      ctaAction: "scroll",
    },
  ];

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);

  const handleCta = (action: string) => {
    if (action === "scroll") {
      const pollsSection = document.getElementById("polls-section");
      if (pollsSection) {
        pollsSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(action);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 min-h-[500px] md:min-h-[600px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-white">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index === currentSlide
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8 absolute"
                  }`}
                >
                  {index === currentSlide && (
                    <>
                      <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-6">
                        {slide.subtitle}
                      </span>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg leading-relaxed">
                        {slide.description}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Button
                          size="lg"
                          onClick={() => handleCta(slide.ctaAction)}
                          className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 group"
                        >
                          {slide.ctaText}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => navigate("/profile")}
                          className="border-white text-gray-900 bg-white/90 hover:bg-white font-semibold px-8 backdrop-blur-sm"
                        >
                          My Profile
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Icon Display */}
            <div className="hidden md:flex justify-center">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-75 absolute"
                  }`}
                >
                  {index === currentSlide && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150" />
                      <div className="relative w-64 h-64 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                        <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center text-white">
                          {slide.icon}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-all"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-all"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? "w-10 h-3 bg-white rounded-full"
                : "w-3 h-3 bg-white/50 hover:bg-white/70 rounded-full"
            }`}
          />
        ))}
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center gap-8 md:gap-16 text-white text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold">1000+</p>
              <p className="text-xs md:text-sm text-white/70">Active Voters</p>
            </div>
            <div className="border-l border-white/20 pl-8 md:pl-16">
              <p className="text-2xl md:text-3xl font-bold">50+</p>
              <p className="text-xs md:text-sm text-white/70">Elections Held</p>
            </div>
            <div className="border-l border-white/20 pl-8 md:pl-16">
              <p className="text-2xl md:text-3xl font-bold">100%</p>
              <p className="text-xs md:text-sm text-white/70">Secure & Transparent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

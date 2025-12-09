import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, Users, Gavel } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 cricket-pattern opacity-30" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent border border-accent/30 text-sm font-medium animate-fade-in">
            <Trophy className="h-4 w-4" />
            <span>India's #1 Cricket Auction Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight animate-fade-in [animation-delay:100ms]">
            Build Your Dream
            <span className="block text-accent">Cricket Team</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
            Create tournaments, organize auctions, and manage teams with ease. 
            From local society matches to corporate leagues — we've got you covered.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:300ms]">
            <Button 
              asChild 
              size="lg" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow"
            >
              <Link to="/tournaments">
                <Gavel className="h-5 w-5 mr-2" />
                Browse Tournaments
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/auth">
                <Users className="h-5 w-5 mr-2" />
                Get Started
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-primary-foreground/60 animate-fade-in [animation-delay:400ms]">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-accent">500+</span>
              <span>Players</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-accent">50+</span>
              <span>Tournaments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-accent">25+</span>
              <span>Cities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 50L60 45.8C120 41.7 240 33.3 360 37.5C480 41.7 600 58.3 720 62.5C840 66.7 960 58.3 1080 50C1200 41.7 1320 33.3 1380 29.2L1440 25V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" 
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}

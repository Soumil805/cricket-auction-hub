import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, UserPlus, Gavel } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mt-3">
            Whether you're an organizer looking to host a tournament or a player seeking opportunities, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Create Tournament */}
          <div className="p-8 rounded-2xl bg-card shadow-card text-center space-y-4 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
              <Plus className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-display font-semibold">Create Tournament</h3>
            <p className="text-sm text-muted-foreground">
              Set up your cricket tournament with customizable settings, teams, and auction rules.
            </p>
            <Button asChild className="w-full">
              <Link to="/tournaments/new">Get Started</Link>
            </Button>
          </div>

          {/* Register as Player */}
          <div className="p-8 rounded-2xl bg-card shadow-card text-center space-y-4 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent">
              <UserPlus className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-display font-semibold">Register as Player</h3>
            <p className="text-sm text-muted-foreground">
              Create your player profile and apply to tournaments that match your skills.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/register">Join Now</Link>
            </Button>
          </div>

          {/* Live Auctions */}
          <div className="p-8 rounded-2xl bg-card shadow-card text-center space-y-4 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-live/10 text-live">
              <Gavel className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-display font-semibold">Live Auctions</h3>
            <p className="text-sm text-muted-foreground">
              Experience the thrill of real-time player auctions with instant bidding.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/tournaments?status=auction">View Auctions</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

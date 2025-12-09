import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TournamentCard } from "@/components/tournaments/TournamentCard";
import { mockTournaments } from "@/data/mockData";
import { ArrowRight } from "lucide-react";

export function FeaturedTournaments() {
  // Show only active/registration/auction tournaments
  const featuredTournaments = mockTournaments
    .filter(t => t.status !== 'completed' && t.status !== 'draft')
    .slice(0, 3);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Featured Tournaments
            </h2>
            <p className="text-muted-foreground mt-2">
              Join ongoing tournaments or explore upcoming ones
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/tournaments">
              View All Tournaments
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Tournament Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTournaments.map((tournament, index) => (
            <div
              key={tournament.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TournamentCard tournament={tournament} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

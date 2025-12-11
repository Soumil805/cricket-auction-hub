import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TournamentCard } from "@/components/tournaments/TournamentCard";
import { supabase } from "@/integrations/supabase/client";
import { Tournament, TournamentCategory, BallType, PitchType, MatchType, TournamentStatus } from "@/data/mockData";
import { ArrowRight, Loader2 } from "lucide-react";

export function FeaturedTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .neq("status", "draft")
        .neq("status", "completed")
        .neq("status", "cancelled")
        .order("start_date", { ascending: true })
        .limit(3);

      if (!error && data) {
        // Transform DB data to match Tournament type
        const transformed: Tournament[] = data.map((t) => ({
          id: t.id,
          organizer_id: t.organizer_id,
          organizer_name: "Tournament Organizer", // Would need a join to get this
          name: t.name,
          slogan: t.slogan || undefined,
          logo_url: t.logo_url || undefined,
          start_date: t.start_date,
          end_date: t.end_date,
          category: t.category as TournamentCategory,
          ball_type: t.ball_type as BallType,
          pitch_type: t.pitch_type as PitchType,
          match_type: t.match_type as MatchType,
          overs: t.overs,
          total_teams: t.number_of_teams,
          players_per_team: t.players_per_team,
          max_player_bids: 3,
          status: mapStatus(t.status),
          is_public: true,
          ground: {
            id: t.ground_id || "",
            name: t.venue_name || "TBD",
            country: "India",
            state: t.venue_state || "",
            city: t.venue_city || "",
            address: t.venue_address || "",
            pincode: t.venue_pincode || "",
          },
        }));
        setTournaments(transformed);
      }
      setLoading(false);
    };

    fetchTournaments();
  }, []);

  // Map database status to mock status type
  const mapStatus = (dbStatus: string): TournamentStatus => {
    const statusMap: Record<string, TournamentStatus> = {
      "draft": "draft",
      "registration_open": "registration",
      "registration_closed": "registration",
      "auction_scheduled": "auction",
      "auction_live": "auction",
      "auction_complete": "auction",
      "in_progress": "live",
      "completed": "completed",
      "cancelled": "completed",
    };
    return statusMap[dbStatus] || "draft";
  };

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
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament, index) => (
              <div
                key={tournament.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <TournamentCard tournament={tournament} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No active tournaments at the moment.</p>
            <p className="text-sm text-muted-foreground mt-1">Check back soon or create your own!</p>
          </div>
        )}
      </div>
    </section>
  );
}

import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { TournamentCard } from "@/components/tournaments/TournamentCard";
import { TournamentFilters } from "@/components/tournaments/TournamentFilters";
import { TournamentCategory, BallType, TournamentStatus } from "@/data/mockData";
import { Trophy, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TournamentData {
  id: string;
  name: string;
  slogan: string | null;
  logo_url: string | null;
  category: string;
  ball_type: string;
  overs: number;
  start_date: string;
  end_date: string;
  venue_city: string | null;
  venue_state: string | null;
  number_of_teams: number;
  players_per_team: number;
  status: string;
  organizer_id: string;
}

const Tournaments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TournamentCategory | null>(null);
  const [selectedBallType, setSelectedBallType] = useState<BallType | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TournamentStatus | null>(null);
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTournaments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .neq("status", "draft")
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Error fetching tournaments:", error);
    } else {
      setTournaments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((tournament) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          tournament.name.toLowerCase().includes(query) ||
          tournament.slogan?.toLowerCase().includes(query) ||
          tournament.venue_city?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory && tournament.category !== selectedCategory) return false;

      // Ball type filter
      if (selectedBallType && tournament.ball_type !== selectedBallType) return false;

      // Status filter
      if (selectedStatus && tournament.status !== selectedStatus) return false;

      return true;
    });
  }, [tournaments, searchQuery, selectedCategory, selectedBallType, selectedStatus]);

  // Transform database format to TournamentCard expected format
  const transformedTournaments = filteredTournaments.map((t) => ({
    id: t.id,
    name: t.name,
    slogan: t.slogan,
    logo_url: t.logo_url,
    category: t.category as TournamentCategory,
    ball_type: t.ball_type as BallType,
    pitch_type: "turf" as const,
    match_type: "limited-overs" as const,
    overs: t.overs,
    start_date: t.start_date,
    end_date: t.end_date,
    status: t.status as TournamentStatus,
    total_teams: t.number_of_teams,
    players_per_team: t.players_per_team,
    max_player_bids: 3,
    is_public: true,
    organizer_id: t.organizer_id,
    organizer_name: "Organizer",
    ground: {
      id: "1",
      name: "Venue",
      country: "India",
      city: t.venue_city || "Unknown",
      state: t.venue_state || "Unknown",
      address: "",
      pincode: "",
    },
  }));

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-primary text-primary-foreground py-12 md:py-16">
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Browse Tournaments
            </h1>
            <p className="text-primary-foreground/80">
              Find and join cricket tournaments happening across India. Filter by category, ball type, or status to find your perfect match.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 p-4 rounded-xl bg-card shadow-card">
                <h2 className="font-semibold mb-4">Filters</h2>
                <TournamentFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedBallType={selectedBallType}
                  onBallTypeChange={setSelectedBallType}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                />
              </div>
            </aside>

            {/* Tournaments Grid */}
            <div className="lg:col-span-3">
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{transformedTournaments.length}</span> tournaments
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : transformedTournaments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {transformedTournaments.map((tournament, index) => (
                    <div
                      key={tournament.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TournamentCard tournament={tournament} onDelete={fetchTournaments} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Trophy className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No tournaments found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Tournaments;
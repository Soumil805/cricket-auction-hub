import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { TournamentCard } from "@/components/tournaments/TournamentCard";
import { TournamentFilters } from "@/components/tournaments/TournamentFilters";
import { mockTournaments, TournamentCategory, BallType, TournamentStatus } from "@/data/mockData";
import { Trophy } from "lucide-react";

const Tournaments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TournamentCategory | null>(null);
  const [selectedBallType, setSelectedBallType] = useState<BallType | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TournamentStatus | null>(null);

  const filteredTournaments = useMemo(() => {
    return mockTournaments.filter((tournament) => {
      // Exclude drafts
      if (tournament.status === 'draft') return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          tournament.name.toLowerCase().includes(query) ||
          tournament.slogan?.toLowerCase().includes(query) ||
          tournament.ground.city.toLowerCase().includes(query) ||
          tournament.organizer_name.toLowerCase().includes(query);
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
  }, [searchQuery, selectedCategory, selectedBallType, selectedStatus]);

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
                  Showing <span className="font-medium text-foreground">{filteredTournaments.length}</span> tournaments
                </p>
              </div>

              {filteredTournaments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTournaments.map((tournament, index) => (
                    <div
                      key={tournament.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TournamentCard tournament={tournament} />
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

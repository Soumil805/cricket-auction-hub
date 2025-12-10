import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Gavel, 
  Users, 
  MapPin, 
  Circle, 
  Timer,
  TrendingUp,
  Trophy
} from "lucide-react";
import { mockTournaments, getCategoryLabel, getBallTypeLabel } from "@/data/mockData";

const LiveAuctions = () => {
  const liveAuctions = useMemo(() => {
    return mockTournaments.filter((t) => t.status === 'auction');
  }, []);

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-live via-primary to-accent text-primary-foreground py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 cricket-pattern opacity-10" />
        <div className="container relative">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Circle className="h-3 w-3 fill-live-foreground text-live-foreground animate-pulse" />
              <span className="text-sm font-medium uppercase tracking-wide">Live Now</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Live Auctions
            </h1>
            <p className="text-primary-foreground/80">
              Watch and participate in exciting player auctions happening right now. 
              Bid for your favorite players and build your dream team.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container">
          {liveAuctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveAuctions.map((auction, index) => (
                <Card 
                  key={auction.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-live/20 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Live Badge Header */}
                  <div className="bg-gradient-to-r from-live to-primary p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary-foreground">
                      <Circle className="h-2 w-2 fill-current animate-pulse" />
                      <span className="text-sm font-semibold">LIVE AUCTION</span>
                    </div>
                    <Badge variant="secondary" className="bg-background/20 text-primary-foreground border-0">
                      <Timer className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                  </div>

                  <CardContent className="p-5 space-y-4">
                    {/* Tournament Info */}
                    <div className="flex items-start gap-4">
                      <img
                        src={auction.logo_url || "/placeholder.svg"}
                        alt={auction.name}
                        className="h-14 w-14 rounded-lg bg-muted p-2 object-contain"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {auction.name}
                        </h3>
                        {auction.slogan && (
                          <p className="text-sm text-muted-foreground italic line-clamp-1">
                            "{auction.slogan}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryLabel(auction.category)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getBallTypeLabel(auction.ball_type)}
                      </Badge>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-primary mb-1">
                          <Users className="h-4 w-4" />
                        </div>
                        <p className="text-lg font-bold">{auction.teams_count || auction.total_teams}</p>
                        <p className="text-xs text-muted-foreground">Teams</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-accent mb-1">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <p className="text-lg font-bold">{auction.players_count || 0}</p>
                        <p className="text-xs text-muted-foreground">Players</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{auction.ground.city}, {auction.ground.state}</span>
                    </div>

                    {/* Organizer */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                      <Trophy className="h-3 w-3" />
                      <span>Organized by {auction.organizer_name}</span>
                    </div>

                    {/* Action Button */}
                    <Button asChild className="w-full bg-live hover:bg-live/90">
                      <Link to={`/auctions/${auction.id}`}>
                        <Gavel className="h-4 w-4 mr-2" />
                        Watch Live Auction
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <Gavel className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Live Auctions</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                There are no live auctions happening at the moment. 
                Check back later or browse upcoming tournaments.
              </p>
              <Button asChild variant="outline">
                <Link to="/tournaments">
                  Browse Tournaments
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default LiveAuctions;

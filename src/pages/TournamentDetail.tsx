import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  Circle, 
  ArrowLeft,
  Building,
  Target,
  Clock,
  Gavel,
  UserPlus,
  Pencil
} from "lucide-react";
import { 
  mockTournaments, 
  getCategoryLabel, 
  getBallTypeLabel, 
  getPitchTypeLabel,
  getMatchTypeLabel,
  getStatusLabel, 
  getStatusColor 
} from "@/data/mockData";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const tournament = mockTournaments.find((t) => t.id === id);

  // Check if current user is the organizer (for mock data, we'll use a simple check)
  const isOwner = user && tournament?.organizer_id === user.id;

  if (!tournament) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Tournament Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The tournament you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/tournaments">Back to Tournaments</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const isLive = tournament.status === 'live' || tournament.status === 'auction';
  const canApply = tournament.status === 'registration';
  const isAuction = tournament.status === 'auction';

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-primary-foreground py-12 md:py-20">
        <div className="absolute inset-0 cricket-pattern opacity-20" />
        <div className="container relative">
          {/* Back Button and Edit */}
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/tournaments" 
              className="inline-flex items-center text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tournaments
            </Link>
            {isOwner && (
              <Button asChild variant="secondary" size="sm">
                <Link to={`/tournaments/${id}/edit`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Tournament
                </Link>
              </Button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-xl bg-card/90 p-3 shadow-lg flex-shrink-0">
              <img
                src={tournament.logo_url || "/placeholder.svg"}
                alt={tournament.name}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge 
                  className={`${getStatusColor(tournament.status)} ${isLive ? 'animate-pulse-live' : ''}`}
                >
                  {isLive && <Circle className="h-2 w-2 mr-1 fill-current" />}
                  {getStatusLabel(tournament.status)}
                </Badge>
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                  {getCategoryLabel(tournament.category)}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
                {tournament.name}
              </h1>

              {tournament.slogan && (
                <p className="text-xl text-primary-foreground/80 italic">
                  "{tournament.slogan}"
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-primary-foreground/80">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(tournament.start_date), 'MMM d')} - {format(new Date(tournament.end_date), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{tournament.ground.city}, {tournament.ground.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>Organized by {tournament.organizer_name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tournament Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Tournament Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{tournament.overs}</p>
                      <p className="text-sm text-muted-foreground">Overs</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{tournament.total_teams}</p>
                      <p className="text-sm text-muted-foreground">Teams</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{tournament.players_per_team}</p>
                      <p className="text-sm text-muted-foreground">Players/Team</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{tournament.max_player_bids}</p>
                      <p className="text-sm text-muted-foreground">Max Bids</p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <span className="text-muted-foreground">Ball Type</span>
                      <Badge variant="outline">{getBallTypeLabel(tournament.ball_type)}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <span className="text-muted-foreground">Pitch Type</span>
                      <Badge variant="outline">{getPitchTypeLabel(tournament.pitch_type)}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <span className="text-muted-foreground">Match Type</span>
                      <Badge variant="outline">{getMatchTypeLabel(tournament.match_type)}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="outline">{getCategoryLabel(tournament.category)}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Venue Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Venue Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{tournament.ground.name}</h3>
                      <p className="text-muted-foreground">{tournament.ground.address}</p>
                      <p className="text-muted-foreground">
                        {tournament.ground.city}, {tournament.ground.state} - {tournament.ground.pincode}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Teams Preview (Mock) */}
              {tournament.teams_count && tournament.teams_count > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Teams ({tournament.teams_count}/{tournament.total_teams})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Array.from({ length: Math.min(tournament.teams_count, 4) }).map((_, i) => (
                        <div key={i} className="text-center p-4 rounded-lg border border-border">
                          <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-2 flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium">Team {i + 1}</p>
                        </div>
                      ))}
                    </div>
                    {tournament.teams_count > 4 && (
                      <p className="text-center text-sm text-muted-foreground mt-4">
                        +{tournament.teams_count - 4} more teams
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions Card */}
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {canApply && (
                    <Button className="w-full" size="lg">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Apply to Tournament
                    </Button>
                  )}

                  {isAuction && (
                    <Button className="w-full bg-live text-live-foreground hover:bg-live/90" size="lg">
                      <Gavel className="h-5 w-5 mr-2" />
                      Join Auction Room
                    </Button>
                  )}

                  {tournament.status === 'completed' && (
                    <Button variant="outline" className="w-full" size="lg">
                      View Results
                    </Button>
                  )}

                  {tournament.status === 'live' && (
                    <Button variant="outline" className="w-full" size="lg">
                      View Matches
                    </Button>
                  )}

                  <div className="pt-4 border-t border-border space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Registered Players</span>
                      <span className="font-medium">{tournament.players_count || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Teams Formed</span>
                      <span className="font-medium">{tournament.teams_count || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spots Left</span>
                      <span className="font-medium text-success">
                        {(tournament.total_teams * tournament.players_per_team) - (tournament.players_count || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TournamentDetail;

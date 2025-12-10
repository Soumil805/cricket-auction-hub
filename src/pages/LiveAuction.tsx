import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Gavel, 
  Users, 
  Circle, 
  Timer,
  TrendingUp,
  ArrowLeft,
  IndianRupee,
  User,
  ChevronUp,
  Trophy,
  Wallet
} from "lucide-react";
import { mockTournaments, getCategoryLabel, getBallTypeLabel } from "@/data/mockData";

// Mock player data for auction
interface AuctionPlayer {
  id: string;
  name: string;
  avatar?: string;
  type: 'batsman' | 'bowler' | 'all_rounder' | 'wicket_keeper';
  category: 'a_plus' | 'a' | 'b' | 'c';
  basePrice: number;
  currentBid: number;
  status: 'upcoming' | 'bidding' | 'sold' | 'unsold';
  soldTo?: string;
  soldPrice?: number;
}

interface Team {
  id: string;
  name: string;
  logo?: string;
  budget: number;
  spent: number;
  playerCount: number;
}

const mockPlayers: AuctionPlayer[] = [
  { id: '1', name: 'Virat Singh', type: 'batsman', category: 'a_plus', basePrice: 50000, currentBid: 75000, status: 'bidding' },
  { id: '2', name: 'Rohit Sharma Jr', type: 'batsman', category: 'a', basePrice: 40000, currentBid: 0, status: 'upcoming' },
  { id: '3', name: 'Jasprit Patel', type: 'bowler', category: 'a_plus', basePrice: 50000, currentBid: 0, status: 'upcoming' },
  { id: '4', name: 'Ravindra Jadeja II', type: 'all_rounder', category: 'a', basePrice: 40000, currentBid: 55000, status: 'sold', soldTo: 'Mumbai Warriors', soldPrice: 55000 },
  { id: '5', name: 'MS Sharma', type: 'wicket_keeper', category: 'b', basePrice: 25000, currentBid: 32000, status: 'sold', soldTo: 'Delhi Capitals', soldPrice: 32000 },
  { id: '6', name: 'Hardik Verma', type: 'all_rounder', category: 'a', basePrice: 40000, currentBid: 0, status: 'upcoming' },
  { id: '7', name: 'Bumrah Clone', type: 'bowler', category: 'b', basePrice: 25000, currentBid: 0, status: 'unsold' },
];

const mockTeams: Team[] = [
  { id: '1', name: 'Mumbai Warriors', logo: '/placeholder.svg', budget: 500000, spent: 155000, playerCount: 4 },
  { id: '2', name: 'Delhi Capitals', logo: '/placeholder.svg', budget: 500000, spent: 132000, playerCount: 3 },
  { id: '3', name: 'Chennai Kings', logo: '/placeholder.svg', budget: 500000, spent: 98000, playerCount: 3 },
  { id: '4', name: 'Kolkata Tigers', logo: '/placeholder.svg', budget: 500000, spent: 75000, playerCount: 2 },
  { id: '5', name: 'Bangalore Bulls', logo: '/placeholder.svg', budget: 500000, spent: 112000, playerCount: 3 },
  { id: '6', name: 'Hyderabad Hawks', logo: '/placeholder.svg', budget: 500000, spent: 45000, playerCount: 1 },
];

const getPlayerTypeLabel = (type: AuctionPlayer['type']) => {
  const labels = {
    batsman: 'Batsman',
    bowler: 'Bowler',
    all_rounder: 'All-Rounder',
    wicket_keeper: 'Wicket Keeper'
  };
  return labels[type];
};

const getCategoryBadgeColor = (category: AuctionPlayer['category']) => {
  const colors = {
    a_plus: 'bg-accent text-accent-foreground',
    a: 'bg-primary text-primary-foreground',
    b: 'bg-secondary text-secondary-foreground',
    c: 'bg-muted text-muted-foreground'
  };
  return colors[category];
};

const formatCurrency = (amount: number) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

const LiveAuction = () => {
  const { id } = useParams<{ id: string }>();
  const [currentBid, setCurrentBid] = useState(75000);
  const [timeLeft, setTimeLeft] = useState(15);
  
  const tournament = useMemo(() => {
    return mockTournaments.find((t) => t.id === id);
  }, [id]);

  const currentPlayer = mockPlayers.find(p => p.status === 'bidding');

  // Simulate countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 15));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate bid updates
  useEffect(() => {
    const bidTimer = setInterval(() => {
      setCurrentBid((prev) => prev + 5000);
    }, 8000);
    return () => clearInterval(bidTimer);
  }, []);

  if (!tournament) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Auction Not Found</h1>
          <Button asChild>
            <Link to="/auctions">Back to Live Auctions</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const soldPlayers = mockPlayers.filter(p => p.status === 'sold').length;
  const totalPlayers = mockPlayers.length;
  const progressPercent = (soldPlayers / totalPlayers) * 100;

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-live via-primary to-accent text-primary-foreground py-6 relative overflow-hidden">
        <div className="absolute inset-0 cricket-pattern opacity-10" />
        <div className="container relative">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" asChild className="text-primary-foreground hover:bg-white/10">
              <Link to="/auctions">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Circle className="h-3 w-3 fill-live-foreground text-live-foreground animate-pulse" />
              <span className="text-sm font-medium uppercase tracking-wide">Live Auction</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <img
              src={tournament.logo_url || "/placeholder.svg"}
              alt={tournament.name}
              className="h-16 w-16 rounded-lg bg-background/20 p-2 object-contain"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                {tournament.name}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="bg-background/20 text-primary-foreground border-0">
                  {getCategoryLabel(tournament.category)}
                </Badge>
                <Badge variant="secondary" className="bg-background/20 text-primary-foreground border-0">
                  {getBallTypeLabel(tournament.ball_type)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auction Progress */}
      <div className="bg-card border-b">
        <div className="container py-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Auction Progress</span>
            <span className="font-medium">{soldPlayers}/{totalPlayers} Players Sold</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <section className="py-6">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Current Bid */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Player Card */}
              {currentPlayer && (
                <Card className="border-2 border-live overflow-hidden">
                  <div className="bg-live text-live-foreground px-4 py-2 flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-2">
                      <Gavel className="h-4 w-4" />
                      Currently Bidding
                    </span>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      <span className="font-mono text-xl font-bold">{timeLeft}s</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Player Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-24 w-24 border-4 border-primary">
                          <AvatarImage src={currentPlayer.avatar} />
                          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                            {currentPlayer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-2xl font-display font-bold">{currentPlayer.name}</h2>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline">{getPlayerTypeLabel(currentPlayer.type)}</Badge>
                            <Badge className={getCategoryBadgeColor(currentPlayer.category)}>
                              {currentPlayer.category.replace('_', '+').toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Base Price: {formatCurrency(currentPlayer.basePrice)}
                          </p>
                        </div>
                      </div>

                      {/* Current Bid */}
                      <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl p-6 text-center min-w-[200px]">
                        <p className="text-sm text-muted-foreground mb-1">Current Bid</p>
                        <div className="flex items-center justify-center gap-1 text-4xl font-display font-bold text-primary">
                          <IndianRupee className="h-8 w-8" />
                          <span>{currentBid.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-success mt-2">
                          <ChevronUp className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            +{formatCurrency(currentBid - currentPlayer.basePrice)} from base
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Players Queue */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Player Queue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockPlayers.filter(p => p.status === 'upcoming').slice(0, 4).map((player, index) => (
                      <div key={player.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground font-medium w-6">{index + 1}</span>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {player.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{player.name}</p>
                          <p className="text-xs text-muted-foreground">{getPlayerTypeLabel(player.type)}</p>
                        </div>
                        <Badge className={getCategoryBadgeColor(player.category)}>
                          {player.category.replace('_', '+').toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium">{formatCurrency(player.basePrice)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sold Players */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-accent" />
                    Recently Sold
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockPlayers.filter(p => p.status === 'sold').map((player) => (
                      <div key={player.id} className="flex items-center gap-4 p-3 rounded-lg bg-success/5 border border-success/20">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-success/10 text-success">
                            {player.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{player.name}</p>
                          <p className="text-xs text-muted-foreground">{getPlayerTypeLabel(player.type)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-success">{formatCurrency(player.soldPrice || 0)}</p>
                          <p className="text-xs text-muted-foreground">→ {player.soldTo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Teams */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    Team Budgets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockTeams.map((team) => {
                    const remainingBudget = team.budget - team.spent;
                    const budgetPercent = (team.spent / team.budget) * 100;
                    
                    return (
                      <div key={team.id} className="p-3 rounded-lg border bg-card">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={team.logo} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {team.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{team.name}</p>
                            <p className="text-xs text-muted-foreground">{team.playerCount} players</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Remaining</span>
                            <span className="font-medium">{formatCurrency(remainingBudget)}</span>
                          </div>
                          <Progress value={budgetPercent} className="h-1.5" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Spent: {formatCurrency(team.spent)}</span>
                            <span>of {formatCurrency(team.budget)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Auction Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Auction Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-primary">{soldPlayers}</p>
                      <p className="text-xs text-muted-foreground">Players Sold</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-accent">{mockPlayers.filter(p => p.status === 'unsold').length}</p>
                      <p className="text-xs text-muted-foreground">Unsold</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-success">
                        {formatCurrency(mockPlayers.filter(p => p.status === 'sold').reduce((sum, p) => sum + (p.soldPrice || 0), 0))}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{mockPlayers.filter(p => p.status === 'upcoming').length}</p>
                      <p className="text-xs text-muted-foreground">Remaining</p>
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

export default LiveAuction;

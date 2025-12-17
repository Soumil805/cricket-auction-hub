import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Search, Users, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Tournament {
  id: string;
  name: string;
  number_of_teams: number;
  team_budget: number;
  organizer_id: string;
}

interface Team {
  id: string;
  name: string;
  logo_url: string | null;
  captain_id: string | null;
  budget_remaining: number;
}

interface Player {
  id: string;
  user_id: string;
  full_name: string;
  mobile: string;
}

export default function CreateTeams() {
  const { id: tournamentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form state
  const [teamName, setTeamName] = useState("");
  const [teamBudget, setTeamBudget] = useState("");
  const [selectedCaptain, setSelectedCaptain] = useState<Player | null>(null);

  // Captain search modal
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchMobile, setSearchMobile] = useState("");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (tournamentId) {
      fetchTournamentAndTeams();
    }
  }, [tournamentId]);

  const fetchTournamentAndTeams = async () => {
    setLoading(true);
    try {
      // Fetch tournament
      const { data: tournamentData, error: tournamentError } = await supabase
        .from("tournaments")
        .select("id, name, number_of_teams, team_budget, organizer_id")
        .eq("id", tournamentId)
        .single();

      if (tournamentError) throw tournamentError;
      
      if (!tournamentData) {
        toast({
          title: "Error",
          description: "Tournament not found.",
          variant: "destructive",
        });
        navigate("/tournaments");
        return;
      }

      // Check if user is organizer
      if (user && tournamentData.organizer_id !== user.id) {
        toast({
          title: "Access Denied",
          description: "Only the organizer can manage teams.",
          variant: "destructive",
        });
        navigate(`/tournaments/${tournamentId}`);
        return;
      }

      setTournament(tournamentData);
      setTeamBudget(tournamentData.team_budget.toString());

      // Fetch existing teams
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*")
        .eq("tournament_id", tournamentId)
        .order("created_at", { ascending: true });

      if (teamsError) throw teamsError;
      setTeams(teamsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load tournament data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCaptain = async () => {
    if (!searchMobile || searchMobile.length < 10) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid mobile number.",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, mobile")
        .eq("mobile", searchMobile)
        .eq("is_player_registered", true);

      if (error) throw error;
      setSearchResults(data || []);

      if (!data || data.length === 0) {
        toast({
          title: "No Results",
          description: "No registered player found with this mobile number.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to search players.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleSelectCaptain = (player: Player) => {
    setSelectedCaptain(player);
    setSearchModalOpen(false);
    setSearchMobile("");
    setSearchResults([]);
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      toast({
        title: "Validation Error",
        description: "Team name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!teamBudget || parseFloat(teamBudget) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid team budget.",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase.from("teams").insert({
        tournament_id: tournamentId,
        name: teamName.trim(),
        captain_id: selectedCaptain?.user_id || null,
        budget_remaining: parseFloat(teamBudget),
        owner_id: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Team "${teamName}" created successfully.`,
      });

      // Reset form
      setTeamName("");
      setSelectedCaptain(null);
      setTeamBudget(tournament?.team_budget.toString() || "");

      // Refresh teams
      fetchTournamentAndTeams();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create team.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!tournament) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Tournament not found.</p>
        </div>
      </Layout>
    );
  }

  const canCreateMore = teams.length < tournament.number_of_teams;

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold">{tournament.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teams: {teams.length} / {tournament.number_of_teams}
            </span>
          </div>
        </div>

        {/* Create Team Form */}
        {canCreateMore && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamName">Team Name *</Label>
                    <Input
                      id="teamName"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter team name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Captain</Label>
                    <div className="flex gap-2">
                      <Input
                        value={selectedCaptain?.full_name || ""}
                        readOnly
                        placeholder="No captain selected"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSearchModalOpen(true)}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teamBudget">Total Bid Amount (₹) *</Label>
                    <Input
                      id="teamBudget"
                      type="number"
                      min="0"
                      value={teamBudget}
                      onChange={(e) => setTeamBudget(e.target.value)}
                      placeholder="Enter team budget"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={creating}>
                  {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Team
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {!canCreateMore && (
          <Card className="bg-success/10 border-success">
            <CardContent className="py-6">
              <p className="text-center text-success font-medium">
                All {tournament.number_of_teams} teams have been created!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Teams List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Created Teams</h2>
          {teams.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No teams created yet.
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <Card key={team.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                        {team.logo_url ? (
                          <img
                            src={team.logo_url}
                            alt={team.name}
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <Users className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{team.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Budget: ₹{team.budget_remaining.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Captain Search Modal */}
      <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Search Captain</DialogTitle>
            <DialogDescription>
              Search for a registered player by mobile number
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={searchMobile}
                onChange={(e) => setSearchMobile(e.target.value)}
                placeholder="Enter mobile number"
                type="tel"
              />
              <Button onClick={handleSearchCaptain} disabled={searching}>
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>{player.full_name}</TableCell>
                      <TableCell>{player.mobile}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleSelectCaptain(player)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

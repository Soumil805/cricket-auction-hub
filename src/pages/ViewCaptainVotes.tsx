import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, User, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Tournament {
  id: string;
  name: string;
}

interface Captain {
  id: string;
  name: string;
  mobile: string;
  photo_url: string | null;
  votes: number;
}

export default function ViewCaptainVotes() {
  const { id: tournamentId } = useParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tournamentId) {
      fetchData();
    }
  }, [tournamentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: tournamentData, error: tournamentError } = await supabase
        .from("tournaments")
        .select("id, name")
        .eq("id", tournamentId)
        .single();

      if (tournamentError) throw tournamentError;
      setTournament(tournamentData);

      const { data: captainsData, error: captainsError } = await supabase
        .from("tournament_captain")
        .select("*")
        .eq("tournament_id", tournamentId)
        .eq("is_active", true)
        .order("votes", { ascending: false });

      if (captainsError) throw captainsError;
      setCaptains(captainsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load voting data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const maxVotes = captains.length > 0 ? Math.max(...captains.map((c) => c.votes), 1) : 1;
  const totalVotes = captains.reduce((sum, c) => sum + c.votes, 0);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/tournaments/${tournamentId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-3xl font-bold">{tournament?.name}</h1>
            <p className="text-muted-foreground">
              Captain Voting Results • {totalVotes} total votes
            </p>
          </div>
        </div>

        {captains.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No captains available for voting.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {captains.map((captain, index) => (
              <Card key={captain.id} className={index === 0 ? "border-primary" : ""}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
                      {index === 0 ? (
                        <Trophy className="h-6 w-6 text-yellow-500" />
                      ) : (
                        `#${index + 1}`
                      )}
                    </div>

                    {/* Photo */}
                    <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {captain.photo_url ? (
                        <img
                          src={captain.photo_url}
                          alt={captain.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-7 w-7 text-muted-foreground" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{captain.name}</h3>
                        <span className="text-primary font-bold">
                          {captain.votes} votes
                        </span>
                      </div>
                      <Progress
                        value={(captain.votes / maxVotes) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

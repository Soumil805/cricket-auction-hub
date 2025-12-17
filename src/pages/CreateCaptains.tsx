import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus, ArrowLeft, Phone, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Tournament {
  id: string;
  name: string;
  captain_voting_enabled: boolean;
  organizer_id: string;
}

interface Captain {
  id: string;
  name: string;
  mobile: string;
  photo_url: string | null;
  votes: number;
}

export default function CreateCaptains() {
  const { id: tournamentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form state
  const [captainName, setCaptainName] = useState("");
  const [captainMobile, setCaptainMobile] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
        .select("id, name, captain_voting_enabled, organizer_id")
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

      if (user && tournamentData.organizer_id !== user.id) {
        toast({
          title: "Access Denied",
          description: "Only the organizer can manage captains.",
          variant: "destructive",
        });
        navigate(`/tournaments/${tournamentId}`);
        return;
      }

      if (!tournamentData.captain_voting_enabled) {
        toast({
          title: "Not Available",
          description: "Captain voting is not enabled for this tournament.",
          variant: "destructive",
        });
        navigate(`/tournaments/${tournamentId}`);
        return;
      }

      setTournament(tournamentData);
      await fetchCaptains();
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

  const fetchCaptains = async () => {
    const { data, error } = await supabase
      .from("tournament_captain")
      .select("*")
      .eq("tournament_id", tournamentId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    setCaptains(data || []);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCaptain = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captainName.trim() || !captainMobile.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and mobile number are required.",
        variant: "destructive",
      });
      return;
    }

    if (captainMobile.length < 10) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid mobile number.",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase.from("tournament_captain").insert({
        tournament_id: tournamentId,
        name: captainName.trim(),
        mobile: captainMobile.trim(),
        photo_url: photoPreview,
        created_by: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Captain "${captainName}" added successfully.`,
      });

      // Reset form
      setCaptainName("");
      setCaptainMobile("");
      setPhotoPreview(null);

      // Refresh captains
      await fetchCaptains();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add captain.",
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

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/tournaments/${tournamentId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-3xl font-bold">{tournament.name}</h1>
            <p className="text-muted-foreground">Create Captains for Voting</p>
          </div>
        </div>

        {/* Create Captain Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Captain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCaptain} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="captainName">Captain Name *</Label>
                  <Input
                    id="captainName"
                    value={captainName}
                    onChange={(e) => setCaptainName(e.target.value)}
                    placeholder="Enter captain name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="captainMobile">Mobile Number *</Label>
                  <Input
                    id="captainMobile"
                    type="tel"
                    value={captainMobile}
                    onChange={(e) => setCaptainMobile(e.target.value)}
                    placeholder="Enter mobile number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="captainPhoto">Photo</Label>
                  <Input
                    id="captainPhoto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>

                {photoPreview && (
                  <div className="flex items-center justify-center">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="h-24 w-24 rounded-full object-cover border-2 border-primary"
                    />
                  </div>
                )}
              </div>

              <Button type="submit" disabled={creating}>
                {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Captain
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Captains List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Captains ({captains.length})</h2>
          {captains.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No captains added yet.
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {captains.map((captain) => (
                <Card key={captain.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {captain.photo_url ? (
                          <img
                            src={captain.photo_url}
                            alt={captain.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{captain.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                          <Phone className="h-3 w-3" />
                          {captain.mobile}
                        </p>
                        <p className="text-xs text-primary mt-1">
                          {captain.votes} votes
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
    </Layout>
  );
}

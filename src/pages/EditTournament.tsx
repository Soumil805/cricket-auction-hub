import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Trophy, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TournamentForm } from "@/components/tournaments/TournamentForm";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const tournamentFormSchema = z.object({
  name: z.string().min(3, "Tournament name must be at least 3 characters"),
  slogan: z.string().optional(),
  logoUrl: z.string().optional(),
  tournamentType: z.enum(["Normal", "Auction", "Auction with Voting"], {
    required_error: "Tournament type is required",
  }),
  category: z.string({ required_error: "Category is required" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  ballType: z.string({ required_error: "Ball type is required" }),
  pitchType: z.string({ required_error: "Pitch type is required" }),
  matchType: z.string({ required_error: "Match type is required" }),
  groundId: z.string().optional(),
  venueName: z.string().min(1, "Ground selection is required"),
  venueState: z.string().optional(),
  venueCity: z.string().optional(),
  venueAddress: z.string().optional(),
  venuePincode: z.string().optional(),
  overs: z.number().min(1, "Overs must be at least 1").max(50, "Maximum 50 overs"),
  numberOfTeams: z.number().min(2, "Minimum 2 teams").max(20, "Maximum 20 teams"),
  playersPerTeam: z.number().min(11, "Minimum 11 players").max(25, "Maximum 25 players"),
  teamBudget: z.number().min(10000, "Minimum budget is ₹10,000").optional(),
  basePrice: z.number().min(1000, "Minimum base price is ₹1,000").optional(),
  maxVotesPerPlayer: z.number().min(1).max(10).optional(),
  entryFee: z.number().min(0, "Entry fee cannot be negative").optional(),
  paymentInstructions: z.string().optional(),
  paymentQrUrl: z.string().optional(),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be on or after start date",
  path: ["endDate"],
});

export type TournamentFormData = z.infer<typeof tournamentFormSchema>;

export default function EditTournament() {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isOrganizer } = useAuth();

  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: "",
      slogan: "",
      logoUrl: "",
      tournamentType: "Normal",
      category: "",
      ballType: "",
      pitchType: "",
      matchType: "",
      overs: 20,
      numberOfTeams: 8,
      playersPerTeam: 15,
      teamBudget: 1000000,
      basePrice: 10000,
      maxVotesPerPlayer: 3,
      venueName: "",
      venueState: "",
      venueCity: "",
      venueAddress: "",
      venuePincode: "",
      groundId: "",
      entryFee: 0,
      paymentInstructions: "",
      paymentQrUrl: "",
    },
  });

  useEffect(() => {
    const fetchTournament = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("tournaments")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Tournament Not Found",
            description: "The tournament you're trying to edit doesn't exist.",
            variant: "destructive",
          });
          navigate("/tournaments");
          return;
        }

        if (data.organizer_id !== user?.id) {
          toast({
            title: "Access Denied",
            description: "You can only edit tournaments you created.",
            variant: "destructive",
          });
          navigate("/tournaments");
          return;
        }

        // Determine tournament type from data
        let tournamentType: "Normal" | "Auction" | "Auction with Voting" = "Normal";
        if (data.tournament_type) {
          tournamentType = data.tournament_type as typeof tournamentType;
        } else if (data.captain_voting_enabled) {
          tournamentType = "Auction with Voting";
        }

        form.reset({
          name: data.name,
          slogan: data.slogan || "",
          logoUrl: data.logo_url || "",
          tournamentType,
          startDate: new Date(data.start_date),
          endDate: new Date(data.end_date),
          category: data.category,
          ballType: data.ball_type,
          pitchType: data.pitch_type,
          matchType: data.match_type,
          groundId: data.ground_id || "",
          venueName: data.venue_name || "",
          venueState: data.venue_state || "",
          venueCity: data.venue_city || "",
          venueAddress: data.venue_address || "",
          venuePincode: data.venue_pincode || "",
          overs: data.overs,
          numberOfTeams: data.number_of_teams,
          playersPerTeam: data.players_per_team,
          teamBudget: data.team_budget,
          basePrice: data.base_price,
          maxVotesPerPlayer: data.max_votes_per_player || 3,
          entryFee: data.entry_fee || 0,
          paymentInstructions: data.payment_instructions || "",
          paymentQrUrl: data.payment_qr_url || "",
        });
      } catch (error: any) {
        console.error("Error fetching tournament:", error);
        toast({
          title: "Error",
          description: "Failed to load tournament data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTournament();
    }
  }, [id, user, navigate, form]);

  const onSubmit = async (data: TournamentFormData) => {
    if (!user || !id) return;

    setIsSubmitting(true);

    try {
      const captainVotingEnabled = data.tournamentType === "Auction with Voting";

      const { error } = await supabase
        .from("tournaments")
        .update({
          name: data.name,
          slogan: data.slogan || null,
          logo_url: data.logoUrl || null,
          tournament_type: data.tournamentType,
          category: data.category,
          start_date: data.startDate.toISOString().split("T")[0],
          end_date: data.endDate.toISOString().split("T")[0],
          ball_type: data.ballType,
          pitch_type: data.pitchType,
          match_type: data.matchType,
          ground_id: data.groundId || null,
          venue_name: data.venueName,
          venue_state: data.venueState || null,
          venue_city: data.venueCity || null,
          venue_address: data.venueAddress || null,
          venue_pincode: data.venuePincode || null,
          overs: data.overs,
          number_of_teams: data.numberOfTeams,
          players_per_team: data.playersPerTeam,
          team_budget: data.teamBudget || 1000000,
          base_price: data.basePrice || 10000,
          captain_voting_enabled: captainVotingEnabled,
          max_votes_per_player: captainVotingEnabled ? data.maxVotesPerPlayer : null,
          entry_fee: data.entryFee || 0,
          payment_instructions: data.paymentInstructions || null,
          payment_qr_url: data.paymentQrUrl || null,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Tournament Updated!",
        description: `${data.name} has been updated successfully.`,
      });
      navigate(`/tournaments/${id}`);
    } catch (error: any) {
      console.error("Error updating tournament:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update tournament. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-8 w-64 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Edit Tournament</h1>
            <p className="text-muted-foreground mt-2">
              Update your tournament details
            </p>
          </div>

          {/* Form */}
          <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TournamentForm form={form} />

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t">
                  <Button 
                    type="submit" 
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

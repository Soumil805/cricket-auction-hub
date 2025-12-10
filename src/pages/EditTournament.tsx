import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, ChevronRight, Check, Trophy, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { StepIndicator } from "@/components/tournaments/create/StepIndicator";
import { BasicInfoStep } from "@/components/tournaments/create/BasicInfoStep";
import { TournamentSettingsStep } from "@/components/tournaments/create/TournamentSettingsStep";
import { TeamSettingsStep } from "@/components/tournaments/create/TeamSettingsStep";
import { VenueStep } from "@/components/tournaments/create/VenueStep";
import { PaymentStep } from "@/components/tournaments/create/PaymentStep";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const tournamentFormSchema = z.object({
  name: z.string().min(3, "Tournament name must be at least 3 characters"),
  slogan: z.string().optional(),
  description: z.string().optional(),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  logoUrl: z.string().optional(),
  category: z.string({ required_error: "Category is required" }),
  ballType: z.string({ required_error: "Ball type is required" }),
  pitchType: z.string({ required_error: "Pitch type is required" }),
  matchType: z.string({ required_error: "Match format is required" }),
  overs: z.number().min(1, "Overs must be at least 1").max(50, "Maximum 50 overs"),
  numberOfTeams: z.number().min(2, "Minimum 2 teams").max(20, "Maximum 20 teams"),
  playersPerTeam: z.number().min(11, "Minimum 11 players").max(25, "Maximum 25 players"),
  teamBudget: z.number().min(10000, "Minimum budget is ₹10,000"),
  basePrice: z.number().min(1000, "Minimum base price is ₹1,000"),
  captainVotingEnabled: z.boolean().default(false),
  maxVotesPerPlayer: z.number().min(1).max(10).optional(),
  venueName: z.string().min(2, "Venue name is required"),
  venueState: z.string({ required_error: "State is required" }),
  venueCity: z.string({ required_error: "City is required" }),
  venueAddress: z.string().optional(),
  venuePincode: z.string().optional(),
  entryFee: z.number().min(0, "Entry fee cannot be negative"),
  paymentInstructions: z.string().optional(),
  paymentQrUrl: z.string().optional(),
});

export type TournamentFormData = z.infer<typeof tournamentFormSchema>;

const steps = [
  { number: 1, title: "Basic Info" },
  { number: 2, title: "Settings" },
  { number: 3, title: "Teams" },
  { number: 4, title: "Venue" },
  { number: 5, title: "Payment" },
];

const stepFields: Record<number, (keyof TournamentFormData)[]> = {
  1: ["name", "startDate", "endDate"],
  2: ["category", "ballType", "pitchType", "matchType", "overs"],
  3: ["numberOfTeams", "playersPerTeam", "teamBudget", "basePrice"],
  4: ["venueName", "venueState", "venueCity"],
  5: ["entryFee"],
};

export default function EditTournament() {
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isOrganizer } = useAuth();

  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: "",
      slogan: "",
      description: "",
      logoUrl: "",
      category: "",
      ballType: "",
      pitchType: "",
      matchType: "",
      overs: 20,
      numberOfTeams: 8,
      playersPerTeam: 15,
      teamBudget: 1000000,
      basePrice: 10000,
      captainVotingEnabled: false,
      maxVotesPerPlayer: 3,
      venueName: "",
      venueState: "",
      venueCity: "",
      venueAddress: "",
      venuePincode: "",
      entryFee: 500,
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

        form.reset({
          name: data.name,
          slogan: data.slogan || "",
          description: data.description || "",
          logoUrl: data.logo_url || "",
          startDate: new Date(data.start_date),
          endDate: new Date(data.end_date),
          category: data.category,
          ballType: data.ball_type,
          pitchType: data.pitch_type,
          matchType: data.match_type,
          overs: data.overs,
          numberOfTeams: data.number_of_teams,
          playersPerTeam: data.players_per_team,
          teamBudget: data.team_budget,
          basePrice: data.base_price,
          captainVotingEnabled: data.captain_voting_enabled || false,
          maxVotesPerPlayer: data.max_votes_per_player || 3,
          venueName: data.venue_name || "",
          venueState: data.venue_state || "",
          venueCity: data.venue_city || "",
          venueAddress: data.venue_address || "",
          venuePincode: data.venue_pincode || "",
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

  const validateCurrentStep = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: TournamentFormData) => {
    if (!user || !id) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("tournaments")
        .update({
          name: data.name,
          slogan: data.slogan || null,
          description: data.description || null,
          start_date: data.startDate.toISOString().split("T")[0],
          end_date: data.endDate.toISOString().split("T")[0],
          logo_url: data.logoUrl || null,
          category: data.category,
          ball_type: data.ballType,
          pitch_type: data.pitchType,
          match_type: data.matchType,
          overs: data.overs,
          number_of_teams: data.numberOfTeams,
          players_per_team: data.playersPerTeam,
          team_budget: data.teamBudget,
          base_price: data.basePrice,
          captain_voting_enabled: data.captainVotingEnabled,
          max_votes_per_player: data.captainVotingEnabled ? data.maxVotesPerPlayer : null,
          venue_name: data.venueName,
          venue_state: data.venueState,
          venue_city: data.venueCity,
          venue_address: data.venueAddress || null,
          venue_pincode: data.venuePincode || null,
          entry_fee: data.entryFee,
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep form={form} />;
      case 2:
        return <TournamentSettingsStep form={form} />;
      case 3:
        return <TeamSettingsStep form={form} />;
      case 4:
        return <VenueStep form={form} />;
      case 5:
        return <PaymentStep form={form} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-8 w-64 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
            <Skeleton className="h-12 w-full mb-8" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cricket-green/10 mb-4">
              <Trophy className="h-8 w-8 text-cricket-green" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Edit Tournament</h1>
            <p className="text-muted-foreground mt-2">
              Update your tournament details
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator steps={steps} currentStep={currentStep} />

          {/* Form */}
          <div className="mt-8 bg-card rounded-xl border shadow-sm p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {renderStep()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < steps.length ? (
                    <Button type="button" onClick={handleNext}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      className="bg-cricket-green hover:bg-cricket-green/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

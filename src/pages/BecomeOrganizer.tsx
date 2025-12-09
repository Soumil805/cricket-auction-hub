import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, Trophy, Users, Gavel, Check } from "lucide-react";

const benefits = [
  {
    icon: Trophy,
    title: "Create Tournaments",
    description: "Set up cricket tournaments with customizable settings, teams, and auction rules.",
  },
  {
    icon: Users,
    title: "Manage Teams",
    description: "Create and manage teams, assign owners, and track team budgets.",
  },
  {
    icon: Gavel,
    title: "Run Live Auctions",
    description: "Conduct real-time player auctions with instant bidding and results.",
  },
];

export default function BecomeOrganizer() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, isOrganizer, addRole, refreshRoles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (isOrganizer) {
      toast({
        title: "Already an Organizer",
        description: "You already have organizer privileges.",
      });
      navigate("/tournaments/new");
    }
  }, [user, isOrganizer, navigate, toast]);

  const handleBecomeOrganizer = async () => {
    setIsLoading(true);

    try {
      const { error } = await addRole("organizer");
      if (error) throw error;

      await refreshRoles();

      toast({
        title: "You're now an Organizer!",
        description: "You can now create and manage tournaments.",
      });

      navigate("/tournaments/new");
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20 text-accent">
                <Shield className="h-7 w-7" />
              </div>
            </div>
            <CardTitle className="text-3xl font-display">Become an Organizer</CardTitle>
            <CardDescription className="text-base">
              Unlock the ability to create and manage cricket tournaments
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Benefits */}
            <div className="grid gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* What you get */}
            <div className="bg-primary/5 rounded-lg p-6">
              <h3 className="font-semibold mb-3">As an Organizer, you can:</h3>
              <ul className="space-y-2">
                {[
                  "Create unlimited tournaments",
                  "Manage player registrations and applications",
                  "Set up custom auction rules and team budgets",
                  "Run live auctions with real-time bidding",
                  "Track tournament progress and results",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <Button size="lg" onClick={handleBecomeOrganizer} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Shield className="mr-2 h-5 w-5" />
                Become an Organizer
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                It's free! You can create your first tournament immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

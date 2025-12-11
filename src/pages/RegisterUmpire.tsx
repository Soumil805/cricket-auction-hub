import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Gavel } from "lucide-react";

export default function RegisterUmpire() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCertified, setIsCertified] = useState(false);
  const { user, isUmpire, addRole, refreshRoles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (isUmpire) {
      toast({
        title: "Already Registered",
        description: "You are already registered as an umpire.",
      });
      navigate("/");
    }
  }, [user, isUmpire, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      // Add umpire role
      const { error: roleError } = await addRole("umpire");
      if (roleError) throw roleError;

      await refreshRoles();

      toast({
        title: "Registration Complete!",
        description: "You are now registered as an umpire. You can create your profile later.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Gavel className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl font-display">Register as Umpire</CardTitle>
            <CardDescription>
              Register to offer your umpiring services for cricket matches
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="e.g., 5"
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Full profile details can be added later
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Are you a certified umpire?</Label>
                    <p className="text-sm text-muted-foreground">
                      Do you have official certification?
                    </p>
                  </div>
                  <Switch
                    checked={isCertified}
                    onCheckedChange={setIsCertified}
                  />
                </div>

                {isCertified && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <div>
                      <Label htmlFor="certificationFrom">Certification Body</Label>
                      <Input
                        id="certificationFrom"
                        placeholder="e.g., BCCI, State Cricket Association"
                      />
                    </div>
                    <div>
                      <Label htmlFor="certificate">Upload Certificate</Label>
                      <Input
                        id="certificate"
                        type="file"
                        accept="image/*,.pdf"
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Certificate upload will be enabled after registration
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="rateCard">Rate Card (Optional)</Label>
                  <Textarea
                    id="rateCard"
                    placeholder="e.g., ₹1000 per match for local games, ₹2000 for tournament matches..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Describe your pricing for umpiring services
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register as Umpire"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

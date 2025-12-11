import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin } from "lucide-react";
import { indianStates, citiesByState } from "@/data/indianLocations";

export default function RegisterGroundOwner() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const { user, isGroundOwner, addRole, refreshRoles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const cities = selectedState ? citiesByState[selectedState] || [] : [];

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (isGroundOwner) {
      toast({
        title: "Already Registered",
        description: "You are already registered as a ground owner.",
      });
      navigate("/");
    }
  }, [user, isGroundOwner, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      // Add ground_owner role
      const { error: roleError } = await addRole("ground_owner");
      if (roleError) throw roleError;

      await refreshRoles();

      toast({
        title: "Registration Complete!",
        description: "You are now registered as a ground owner. You can add your grounds later.",
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
                <MapPin className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl font-display">Register as Ground Owner</CardTitle>
            <CardDescription>
              Register to list your cricket ground and accept bookings
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="groundName">Ground Name</Label>
                  <Input
                    id="groundName"
                    placeholder="e.g., City Sports Complex"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Full ground details can be added later
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>State</Label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>City</Label>
                    <Select disabled={!selectedState}>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedState ? "Select city" : "Select state first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="facilities">Facilities (Optional)</Label>
                  <Textarea
                    id="facilities"
                    placeholder="e.g., Floodlights, Dressing rooms, Parking, Canteen..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="rateCard">Rate Card (Optional)</Label>
                  <Textarea
                    id="rateCard"
                    placeholder="e.g., ₹5000 for half day, ₹8000 for full day, ₹15000 for tournament day..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Describe your pricing for ground rental
                  </p>
                </div>

                <div>
                  <Label>Ground Images & Videos</Label>
                  <Input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Media upload will be enabled after registration
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
                  "Register as Ground Owner"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

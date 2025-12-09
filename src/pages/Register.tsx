import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { indianStates, citiesByState } from "@/data/indianLocations";

const playerTypes = [
  { value: "batsman", label: "Batsman" },
  { value: "bowler", label: "Bowler" },
  { value: "all_rounder", label: "All-Rounder" },
  { value: "wicket_keeper", label: "Wicket Keeper" },
];

const battingStyles = [
  { value: "right_handed", label: "Right Handed" },
  { value: "left_handed", label: "Left Handed" },
];

const bowlingStyles = [
  { value: "right_arm_fast", label: "Right Arm Fast" },
  { value: "left_arm_fast", label: "Left Arm Fast" },
  { value: "right_arm_medium", label: "Right Arm Medium" },
  { value: "left_arm_medium", label: "Left Arm Medium" },
  { value: "right_arm_spin", label: "Right Arm Spin" },
  { value: "left_arm_spin", label: "Left Arm Spin" },
  { value: "none", label: "None / Not Applicable" },
];

const playerCategories = [
  { value: "a_plus", label: "A+ (Elite)" },
  { value: "a", label: "A (Advanced)" },
  { value: "b", label: "B (Intermediate)" },
  { value: "c", label: "C (Beginner)" },
];

const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const registerSchema = z.object({
  // Personal Info
  fullName: z.string().min(2, "Name is required").max(100),
  mobile: z.string().min(10, "Valid mobile number required").max(15),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  // Address
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().max(500).optional(),
  pincode: z.string().length(6, "Pincode must be 6 digits").optional(),
  // Player Details
  playerType: z.enum(["batsman", "bowler", "all_rounder", "wicket_keeper"]),
  battingStyle: z.enum(["right_handed", "left_handed"]),
  bowlingStyle: z.enum(["right_arm_fast", "left_arm_fast", "right_arm_medium", "left_arm_medium", "right_arm_spin", "left_arm_spin", "none"]),
  playerCategory: z.enum(["a_plus", "a", "b", "c"]),
  bio: z.string().max(500).optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const steps = [
  { id: 1, title: "Personal Info" },
  { id: 2, title: "Location" },
  { id: 3, title: "Player Details" },
];

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isPlayer, addRole, refreshRoles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      mobile: "",
      dateOfBirth: "",
      state: "",
      city: "",
      address: "",
      pincode: "",
      bio: "",
    },
  });

  const selectedState = form.watch("state");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (isPlayer) {
      toast({
        title: "Already Registered",
        description: "You are already registered as a player.",
      });
      navigate("/");
    }
  }, [user, isPlayer, navigate, toast]);

  useEffect(() => {
    if (selectedState) {
      form.setValue("city", "");
    }
  }, [selectedState, form]);

  const stepFields: Record<number, (keyof RegisterFormData)[]> = {
    1: ["fullName", "mobile", "gender", "dateOfBirth"],
    2: ["state", "city"],
    3: ["playerType", "battingStyle", "bowlingStyle", "playerCategory"],
  };

  const validateCurrentStep = async () => {
    const fields = stepFields[currentStep];
    const result = await form.trigger(fields);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Update profile with player details
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: data.fullName,
          mobile: data.mobile,
          gender: data.gender,
          date_of_birth: data.dateOfBirth,
          state: data.state,
          city: data.city,
          address: data.address || null,
          pincode: data.pincode || null,
          player_type: data.playerType,
          batting_style: data.battingStyle,
          bowling_style: data.bowlingStyle,
          player_category: data.playerCategory,
          bio: data.bio || null,
          is_player_registered: true,
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      // Add player role
      const { error: roleError } = await addRole("player");
      if (roleError) throw roleError;

      await refreshRoles();

      toast({
        title: "Registration Complete!",
        description: "You are now registered as a player. Browse tournaments to apply!",
      });

      navigate("/tournaments");
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

  const cities = selectedState ? citiesByState[selectedState] || [] : [];

  return (
    <Layout>
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <UserPlus className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl font-display">Player Registration</CardTitle>
            <CardDescription>
              Complete your player profile to apply for tournaments
            </CardDescription>
          </CardHeader>

          {/* Step Indicator */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                        currentStep > step.id
                          ? "bg-primary border-primary text-primary-foreground"
                          : currentStep === step.id
                          ? "border-primary text-primary"
                          : "border-muted-foreground/30 text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                    </div>
                    <span className="mt-2 text-xs font-medium text-muted-foreground">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-4 h-0.5 w-16 sm:w-24 ${
                        currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="10-digit mobile number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {genders.map((g) => (
                                  <SelectItem key={g.value} value={g.value}>
                                    {g.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Location */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {indianStates.map((state) => (
                                  <SelectItem key={state.code} value={state.code}>
                                    {state.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!selectedState}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={selectedState ? "Select city" : "Select state first"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {cities.map((city) => (
                                  <SelectItem key={city} value={city}>
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Street address, locality, landmark..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Optional - for tournament communications</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <FormControl>
                            <Input placeholder="6-digit pincode" maxLength={6} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Player Details */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="playerType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Player Type *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {playerTypes.map((t) => (
                                  <SelectItem key={t.value} value={t.value}>
                                    {t.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="playerCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skill Category *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {playerCategories.map((c) => (
                                  <SelectItem key={c.value} value={c.value}>
                                    {c.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="battingStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Batting Style *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {battingStyles.map((s) => (
                                  <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bowlingStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bowling Style *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {bowlingStyles.map((s) => (
                                  <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio / About You</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell organizers about your cricket experience, achievements, playing history..."
                              className="h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Optional - helps organizers know you better</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < 3 ? (
                    <Button type="button" onClick={handleNext}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Complete Registration
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

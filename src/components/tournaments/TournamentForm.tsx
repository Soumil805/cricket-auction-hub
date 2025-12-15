import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Upload, QrCode, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TournamentFormData } from "@/pages/CreateTournament";
import { supabase } from "@/integrations/supabase/client";

interface TournamentFormProps {
  form: UseFormReturn<TournamentFormData>;
}

const tournamentTypes = [
  { value: "Normal", label: "Normal" },
  { value: "Auction", label: "Auction" },
  { value: "Auction with Voting", label: "Auction with Voting" },
];

const categories = [
  { value: "Open", label: "Open" },
  { value: "Corporate", label: "Corporate" },
  { value: "Community", label: "Community" },
  { value: "School", label: "School" },
  { value: "College", label: "College" },
  { value: "University", label: "University" },
  { value: "Others", label: "Others" },
];

const ballTypes = [
  { value: "Tennis", label: "Tennis" },
  { value: "Leather", label: "Leather" },
  { value: "Other", label: "Other" },
];

const pitchTypes = [
  { value: "Turf", label: "Turf" },
  { value: "Matting", label: "Matting" },
  { value: "Cement", label: "Cement" },
  { value: "Rough", label: "Rough" },
  { value: "Astroturf", label: "Astroturf" },
];

const matchTypes = [
  { value: "Limited Over", label: "Limited Over" },
  { value: "Box Cricket", label: "Box Cricket" },
  { value: "Pair Cricket", label: "Pair Cricket" },
  { value: "Test Match", label: "Test Match" },
];

interface Ground {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string | null;
}

export function TournamentForm({ form }: TournamentFormProps) {
  const [groundModalOpen, setGroundModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingGrounds, setLoadingGrounds] = useState(false);

  const tournamentType = form.watch("tournamentType");
  const showVotingFields = tournamentType === "Auction with Voting";
  const showAuctionFields = tournamentType === "Auction" || tournamentType === "Auction with Voting";

  // Fetch states when modal opens
  const fetchStates = async () => {
    setLoadingStates(true);
    try {
      const { data, error } = await supabase
        .from("grounds")
        .select("state")
        .order("state");
      
      if (error) throw error;
      
      const uniqueStates = [...new Set(data?.map(g => g.state) || [])];
      setStates(uniqueStates);
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  // Fetch cities when state is selected
  const fetchCities = async (state: string) => {
    setLoadingCities(true);
    try {
      const { data, error } = await supabase
        .from("grounds")
        .select("city")
        .eq("state", state)
        .order("city");
      
      if (error) throw error;
      
      const uniqueCities = [...new Set(data?.map(g => g.city) || [])];
      setCities(uniqueCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  // Fetch grounds when city is selected
  const fetchGrounds = async (state: string, city: string) => {
    setLoadingGrounds(true);
    try {
      const { data, error } = await supabase
        .from("grounds")
        .select("id, name, city, state, address")
        .eq("state", state)
        .eq("city", city)
        .order("name");
      
      if (error) throw error;
      setGrounds(data || []);
    } catch (error) {
      console.error("Error fetching grounds:", error);
    } finally {
      setLoadingGrounds(false);
    }
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity("");
    setGrounds([]);
    fetchCities(state);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    fetchGrounds(selectedState, city);
  };

  const handleGroundSelect = (ground: Ground) => {
    form.setValue("groundId", ground.id);
    form.setValue("venueName", ground.name);
    form.setValue("venueState", ground.state);
    form.setValue("venueCity", ground.city);
    form.setValue("venueAddress", ground.address || "");
    setGroundModalOpen(false);
  };

  const handleModalOpen = (open: boolean) => {
    setGroundModalOpen(open);
    if (open) {
      fetchStates();
    }
  };

  return (
    <div className="space-y-8">
      {/* Tournament Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tournament Name *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Premier Cricket League 2024" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tournament Slogan */}
      <FormField
        control={form.control}
        name="slogan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tournament Slogan</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Where Champions Are Made" {...field} />
            </FormControl>
            <FormDescription>A catchy phrase for your tournament</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tournament Logo */}
      <FormField
        control={form.control}
        name="logoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tournament Logo</FormLabel>
            <FormControl>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.onChange(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tournament Type */}
      <FormField
        control={form.control}
        name="tournamentType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tournament Type *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select tournament type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tournamentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {tournamentType === "Normal" && "Players/teams register directly. No auction."}
              {tournamentType === "Auction" && "Players apply, organizer creates teams, captains bid on players."}
              {tournamentType === "Auction with Voting" && "Players vote for captains, then auction starts."}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Category */}
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Start & End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() ||
                      (form.watch("startDate") && date < form.watch("startDate"))
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Ball Type */}
      <FormField
        control={form.control}
        name="ballType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ball Type *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select ball type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ballTypes.map((ball) => (
                  <SelectItem key={ball.value} value={ball.value}>
                    {ball.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Pitch Type */}
      <FormField
        control={form.control}
        name="pitchType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pitch Type *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select pitch type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {pitchTypes.map((pitch) => (
                  <SelectItem key={pitch.value} value={pitch.value}>
                    {pitch.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Match Type */}
      <FormField
        control={form.control}
        name="matchType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Match Type *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select match type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {matchTypes.map((match) => (
                  <SelectItem key={match.value} value={match.value}>
                    {match.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Ground Selection */}
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="venueName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selected Ground *</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input 
                    {...field} 
                    readOnly 
                    placeholder="No ground selected"
                    className="bg-muted"
                  />
                </FormControl>
                <Dialog open={groundModalOpen} onOpenChange={handleModalOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Select Ground
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Select Ground</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* State Dropdown */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">State</label>
                        <Select onValueChange={handleStateChange} value={selectedState}>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingStates ? "Loading..." : "Select state"} />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* City Dropdown */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">City</label>
                        <Select 
                          onValueChange={handleCityChange} 
                          value={selectedCity}
                          disabled={!selectedState}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={loadingCities ? "Loading..." : "Select city"} />
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

                      {/* Grounds List */}
                      {selectedCity && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Available Grounds</label>
                          {loadingGrounds ? (
                            <p className="text-sm text-muted-foreground">Loading grounds...</p>
                          ) : grounds.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No grounds found in this area</p>
                          ) : (
                            <div className="max-h-48 overflow-y-auto space-y-2">
                              {grounds.map((ground) => (
                                <div
                                  key={ground.id}
                                  onClick={() => handleGroundSelect(ground)}
                                  className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                                >
                                  <p className="font-medium">{ground.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {ground.city}, {ground.state}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {states.length === 0 && !loadingStates && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No grounds available. Please add grounds first.
                        </p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Overs Per Match */}
      <FormField
        control={form.control}
        name="overs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Overs Per Match *</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                max={50}
                placeholder="e.g., 20"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || "")}
              />
            </FormControl>
            <FormDescription>Number of overs each team will play</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Number of Teams */}
      <FormField
        control={form.control}
        name="numberOfTeams"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Teams *</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={2}
                max={20}
                placeholder="e.g., 8"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || "")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Players Per Team */}
      <FormField
        control={form.control}
        name="playersPerTeam"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Players Per Team *</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={11}
                max={25}
                placeholder="e.g., 15"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || "")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Auction Fields - Only for Auction types */}
      {showAuctionFields && (
        <>
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Auction Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="teamBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Budget (₹) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={10000}
                        step={1000}
                        placeholder="e.g., 1000000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || "")}
                      />
                    </FormControl>
                    <FormDescription>Budget for each team</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price (₹) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1000}
                        step={500}
                        placeholder="e.g., 10000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || "")}
                      />
                    </FormControl>
                    <FormDescription>Minimum bid per player</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </>
      )}

      {/* Captain Voting Fields - Only for Auction with Voting */}
      {showVotingFields && (
        <div className="border rounded-lg p-6 bg-muted/30">
          <h3 className="text-lg font-semibold mb-4">Captain Voting Settings</h3>
          
          <FormField
            control={form.control}
            name="maxVotesPerPlayer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Votes Per Player *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    placeholder="e.g., 3"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || "")}
                  />
                </FormControl>
                <FormDescription>
                  How many captains can each player vote for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* Payment Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="entryFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Fee (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={100}
                    placeholder="e.g., 500"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>Enter 0 for free registration</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentQrUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment QR Code</FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">Upload payment QR code</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter payment instructions for players..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

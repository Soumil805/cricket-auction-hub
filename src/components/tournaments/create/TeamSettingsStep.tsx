import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TournamentFormData } from "@/pages/CreateTournament";

interface TeamSettingsStepProps {
  form: UseFormReturn<TournamentFormData>;
}

export function TeamSettingsStep({ form }: TeamSettingsStepProps) {
  const captainVotingEnabled = form.watch("captainVotingEnabled");

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Team Settings</h2>
        <p className="text-muted-foreground mt-1">
          Configure team composition and auction settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <FormDescription>
                Total teams in the tournament (2-20)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <FormDescription>
                Maximum players each team can have (11-25)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <FormDescription>
                Budget allocated to each team for auction (in INR)
              </FormDescription>
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
              <FormDescription>
                Minimum starting bid for each player
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="border rounded-lg p-6 bg-muted/30">
        <FormField
          control={form.control}
          name="captainVotingEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Captain Voting</FormLabel>
                <FormDescription>
                  Allow players to vote for team captains before the auction
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {captainVotingEnabled && (
          <div className="mt-6 pt-6 border-t">
            <FormField
              control={form.control}
              name="maxVotesPerPlayer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Votes Per Player</FormLabel>
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
                    How many captains can each player vote for (1-10)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}

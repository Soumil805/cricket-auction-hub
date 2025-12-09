import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TournamentFormData } from "@/pages/CreateTournament";

interface TournamentSettingsStepProps {
  form: UseFormReturn<TournamentFormData>;
}

const categories = [
  { value: "open", label: "Open" },
  { value: "corporate", label: "Corporate" },
  { value: "school", label: "School" },
  { value: "college", label: "College" },
  { value: "club", label: "Club" },
  { value: "invitational", label: "Invitational" },
];

const ballTypes = [
  { value: "tennis", label: "Tennis Ball" },
  { value: "leather", label: "Leather Ball" },
  { value: "rubber", label: "Rubber Ball" },
];

const pitchTypes = [
  { value: "turf", label: "Turf" },
  { value: "cement", label: "Cement" },
  { value: "matting", label: "Matting" },
  { value: "artificial", label: "Artificial" },
];

const matchTypes = [
  { value: "league", label: "League" },
  { value: "knockout", label: "Knockout" },
  { value: "group_knockout", label: "Group + Knockout" },
  { value: "round_robin", label: "Round Robin" },
];

export function TournamentSettingsStep({ form }: TournamentSettingsStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Tournament Settings</h2>
        <p className="text-muted-foreground mt-1">
          Configure the format and rules of your tournament
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormDescription>
                Type of tournament participation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ballType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ball Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <FormField
          control={form.control}
          name="pitchType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pitch Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <FormField
          control={form.control}
          name="matchType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Match Format *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
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
              <FormDescription>
                How matches will be organized
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
            <FormDescription>
              Number of overs each team will play (1-50)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

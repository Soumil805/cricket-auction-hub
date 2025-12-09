import { UseFormReturn } from "react-hook-form";
import { Upload, QrCode } from "lucide-react";
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
import { TournamentFormData } from "@/pages/CreateTournament";

interface PaymentStepProps {
  form: UseFormReturn<TournamentFormData>;
}

export function PaymentStep({ form }: PaymentStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Payment Information</h2>
        <p className="text-muted-foreground mt-1">
          Configure payment details for player registrations
        </p>
      </div>

      <FormField
        control={form.control}
        name="entryFee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entry Fee (₹) *</FormLabel>
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
            <FormDescription>
              Registration fee for each player (enter 0 for free registration)
            </FormDescription>
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
                placeholder="Enter payment instructions for players...&#10;&#10;Example:&#10;1. Scan the QR code or use UPI ID: example@upi&#10;2. Pay the registration fee&#10;3. Take a screenshot of the payment&#10;4. Upload during registration"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Instructions will be shown to players during registration
            </FormDescription>
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
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-cricket-green/50 transition-colors cursor-pointer">
                <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Upload your payment QR code
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 2MB
                </p>
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
            <FormDescription>
              Players will scan this QR code to make payments
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-muted/30 rounded-lg p-4 border">
        <h4 className="font-medium text-foreground mb-2">Preview Summary</h4>
        <p className="text-sm text-muted-foreground">
          After submitting, you'll be able to:
        </p>
        <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
          <li>Manage player applications</li>
          <li>Set up teams and captains</li>
          <li>Start the auction when ready</li>
          <li>Track all payments and registrations</li>
        </ul>
      </div>
    </div>
  );
}

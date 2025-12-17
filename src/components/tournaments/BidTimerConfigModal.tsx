import { useState, useEffect } from "react";
import { Loader2, Timer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BidTimerConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentId: string;
  tournamentName: string;
}

export function BidTimerConfigModal({
  open,
  onOpenChange,
  tournamentId,
  tournamentName,
}: BidTimerConfigModalProps) {
  const [bidTime, setBidTime] = useState("10");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchTimer();
    }
  }, [open, tournamentId]);

  const fetchTimer = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("auction_timer")
        .select("*")
        .eq("tournament_id", tournamentId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setBidTime(data.bid_time.toString());
        setExistingId(data.id);
      } else {
        setBidTime("10");
        setExistingId(null);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load timer config.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const bidTimeNum = parseInt(bidTime);
    if (isNaN(bidTimeNum) || bidTimeNum < 5 || bidTimeNum > 120) {
      toast({
        title: "Validation Error",
        description: "Bid time must be between 5 and 120 seconds.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (existingId) {
        // Update existing
        const { error } = await supabase
          .from("auction_timer")
          .update({ bid_time: bidTimeNum })
          .eq("id", existingId);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase.from("auction_timer").insert({
          tournament_id: tournamentId,
          bid_time: bidTimeNum,
        });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Bid timer configuration saved.",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save timer config.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Bid Timer Configuration
          </DialogTitle>
          <DialogDescription>
            Set auction bid duration for {tournamentName}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bidTime">Bid Time (seconds)</Label>
              <Input
                id="bidTime"
                type="number"
                min="5"
                max="120"
                value={bidTime}
                onChange={(e) => setBidTime(e.target.value)}
                placeholder="e.g., 10"
              />
              <p className="text-xs text-muted-foreground">
                Duration for each bid during auction (5-120 seconds)
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Configuration
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

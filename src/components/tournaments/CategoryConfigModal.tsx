import { useState, useEffect } from "react";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const CATEGORY_OPTIONS = [
  "Diamond A",
  "Diamond B",
  "Platinum A",
  "Platinum",
  "Gold",
  "Silver",
];

interface AuctionConfig {
  id: string;
  category: string;
  max_players: number;
  base_price: number;
}

interface CategoryConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentId: string;
  tournamentName: string;
}

export function CategoryConfigModal({
  open,
  onOpenChange,
  tournamentId,
  tournamentName,
}: CategoryConfigModalProps) {
  const [configs, setConfigs] = useState<AuctionConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [category, setCategory] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [basePrice, setBasePrice] = useState("");

  useEffect(() => {
    if (open) {
      fetchConfigs();
    }
  }, [open, tournamentId]);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("auction_config")
        .select("*")
        .eq("tournament_id", tournamentId)
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setConfigs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load category config.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCategory("");
    setMaxPlayers("");
    setBasePrice("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !maxPlayers || !basePrice) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from("auction_config")
          .update({
            category,
            max_players: parseInt(maxPlayers),
            base_price: parseFloat(basePrice),
          })
          .eq("id", editingId);

        if (error) throw error;
        toast({ title: "Success", description: "Category updated." });
      } else {
        // Create new
        const { error } = await supabase.from("auction_config").insert({
          tournament_id: tournamentId,
          category,
          max_players: parseInt(maxPlayers),
          base_price: parseFloat(basePrice),
        });

        if (error) throw error;
        toast({ title: "Success", description: "Category added." });
      }

      resetForm();
      fetchConfigs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save category.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (config: AuctionConfig) => {
    setCategory(config.category);
    setMaxPlayers(config.max_players.toString());
    setBasePrice(config.base_price.toString());
    setEditingId(config.id);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("auction_config")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Category deleted." });
      fetchConfigs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Category Configuration</DialogTitle>
          <DialogDescription>
            Manage auction categories for {tournamentName}
          </DialogDescription>
        </DialogHeader>

        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Max Players</Label>
              <Input
                type="number"
                min="1"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
                placeholder="e.g., 5"
              />
            </div>
            <div className="space-y-2">
              <Label>Base Price (₹)</Label>
              <Input
                type="number"
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="e.g., 5000"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingId ? "Update" : "Add"} Category
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* Config Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Max Players</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : configs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No categories configured yet.
                  </TableCell>
                </TableRow>
              ) : (
                configs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">{config.category}</TableCell>
                    <TableCell>{config.max_players}</TableCell>
                    <TableCell>₹{config.base_price.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(config)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(config.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

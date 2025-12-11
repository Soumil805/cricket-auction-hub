import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Trophy, Circle, Pencil, Trash2, Loader2 } from "lucide-react";
import { 
  Tournament, 
  getCategoryLabel, 
  getBallTypeLabel, 
  getStatusLabel, 
  getStatusColor 
} from "@/data/mockData";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TournamentCardProps {
  tournament: Tournament;
  onDelete?: () => void;
}

export function TournamentCard({ tournament, onDelete }: TournamentCardProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const isLive = tournament.status === 'live' || tournament.status === 'auction';
  const isOwner = user && tournament.organizer_id === user.id;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("tournaments")
        .delete()
        .eq("id", tournament.id);

      if (error) throw error;

      toast({
        title: "Tournament Deleted",
        description: `${tournament.name} has been deleted successfully.`,
      });

      onDelete?.();
    } catch (error: any) {
      console.error("Error deleting tournament:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete tournament.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Header with Logo and Status */}
      <div className="relative h-32 bg-gradient-primary flex items-center justify-center">
        <div className="absolute inset-0 cricket-pattern opacity-20" />
        <img
          src={tournament.logo_url || "/placeholder.svg"}
          alt={tournament.name}
          className="h-16 w-16 rounded-lg bg-card/90 p-2 object-contain relative z-10"
        />
        
        {/* Status Badge */}
        <Badge 
          className={`absolute top-3 right-3 ${getStatusColor(tournament.status)} ${isLive ? 'animate-pulse-live' : ''}`}
        >
          {isLive && <Circle className="h-2 w-2 mr-1 fill-current" />}
          {getStatusLabel(tournament.status)}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Tournament Name */}
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {tournament.name}
          </h3>
          {tournament.slogan && (
            <p className="text-sm text-muted-foreground italic line-clamp-1">
              "{tournament.slogan}"
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {getCategoryLabel(tournament.category)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {getBallTypeLabel(tournament.ball_type)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {tournament.overs} Overs
          </Badge>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>
              {format(new Date(tournament.start_date), 'MMM d')} - {format(new Date(tournament.end_date), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{tournament.ground.city}, {tournament.ground.state}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>{tournament.total_teams} Teams • {tournament.players_per_team} Players each</span>
          </div>
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
          <Trophy className="h-3 w-3" />
          <span>Organized by {tournament.organizer_name}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button asChild className="flex-1">
          <Link to={`/tournaments/${tournament.id}`}>
            View Details
          </Link>
        </Button>
        {isOwner && (
          <>
            <Button asChild variant="outline" size="icon">
              <Link to={`/tournaments/${tournament.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Tournament</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{tournament.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
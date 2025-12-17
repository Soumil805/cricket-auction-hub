import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Users, Settings, Timer, UserPlus, Vote, Eye, Play, Square } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CategoryConfigModal } from "./CategoryConfigModal";
import { BidTimerConfigModal } from "./BidTimerConfigModal";

interface TournamentActionMenuProps {
  tournamentId: string;
  tournamentName: string;
  numTeams: number;
  currentTeamsCount: number;
  isCaptainVoting: boolean;
  isVotingLive: boolean;
  onVotingToggle?: () => void;
}

export function TournamentActionMenu({
  tournamentId,
  tournamentName,
  numTeams,
  currentTeamsCount,
  isCaptainVoting,
  isVotingLive,
  onVotingToggle,
}: TournamentActionMenuProps) {
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [isTogglingVoting, setIsTogglingVoting] = useState(false);

  const hasAllTeams = currentTeamsCount >= numTeams;

  const handleToggleVoting = async () => {
    setIsTogglingVoting(true);
    try {
      const { error } = await supabase
        .from("tournaments")
        .update({ is_voting_live: !isVotingLive })
        .eq("id", tournamentId);

      if (error) throw error;

      toast({
        title: isVotingLive ? "Voting Stopped" : "Voting Started",
        description: isVotingLive
          ? "Captain voting has been stopped."
          : "Captain voting is now live!",
      });

      onVotingToggle?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle voting.",
        variant: "destructive",
      });
    } finally {
      setIsTogglingVoting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Create/View Teams */}
          <DropdownMenuItem asChild>
            <Link
              to={hasAllTeams ? `/tournaments/${tournamentId}/teams` : `/tournaments/${tournamentId}/teams/create`}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              {hasAllTeams ? "View Teams" : "Create Teams"}
            </Link>
          </DropdownMenuItem>

          {/* Category Config */}
          <DropdownMenuItem onClick={() => setCategoryModalOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Category Config
          </DropdownMenuItem>

          {/* Bid Timer Config */}
          <DropdownMenuItem onClick={() => setTimerModalOpen(true)}>
            <Timer className="h-4 w-4 mr-2" />
            Bid Timer Config
          </DropdownMenuItem>

          {/* Captain Voting Options - Only if enabled */}
          {isCaptainVoting && (
            <>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link
                  to={`/tournaments/${tournamentId}/captains/create`}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Create Captains
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleToggleVoting}
                disabled={isTogglingVoting}
              >
                {isVotingLive ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop Voting
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Voting
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  to={`/tournaments/${tournamentId}/captains/votes`}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  See Voting
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CategoryConfigModal
        open={categoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        tournamentId={tournamentId}
        tournamentName={tournamentName}
      />

      <BidTimerConfigModal
        open={timerModalOpen}
        onOpenChange={setTimerModalOpen}
        tournamentId={tournamentId}
        tournamentName={tournamentName}
      />
    </>
  );
}

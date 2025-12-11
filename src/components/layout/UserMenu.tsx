import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Trophy, UserPlus, Shield, Gavel, MapPin } from "lucide-react";

export function UserMenu() {
  const { user, isPlayer, isOrganizer, isUmpire, isGroundOwner, signOut } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/auth">
            <User className="h-4 w-4 mr-2" />
            Login
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/auth">Register</Link>
        </Button>
      </div>
    );
  }

  const initials = user.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {isPlayer && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  Player
                </span>
              )}
              {isOrganizer && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-accent/20 text-accent">
                  Organizer
                </span>
              )}
              {isUmpire && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-success/20 text-success">
                  Umpire
                </span>
              )}
              {isGroundOwner && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-secondary/50 text-secondary-foreground">
                  Ground Owner
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {!isPlayer && (
          <DropdownMenuItem asChild>
            <Link to="/register" className="cursor-pointer">
              <UserPlus className="mr-2 h-4 w-4" />
              Register as Player
            </Link>
          </DropdownMenuItem>
        )}
        
        {!isOrganizer && (
          <DropdownMenuItem asChild>
            <Link to="/become-organizer" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              Become an Organizer
            </Link>
          </DropdownMenuItem>
        )}

        {!isUmpire && (
          <DropdownMenuItem asChild>
            <Link to="/register-umpire" className="cursor-pointer">
              <Gavel className="mr-2 h-4 w-4" />
              Register as Umpire
            </Link>
          </DropdownMenuItem>
        )}

        {!isGroundOwner && (
          <DropdownMenuItem asChild>
            <Link to="/register-ground-owner" className="cursor-pointer">
              <MapPin className="mr-2 h-4 w-4" />
              Register as Ground Owner
            </Link>
          </DropdownMenuItem>
        )}
        
        {isOrganizer && (
          <DropdownMenuItem asChild>
            <Link to="/tournaments/new" className="cursor-pointer">
              <Trophy className="mr-2 h-4 w-4" />
              Create Tournament
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

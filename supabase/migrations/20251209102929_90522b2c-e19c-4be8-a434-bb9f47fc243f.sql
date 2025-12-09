-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('player', 'organizer', 'admin');

-- Create enum for player types
CREATE TYPE public.player_type AS ENUM ('batsman', 'bowler', 'all_rounder', 'wicket_keeper');

-- Create enum for batting styles
CREATE TYPE public.batting_style AS ENUM ('right_handed', 'left_handed');

-- Create enum for bowling styles  
CREATE TYPE public.bowling_style AS ENUM ('right_arm_fast', 'left_arm_fast', 'right_arm_medium', 'left_arm_medium', 'right_arm_spin', 'left_arm_spin', 'none');

-- Create enum for player categories
CREATE TYPE public.player_category AS ENUM ('a_plus', 'a', 'b', 'c');

-- Create enum for tournament status
CREATE TYPE public.tournament_status AS ENUM ('draft', 'registration_open', 'registration_closed', 'auction_scheduled', 'auction_live', 'auction_complete', 'in_progress', 'completed', 'cancelled');

-- Create enum for gender
CREATE TYPE public.gender AS ENUM ('male', 'female', 'other');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  mobile TEXT,
  gender public.gender,
  date_of_birth DATE,
  state TEXT,
  city TEXT,
  address TEXT,
  pincode TEXT,
  avatar_url TEXT,
  -- Player specific fields
  player_type public.player_type,
  batting_style public.batting_style,
  bowling_style public.bowling_style,
  player_category public.player_category,
  bio TEXT,
  is_player_registered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create grounds/venues table
CREATE TABLE public.grounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tournaments table
CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  slogan TEXT,
  description TEXT,
  logo_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  -- Tournament settings
  category TEXT NOT NULL,
  ball_type TEXT NOT NULL,
  pitch_type TEXT NOT NULL,
  match_type TEXT NOT NULL,
  overs INTEGER NOT NULL,
  -- Team settings
  number_of_teams INTEGER NOT NULL,
  players_per_team INTEGER NOT NULL,
  team_budget DECIMAL(12,2) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  captain_voting_enabled BOOLEAN DEFAULT FALSE,
  max_votes_per_player INTEGER,
  -- Venue
  ground_id UUID REFERENCES public.grounds(id),
  venue_name TEXT,
  venue_state TEXT,
  venue_city TEXT,
  venue_address TEXT,
  venue_pincode TEXT,
  -- Payment
  entry_fee DECIMAL(10,2) DEFAULT 0,
  payment_instructions TEXT,
  payment_qr_url TEXT,
  -- Status
  status public.tournament_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tournament applications (players applying to tournaments)
CREATE TABLE public.tournament_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_proof_url TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  UNIQUE (tournament_id, player_id)
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  owner_id UUID REFERENCES auth.users(id),
  captain_id UUID REFERENCES auth.users(id),
  budget_remaining DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create team_players (auction results)
CREATE TABLE public.team_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sold_price DECIMAL(10,2) NOT NULL,
  is_captain BOOLEAN DEFAULT FALSE,
  sold_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (team_id, player_id)
);

-- Create auction_bids table for bid history
CREATE TABLE public.auction_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  bid_amount DECIMAL(10,2) NOT NULL,
  bid_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grounds_updated_at
  BEFORE UPDATE ON public.grounds
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Profiles: Users can view any profile, but only update their own
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User Roles: Users can view their own roles, admins can manage all
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Grounds: Viewable by all, manageable by organizers
CREATE POLICY "Grounds are viewable by everyone"
  ON public.grounds FOR SELECT
  USING (true);

CREATE POLICY "Organizers can create grounds"
  ON public.grounds FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'organizer'));

CREATE POLICY "Organizers can update their grounds"
  ON public.grounds FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Tournaments: Viewable by all, manageable by organizers
CREATE POLICY "Tournaments are viewable by everyone"
  ON public.tournaments FOR SELECT
  USING (true);

CREATE POLICY "Organizers can create tournaments"
  ON public.tournaments FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'organizer') AND auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their tournaments"
  ON public.tournaments FOR UPDATE
  TO authenticated
  USING (organizer_id = auth.uid());

CREATE POLICY "Organizers can delete their tournaments"
  ON public.tournaments FOR DELETE
  TO authenticated
  USING (organizer_id = auth.uid());

-- Tournament Applications: Players can apply, organizers can manage
CREATE POLICY "Players can view their applications"
  ON public.tournament_applications FOR SELECT
  TO authenticated
  USING (player_id = auth.uid());

CREATE POLICY "Organizers can view applications for their tournaments"
  ON public.tournament_applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tournaments t 
      WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Players can apply to tournaments"
  ON public.tournament_applications FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'player') AND auth.uid() = player_id);

CREATE POLICY "Organizers can update applications"
  ON public.tournament_applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tournaments t 
      WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
    )
  );

-- Teams: Viewable by all in a tournament
CREATE POLICY "Teams are viewable by everyone"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Organizers can manage teams"
  ON public.teams FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tournaments t 
      WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
    )
  );

-- Team Players: Viewable by all
CREATE POLICY "Team players are viewable by everyone"
  ON public.team_players FOR SELECT
  USING (true);

CREATE POLICY "Organizers can manage team players"
  ON public.team_players FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.teams tm
      JOIN public.tournaments t ON t.id = tm.tournament_id
      WHERE tm.id = team_id AND t.organizer_id = auth.uid()
    )
  );

-- Auction Bids: Viewable by tournament participants
CREATE POLICY "Auction bids are viewable by everyone"
  ON public.auction_bids FOR SELECT
  USING (true);

CREATE POLICY "Team owners can place bids"
  ON public.auction_bids FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teams tm
      WHERE tm.id = team_id AND tm.owner_id = auth.uid()
    )
  );
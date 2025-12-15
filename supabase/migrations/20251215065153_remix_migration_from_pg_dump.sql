CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'player',
    'organizer',
    'admin',
    'umpire',
    'ground_owner'
);


--
-- Name: batting_style; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.batting_style AS ENUM (
    'right_handed',
    'left_handed'
);


--
-- Name: bowling_style; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.bowling_style AS ENUM (
    'right_arm_fast',
    'left_arm_fast',
    'right_arm_medium',
    'left_arm_medium',
    'right_arm_spin',
    'left_arm_spin',
    'none'
);


--
-- Name: gender; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.gender AS ENUM (
    'male',
    'female',
    'other'
);


--
-- Name: player_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.player_category AS ENUM (
    'a_plus',
    'a',
    'b',
    'c'
);


--
-- Name: player_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.player_type AS ENUM (
    'batsman',
    'bowler',
    'all_rounder',
    'wicket_keeper'
);


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: auction_bids; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auction_bids (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tournament_id uuid NOT NULL,
    player_id uuid NOT NULL,
    team_id uuid NOT NULL,
    bid_amount numeric(10,2) NOT NULL,
    bid_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: grounds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grounds (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    address text,
    state text NOT NULL,
    city text NOT NULL,
    pincode text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    full_name text,
    mobile text,
    gender public.gender,
    date_of_birth date,
    state text,
    city text,
    address text,
    pincode text,
    avatar_url text,
    player_type public.player_type,
    batting_style public.batting_style,
    bowling_style public.bowling_style,
    player_category public.player_category,
    bio text,
    is_player_registered boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: team_players; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_players (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    team_id uuid NOT NULL,
    player_id uuid NOT NULL,
    sold_price numeric(10,2) NOT NULL,
    is_captain boolean DEFAULT false,
    sold_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teams (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tournament_id uuid NOT NULL,
    name text NOT NULL,
    logo_url text,
    owner_id uuid,
    captain_id uuid,
    budget_remaining numeric(12,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tournament_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tournament_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tournament_id uuid NOT NULL,
    player_id uuid NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    payment_proof_url text,
    applied_at timestamp with time zone DEFAULT now() NOT NULL,
    reviewed_at timestamp with time zone
);


--
-- Name: tournaments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tournaments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organizer_id uuid NOT NULL,
    name text NOT NULL,
    slogan text,
    description text,
    logo_url text,
    start_date date NOT NULL,
    end_date date NOT NULL,
    category text NOT NULL,
    ball_type text NOT NULL,
    pitch_type text NOT NULL,
    match_type text NOT NULL,
    overs integer NOT NULL,
    number_of_teams integer NOT NULL,
    players_per_team integer NOT NULL,
    team_budget numeric(12,2) NOT NULL,
    base_price numeric(10,2) NOT NULL,
    captain_voting_enabled boolean DEFAULT false,
    max_votes_per_player integer,
    ground_id uuid,
    venue_name text,
    venue_state text,
    venue_city text,
    venue_address text,
    venue_pincode text,
    entry_fee numeric(10,2) DEFAULT 0,
    payment_instructions text,
    payment_qr_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    organizer_name text,
    organizer_mobile text,
    is_active boolean DEFAULT true,
    is_auction_live boolean DEFAULT false,
    is_voting_live boolean DEFAULT false
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: auction_bids auction_bids_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auction_bids
    ADD CONSTRAINT auction_bids_pkey PRIMARY KEY (id);


--
-- Name: grounds grounds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grounds
    ADD CONSTRAINT grounds_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: team_players team_players_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_players
    ADD CONSTRAINT team_players_pkey PRIMARY KEY (id);


--
-- Name: team_players team_players_team_id_player_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_players
    ADD CONSTRAINT team_players_team_id_player_id_key UNIQUE (team_id, player_id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: tournament_applications tournament_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament_applications
    ADD CONSTRAINT tournament_applications_pkey PRIMARY KEY (id);


--
-- Name: tournament_applications tournament_applications_tournament_id_player_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament_applications
    ADD CONSTRAINT tournament_applications_tournament_id_player_id_key UNIQUE (tournament_id, player_id);


--
-- Name: tournaments tournaments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: grounds update_grounds_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_grounds_updated_at BEFORE UPDATE ON public.grounds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: teams update_teams_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tournaments update_tournaments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: auction_bids auction_bids_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auction_bids
    ADD CONSTRAINT auction_bids_player_id_fkey FOREIGN KEY (player_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: auction_bids auction_bids_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auction_bids
    ADD CONSTRAINT auction_bids_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: auction_bids auction_bids_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auction_bids
    ADD CONSTRAINT auction_bids_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;


--
-- Name: grounds grounds_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grounds
    ADD CONSTRAINT grounds_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: team_players team_players_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_players
    ADD CONSTRAINT team_players_player_id_fkey FOREIGN KEY (player_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: team_players team_players_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_players
    ADD CONSTRAINT team_players_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
-- Name: teams teams_captain_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_captain_id_fkey FOREIGN KEY (captain_id) REFERENCES auth.users(id);


--
-- Name: teams teams_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id);


--
-- Name: teams teams_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;


--
-- Name: tournament_applications tournament_applications_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament_applications
    ADD CONSTRAINT tournament_applications_player_id_fkey FOREIGN KEY (player_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tournament_applications tournament_applications_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament_applications
    ADD CONSTRAINT tournament_applications_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;


--
-- Name: tournaments tournaments_ground_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_ground_id_fkey FOREIGN KEY (ground_id) REFERENCES public.grounds(id);


--
-- Name: tournaments tournaments_organizer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES auth.users(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: auction_bids Auction bids are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Auction bids are viewable by everyone" ON public.auction_bids FOR SELECT USING (true);


--
-- Name: grounds Grounds are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Grounds are viewable by everyone" ON public.grounds FOR SELECT USING (true);


--
-- Name: grounds Organizers can create grounds; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizers can create grounds" ON public.grounds FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'organizer'::public.app_role));


--
-- Name: tournaments Organizers can create tournaments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizers can create tournaments" ON public.tournaments FOR INSERT TO authenticated WITH CHECK ((public.has_role(auth.uid(), 'organizer'::public.app_role) AND (auth.uid() = organizer_id)));


--
-- Name: tournaments Organizers can delete their tournaments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizers can delete their tournaments" ON public.tournaments FOR DELETE TO authenticated USING ((organizer_id = auth.uid()));


--
-- Name: team_players Organizers can manage team players; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizers can manage team players" ON public.team_players TO authenticated USING ((EXISTS ( SELECT 1
   FROM (public.teams tm
     JOIN public.tournaments t ON ((t.id = tm.tournament_id)))
  WHERE ((tm.id = team_players.team_id) AND (t.organizer_id = auth.uid())))));


--
-- Name: teams Organizers can manage teams; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizers can manage teams" ON public.teams TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.tournaments t
  WHERE ((t.id = teams.tournament_id) AND (t.organizer_id = auth.uid())))));


--
-- Name: tournament_applications Organizers can update applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizers can update applications" ON public.tournament_applications FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.tournaments t
  WHERE ((t.id = tournament_applications.tournament_id) AND (t.organizer_id = auth.uid())))));


--
-- Name: grounds Organizers can update their grounds; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizers can update their grounds" ON public.grounds FOR UPDATE TO authenticated USING ((created_by = auth.uid()));


--
-- Name: tournaments Organizers can update their tournaments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizers can update their tournaments" ON public.tournaments FOR UPDATE TO authenticated USING ((organizer_id = auth.uid()));


--
-- Name: tournament_applications Organizers can view applications for their tournaments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizers can view applications for their tournaments" ON public.tournament_applications FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.tournaments t
  WHERE ((t.id = tournament_applications.tournament_id) AND (t.organizer_id = auth.uid())))));


--
-- Name: tournament_applications Players can apply to tournaments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can apply to tournaments" ON public.tournament_applications FOR INSERT TO authenticated WITH CHECK ((public.has_role(auth.uid(), 'player'::public.app_role) AND (auth.uid() = player_id)));


--
-- Name: tournament_applications Players can view their applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Players can view their applications" ON public.tournament_applications FOR SELECT TO authenticated USING ((player_id = auth.uid()));


--
-- Name: profiles Profiles are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);


--
-- Name: auction_bids Team owners can place bids; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Team owners can place bids" ON public.auction_bids FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.teams tm
  WHERE ((tm.id = auction_bids.team_id) AND (tm.owner_id = auth.uid())))));


--
-- Name: team_players Team players are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Team players are viewable by everyone" ON public.team_players FOR SELECT USING (true);


--
-- Name: teams Teams are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Teams are viewable by everyone" ON public.teams FOR SELECT USING (true);


--
-- Name: tournaments Tournaments are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Tournaments are viewable by everyone" ON public.tournaments FOR SELECT USING (true);


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_roles Users can insert their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: auction_bids; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;

--
-- Name: grounds; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.grounds ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: team_players; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.team_players ENABLE ROW LEVEL SECURITY;

--
-- Name: teams; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

--
-- Name: tournament_applications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tournament_applications ENABLE ROW LEVEL SECURITY;

--
-- Name: tournaments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--



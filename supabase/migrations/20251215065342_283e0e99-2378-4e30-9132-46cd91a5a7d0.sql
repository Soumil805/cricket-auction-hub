-- Create tournament_type enum
CREATE TYPE public.tournament_type AS ENUM ('Normal', 'Auction', 'Auction with Voting');

-- Add tournament_type column to tournaments table
ALTER TABLE public.tournaments 
ADD COLUMN tournament_type public.tournament_type NOT NULL DEFAULT 'Normal';

-- Update existing tournaments based on their current settings
UPDATE public.tournaments 
SET tournament_type = CASE 
  WHEN captain_voting_enabled = true THEN 'Auction with Voting'::public.tournament_type
  ELSE 'Auction'::public.tournament_type
END;
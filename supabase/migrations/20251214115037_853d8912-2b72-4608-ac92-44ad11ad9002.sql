-- Add new columns per user's schema requirements
ALTER TABLE public.tournaments 
ADD COLUMN IF NOT EXISTS organizer_name TEXT,
ADD COLUMN IF NOT EXISTS organizer_mobile TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS is_auction_live BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_voting_live BOOLEAN DEFAULT FALSE;

-- Update existing tournaments to be active (so they appear)
UPDATE public.tournaments SET is_active = TRUE WHERE is_active IS NULL;

-- Drop the status column and enum (as requested)
ALTER TABLE public.tournaments DROP COLUMN IF EXISTS status;

-- Drop the tournament_status enum type
DROP TYPE IF EXISTS public.tournament_status;
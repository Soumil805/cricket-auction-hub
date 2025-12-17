-- Create auction_config table for category configuration
CREATE TABLE public.auction_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  max_players INTEGER NOT NULL DEFAULT 1,
  base_price NUMERIC NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create auction_timer table for bid duration settings
CREATE TABLE public.auction_timer (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE UNIQUE,
  bid_time INTEGER NOT NULL DEFAULT 10,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create tournament_captain table for captain voting
CREATE TABLE public.tournament_captain (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  photo_url TEXT,
  votes INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on all new tables
ALTER TABLE public.auction_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_timer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_captain ENABLE ROW LEVEL SECURITY;

-- RLS policies for auction_config
CREATE POLICY "Auction config viewable by everyone"
ON public.auction_config FOR SELECT
USING (true);

CREATE POLICY "Organizers can manage auction config"
ON public.auction_config FOR ALL
USING (EXISTS (
  SELECT 1 FROM tournaments t
  WHERE t.id = auction_config.tournament_id
  AND t.organizer_id = auth.uid()
));

-- RLS policies for auction_timer
CREATE POLICY "Auction timer viewable by everyone"
ON public.auction_timer FOR SELECT
USING (true);

CREATE POLICY "Organizers can manage auction timer"
ON public.auction_timer FOR ALL
USING (EXISTS (
  SELECT 1 FROM tournaments t
  WHERE t.id = auction_timer.tournament_id
  AND t.organizer_id = auth.uid()
));

-- RLS policies for tournament_captain
CREATE POLICY "Tournament captains viewable by everyone"
ON public.tournament_captain FOR SELECT
USING (true);

CREATE POLICY "Organizers can manage tournament captains"
ON public.tournament_captain FOR ALL
USING (EXISTS (
  SELECT 1 FROM tournaments t
  WHERE t.id = tournament_captain.tournament_id
  AND t.organizer_id = auth.uid()
));

-- Add triggers for updated_at
CREATE TRIGGER update_auction_config_updated_at
BEFORE UPDATE ON public.auction_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_auction_timer_updated_at
BEFORE UPDATE ON public.auction_timer
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
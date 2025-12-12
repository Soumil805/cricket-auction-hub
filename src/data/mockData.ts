// Mock data matching the Flask backend structure

export type TournamentCategory = 'open' | 'corporate' | 'school' | 'college' | 'society' | 'locality';
export type BallType = 'tennis' | 'leather' | 'tennis-tape' | 'leather-white';
export type PitchType = 'turf' | 'cement' | 'matting' | 'synthetic' | 'grass';
export type MatchType = 'limited-overs' | 't20' | 't10' | 'test';
export type TournamentStatus = 'draft' | 'registration' | 'auction' | 'live' | 'completed';

// Database status enum values
export type DbTournamentStatus = 
  | 'draft' 
  | 'registration_open' 
  | 'registration_closed' 
  | 'auction_scheduled' 
  | 'auction_live' 
  | 'auction_complete' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface Ground {
  id: string;
  name: string;
  logo_url?: string;
  country: string;
  state: string;
  city: string;
  address: string;
  pincode: string;
}

export interface Tournament {
  id: string;
  organizer_id: string;
  organizer_name: string;
  name: string;
  slogan?: string;
  logo_url?: string;
  start_date: string;
  end_date: string;
  category: TournamentCategory;
  ball_type: BallType;
  pitch_type: PitchType;
  match_type: MatchType;
  overs: number;
  total_teams: number;
  players_per_team: number;
  max_player_bids: number;
  status: TournamentStatus;
  is_public: boolean;
  ground: Ground;
  teams_count?: number;
  players_count?: number;
}

export interface Stats {
  totalPlayers: number;
  activeTournaments: number;
  liveAuctions: number;
  totalTeams: number;
}

// Mock Grounds (Indian venues)
export const mockGrounds: Ground[] = [
  {
    id: "1",
    name: "Wankhede Stadium",
    logo_url: "/placeholder.svg",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    address: "D Road, Churchgate",
    pincode: "400020"
  },
  {
    id: "2",
    name: "M. Chinnaswamy Stadium",
    logo_url: "/placeholder.svg",
    country: "India",
    state: "Karnataka",
    city: "Bengaluru",
    address: "MG Road, Bengaluru",
    pincode: "560001"
  },
  {
    id: "3",
    name: "Eden Gardens",
    logo_url: "/placeholder.svg",
    country: "India",
    state: "West Bengal",
    city: "Kolkata",
    address: "BBD Bagh, Kolkata",
    pincode: "700021"
  },
  {
    id: "4",
    name: "Feroz Shah Kotla",
    logo_url: "/placeholder.svg",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    address: "Bahadur Shah Zafar Marg",
    pincode: "110002"
  },
  {
    id: "5",
    name: "Narendra Modi Stadium",
    logo_url: "/placeholder.svg",
    country: "India",
    state: "Gujarat",
    city: "Ahmedabad",
    address: "Motera, Ahmedabad",
    pincode: "380005"
  },
];

// Mock Tournaments
export const mockTournaments: Tournament[] = [
  {
    id: "1",
    organizer_id: "user1",
    organizer_name: "Rajesh Kumar",
    name: "Mumbai Premier League 2024",
    slogan: "Cricket ka Maha Muqabala",
    logo_url: "/placeholder.svg",
    start_date: "2024-03-15",
    end_date: "2024-04-15",
    category: "open",
    ball_type: "leather",
    pitch_type: "turf",
    match_type: "t20",
    overs: 20,
    total_teams: 8,
    players_per_team: 15,
    max_player_bids: 3,
    status: "registration",
    is_public: true,
    ground: mockGrounds[0],
    teams_count: 6,
    players_count: 120
  },
  {
    id: "2",
    organizer_id: "user2",
    organizer_name: "Priya Sharma",
    name: "TechCorp Cricket Championship",
    slogan: "Where Code Meets Cricket",
    logo_url: "/placeholder.svg",
    start_date: "2024-03-20",
    end_date: "2024-04-10",
    category: "corporate",
    ball_type: "tennis",
    pitch_type: "cement",
    match_type: "t20",
    overs: 20,
    total_teams: 6,
    players_per_team: 11,
    max_player_bids: 2,
    status: "auction",
    is_public: true,
    ground: mockGrounds[1],
    teams_count: 6,
    players_count: 66
  },
  {
    id: "3",
    organizer_id: "user3",
    organizer_name: "Amit Patel",
    name: "Gujarat School Trophy",
    slogan: "Nurturing Future Champions",
    logo_url: "/placeholder.svg",
    start_date: "2024-04-01",
    end_date: "2024-04-20",
    category: "school",
    ball_type: "tennis",
    pitch_type: "matting",
    match_type: "limited-overs",
    overs: 25,
    total_teams: 12,
    players_per_team: 13,
    max_player_bids: 2,
    status: "registration",
    is_public: true,
    ground: mockGrounds[4],
    teams_count: 8,
    players_count: 104
  },
  {
    id: "4",
    organizer_id: "user4",
    organizer_name: "Vikram Singh",
    name: "Delhi University Premier League",
    slogan: "Battle of Champions",
    logo_url: "/placeholder.svg",
    start_date: "2024-03-10",
    end_date: "2024-03-25",
    category: "college",
    ball_type: "leather",
    pitch_type: "turf",
    match_type: "t20",
    overs: 20,
    total_teams: 10,
    players_per_team: 15,
    max_player_bids: 3,
    status: "live",
    is_public: true,
    ground: mockGrounds[3],
    teams_count: 10,
    players_count: 150
  },
  {
    id: "5",
    organizer_id: "user5",
    organizer_name: "Suresh Menon",
    name: "Kolkata Night Riders Cup",
    slogan: "Under the Lights",
    logo_url: "/placeholder.svg",
    start_date: "2024-02-01",
    end_date: "2024-02-20",
    category: "open",
    ball_type: "leather-white",
    pitch_type: "grass",
    match_type: "t20",
    overs: 20,
    total_teams: 8,
    players_per_team: 15,
    max_player_bids: 3,
    status: "completed",
    is_public: true,
    ground: mockGrounds[2],
    teams_count: 8,
    players_count: 120
  },
  {
    id: "6",
    organizer_id: "user6",
    organizer_name: "Neha Kapoor",
    name: "Harmony Society T10 Blast",
    slogan: "Quick Fire Cricket",
    logo_url: "/placeholder.svg",
    start_date: "2024-04-05",
    end_date: "2024-04-08",
    category: "society",
    ball_type: "tennis-tape",
    pitch_type: "cement",
    match_type: "t10",
    overs: 10,
    total_teams: 4,
    players_per_team: 11,
    max_player_bids: 2,
    status: "registration",
    is_public: true,
    ground: mockGrounds[0],
    teams_count: 2,
    players_count: 30
  },
];

// Mock Stats
export const mockStats: Stats = {
  totalPlayers: 590,
  activeTournaments: 5,
  liveAuctions: 1,
  totalTeams: 40
};

// Helper functions - accept string to handle both mock and DB types
export const getCategoryLabel = (category: TournamentCategory | string): string => {
  const labels: Record<string, string> = {
    'open': 'Open',
    'corporate': 'Corporate',
    'school': 'School',
    'college': 'College',
    'society': 'Society',
    'locality': 'Locality'
  };
  return labels[category] || category;
};

export const getBallTypeLabel = (ballType: BallType | string): string => {
  const labels: Record<string, string> = {
    'tennis': 'Tennis Ball',
    'leather': 'Leather Ball',
    'tennis-tape': 'Tennis Tape Ball',
    'leather-white': 'White Leather'
  };
  return labels[ballType] || ballType;
};

export const getPitchTypeLabel = (pitchType: PitchType | string): string => {
  const labels: Record<string, string> = {
    'turf': 'Turf',
    'cement': 'Cement',
    'matting': 'Matting',
    'synthetic': 'Synthetic',
    'grass': 'Grass'
  };
  return labels[pitchType] || pitchType;
};

export const getMatchTypeLabel = (matchType: MatchType | string): string => {
  const labels: Record<string, string> = {
    'limited-overs': 'Limited Overs',
    't20': 'T20',
    't10': 'T10',
    'test': 'Test Match'
  };
  return labels[matchType] || matchType;
};

export const getStatusLabel = (status: TournamentStatus | DbTournamentStatus | string): string => {
  const labels: Record<string, string> = {
    'draft': 'Draft',
    'registration': 'Registration Open',
    'registration_open': 'Registration Open',
    'registration_closed': 'Registration Closed',
    'auction': 'Auction Phase',
    'auction_scheduled': 'Auction Scheduled',
    'auction_live': 'Auction Live',
    'auction_complete': 'Auction Complete',
    'live': 'Live',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  return labels[status] || status;
};

export const getStatusColor = (status: TournamentStatus | DbTournamentStatus | string): string => {
  const colors: Record<string, string> = {
    'draft': 'bg-muted text-muted-foreground',
    'registration': 'bg-success text-success-foreground',
    'registration_open': 'bg-success text-success-foreground',
    'registration_closed': 'bg-warning text-warning-foreground',
    'auction': 'bg-accent text-accent-foreground',
    'auction_scheduled': 'bg-accent text-accent-foreground',
    'auction_live': 'bg-live text-live-foreground',
    'auction_complete': 'bg-secondary text-secondary-foreground',
    'live': 'bg-live text-live-foreground',
    'in_progress': 'bg-live text-live-foreground',
    'completed': 'bg-secondary text-secondary-foreground',
    'cancelled': 'bg-destructive text-destructive-foreground'
  };
  return colors[status] || 'bg-muted text-muted-foreground';
};

// Check if status is live-like (for UI effects)
export const isLiveStatus = (status: string): boolean => {
  return ['auction_live', 'in_progress', 'live', 'auction'].includes(status);
};

// Check if registration is open
export const canApplyToTournament = (status: string): boolean => {
  return ['registration', 'registration_open'].includes(status);
};

// Check if auction is happening
export const isAuctionStatus = (status: string): boolean => {
  return ['auction', 'auction_live'].includes(status);
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      auction_bids: {
        Row: {
          bid_amount: number
          bid_at: string
          id: string
          player_id: string
          team_id: string
          tournament_id: string
        }
        Insert: {
          bid_amount: number
          bid_at?: string
          id?: string
          player_id: string
          team_id: string
          tournament_id: string
        }
        Update: {
          bid_amount?: number
          bid_at?: string
          id?: string
          player_id?: string
          team_id?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_bids_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      grounds: {
        Row: {
          address: string | null
          city: string
          created_at: string
          created_by: string | null
          id: string
          name: string
          pincode: string | null
          state: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          city: string
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          pincode?: string | null
          state: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          pincode?: string | null
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          batting_style: Database["public"]["Enums"]["batting_style"] | null
          bio: string | null
          bowling_style: Database["public"]["Enums"]["bowling_style"] | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          is_player_registered: boolean | null
          mobile: string | null
          pincode: string | null
          player_category: Database["public"]["Enums"]["player_category"] | null
          player_type: Database["public"]["Enums"]["player_type"] | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          batting_style?: Database["public"]["Enums"]["batting_style"] | null
          bio?: string | null
          bowling_style?: Database["public"]["Enums"]["bowling_style"] | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          is_player_registered?: boolean | null
          mobile?: string | null
          pincode?: string | null
          player_category?:
            | Database["public"]["Enums"]["player_category"]
            | null
          player_type?: Database["public"]["Enums"]["player_type"] | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          batting_style?: Database["public"]["Enums"]["batting_style"] | null
          bio?: string | null
          bowling_style?: Database["public"]["Enums"]["bowling_style"] | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          is_player_registered?: boolean | null
          mobile?: string | null
          pincode?: string | null
          player_category?:
            | Database["public"]["Enums"]["player_category"]
            | null
          player_type?: Database["public"]["Enums"]["player_type"] | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_players: {
        Row: {
          id: string
          is_captain: boolean | null
          player_id: string
          sold_at: string
          sold_price: number
          team_id: string
        }
        Insert: {
          id?: string
          is_captain?: boolean | null
          player_id: string
          sold_at?: string
          sold_price: number
          team_id: string
        }
        Update: {
          id?: string
          is_captain?: boolean | null
          player_id?: string
          sold_at?: string
          sold_price?: number
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          budget_remaining: number
          captain_id: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          owner_id: string | null
          tournament_id: string
          updated_at: string
        }
        Insert: {
          budget_remaining: number
          captain_id?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          owner_id?: string | null
          tournament_id: string
          updated_at?: string
        }
        Update: {
          budget_remaining?: number
          captain_id?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          tournament_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_applications: {
        Row: {
          applied_at: string
          id: string
          payment_proof_url: string | null
          player_id: string
          reviewed_at: string | null
          status: string
          tournament_id: string
        }
        Insert: {
          applied_at?: string
          id?: string
          payment_proof_url?: string | null
          player_id: string
          reviewed_at?: string | null
          status?: string
          tournament_id: string
        }
        Update: {
          applied_at?: string
          id?: string
          payment_proof_url?: string | null
          player_id?: string
          reviewed_at?: string | null
          status?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_applications_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          ball_type: string
          base_price: number
          captain_voting_enabled: boolean | null
          category: string
          created_at: string
          description: string | null
          end_date: string
          entry_fee: number | null
          ground_id: string | null
          id: string
          logo_url: string | null
          match_type: string
          max_votes_per_player: number | null
          name: string
          number_of_teams: number
          organizer_id: string
          overs: number
          payment_instructions: string | null
          payment_qr_url: string | null
          pitch_type: string
          players_per_team: number
          slogan: string | null
          start_date: string
          status: Database["public"]["Enums"]["tournament_status"]
          team_budget: number
          updated_at: string
          venue_address: string | null
          venue_city: string | null
          venue_name: string | null
          venue_pincode: string | null
          venue_state: string | null
        }
        Insert: {
          ball_type: string
          base_price: number
          captain_voting_enabled?: boolean | null
          category: string
          created_at?: string
          description?: string | null
          end_date: string
          entry_fee?: number | null
          ground_id?: string | null
          id?: string
          logo_url?: string | null
          match_type: string
          max_votes_per_player?: number | null
          name: string
          number_of_teams: number
          organizer_id: string
          overs: number
          payment_instructions?: string | null
          payment_qr_url?: string | null
          pitch_type: string
          players_per_team: number
          slogan?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["tournament_status"]
          team_budget: number
          updated_at?: string
          venue_address?: string | null
          venue_city?: string | null
          venue_name?: string | null
          venue_pincode?: string | null
          venue_state?: string | null
        }
        Update: {
          ball_type?: string
          base_price?: number
          captain_voting_enabled?: boolean | null
          category?: string
          created_at?: string
          description?: string | null
          end_date?: string
          entry_fee?: number | null
          ground_id?: string | null
          id?: string
          logo_url?: string | null
          match_type?: string
          max_votes_per_player?: number | null
          name?: string
          number_of_teams?: number
          organizer_id?: string
          overs?: number
          payment_instructions?: string | null
          payment_qr_url?: string | null
          pitch_type?: string
          players_per_team?: number
          slogan?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["tournament_status"]
          team_budget?: number
          updated_at?: string
          venue_address?: string | null
          venue_city?: string | null
          venue_name?: string | null
          venue_pincode?: string | null
          venue_state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_ground_id_fkey"
            columns: ["ground_id"]
            isOneToOne: false
            referencedRelation: "grounds"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "player" | "organizer" | "admin" | "umpire" | "ground_owner"
      batting_style: "right_handed" | "left_handed"
      bowling_style:
        | "right_arm_fast"
        | "left_arm_fast"
        | "right_arm_medium"
        | "left_arm_medium"
        | "right_arm_spin"
        | "left_arm_spin"
        | "none"
      gender: "male" | "female" | "other"
      player_category: "a_plus" | "a" | "b" | "c"
      player_type: "batsman" | "bowler" | "all_rounder" | "wicket_keeper"
      tournament_status:
        | "draft"
        | "registration_open"
        | "registration_closed"
        | "auction_scheduled"
        | "auction_live"
        | "auction_complete"
        | "in_progress"
        | "completed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["player", "organizer", "admin", "umpire", "ground_owner"],
      batting_style: ["right_handed", "left_handed"],
      bowling_style: [
        "right_arm_fast",
        "left_arm_fast",
        "right_arm_medium",
        "left_arm_medium",
        "right_arm_spin",
        "left_arm_spin",
        "none",
      ],
      gender: ["male", "female", "other"],
      player_category: ["a_plus", "a", "b", "c"],
      player_type: ["batsman", "bowler", "all_rounder", "wicket_keeper"],
      tournament_status: [
        "draft",
        "registration_open",
        "registration_closed",
        "auction_scheduled",
        "auction_live",
        "auction_complete",
        "in_progress",
        "completed",
        "cancelled",
      ],
    },
  },
} as const

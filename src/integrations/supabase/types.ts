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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applicant_name: string
          created_at: string
          description: string | null
          email: string
          id: string
          phone: string | null
          program: string
          review_notes: string | null
          reviewed_at: string | null
          startup_name: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          applicant_name: string
          created_at?: string
          description?: string | null
          email: string
          id?: string
          phone?: string | null
          program: string
          review_notes?: string | null
          reviewed_at?: string | null
          startup_name?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          applicant_name?: string
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          phone?: string | null
          program?: string
          review_notes?: string | null
          reviewed_at?: string | null
          startup_name?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          published_at: string | null
          read_time_minutes: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          published_at?: string | null
          read_time_minutes?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          published_at?: string | null
          read_time_minutes?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cofounder_requests: {
        Row: {
          commitment: string | null
          contact_email: string | null
          created_at: string
          description: string | null
          equity_offered: string | null
          id: string
          location: string | null
          skills_needed: string | null
          status: string
          title: string
          user_id: string | null
        }
        Insert: {
          commitment?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          equity_offered?: string | null
          id?: string
          location?: string | null
          skills_needed?: string | null
          status?: string
          title: string
          user_id?: string | null
        }
        Update: {
          commitment?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          equity_offered?: string | null
          id?: string
          location?: string | null
          skills_needed?: string | null
          status?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      hackathon_registrations: {
        Row: {
          age: string | null
          city: string | null
          college: string | null
          created_at: string
          email: string
          experience: string | null
          frameworks: string | null
          full_name: string
          github_profile: string | null
          graduation: string | null
          id: string
          phone: string | null
          portfolio: string | null
          programming_languages: string | null
          specialization: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          age?: string | null
          city?: string | null
          college?: string | null
          created_at?: string
          email: string
          experience?: string | null
          frameworks?: string | null
          full_name: string
          github_profile?: string | null
          graduation?: string | null
          id?: string
          phone?: string | null
          portfolio?: string | null
          programming_languages?: string | null
          specialization?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          age?: string | null
          city?: string | null
          college?: string | null
          created_at?: string
          email?: string
          experience?: string | null
          frameworks?: string | null
          full_name?: string
          github_profile?: string | null
          graduation?: string | null
          id?: string
          phone?: string | null
          portfolio?: string | null
          programming_languages?: string | null
          specialization?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inclab_applications: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          founder_name: string
          funding_ask: string | null
          id: string
          industry: string | null
          market: string | null
          phone: string | null
          pitch_deck_url: string | null
          problem: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          solution: string | null
          stage: string | null
          startup_name: string | null
          status: string
          team_size: string | null
          traction: string | null
          updated_at: string
          user_id: string
          why_inclab: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          founder_name: string
          funding_ask?: string | null
          id?: string
          industry?: string | null
          market?: string | null
          phone?: string | null
          pitch_deck_url?: string | null
          problem?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          solution?: string | null
          stage?: string | null
          startup_name?: string | null
          status?: string
          team_size?: string | null
          traction?: string | null
          updated_at?: string
          user_id: string
          why_inclab?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          founder_name?: string
          funding_ask?: string | null
          id?: string
          industry?: string | null
          market?: string | null
          phone?: string | null
          pitch_deck_url?: string | null
          problem?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          solution?: string | null
          stage?: string | null
          startup_name?: string | null
          status?: string
          team_size?: string | null
          traction?: string | null
          updated_at?: string
          user_id?: string
          why_inclab?: string | null
        }
        Relationships: []
      }
      incubation_applications: {
        Row: {
          created_at: string
          description: string | null
          email: string
          founder_name: string
          funding_status: string | null
          id: string
          industry: string | null
          phone: string | null
          pitch_deck_url: string | null
          stage: string | null
          startup_name: string | null
          status: string
          team_size: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          email: string
          founder_name: string
          funding_status?: string | null
          id?: string
          industry?: string | null
          phone?: string | null
          pitch_deck_url?: string | null
          stage?: string | null
          startup_name?: string | null
          status?: string
          team_size?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string
          founder_name?: string
          funding_status?: string | null
          id?: string
          industry?: string | null
          phone?: string | null
          pitch_deck_url?: string | null
          stage?: string | null
          startup_name?: string | null
          status?: string
          team_size?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          impact: string | null
          is_breaking: boolean | null
          is_published: boolean | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          published_at: string | null
          slug: string
          source: string | null
          source_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          impact?: string | null
          is_breaking?: boolean | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          published_at?: string | null
          slug: string
          source?: string | null
          source_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          impact?: string | null
          is_breaking?: boolean | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          published_at?: string | null
          slug?: string
          source?: string | null
          source_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_regions: {
        Row: {
          created_at: string
          description: string | null
          flag: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          flag?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          flag?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          benefits: string[] | null
          case_study_url: string | null
          category: string | null
          created_at: string
          description: string | null
          founded_year: number | null
          headquarters: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          note: string | null
          partnership_tier: string | null
          region_id: string
          slug: string | null
          sort_order: number
          tagline: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          benefits?: string[] | null
          case_study_url?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          note?: string | null
          partnership_tier?: string | null
          region_id: string
          slug?: string | null
          sort_order?: number
          tagline?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          benefits?: string[] | null
          case_study_url?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          note?: string | null
          partnership_tier?: string | null
          region_id?: string
          slug?: string | null
          sort_order?: number
          tagline?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "partner_regions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      startups: {
        Row: {
          country: string | null
          created_at: string
          description: string | null
          founded_year: number | null
          headquarters: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          logo_url: string | null
          name: string
          region: string | null
          sector: string | null
          slug: string
          sort_order: number | null
          stage: string | null
          tags: string[] | null
          team_size: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          logo_url?: string | null
          name: string
          region?: string | null
          sector?: string | null
          slug: string
          sort_order?: number | null
          stage?: string | null
          tags?: string[] | null
          team_size?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          logo_url?: string | null
          name?: string
          region?: string | null
          sector?: string | null
          slug?: string
          sort_order?: number | null
          stage?: string | null
          tags?: string[] | null
          team_size?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
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
      app_role: "admin" | "startup" | "investor" | "mentor" | "cofounder"
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
      app_role: ["admin", "startup", "investor", "mentor", "cofounder"],
    },
  },
} as const

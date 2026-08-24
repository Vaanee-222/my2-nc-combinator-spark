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
      admin_audit_log: {
        Row: {
          action_type: string
          admin_email: string | null
          admin_user_id: string | null
          created_at: string
          details: Json | null
          id: string
          record_id: string | null
          table_name: string
        }
        Insert: {
          action_type: string
          admin_email?: string | null
          admin_user_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          record_id?: string | null
          table_name: string
        }
        Update: {
          action_type?: string
          admin_email?: string | null
          admin_user_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      advisors: {
        Row: {
          avatar_url: string | null
          company: string | null
          country: string | null
          created_at: string
          description: string | null
          expertise: string | null
          id: string
          is_active: boolean
          linkedin_url: string | null
          name: string
          role: string | null
          sort_order: number
          tier: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          expertise?: string | null
          id?: string
          is_active?: boolean
          linkedin_url?: string | null
          name: string
          role?: string | null
          sort_order?: number
          tier?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          expertise?: string | null
          id?: string
          is_active?: boolean
          linkedin_url?: string | null
          name?: string
          role?: string | null
          sort_order?: number
          tier?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      badges: {
        Row: {
          created_at: string
          criteria_event: string
          description: string | null
          icon: string
          id: string
          is_active: boolean
          key: string
          name: string
          sort_order: number
          threshold: number
        }
        Insert: {
          created_at?: string
          criteria_event: string
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          key: string
          name: string
          sort_order?: number
          threshold?: number
        }
        Update: {
          created_at?: string
          criteria_event?: string
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          sort_order?: number
          threshold?: number
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
      cloud_credit_ledger: {
        Row: {
          amount_usd: number
          approved_at: string | null
          approved_by: string | null
          beneficiary_email: string | null
          created_at: string
          entry_type: string
          id: string
          notes: string | null
          occurred_on: string
          provider: string
          reference: string | null
          request_id: string | null
          startup_name: string | null
          status: string
          supporting_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_usd?: number
          approved_at?: string | null
          approved_by?: string | null
          beneficiary_email?: string | null
          created_at?: string
          entry_type?: string
          id?: string
          notes?: string | null
          occurred_on?: string
          provider: string
          reference?: string | null
          request_id?: string | null
          startup_name?: string | null
          status?: string
          supporting_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_usd?: number
          approved_at?: string | null
          approved_by?: string | null
          beneficiary_email?: string | null
          created_at?: string
          entry_type?: string
          id?: string
          notes?: string | null
          occurred_on?: string
          provider?: string
          reference?: string | null
          request_id?: string | null
          startup_name?: string | null
          status?: string
          supporting_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cloud_credit_ledger_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "cloud_credit_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      cloud_credit_requests: {
        Row: {
          admin_notes: string | null
          applicant_name: string
          created_at: string
          credit_amount: string | null
          email: string
          id: string
          provider: string
          stage: string | null
          startup_name: string | null
          status: string
          updated_at: string
          use_case: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          applicant_name: string
          created_at?: string
          credit_amount?: string | null
          email: string
          id?: string
          provider: string
          stage?: string | null
          startup_name?: string | null
          status?: string
          updated_at?: string
          use_case?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          applicant_name?: string
          created_at?: string
          credit_amount?: string | null
          email?: string
          id?: string
          provider?: string
          stage?: string | null
          startup_name?: string | null
          status?: string
          updated_at?: string
          use_case?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cofounder_applications: {
        Row: {
          applicant_id: string
          applicant_name: string
          created_at: string
          email: string
          founder_notes: string | null
          headline: string | null
          id: string
          linkedin_url: string | null
          message: string
          request_id: string
          skills: string | null
          status: string
          updated_at: string
        }
        Insert: {
          applicant_id: string
          applicant_name: string
          created_at?: string
          email: string
          founder_notes?: string | null
          headline?: string | null
          id?: string
          linkedin_url?: string | null
          message: string
          request_id: string
          skills?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          applicant_name?: string
          created_at?: string
          email?: string
          founder_notes?: string | null
          headline?: string | null
          id?: string
          linkedin_url?: string | null
          message?: string
          request_id?: string
          skills?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cofounder_applications_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "cofounder_requests"
            referencedColumns: ["id"]
          },
        ]
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
          review_notes: string | null
          review_status: string
          reviewed_at: string | null
          reviewed_by: string | null
          skills_needed: string | null
          status: string
          title: string
          updated_at: string
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
          review_notes?: string | null
          review_status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          skills_needed?: string | null
          status?: string
          title: string
          updated_at?: string
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
          review_notes?: string | null
          review_status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          skills_needed?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cohort_startups: {
        Row: {
          category: string | null
          cohort_type: string
          created_at: string
          description: string | null
          external_id: string | null
          founder: string | null
          highlight: string | null
          id: string
          is_visible: boolean
          name: string
          period: string
          sort_order: number
          stage: string | null
          status: string
          traction: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          cohort_type?: string
          created_at?: string
          description?: string | null
          external_id?: string | null
          founder?: string | null
          highlight?: string | null
          id?: string
          is_visible?: boolean
          name: string
          period: string
          sort_order?: number
          stage?: string | null
          status?: string
          traction?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          cohort_type?: string
          created_at?: string
          description?: string | null
          external_id?: string | null
          founder?: string | null
          highlight?: string | null
          id?: string
          is_visible?: boolean
          name?: string
          period?: string
          sort_order?: number
          stage?: string | null
          status?: string
          traction?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      consultation_bookings: {
        Row: {
          admin_notes: string | null
          company: string | null
          consultation_type: string
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          preferred_date: string | null
          preferred_time: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          company?: string | null
          consultation_type: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          company?: string | null
          consultation_type?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      deal_claims: {
        Row: {
          company_name: string | null
          created_at: string
          deal_id: string | null
          deal_title: string
          id: string
          notes: string | null
          offer_value: string | null
          redemption_url: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          deal_id?: string | null
          deal_title: string
          id?: string
          notes?: string | null
          offer_value?: string | null
          redemption_url?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          deal_id?: string | null
          deal_title?: string
          id?: string
          notes?: string | null
          offer_value?: string | null
          redemption_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_claims_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deal_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_offers: {
        Row: {
          admin_notes: string | null
          category: string | null
          company_name: string
          contact_email: string
          created_at: string
          description: string | null
          discount: string | null
          id: string
          is_featured: boolean
          logo_url: string | null
          offer_value: string | null
          promo_code: string | null
          redemption_url: string | null
          status: string
          submitted_by: string | null
          title: string
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          admin_notes?: string | null
          category?: string | null
          company_name: string
          contact_email: string
          created_at?: string
          description?: string | null
          discount?: string | null
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          offer_value?: string | null
          promo_code?: string | null
          redemption_url?: string | null
          status?: string
          submitted_by?: string | null
          title: string
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          admin_notes?: string | null
          category?: string | null
          company_name?: string
          contact_email?: string
          created_at?: string
          description?: string | null
          discount?: string | null
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          offer_value?: string | null
          promo_code?: string | null
          redemption_url?: string | null
          status?: string
          submitted_by?: string | null
          title?: string
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      grant_applications: {
        Row: {
          admin_notes: string | null
          applicant_name: string
          created_at: string
          email: string
          funding_ask: string | null
          grant_id: string | null
          grant_name: string
          id: string
          phone: string | null
          proposal: string | null
          sector: string | null
          stage: string | null
          startup_name: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          applicant_name: string
          created_at?: string
          email: string
          funding_ask?: string | null
          grant_id?: string | null
          grant_name: string
          id?: string
          phone?: string | null
          proposal?: string | null
          sector?: string | null
          stage?: string | null
          startup_name?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          applicant_name?: string
          created_at?: string
          email?: string
          funding_ask?: string | null
          grant_id?: string | null
          grant_name?: string
          id?: string
          phone?: string | null
          proposal?: string | null
          sector?: string | null
          stage?: string | null
          startup_name?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grant_applications_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "grants"
            referencedColumns: ["id"]
          },
        ]
      }
      grants: {
        Row: {
          amount: string | null
          application_process: string | null
          benefits: string[]
          created_at: string
          deadline: string | null
          description: string | null
          eligibility: string[]
          focus: string | null
          grant_type: string | null
          id: string
          is_active: boolean
          name: string
          sectors: string[]
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          amount?: string | null
          application_process?: string | null
          benefits?: string[]
          created_at?: string
          deadline?: string | null
          description?: string | null
          eligibility?: string[]
          focus?: string | null
          grant_type?: string | null
          id?: string
          is_active?: boolean
          name: string
          sectors?: string[]
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: string | null
          application_process?: string | null
          benefits?: string[]
          created_at?: string
          deadline?: string | null
          description?: string | null
          eligibility?: string[]
          focus?: string | null
          grant_type?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sectors?: string[]
          sort_order?: number
          status?: string
          updated_at?: string
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
      introduction_requests: {
        Row: {
          admin_notes: string | null
          contact_email: string
          created_at: string
          id: string
          investor_id: string
          investor_name: string
          message: string
          requester_id: string
          requester_name: string
          reviewed_at: string | null
          reviewed_by: string | null
          startup_name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          contact_email: string
          created_at?: string
          id?: string
          investor_id: string
          investor_name: string
          message: string
          requester_id: string
          requester_name: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          startup_name?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          contact_email?: string
          created_at?: string
          id?: string
          investor_id?: string
          investor_name?: string
          message?: string
          requester_id?: string
          requester_name?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          startup_name?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      investor_deals: {
        Row: {
          ask_amount: number | null
          company_name: string
          contact_email: string | null
          created_at: string
          founded_year: number | null
          id: string
          notes: string | null
          progress: number
          revenue: string | null
          sector: string | null
          source: string | null
          stage: string
          startup_id: string | null
          team_size: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ask_amount?: number | null
          company_name: string
          contact_email?: string | null
          created_at?: string
          founded_year?: number | null
          id?: string
          notes?: string | null
          progress?: number
          revenue?: string | null
          sector?: string | null
          source?: string | null
          stage?: string
          startup_id?: string | null
          team_size?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ask_amount?: number | null
          company_name?: string
          contact_email?: string | null
          created_at?: string
          founded_year?: number | null
          id?: string
          notes?: string | null
          progress?: number
          revenue?: string | null
          sector?: string | null
          source?: string | null
          stage?: string
          startup_id?: string | null
          team_size?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_deals_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_inquiries: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          firm: string | null
          id: string
          instrument: string | null
          investor_name: string
          investor_type: string
          message: string | null
          phone: string | null
          profile_url: string | null
          stage_preference: string | null
          startup_name: string
          status: string
          ticket_size: string
          timeline: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          firm?: string | null
          id?: string
          instrument?: string | null
          investor_name: string
          investor_type: string
          message?: string | null
          phone?: string | null
          profile_url?: string | null
          stage_preference?: string | null
          startup_name: string
          status?: string
          ticket_size: string
          timeline?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          firm?: string | null
          id?: string
          instrument?: string | null
          investor_name?: string
          investor_type?: string
          message?: string | null
          phone?: string | null
          profile_url?: string | null
          stage_preference?: string | null
          startup_name?: string
          status?: string
          ticket_size?: string
          timeline?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investor_portfolio: {
        Row: {
          amount_invested: number
          company_name: string
          created_at: string
          current_valuation: number
          id: string
          invested_on: string | null
          notes: string | null
          ownership_pct: number
          sector: string | null
          stage: string | null
          startup_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_invested?: number
          company_name: string
          created_at?: string
          current_valuation?: number
          id?: string
          invested_on?: string | null
          notes?: string | null
          ownership_pct?: number
          sector?: string | null
          stage?: string | null
          startup_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_invested?: number
          company_name?: string
          created_at?: string
          current_valuation?: number
          id?: string
          invested_on?: string | null
          notes?: string | null
          ownership_pct?: number
          sector?: string | null
          stage?: string | null
          startup_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_portfolio_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_preferences: {
        Row: {
          bio: string | null
          check_size_max: number | null
          check_size_min: number | null
          contact_person: string | null
          created_at: string
          email: string | null
          firm_name: string | null
          id: string
          investor_type: string | null
          notify_market_insights: boolean
          notify_new_deals: boolean
          notify_portfolio_updates: boolean
          notify_weekly_digest: boolean
          phone: string | null
          regions: string[]
          sectors: string[]
          stages: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          check_size_max?: number | null
          check_size_min?: number | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          firm_name?: string | null
          id?: string
          investor_type?: string | null
          notify_market_insights?: boolean
          notify_new_deals?: boolean
          notify_portfolio_updates?: boolean
          notify_weekly_digest?: boolean
          phone?: string | null
          regions?: string[]
          sectors?: string[]
          stages?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          check_size_max?: number | null
          check_size_min?: number | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          firm_name?: string | null
          id?: string
          investor_type?: string | null
          notify_market_insights?: boolean
          notify_new_deals?: boolean
          notify_portfolio_updates?: boolean
          notify_weekly_digest?: boolean
          phone?: string | null
          regions?: string[]
          sectors?: string[]
          stages?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investors: {
        Row: {
          check_size: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          portfolio_count: number | null
          stage: string | null
          status: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          check_size?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          portfolio_count?: number | null
          stage?: string | null
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          check_size?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          portfolio_count?: number | null
          stage?: string | null
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          folder: string
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          updated_at: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          folder?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          folder?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      mentor_profiles: {
        Row: {
          bio: string | null
          company: string | null
          created_at: string
          experience: string | null
          expertise: string | null
          full_name: string | null
          hourly_availability: string | null
          id: string
          linkedin_url: string | null
          notify_new_requests: boolean
          notify_session_reminders: boolean
          rating: number
          specializations: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          company?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string | null
          full_name?: string | null
          hourly_availability?: string | null
          id?: string
          linkedin_url?: string | null
          notify_new_requests?: boolean
          notify_session_reminders?: boolean
          rating?: number
          specializations?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          company?: string | null
          created_at?: string
          experience?: string | null
          expertise?: string | null
          full_name?: string | null
          hourly_availability?: string | null
          id?: string
          linkedin_url?: string | null
          notify_new_requests?: boolean
          notify_session_reminders?: boolean
          rating?: number
          specializations?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentor_sessions: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          meeting_url: string | null
          mentee_name: string
          mentor_id: string
          mentorship_id: string | null
          notes: string | null
          scheduled_at: string
          session_type: string
          status: string
          topic: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_url?: string | null
          mentee_name: string
          mentor_id: string
          mentorship_id?: string | null
          notes?: string | null
          scheduled_at: string
          session_type?: string
          status?: string
          topic: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_url?: string | null
          mentee_name?: string
          mentor_id?: string
          mentorship_id?: string | null
          notes?: string | null
          scheduled_at?: string
          session_type?: string
          status?: string
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_sessions_mentorship_id_fkey"
            columns: ["mentorship_id"]
            isOneToOne: false
            referencedRelation: "mentorships"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_requests: {
        Row: {
          challenge: string
          contact_email: string
          created_at: string
          founder_name: string
          id: string
          match_score: number
          mentor_id: string | null
          mentor_notes: string | null
          requester_id: string
          sector: string | null
          stage: string | null
          startup_name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          challenge: string
          contact_email: string
          created_at?: string
          founder_name: string
          id?: string
          match_score?: number
          mentor_id?: string | null
          mentor_notes?: string | null
          requester_id: string
          sector?: string | null
          stage?: string | null
          startup_name?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          challenge?: string
          contact_email?: string
          created_at?: string
          founder_name?: string
          id?: string
          match_score?: number
          mentor_id?: string | null
          mentor_notes?: string | null
          requester_id?: string
          sector?: string | null
          stage?: string | null
          startup_name?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentorships: {
        Row: {
          created_at: string
          current_focus: string | null
          id: string
          mentee_email: string | null
          mentee_id: string | null
          mentee_name: string
          mentor_id: string
          next_session_on: string | null
          notes: string | null
          sector: string | null
          sessions_completed: number
          stage: string | null
          startup_name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_focus?: string | null
          id?: string
          mentee_email?: string | null
          mentee_id?: string | null
          mentee_name: string
          mentor_id: string
          next_session_on?: string | null
          notes?: string | null
          sector?: string | null
          sessions_completed?: number
          stage?: string | null
          startup_name?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_focus?: string | null
          id?: string
          mentee_email?: string | null
          mentee_id?: string | null
          mentee_name?: string
          mentor_id?: string
          next_session_on?: string | null
          notes?: string | null
          sector?: string | null
          sessions_completed?: number
          stage?: string | null
          startup_name?: string | null
          status?: string
          updated_at?: string
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
      notification_reads: {
        Row: {
          id: string
          notification_key: string
          read_at: string
          user_id: string
        }
        Insert: {
          id?: string
          notification_key: string
          read_at?: string
          user_id: string
        }
        Update: {
          id?: string
          notification_key?: string
          read_at?: string
          user_id?: string
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
      point_events: {
        Row: {
          awarded_at: string
          event_key: string
          id: string
          points: number
          role: string | null
          source_id: string | null
          source_table: string | null
          user_id: string
        }
        Insert: {
          awarded_at?: string
          event_key: string
          id?: string
          points: number
          role?: string | null
          source_id?: string | null
          source_table?: string | null
          user_id: string
        }
        Update: {
          awarded_at?: string
          event_key?: string
          id?: string
          points?: number
          role?: string | null
          source_id?: string | null
          source_table?: string | null
          user_id?: string
        }
        Relationships: []
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
          is_active: boolean
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
          is_active?: boolean
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
          is_active?: boolean
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          budget: string | null
          capacity: number | null
          created_at: string
          description: string | null
          duration: string | null
          id: string
          name: string
          program_type: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          budget?: string | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          name: string
          program_type: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: string | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          name?: string
          program_type?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          announcement_enabled: boolean
          announcement_text: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          draft_settings: Json | null
          favicon_url: string | null
          footer_text: string | null
          has_draft: boolean
          id: string
          linkedin_url: string | null
          logo_url: string | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          robots_txt: string | null
          site_name: string
          sitemap_enabled: boolean
          sitemap_extra_paths: string[]
          tagline: string | null
          twitter_handle: string | null
          twitter_url: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          announcement_enabled?: boolean
          announcement_text?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          draft_settings?: Json | null
          favicon_url?: string | null
          footer_text?: string | null
          has_draft?: boolean
          id?: string
          linkedin_url?: string | null
          logo_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          robots_txt?: string | null
          site_name?: string
          sitemap_enabled?: boolean
          sitemap_extra_paths?: string[]
          tagline?: string | null
          twitter_handle?: string | null
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          announcement_enabled?: boolean
          announcement_text?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          draft_settings?: Json | null
          favicon_url?: string | null
          footer_text?: string | null
          has_draft?: boolean
          id?: string
          linkedin_url?: string | null
          logo_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          robots_txt?: string | null
          site_name?: string
          sitemap_enabled?: boolean
          sitemap_extra_paths?: string[]
          tagline?: string | null
          twitter_handle?: string | null
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      site_settings_versions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          settings_id: string | null
          snapshot: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          settings_id?: string | null
          snapshot: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          settings_id?: string | null
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_versions_settings_id_fkey"
            columns: ["settings_id"]
            isOneToOne: false
            referencedRelation: "site_settings"
            referencedColumns: ["id"]
          },
        ]
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
      subscription_plans: {
        Row: {
          audience: string
          billing_period: string
          category: string
          created_at: string
          description: string | null
          features: string[]
          id: string
          is_active: boolean
          is_popular: boolean
          name: string
          price_usd: number
          sort_order: number
          tier: string | null
          updated_at: string
        }
        Insert: {
          audience?: string
          billing_period?: string
          category?: string
          created_at?: string
          description?: string | null
          features?: string[]
          id?: string
          is_active?: boolean
          is_popular?: boolean
          name: string
          price_usd?: number
          sort_order?: number
          tier?: string | null
          updated_at?: string
        }
        Update: {
          audience?: string
          billing_period?: string
          category?: string
          created_at?: string
          description?: string | null
          features?: string[]
          id?: string
          is_active?: boolean
          is_popular?: boolean
          name?: string
          price_usd?: number
          sort_order?: number
          tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscription_purchases: {
        Row: {
          amount_usd: number
          billing_period: string | null
          buyer_email: string | null
          created_at: string
          expires_at: string | null
          id: string
          plan_id: string | null
          plan_name: string
          purchased_at: string
          reference: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_usd?: number
          billing_period?: string | null
          buyer_email?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string | null
          plan_name: string
          purchased_at?: string
          reference?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_usd?: number
          billing_period?: string | null
          buyer_email?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string | null
          plan_name?: string
          purchased_at?: string
          reference?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_purchases_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_counters: {
        Row: {
          count: number
          counter_key: string
          id: string
          period_start: string
          updated_at: string
          user_id: string
        }
        Insert: {
          count?: number
          counter_key: string
          id?: string
          period_start?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          count?: number
          counter_key?: string
          id?: string
          period_start?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge_key: string
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_key: string
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_key?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_key_fkey"
            columns: ["badge_key"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["key"]
          },
        ]
      }
      user_points: {
        Row: {
          level: number
          level_name: string
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          level?: number
          level_name?: string
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          level?: number
          level_name?: string
          total_points?: number
          updated_at?: string
          user_id?: string
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
      public_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          is_active: boolean | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          is_active?: boolean | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          is_active?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_adjust_points: {
        Args: { _points: number; _reason: string; _user_id: string }
        Returns: string
      }
      admin_points_directory: {
        Args: { _limit?: number; _search?: string }
        Returns: {
          email: string
          full_name: string
          level: number
          level_name: string
          role: string
          total_points: number
          user_id: string
        }[]
      }
      admin_void_point_event: { Args: { _event_id: string }; Returns: string }
      award_points: {
        Args: {
          _event_key: string
          _points: number
          _source_id?: string
          _source_table?: string
          _user_id: string
        }
        Returns: undefined
      }
      evaluate_badges: { Args: { _user_id: string }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_usage_counter: {
        Args: { _counter_key: string; _delta?: number }
        Returns: number
      }
      level_for_points: {
        Args: { _points: number }
        Returns: {
          level: number
          level_name: string
        }[]
      }
      monthly_leaderboard: {
        Args: { _limit?: number; _month?: string; _role?: string }
        Returns: {
          avatar_url: string
          badge_count: number
          display_name: string
          events: number
          level: number
          level_name: string
          points: number
          rank: number
          role: string
          total_points: number
          user_id: string
        }[]
      }
      public_gamification: {
        Args: { _user_id: string }
        Returns: {
          avatar_url: string
          badges: Json
          bio: string
          city: string
          display_name: string
          joined_at: string
          level: number
          level_name: string
          role: string
          total_points: number
          user_id: string
        }[]
      }
      recalc_user_points: { Args: { _user_id: string }; Returns: undefined }
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

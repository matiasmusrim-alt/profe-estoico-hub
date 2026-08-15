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
      demo_usage: {
        Row: {
          created_at: string
          last_used_at: string | null
          max_uses: number
          updated_at: string
          used_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          last_used_at?: string | null
          max_uses?: number
          updated_at?: string
          used_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          last_used_at?: string | null
          max_uses?: number
          updated_at?: string
          used_count?: number
          user_id?: string
        }
        Relationships: []
      }
      licenses: {
        Row: {
          activated_at: string | null
          amount_clp: number | null
          created_at: string
          expires_at: string | null
          id: string
          payment_provider: string | null
          provider_reference: string | null
          status: Database["public"]["Enums"]["license_status"]
          tier: Database["public"]["Enums"]["license_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          amount_clp?: number | null
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_provider?: string | null
          provider_reference?: string | null
          status?: Database["public"]["Enums"]["license_status"]
          tier?: Database["public"]["Enums"]["license_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          activated_at?: string | null
          amount_clp?: number | null
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_provider?: string | null
          provider_reference?: string | null
          status?: Database["public"]["Enums"]["license_status"]
          tier?: Database["public"]["Enums"]["license_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentor_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          indicator_id: string | null
          model: string | null
          project_id: string | null
          role: Database["public"]["Enums"]["mentor_role"]
          tokens_in: number | null
          tokens_out: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          indicator_id?: string | null
          model?: string | null
          project_id?: string | null
          role: Database["public"]["Enums"]["mentor_role"]
          tokens_in?: number | null
          tokens_out?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          indicator_id?: string | null
          model?: string | null
          project_id?: string | null
          role?: Database["public"]["Enums"]["mentor_role"]
          tokens_in?: number | null
          tokens_out?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_messages_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "portfolio_indicators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      official_documents: {
        Row: {
          created_at: string
          doc_type: string
          id: string
          indicator_code: string | null
          is_published: boolean
          module: string | null
          source_url: string | null
          specialty: string | null
          storage_path: string | null
          task: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          doc_type: string
          id?: string
          indicator_code?: string | null
          is_published?: boolean
          module?: string | null
          source_url?: string | null
          specialty?: string | null
          storage_path?: string | null
          task?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          id?: string
          indicator_code?: string | null
          is_published?: boolean
          module?: string | null
          source_url?: string | null
          specialty?: string | null
          storage_path?: string | null
          task?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          created_at: string
          email: string | null
          event_id: string
          event_type: string | null
          id: string
          payload: Json | null
          processed_at: string | null
          provider: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          event_id: string
          event_type?: string | null
          id?: string
          payload?: Json | null
          processed_at?: string | null
          provider: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          event_id?: string
          event_type?: string | null
          id?: string
          payload?: Json | null
          processed_at?: string | null
          provider?: string
          user_id?: string | null
        }
        Relationships: []
      }
      portfolio_indicators: {
        Row: {
          confirmed_content: string | null
          created_at: string
          id: string
          indicator_code: string
          project_id: string
          status: Database["public"]["Enums"]["indicator_status"]
          subtask: string | null
          task: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          confirmed_content?: string | null
          created_at?: string
          id?: string
          indicator_code: string
          project_id: string
          status?: Database["public"]["Enums"]["indicator_status"]
          subtask?: string | null
          task?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          confirmed_content?: string | null
          created_at?: string
          id?: string
          indicator_code?: string
          project_id?: string
          status?: Database["public"]["Enums"]["indicator_status"]
          subtask?: string | null
          task?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_indicators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          context_notes: string | null
          course: string | null
          created_at: string
          id: string
          module: string | null
          specialty: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context_notes?: string | null
          course?: string | null
          created_at?: string
          id?: string
          module?: string | null
          specialty?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context_notes?: string | null
          course?: string | null
          created_at?: string
          id?: string
          module?: string | null
          specialty?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          school_level: string | null
          specialty: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          school_level?: string | null
          specialty?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          school_level?: string | null
          specialty?: string | null
          updated_at?: string
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
      consume_mentor_use: { Args: { _user_id: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      refund_mentor_use: { Args: { _user_id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
      indicator_status: "pendiente" | "en_progreso" | "preliminar"
      license_status: "active" | "pending" | "revoked"
      license_tier: "demo" | "premium"
      mentor_role: "user" | "assistant"
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
      app_role: ["admin", "user"],
      indicator_status: ["pendiente", "en_progreso", "preliminar"],
      license_status: ["active", "pending", "revoked"],
      license_tier: ["demo", "premium"],
      mentor_role: ["user", "assistant"],
    },
  },
} as const

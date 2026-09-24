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
      flagged_answers: {
        Row: {
          created_at: string
          id: string
          option_id: string
          question_id: number
          updated_at: string
          workshop: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_id: string
          question_id: number
          updated_at?: string
          workshop?: string
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string
          question_id?: number
          updated_at?: string
          workshop?: string
        }
        Relationships: []
      }
      passport_entries: {
        Row: {
          column_type: string
          content: string
          created_at: string
          founder_id: string
          id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          column_type: string
          content?: string
          created_at?: string
          founder_id: string
          id?: string
          session_id: string
          updated_at?: string
        }
        Update: {
          column_type?: string
          content?: string
          created_at?: string
          founder_id?: string
          id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "passport_entries_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "passport_founders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passport_entries_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "passport_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      passport_founders: {
        Row: {
          access_token: string
          created_at: string
          id: string
          name: string
          session_id: string
          veto_column: string | null
          veto_used: boolean
        }
        Insert: {
          access_token?: string
          created_at?: string
          id?: string
          name: string
          session_id: string
          veto_column?: string | null
          veto_used?: boolean
        }
        Update: {
          access_token?: string
          created_at?: string
          id?: string
          name?: string
          session_id?: string
          veto_column?: string | null
          veto_used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "passport_founders_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "passport_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      passport_master_row: {
        Row: {
          column_type: string
          content: string
          created_at: string
          has_veto: boolean
          id: string
          session_id: string
          source_founder_id: string | null
          updated_at: string
          veto_founder_id: string | null
        }
        Insert: {
          column_type: string
          content?: string
          created_at?: string
          has_veto?: boolean
          id?: string
          session_id: string
          source_founder_id?: string | null
          updated_at?: string
          veto_founder_id?: string | null
        }
        Update: {
          column_type?: string
          content?: string
          created_at?: string
          has_veto?: boolean
          id?: string
          session_id?: string
          source_founder_id?: string | null
          updated_at?: string
          veto_founder_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "passport_master_row_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "passport_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passport_master_row_source_founder_id_fkey"
            columns: ["source_founder_id"]
            isOneToOne: false
            referencedRelation: "passport_founders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passport_master_row_veto_founder_id_fkey"
            columns: ["veto_founder_id"]
            isOneToOne: false
            referencedRelation: "passport_founders"
            referencedColumns: ["id"]
          },
        ]
      }
      passport_sessions: {
        Row: {
          created_at: string
          current_phase: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_phase?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_phase?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          answers: Json
          completed_at: string
          created_at: string
          id: string
          participant_id: string
          participant_name: string
          workshop: string
        }
        Insert: {
          answers?: Json
          completed_at?: string
          created_at?: string
          id?: string
          participant_id: string
          participant_name: string
          workshop?: string
        }
        Update: {
          answers?: Json
          completed_at?: string
          created_at?: string
          id?: string
          participant_id?: string
          participant_name?: string
          workshop?: string
        }
        Relationships: []
      }
      value_selections: {
        Row: {
          current_values: Json
          new_values: Json
          strengthen_values: Json
          updated_at: string
          workshop: string
        }
        Insert: {
          current_values?: Json
          new_values?: Json
          strengthen_values?: Json
          updated_at?: string
          workshop: string
        }
        Update: {
          current_values?: Json
          new_values?: Json
          strengthen_values?: Json
          updated_at?: string
          workshop?: string
        }
        Relationships: []
      }
      value_votes: {
        Row: {
          created_at: string
          exercise: string
          id: string
          participant_id: string
          participant_name: string
          picks: Json
          updated_at: string
          workshop: string
        }
        Insert: {
          created_at?: string
          exercise: string
          id?: string
          participant_id: string
          participant_name: string
          picks?: Json
          updated_at?: string
          workshop: string
        }
        Update: {
          created_at?: string
          exercise?: string
          id?: string
          participant_id?: string
          participant_name?: string
          picks?: Json
          updated_at?: string
          workshop?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

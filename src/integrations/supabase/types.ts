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
      weekly_intake_forms: {
        Row: {
          app_name: string
          app_owner: string
          azure: boolean
          azure_type: string | null
          azure_volume: string | null
          backup: boolean
          cms_full_support: boolean
          cost: number | null
          created_at: string
          data_center_location: string | null
          date_requested: string
          dr: boolean
          dr_count: number
          env_dr: boolean
          env_non_prod: boolean
          env_prod: boolean
          exceptions_to_cms: string | null
          fund_code: string | null
          funding_available: boolean
          id: string
          l1_leadership: string
          location_on_prem: boolean
          location_physical: boolean
          location_reason_for_physical: string | null
          non_prod_count: number
          on_prem: boolean
          on_prem_volume: string | null
          oracle: boolean
          other_explain: string | null
          other_notes: string | null
          physical: boolean
          prod_count: number
          reason_for_on_prem: string | null
          reason_for_physical: string | null
          requestor: string
          sql: boolean
          storage_on_prem: string | null
          updated_at: string
          week_date: string
        }
        Insert: {
          app_name: string
          app_owner: string
          azure?: boolean
          azure_type?: string | null
          azure_volume?: string | null
          backup?: boolean
          cms_full_support?: boolean
          cost?: number | null
          created_at?: string
          data_center_location?: string | null
          date_requested: string
          dr?: boolean
          dr_count?: number
          env_dr?: boolean
          env_non_prod?: boolean
          env_prod?: boolean
          exceptions_to_cms?: string | null
          fund_code?: string | null
          funding_available?: boolean
          id?: string
          l1_leadership: string
          location_on_prem?: boolean
          location_physical?: boolean
          location_reason_for_physical?: string | null
          non_prod_count?: number
          on_prem?: boolean
          on_prem_volume?: string | null
          oracle?: boolean
          other_explain?: string | null
          other_notes?: string | null
          physical?: boolean
          prod_count?: number
          reason_for_on_prem?: string | null
          reason_for_physical?: string | null
          requestor: string
          sql?: boolean
          storage_on_prem?: string | null
          updated_at?: string
          week_date: string
        }
        Update: {
          app_name?: string
          app_owner?: string
          azure?: boolean
          azure_type?: string | null
          azure_volume?: string | null
          backup?: boolean
          cms_full_support?: boolean
          cost?: number | null
          created_at?: string
          data_center_location?: string | null
          date_requested?: string
          dr?: boolean
          dr_count?: number
          env_dr?: boolean
          env_non_prod?: boolean
          env_prod?: boolean
          exceptions_to_cms?: string | null
          fund_code?: string | null
          funding_available?: boolean
          id?: string
          l1_leadership?: string
          location_on_prem?: boolean
          location_physical?: boolean
          location_reason_for_physical?: string | null
          non_prod_count?: number
          on_prem?: boolean
          on_prem_volume?: string | null
          oracle?: boolean
          other_explain?: string | null
          other_notes?: string | null
          physical?: boolean
          prod_count?: number
          reason_for_on_prem?: string | null
          reason_for_physical?: string | null
          requestor?: string
          sql?: boolean
          storage_on_prem?: string | null
          updated_at?: string
          week_date?: string
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
    Enums: {},
  },
} as const

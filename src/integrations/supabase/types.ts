export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      weekly_intake_forms: {
        Row: {
          app_name: string
          app_owner: string | null
          azure: boolean | null
          azure_type: string | null
          azure_volume: string | null
          backup: boolean | null
          cms_full_support: boolean | null
          cost: string | null
          created_at: string
          data_center_location: string | null
          date_requested: string | null
          dr: boolean | null
          dr_count: number | null
          env_dr: boolean | null
          env_non_prod: boolean | null
          env_prod: boolean | null
          exceptions_to_cms: string | null
          fund_code: string | null
          funding_available: boolean | null
          id: string
          l1_leadership: string | null
          location_on_prem: boolean | null
          location_physical: boolean | null
          location_reason_for_physical: string | null
          non_prod_count: number | null
          on_prem: boolean | null
          on_prem_volume: string | null
          oracle: boolean | null
          other_explain: string | null
          other_notes: string | null
          physical: boolean | null
          prod_count: number | null
          reason_for_on_prem: string | null
          reason_for_physical: string | null
          requestor: boolean | null
          sql: boolean | null
          storage_on_prem: boolean | null
          week_date: string | null
        }
        Insert: {
          app_name: string
          app_owner?: string | null
          azure?: boolean | null
          azure_type?: string | null
          azure_volume?: string | null
          backup?: boolean | null
          cms_full_support?: boolean | null
          cost?: string | null
          created_at?: string
          data_center_location?: string | null
          date_requested?: string | null
          dr?: boolean | null
          dr_count?: number | null
          env_dr?: boolean | null
          env_non_prod?: boolean | null
          env_prod?: boolean | null
          exceptions_to_cms?: string | null
          fund_code?: string | null
          funding_available?: boolean | null
          id?: string
          l1_leadership?: string | null
          location_on_prem?: boolean | null
          location_physical?: boolean | null
          location_reason_for_physical?: string | null
          non_prod_count?: number | null
          on_prem?: boolean | null
          on_prem_volume?: string | null
          oracle?: boolean | null
          other_explain?: string | null
          other_notes?: string | null
          physical?: boolean | null
          prod_count?: number | null
          reason_for_on_prem?: string | null
          reason_for_physical?: string | null
          requestor?: boolean | null
          sql?: boolean | null
          storage_on_prem?: boolean | null
          week_date?: string | null
        }
        Update: {
          app_name?: string
          app_owner?: string | null
          azure?: boolean | null
          azure_type?: string | null
          azure_volume?: string | null
          backup?: boolean | null
          cms_full_support?: boolean | null
          cost?: string | null
          created_at?: string
          data_center_location?: string | null
          date_requested?: string | null
          dr?: boolean | null
          dr_count?: number | null
          env_dr?: boolean | null
          env_non_prod?: boolean | null
          env_prod?: boolean | null
          exceptions_to_cms?: string | null
          fund_code?: string | null
          funding_available?: boolean | null
          id?: string
          l1_leadership?: string | null
          location_on_prem?: boolean | null
          location_physical?: boolean | null
          location_reason_for_physical?: string | null
          non_prod_count?: number | null
          on_prem?: boolean | null
          on_prem_volume?: string | null
          oracle?: boolean | null
          other_explain?: string | null
          other_notes?: string | null
          physical?: boolean | null
          prod_count?: number | null
          reason_for_on_prem?: string | null
          reason_for_physical?: string | null
          requestor?: boolean | null
          sql?: boolean | null
          storage_on_prem?: boolean | null
          week_date?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

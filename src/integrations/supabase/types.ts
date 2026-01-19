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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string
          doctor_id: string
          doctor_name: string
          fee: number
          hospital_id: string
          hospital_name: string
          id: string
          payment_id: string | null
          slot_date: string
          slot_id: string | null
          slot_time: string
          specialization: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          doctor_name: string
          fee: number
          hospital_id: string
          hospital_name: string
          id?: string
          payment_id?: string | null
          slot_date: string
          slot_id?: string | null
          slot_time: string
          specialization?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          doctor_name?: string
          fee?: number
          hospital_id?: string
          hospital_name?: string
          id?: string
          payment_id?: string | null
          slot_date?: string
          slot_id?: string | null
          slot_time?: string
          specialization?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "slots"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          available: boolean | null
          created_at: string
          degree: string | null
          fee: number
          hospital_id: string
          id: string
          name: string
          rating: number | null
          reviews: number | null
          specialization: string
          updated_at: string
        }
        Insert: {
          available?: boolean | null
          created_at?: string
          degree?: string | null
          fee?: number
          hospital_id: string
          id?: string
          name: string
          rating?: number | null
          reviews?: number | null
          specialization: string
          updated_at?: string
        }
        Update: {
          available?: boolean | null
          created_at?: string
          degree?: string | null
          fee?: number
          hospital_id?: string
          id?: string
          name?: string
          rating?: number | null
          reviews?: number | null
          specialization?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          created_at: string
          hospital_code: string
          id: string
          image: string | null
          location: string | null
          mobile_number: string
          name: string
          rating: number | null
          specialties: string[] | null
          status: string | null
          updated_at: string
          upi_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          hospital_code: string
          id?: string
          image?: string | null
          location?: string | null
          mobile_number: string
          name: string
          rating?: number | null
          specialties?: string[] | null
          status?: string | null
          updated_at?: string
          upi_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          hospital_code?: string
          id?: string
          image?: string | null
          location?: string | null
          mobile_number?: string
          name?: string
          rating?: number | null
          specialties?: string[] | null
          status?: string | null
          updated_at?: string
          upi_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          doctor_name: string
          hospital_name: string
          id: string
          slot_date: string
          slot_time: string
          status: string
          transaction_id: string
          updated_at: string
          upi_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          doctor_name: string
          hospital_name: string
          id?: string
          slot_date: string
          slot_time: string
          status?: string
          transaction_id: string
          updated_at?: string
          upi_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          doctor_name?: string
          hospital_name?: string
          id?: string
          slot_date?: string
          slot_time?: string
          status?: string
          transaction_id?: string
          updated_at?: string
          upi_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: string | null
          avatar: string | null
          created_at: string
          email: string | null
          gender: string | null
          id: string
          name: string
          phone: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          age?: string | null
          avatar?: string | null
          created_at?: string
          email?: string | null
          gender?: string | null
          id?: string
          name?: string
          phone: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          age?: string | null
          avatar?: string | null
          created_at?: string
          email?: string | null
          gender?: string | null
          id?: string
          name?: string
          phone?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      slots: {
        Row: {
          booked: boolean | null
          created_at: string
          date: string
          doctor_id: string
          id: string
          time: string
        }
        Insert: {
          booked?: boolean | null
          created_at?: string
          date: string
          doctor_id: string
          id?: string
          time: string
        }
        Update: {
          booked?: boolean | null
          created_at?: string
          date?: string
          doctor_id?: string
          id?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "slots_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
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

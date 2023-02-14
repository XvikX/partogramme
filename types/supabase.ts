export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      nurse_info: {
        Row: {
          created_at: string | null
          first_mid_name: string | null
          id: string
          last_name: string | null
          profiles: string | null
        }
        Insert: {
          created_at?: string | null
          first_mid_name?: string | null
          id?: string
          last_name?: string | null
          profiles?: string | null
        }
        Update: {
          created_at?: string | null
          first_mid_name?: string | null
          id?: string
          last_name?: string | null
          profiles?: string | null
        }
      }
      partogramme: {
        Row: {
          admission_time: string | null
          center_name: string | null
          commentary: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          no_case: string | null
          nurse_id: string | null
          start_work_time: string | null
          state: string | null
        }
        Insert: {
          admission_time?: string | null
          center_name?: string | null
          commentary?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          no_case?: string | null
          nurse_id?: string | null
          start_work_time?: string | null
          state?: string | null
        }
        Update: {
          admission_time?: string | null
          center_name?: string | null
          commentary?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          no_case?: string | null
          nurse_id?: string | null
          start_work_time?: string | null
          state?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          isDoctor: boolean
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          isDoctor?: boolean
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          isDoctor?: boolean
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
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

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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
      }
      amnioticLiquid: {
        Row: {
          created_at: string
          id: string
          partogrammeId: string
          Rank: number
          stateLiquid: Database["public"]["Enums"]["LiquidState"]
        }
        Insert: {
          created_at: string
          id: string
          partogrammeId: string
          Rank: number
          stateLiquid?: Database["public"]["Enums"]["LiquidState"]
        }
        Update: {
          created_at?: string
          id?: string
          partogrammeId?: string
          Rank?: number
          stateLiquid?: Database["public"]["Enums"]["LiquidState"]
        }
      }
      BabyDescent: {
        Row: {
          babydescent: number
          created_at: string
          id: string
          partogrammeId: string
          Rank: number
        }
        Insert: {
          babydescent: number
          created_at: string
          id: string
          partogrammeId: string
          Rank: number
        }
        Update: {
          babydescent?: number
          created_at?: string
          id?: string
          partogrammeId?: string
          Rank?: number
        }
      }
      BabyHeartFrequency: {
        Row: {
          babyFc: number
          created_at: string
          id: string
          partogrammeId: string
          Rank: number
        }
        Insert: {
          babyFc: number
          created_at: string
          id: string
          partogrammeId: string
          Rank: number
        }
        Update: {
          babyFc?: number
          created_at?: string
          id?: string
          partogrammeId?: string
          Rank?: number
        }
      }
      Dilation: {
        Row: {
          created_at: string
          dilation: number
          id: string
          partogrammeId: string
          Rank: number
        }
        Insert: {
          created_at: string
          dilation: number
          id: string
          partogrammeId: string
          Rank: number
        }
        Update: {
          created_at?: string
          dilation?: number
          id?: string
          partogrammeId?: string
          Rank?: number
        }
      }
      MotherBloodPressure: {
        Row: {
          created_at: string
          id: string
          motherBloodPressure: number
          partogrammeId: string
          rank: number
        }
        Insert: {
          created_at: string
          id: string
          motherBloodPressure: number
          partogrammeId: string
          rank: number
        }
        Update: {
          created_at?: string
          id?: string
          motherBloodPressure?: number
          partogrammeId?: string
          rank?: number
        }
      }
      MotherContractionsFrequency: {
        Row: {
          created_at: string
          id: string
          motherContractionsFrequency: number
          partogrammeId: string
          rank: number
        }
        Insert: {
          created_at: string
          id: string
          motherContractionsFrequency: number
          partogrammeId: string
          rank: number
        }
        Update: {
          created_at?: string
          id?: string
          motherContractionsFrequency?: number
          partogrammeId?: string
          rank?: number
        }
      }
      MotherHeartFrequency: {
        Row: {
          created_at: string
          id: string
          motherFc: number
          partogrammeId: string
          rank: number
        }
        Insert: {
          created_at: string
          id: string
          motherFc: number
          partogrammeId: string
          rank: number
        }
        Update: {
          created_at?: string
          id?: string
          motherFc?: number
          partogrammeId?: string
          rank?: number
        }
      }
      MotherTemperature: {
        Row: {
          created_at: string
          id: string
          motherTemperature: number
          partogrammeId: string
          rank: number
        }
        Insert: {
          created_at: string
          id: string
          motherTemperature: number
          partogrammeId: string
          rank: number
        }
        Update: {
          created_at?: string
          id?: string
          motherTemperature?: number
          partogrammeId?: string
          rank?: number
        }
      }
      Partogramme: {
        Row: {
          admissionDateTime: string
          commentary: string
          hospitalName: string
          id: string
          noFile: number
          nurseId: string
          patientFirstName: string | null
          patientLastName: string | null
          state: Database["public"]["Enums"]["PartogrammeState"]
          workStartDateTime: string
        }
        Insert: {
          admissionDateTime: string
          commentary: string
          hospitalName: string
          id: string
          noFile: number
          nurseId: string
          patientFirstName?: string | null
          patientLastName?: string | null
          state?: Database["public"]["Enums"]["PartogrammeState"]
          workStartDateTime: string
        }
        Update: {
          admissionDateTime?: string
          commentary?: string
          hospitalName?: string
          id?: string
          noFile?: number
          nurseId?: string
          patientFirstName?: string | null
          patientLastName?: string | null
          state?: Database["public"]["Enums"]["PartogrammeState"]
          workStartDateTime?: string
        }
      }
      Profile: {
        Row: {
          email: string | null
          firstName: string | null
          id: string
          lastName: string | null
          refDoctor: string | null
          role: Database["public"]["Enums"]["Role"] | null
        }
        Insert: {
          email?: string | null
          firstName?: string | null
          id: string
          lastName?: string | null
          refDoctor?: string | null
          role?: Database["public"]["Enums"]["Role"] | null
        }
        Update: {
          email?: string | null
          firstName?: string | null
          id?: string
          lastName?: string | null
          refDoctor?: string | null
          role?: Database["public"]["Enums"]["Role"] | null
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
      LiquidState: "INTACT" | "CLAIR" | "MECONIAL" | "BLOOD"
      PartogrammeState: "NOT_STARTED" | "IN_PROGRESS" | "FINISHED"
      Role: "NURSE" | "DOCTOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

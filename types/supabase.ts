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
          id: string
          partogrammeId: string
          Rank: number
          stateLiquid: Database["public"]["Enums"]["LiquidState"]
        }
        Insert: {
          id: string
          partogrammeId: string
          Rank: number
          stateLiquid?: Database["public"]["Enums"]["LiquidState"]
        }
        Update: {
          id?: string
          partogrammeId?: string
          Rank?: number
          stateLiquid?: Database["public"]["Enums"]["LiquidState"]
        }
      }
      BabyDescent: {
        Row: {
          babydescent: number
          id: string
          partogrammeId: string
          Rank: number
        }
        Insert: {
          babydescent: number
          id: string
          partogrammeId: string
          Rank: number
        }
        Update: {
          babydescent?: number
          id?: string
          partogrammeId?: string
          Rank?: number
        }
      }
      BabyHeartFrequency: {
        Row: {
          babyFc: number
          id: string
          partogrammeId: string
          Rank: number
        }
        Insert: {
          babyFc: number
          id: string
          partogrammeId: string
          Rank: number
        }
        Update: {
          babyFc?: number
          id?: string
          partogrammeId?: string
          Rank?: number
        }
      }
      Dilation: {
        Row: {
          dilation: number
          id: string
          partogrammeId: string
          Rank: number
        }
        Insert: {
          dilation: number
          id: string
          partogrammeId: string
          Rank: number
        }
        Update: {
          dilation?: number
          id?: string
          partogrammeId?: string
          Rank?: number
        }
      }
      MotherBloodPressure: {
        Row: {
          id: string
          motherBloodPressure: number
          partogrammeId: string
          rank: number
        }
        Insert: {
          id: string
          motherBloodPressure: number
          partogrammeId: string
          rank: number
        }
        Update: {
          id?: string
          motherBloodPressure?: number
          partogrammeId?: string
          rank?: number
        }
      }
      MotherContractionsFrequency: {
        Row: {
          id: string
          motherContractionsFrequency: number
          partogrammeId: string
          rank: number
        }
        Insert: {
          id: string
          motherContractionsFrequency: number
          partogrammeId: string
          rank: number
        }
        Update: {
          id?: string
          motherContractionsFrequency?: number
          partogrammeId?: string
          rank?: number
        }
      }
      MotherHeartFrequency: {
        Row: {
          id: string
          motherFc: number
          partogrammeId: string
          rank: number
        }
        Insert: {
          id: string
          motherFc: number
          partogrammeId: string
          rank: number
        }
        Update: {
          id?: string
          motherFc?: number
          partogrammeId?: string
          rank?: number
        }
      }
      MotherTemperature: {
        Row: {
          id: string
          motherTemperature: number
          partogrammeId: string
          rank: number
        }
        Insert: {
          id: string
          motherTemperature: number
          partogrammeId: string
          rank: number
        }
        Update: {
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
          state: string
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
          state: string
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
          state?: string
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

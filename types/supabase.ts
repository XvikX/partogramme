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
        Relationships: []
      }
      amnioticLiquid: {
        Row: {
          created_at: string
          id: string
          isDeleted: boolean | null
          partogrammeId: string
          Rank: number
          stateLiquid: Database["public"]["Enums"]["LiquidState"]
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean | null
          partogrammeId: string
          Rank: number
          stateLiquid?: Database["public"]["Enums"]["LiquidState"]
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          partogrammeId?: string
          Rank?: number
          stateLiquid?: Database["public"]["Enums"]["LiquidState"]
        }
        Relationships: [
          {
            foreignKeyName: "amnioticLiquid_partogrammeId_fkey"
            columns: ["partogrammeId"]
            referencedRelation: "Partogramme"
            referencedColumns: ["id"]
          }
        ]
      }
      BabyDescent: {
        Row: {
          babydescent: number
          created_at: string
          id: string
          isDeleted: boolean | null
          partogrammeId: string
          Rank: number | null
        }
        Insert: {
          babydescent: number
          created_at: string
          id: string
          isDeleted?: boolean | null
          partogrammeId: string
          Rank?: number | null
        }
        Update: {
          babydescent?: number
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          partogrammeId?: string
          Rank?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "BabyDescent_partogrammeId_fkey"
            columns: ["partogrammeId"]
            referencedRelation: "Partogramme"
            referencedColumns: ["id"]
          }
        ]
      }
      BabyHeartFrequency: {
        Row: {
          babyFc: number
          created_at: string
          id: string
          isDeleted: boolean | null
          partogrammeId: string
          Rank: number | null
        }
        Insert: {
          babyFc: number
          created_at: string
          id: string
          isDeleted?: boolean | null
          partogrammeId: string
          Rank?: number | null
        }
        Update: {
          babyFc?: number
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          partogrammeId?: string
          Rank?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "BabyHeartFrequency_partogrammeId_fkey"
            columns: ["partogrammeId"]
            referencedRelation: "Partogramme"
            referencedColumns: ["id"]
          }
        ]
      }
      Dilation: {
        Row: {
          created_at: string
          dilation: number
          id: string
          isDeleted: boolean | null
          partogrammeId: string
          Rank: number | null
        }
        Insert: {
          created_at: string
          dilation: number
          id: string
          isDeleted?: boolean | null
          partogrammeId: string
          Rank?: number | null
        }
        Update: {
          created_at?: string
          dilation?: number
          id?: string
          isDeleted?: boolean | null
          partogrammeId?: string
          Rank?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Dilation_partogrammeId_fkey"
            columns: ["partogrammeId"]
            referencedRelation: "Partogramme"
            referencedColumns: ["id"]
          }
        ]
      }
      MotherBloodPressure: {
        Row: {
          created_at: string
          id: string
          isDeleted: boolean | null
          motherBloodPressure: number
          partogrammeId: string
          Rank: number
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean | null
          motherBloodPressure: number
          partogrammeId: string
          Rank: number
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          motherBloodPressure?: number
          partogrammeId?: string
          Rank?: number
        }
        Relationships: [
          {
            foreignKeyName: "MotherBloodPressure_partogrammeId_fkey"
            columns: ["partogrammeId"]
            referencedRelation: "Partogramme"
            referencedColumns: ["id"]
          }
        ]
      }
      MotherContractionsFrequency: {
        Row: {
          created_at: string
          id: string
          isDeleted: boolean | null
          motherContractionsFrequency: number
          partogrammeId: string
          Rank: number
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean | null
          motherContractionsFrequency: number
          partogrammeId: string
          Rank: number
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          motherContractionsFrequency?: number
          partogrammeId?: string
          Rank?: number
        }
        Relationships: [
          {
            foreignKeyName: "MotherContractionsFrequency_partogrammeId_fkey"
            columns: ["partogrammeId"]
            referencedRelation: "Partogramme"
            referencedColumns: ["id"]
          }
        ]
      }
      MotherHeartFrequency: {
        Row: {
          created_at: string
          id: string
          isDeleted: boolean | null
          motherFc: number
          partogrammeId: string
          Rank: number
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean | null
          motherFc: number
          partogrammeId: string
          Rank: number
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          motherFc?: number
          partogrammeId?: string
          Rank?: number
        }
        Relationships: [
          {
            foreignKeyName: "MotherHeartFrequency_partogrammeId_fkey"
            columns: ["partogrammeId"]
            referencedRelation: "Partogramme"
            referencedColumns: ["id"]
          }
        ]
      }
      MotherTemperature: {
        Row: {
          created_at: string
          id: string
          isDeleted: boolean | null
          motherTemperature: number
          partogrammeId: string
          Rank: number
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean | null
          motherTemperature: number
          partogrammeId: string
          Rank: number
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          motherTemperature?: number
          partogrammeId?: string
          Rank?: number
        }
        Relationships: [
          {
            foreignKeyName: "MotherTemperature_partogrammeId_fkey"
            columns: ["partogrammeId"]
            referencedRelation: "Partogramme"
            referencedColumns: ["id"]
          }
        ]
      }
      Partogramme: {
        Row: {
          admissionDateTime: string
          commentary: string
          hospitalName: string
          id: string
          isDeleted: boolean | null
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
          isDeleted?: boolean | null
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
          isDeleted?: boolean | null
          noFile?: number
          nurseId?: string
          patientFirstName?: string | null
          patientLastName?: string | null
          state?: Database["public"]["Enums"]["PartogrammeState"]
          workStartDateTime?: string
        }
        Relationships: [
          {
            foreignKeyName: "Partogramme_nurseId_fkey"
            columns: ["nurseId"]
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          }
        ]
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
      LiquidState: "INTACT" | "CLAIR" | "MECONIAL" | "SANG"
      PartogrammeState: "NOT_STARTED" | "IN_PROGRESS" | "FINISHED"
      Role: "NURSE" | "DOCTOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

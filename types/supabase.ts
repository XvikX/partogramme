export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
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
          Rank: number | null
          value: Database["public"]["Enums"]["LiquidState"]
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean | null
          partogrammeId: string
          Rank?: number | null
          value?: Database["public"]["Enums"]["LiquidState"]
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          partogrammeId?: string
          Rank?: number | null
          value?: Database["public"]["Enums"]["LiquidState"]
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
          created_at: string
          id: string
          isDeleted: boolean | null
          partogrammeId: string
          Rank: number | null
          value: number
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean | null
          partogrammeId: string
          Rank?: number | null
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          partogrammeId?: string
          Rank?: number | null
          value?: number
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
          created_at: string
          id: string
          isDeleted: boolean | null
          partogrammeId: string
          Rank: number | null
          value: number
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean | null
          partogrammeId: string
          Rank?: number | null
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          partogrammeId?: string
          Rank?: number | null
          value?: number
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
      Comment: {
        Row: {
          created_at: string
          id: string
          isDeleted: boolean
          partogrammeId: string
          value: string
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean
          partogrammeId: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean
          partogrammeId?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "Comment_partogrammeId_fkey"
            columns: ["partogrammeId"]
            referencedRelation: "Partogramme"
            referencedColumns: ["id"]
          }
        ]
      }
      Dilation: {
        Row: {
          created_at: string
          id: string
          isDeleted: boolean | null
          partogrammeId: string
          Rank: number | null
          value: number
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean | null
          partogrammeId: string
          Rank?: number | null
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          partogrammeId?: string
          Rank?: number | null
          value?: number
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
      hospital: {
        Row: {
          city: string
          id: string
          isDeleted: boolean | null
          name: string
        }
        Insert: {
          city: string
          id: string
          isDeleted?: boolean | null
          name: string
        }
        Update: {
          city?: string
          id?: string
          isDeleted?: boolean | null
          name?: string
        }
        Relationships: []
      }
      MotherContractionDuration: {
        Row: {
          created_at: string
          id: string
          isDeleted: boolean
          partogrammeId: string
          Rank: number | null
          value: number
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean
          partogrammeId: string
          Rank?: number | null
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean
          partogrammeId?: string
          Rank?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "MotherContractionDuration_partogrammeId_fkey"
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
          partogrammeId: string
          Rank: number | null
          value: number
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean | null
          partogrammeId: string
          Rank?: number | null
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          partogrammeId?: string
          Rank?: number | null
          value?: number
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
      MotherDiastolicBloodPressure: {
        Row: {
          created_at: string
          id: string
          isDeleted: boolean | null
          partogrammeId: string
          Rank: number | null
          value: number
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean | null
          partogrammeId: string
          Rank?: number | null
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          partogrammeId?: string
          Rank?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "MotherDiastolicBloodPressure_partogrammeId_fkey"
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
          partogrammeId: string
          Rank: number | null
          value: number
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean | null
          partogrammeId: string
          Rank?: number | null
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          partogrammeId?: string
          Rank?: number | null
          value?: number
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
      MotherSystolicBloodPressure: {
        Row: {
          created_at: string
          id: string
          isDeleted: boolean | null
          partogrammeId: string
          Rank: number | null
          value: number
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean | null
          partogrammeId: string
          Rank?: number | null
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          partogrammeId?: string
          Rank?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "MotherSystolicBloodPressure_partogrammeId_fkey"
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
          partogrammeId: string
          Rank: number | null
          value: number
        }
        Insert: {
          created_at: string
          id: string
          isDeleted?: boolean | null
          partogrammeId: string
          Rank?: number | null
          value?: number
        }
        Update: {
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          partogrammeId?: string
          Rank?: number | null
          value?: number
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
          hospitalId: string | null
          id: string
          isDeleted: boolean | null
          noFile: number
          nurseId: string
          patientFirstName: string | null
          patientLastName: string | null
          refDoctorId: string | null
          state: Database["public"]["Enums"]["PartogrammeState"]
          workStartDateTime: string | null
        }
        Insert: {
          admissionDateTime: string
          commentary: string
          hospitalId?: string | null
          id: string
          isDeleted?: boolean | null
          noFile: number
          nurseId: string
          patientFirstName?: string | null
          patientLastName?: string | null
          refDoctorId?: string | null
          state?: Database["public"]["Enums"]["PartogrammeState"]
          workStartDateTime?: string | null
        }
        Update: {
          admissionDateTime?: string
          commentary?: string
          hospitalId?: string | null
          id?: string
          isDeleted?: boolean | null
          noFile?: number
          nurseId?: string
          patientFirstName?: string | null
          patientLastName?: string | null
          refDoctorId?: string | null
          state?: Database["public"]["Enums"]["PartogrammeState"]
          workStartDateTime?: string | null
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
          id: string
          isDeleted: boolean | null
        }
        Insert: {
          email?: string | null
          id: string
          isDeleted?: boolean | null
        }
        Update: {
          email?: string | null
          id?: string
          isDeleted?: boolean | null
        }
        Relationships: []
      }
      userInfo: {
        Row: {
          firstName: string
          hospitalId: string | null
          id: string
          isDeleted: boolean | null
          lastName: string
          profileId: string
          refDoctorId: string
          role: Database["public"]["Enums"]["Role"]
        }
        Insert: {
          firstName: string
          hospitalId?: string | null
          id: string
          isDeleted?: boolean | null
          lastName: string
          profileId: string
          refDoctorId: string
          role?: Database["public"]["Enums"]["Role"]
        }
        Update: {
          firstName?: string
          hospitalId?: string | null
          id?: string
          isDeleted?: boolean | null
          lastName?: string
          profileId?: string
          refDoctorId?: string
          role?: Database["public"]["Enums"]["Role"]
        }
        Relationships: [
          {
            foreignKeyName: "userInfo_profileId_fkey"
            columns: ["profileId"]
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: string
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      get_claims: {
        Args: {
          uid: string
        }
        Returns: Json
      }
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
      }
    }
    Enums: {
      LiquidState:
        | "NONE"
        | "INTACT"
        | "CLAIR"
        | "MECONIAL"
        | "SANG"
        | "PUREE_DE_POIS"
      PartogrammeState:
        | "ADMITTED"
        | "IN_PROGRESS"
        | "TRANSFERRED"
        | "WORK_FINISHED"
      Role: "NURSE" | "DOCTOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

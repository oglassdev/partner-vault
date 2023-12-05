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
      invites: {
        Row: {
          from_id: string
          id: string
          team_id: string
          to_id: string
        }
        Insert: {
          from_id: string
          id?: string
          team_id: string
          to_id: string
        }
        Update: {
          from_id?: string
          id?: string
          team_id?: string
          to_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invites_from_id_fkey"
            columns: ["from_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_to_id_fkey"
            columns: ["to_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      partner_tags: {
        Row: {
          partner_id: string
          tag_id: string
        }
        Insert: {
          partner_id: string
          tag_id: string
        }
        Update: {
          partner_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_tags_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      partners: {
        Row: {
          contacts: string[] | null
          created_at: string
          id: string
          image: string | null
          name: string
          team_id: string
          type: string | null
        }
        Insert: {
          contacts?: string[] | null
          created_at?: string
          id?: string
          image?: string | null
          name: string
          team_id: string
          type?: string | null
        }
        Update: {
          contacts?: string[] | null
          created_at?: string
          id?: string
          image?: string | null
          name?: string
          team_id?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_image_fkey"
            columns: ["image"]
            isOneToOne: false
            referencedRelation: "objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partners_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          public_email: string | null
          username: string | null
        }
        Insert: {
          id: string
          public_email?: string | null
          username?: string | null
        }
        Update: {
          id?: string
          public_email?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      roles: {
        Row: {
          color: number | null
          created_at: string
          id: string
          name: string
          permissions: Json | null
          team_id: string
        }
        Insert: {
          color?: number | null
          created_at?: string
          id?: string
          name: string
          permissions?: Json | null
          team_id: string
        }
        Update: {
          color?: number | null
          created_at?: string
          id?: string
          name?: string
          permissions?: Json | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          color: number | null
          created_at: string
          description: string | null
          id: string
          name: string
          team_id: string
        }
        Insert: {
          color?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          team_id: string
        }
        Update: {
          color?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          name: string
          owner: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_teams: {
        Row: {
          role_id: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          role_id?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          role_id?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_teams_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_teams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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

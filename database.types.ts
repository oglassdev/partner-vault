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
      invites: {
        Row: {
          from_id: string
          team_id: string
          to_id: string
        }
        Insert: {
          from_id: string
          team_id: string
          to_id: string
        }
        Update: {
          from_id?: string
          team_id?: string
          to_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invites_from_id_fkey"
            columns: ["from_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
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
          display_name: string
          id: string
          public_email: string | null
          username: string
        }
        Insert: {
          display_name?: string
          id: string
          public_email?: string | null
          username: string
        }
        Update: {
          display_name?: string
          id?: string
          public_email?: string | null
          username?: string
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
      accept_team_invites: {
        Args: {
          teams: string[]
        }
        Returns: undefined
      }
      check_user_in_team: {
        Args: {
          team: string
        }
        Returns: boolean
      }
      insert_partner: {
        Args: {
          partner: Json
          tag_ids: string[]
        }
        Returns: undefined
      }
      search_invitable_profiles: {
        Args: {
          search: string
          user_id: string
          current_team_id: string
        }
        Returns: {
          display_name: string
          id: string
          public_email: string | null
          username: string
        }[]
      }
      update_partner_and_tags: {
        Args: {
          p_partner_id: string
          partner_details: Json
          tag_ids: string[]
        }
        Returns: undefined
      }
      update_partner_tags: {
        Args: {
          delete_values: Json
          insert_values: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

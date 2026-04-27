export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Role = 'platform_admin' | 'school_admin' | 'driver' | 'parent'
export type AttendanceStatus = 'boarded' | 'absent'
export type InviteRole = 'school_admin' | 'driver' | 'parent'

export interface RouteWaypoint {
  lat: number
  lng: number
  student_id: string
  stop_order: number
  eta_offset_min: number
}

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          name: string
          address: string
          starting_point: unknown // PostGIS GEOGRAPHY
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          starting_point: unknown
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          starting_point?: unknown
          created_by?: string | null
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: Role
          school_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: Role
          school_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: Role
          school_id?: string | null
        }
      }
      buses: {
        Row: {
          id: string
          school_id: string
          name: string
          capacity: number
          driver_id: string | null
          color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          capacity?: number
          driver_id?: string | null
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          capacity?: number
          driver_id?: string | null
          color?: string
          is_active?: boolean
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          school_id: string
          name: string
          parent_id: string | null
          home_address: string
          home_location: unknown // PostGIS GEOGRAPHY
          bus_id: string | null
          stop_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          parent_id?: string | null
          home_address: string
          home_location: unknown
          bus_id?: string | null
          stop_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          parent_id?: string | null
          home_address?: string
          home_location?: unknown
          bus_id?: string | null
          stop_order?: number | null
          updated_at?: string
        }
      }
      routes: {
        Row: {
          id: string
          school_id: string
          bus_id: string
          waypoints: RouteWaypoint[]
          total_distance_km: number | null
          total_duration_min: number | null
          encoded_polyline: string | null
          optimized_at: string
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          bus_id: string
          waypoints?: RouteWaypoint[]
          total_distance_km?: number | null
          total_duration_min?: number | null
          encoded_polyline?: string | null
          optimized_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          bus_id?: string
          waypoints?: RouteWaypoint[]
          total_distance_km?: number | null
          total_duration_min?: number | null
          encoded_polyline?: string | null
          optimized_at?: string
        }
      }
      bus_locations: {
        Row: {
          id: string
          bus_id: string
          location: unknown // PostGIS GEOGRAPHY
          heading: number | null
          speed: number | null
          timestamp: string
        }
        Insert: {
          id?: string
          bus_id: string
          location: unknown
          heading?: number | null
          speed?: number | null
          timestamp?: string
        }
        Update: {
          id?: string
          bus_id?: string
          location?: unknown
          heading?: number | null
          speed?: number | null
          timestamp?: string
        }
      }
      announcements: {
        Row: {
          id: string
          school_id: string | null
          bus_id: string | null
          sender_id: string | null
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          school_id?: string | null
          bus_id?: string | null
          sender_id?: string | null
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string | null
          bus_id?: string | null
          sender_id?: string | null
          message?: string
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string | null
          bus_id: string | null
          status: AttendanceStatus | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id?: string | null
          bus_id?: string | null
          status?: AttendanceStatus | null
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string | null
          bus_id?: string | null
          status?: AttendanceStatus | null
          date?: string
        }
      }
      invites: {
        Row: {
          id: string
          code: string
          role: InviteRole
          school_id: string | null
          bus_id: string | null
          student_ids: string[]
          created_by: string | null
          expires_at: string
          used_at: string | null
          used_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          role: InviteRole
          school_id?: string | null
          bus_id?: string | null
          student_ids?: string[]
          created_by?: string | null
          expires_at?: string
          used_at?: string | null
          used_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          role?: InviteRole
          school_id?: string | null
          bus_id?: string | null
          student_ids?: string[]
          expires_at?: string
          used_at?: string | null
          used_by?: string | null
        }
      }
      demo_requests: {
        Row: {
          id: string
          full_name: string
          school_name: string
          email: string
          phone: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          school_name: string
          email: string
          phone?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          school_name?: string
          email?: string
          phone?: string | null
          notes?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      get_user_role: {
        Args: Record<string, never>
        Returns: Role
      }
      get_user_school_id: {
        Args: Record<string, never>
        Returns: string
      }
      redeem_invite: {
        Args: { p_code: string; p_user_id: string }
        Returns: Json
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

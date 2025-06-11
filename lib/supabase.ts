import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: "user" | "organizer" | "admin"
          avatar_url: string | null
          bio: string | null
          phone: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: "user" | "organizer" | "admin"
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          location?: string | null
        }
        Update: {
          full_name?: string | null
          role?: "user" | "organizer" | "admin"
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          location?: string | null
        }
      }
      event_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          icon: string
          created_at: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          time: string | null
          end_time: string | null
          location: string | null
          venue_details: any
          capacity: number
          price: number
          currency: string
          category_id: string | null
          organizer_id: string
          image_url: string | null
          gallery: any
          tags: string[]
          requirements: string | null
          status: "active" | "cancelled" | "completed" | "draft"
          is_featured: boolean
          check_in_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          description?: string | null
          date: string
          time?: string | null
          end_time?: string | null
          location?: string | null
          venue_details?: any
          capacity?: number
          price?: number
          currency?: string
          category_id?: string | null
          organizer_id: string
          image_url?: string | null
          gallery?: any
          tags?: string[]
          requirements?: string | null
          status?: "active" | "cancelled" | "completed" | "draft"
          is_featured?: boolean
          check_in_code?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          date?: string
          time?: string | null
          end_time?: string | null
          location?: string | null
          venue_details?: any
          capacity?: number
          price?: number
          currency?: string
          category_id?: string | null
          image_url?: string | null
          gallery?: any
          tags?: string[]
          requirements?: string | null
          status?: "active" | "cancelled" | "completed" | "draft"
          is_featured?: boolean
          check_in_code?: string | null
        }
      }
      registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string
          status: "confirmed" | "cancelled" | "waitlist" | "checked_in"
          registration_data: any
          checked_in_at: string | null
          registered_at: string
        }
        Insert: {
          event_id: string
          user_id: string
          status?: "confirmed" | "cancelled" | "waitlist" | "checked_in"
          registration_data?: any
        }
        Update: {
          status?: "confirmed" | "cancelled" | "waitlist" | "checked_in"
          registration_data?: any
          checked_in_at?: string | null
        }
      }
      feedback: {
        Row: {
          id: string
          event_id: string
          user_id: string
          rating: number
          comment: string | null
          photos: any
          is_featured: boolean
          created_at: string
        }
        Insert: {
          event_id: string
          user_id: string
          rating: number
          comment?: string | null
          photos?: any
          is_featured?: boolean
        }
        Update: {
          rating?: number
          comment?: string | null
          photos?: any
          is_featured?: boolean
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: "info" | "success" | "warning" | "error" | "event_reminder" | "registration_confirmed"
          data: any
          read: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          title: string
          message: string
          type?: "info" | "success" | "warning" | "error" | "event_reminder" | "registration_confirmed"
          data?: any
          read?: boolean
        }
        Update: {
          read?: boolean
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          following_id: string
        }
      }
    }
  }
}

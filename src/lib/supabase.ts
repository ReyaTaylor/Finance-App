import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (will be auto-generated in production)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          currency: string
          timezone: string
          settings: Record<string, unknown>
          created_at: string
          updated_at: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          name: string
          income: number
          period_start: string | null
          period_end: string | null
          is_active: boolean
          budget_method: string
          settings: Record<string, unknown>
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['budgets']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['budgets']['Insert']>
      }
      categories: {
        Row: {
          id: string
          budget_id: string
          name: string
          type: string
          percentage: number
          allocated: number
          spent: number
          color: string
          icon: string | null
          sort_order: number
          is_system: boolean
          metadata: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      expenses: {
        Row: {
          id: string
          category_id: string
          user_id: string
          recurring_expense_id: string | null
          name: string
          amount: number
          expense_date: string
          due_date: string | null
          status: string
          expense_type: string
          tags: string[]
          notes: string | null
          receipt_url: string | null
          metadata: Record<string, unknown>
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['expenses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['expenses']['Insert']>
      }
    }
  }
}

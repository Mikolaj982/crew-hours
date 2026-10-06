import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_PUBLISHABLE_KEY environment variable')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

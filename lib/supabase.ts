import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client for use in API routes and server-side code.
 * Uses the service role key for full database access.
 */
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(url, key)
}

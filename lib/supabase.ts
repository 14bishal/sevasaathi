import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client — uses the service role key, bypasses RLS.
 * Only ever called from API routes and Server Components.
 * Never import this in 'use client' files.
 *
 * Note: We use an untyped client here and rely on @/lib/types for TypeScript
 * type safety at the call sites via explicit `as` casts after .select().
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

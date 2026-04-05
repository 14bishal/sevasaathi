import { supabase } from './supabase'
import { buildBaseSlug } from './slug-util'

export { buildBaseSlug }

export async function generateUniqueSlug(name: string): Promise<string> {
  const base = buildBaseSlug(name)

  // Fetch all existing slugs that match the base pattern in a single query
  const { data } = await supabase
    .from('workers')
    .select('slug')
    .ilike('slug', `${base}%`)

  if (!data || data.length === 0) return base

  const existingSlugs = new Set(data.map((w) => w.slug))
  if (!existingSlugs.has(base)) return base

  let counter = 2
  while (true) {
    const candidate = `${base}-${counter}`
    if (!existingSlugs.has(candidate)) return candidate
    counter++
  }
}

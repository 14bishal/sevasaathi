import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: workers } = await supabase
    .from('workers')
    .select('city, trade, slug, updated_at')
    .eq('is_active', true)

  const workerUrls: MetadataRoute.Sitemap = (workers ?? []).map((w) => ({
    url: `https://sevasaathi.in/${w.city}/${w.trade.toLowerCase()}/${w.slug}`,
    lastModified: new Date(w.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    { url: 'https://sevasaathi.in/', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://sevasaathi.in/register', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...workerUrls,
  ]
}

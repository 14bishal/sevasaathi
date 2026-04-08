import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import WorkerCard from '@/components/WorkerCard'
import type { WorkerWithRatings } from '@/lib/types'

export interface WorkerGridParams {
  trade?: string
  city?: string
  q?: string
  state?: string
}

async function getWorkers(trade?: string, city?: string, q?: string, state?: string): Promise<WorkerWithRatings[]> {
  let query = supabase
    .from('workers')
    .select('*, reviews(rating)')
    .eq('is_active', true)
    .order('is_verified', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48)

  if (trade) {
    query = query.eq('trade', trade)
  }
  if (city) {
    query = query.eq('city', city.toLowerCase().trim())
  }
  if (q) {
    query = query.or(`name.ilike.%${q}%,area.ilike.%${q}%,trade.ilike.%${q}%,city.ilike.%${q}%,state.ilike.%${q}%`)
  }
  if (state) {
    query = query.eq('state', state.toLowerCase().trim())
  }

  const { data, error } = await query
  if (error) {
    console.error('getWorkers error:', error)
    return []
  }
  return (data ?? []) as WorkerWithRatings[]
}

export function WorkerGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border animate-pulse" style={{ borderColor: '#f0ede9' }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gray-200 flex-shrink-0" />
            <div className="flex-1 mt-1">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t flex items-center justify-between">
            <div className="h-3 bg-gray-100 rounded w-1/4" />
            <div className="h-3 bg-gray-100 rounded w-1/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function WorkerGrid({ searchParamsPromise }: { searchParamsPromise: Promise<WorkerGridParams> }) {
  const { trade, city, q, state } = await searchParamsPromise;
  const workers = await getWorkers(trade, city, q, state)

  if (workers.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-charcoal)' }}>
          No workers found
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--color-charcoal-60)' }}>
          Try a different trade or area. Or help us grow!
        </p>
        {/* <Link
          href="/register"
          className="inline-block px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-amber-mid)', color: 'var(--color-amber-dark)' }}
        >
          Register as a Worker
        </Link> */}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {workers.map((worker) => (
        <WorkerCard key={worker.id} worker={worker} />
      ))}
    </div>
  )
}

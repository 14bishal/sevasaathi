import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ALL_TRADES } from '@/lib/constants'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import HomeFilters from '@/components/HomeFilters'
import WorkerGrid, { WorkerGridSkeleton, WorkerGridParams } from '@/components/WorkerGrid'
import { Suspense } from 'react'

interface HomePageProps {
  searchParams: Promise<WorkerGridParams>
}



async function getActiveTrades(): Promise<string[]> {
  const { data, error } = await supabase
    .from('trades')
    .select('name')
  // .eq('is_active', true)

  if (error || !data) return ALL_TRADES

  return data.map(t => t.name)
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const dynamicTrades = await getActiveTrades()
  const resolvedSearchParams = await searchParams

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-warm-bg)' }}>
      <Header
        variant="transparent"
        rightNode={
          <Link
            href="/register"
            id="nav-register-btn"
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-amber-mid)', color: 'var(--color-amber-dark)', boxShadow: 'var(--shadow-button)' }}
          >
            Register Your Trade
          </Link>
        }
      />

      <Suspense fallback={null}>
        <HomeFilters dynamicTrades={dynamicTrades} />
      </Suspense>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <Suspense key={JSON.stringify(resolvedSearchParams)} fallback={<WorkerGridSkeleton />}>
          <WorkerGrid searchParamsPromise={searchParams} />
        </Suspense>
      </main>

      {/* CTA Banner */}
      <section className="py-12 px-4 text-center" style={{ backgroundColor: 'var(--color-amber-light)' }}>
        <h2 className="text-2xl font-bold mb-2 text-black">Are you a skilled worker?</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-charcoal)' }}>
          Get your own free profile page — customers find you directly on Google.
        </p>
        <Link
          href="/register"
          id="cta-register-btn"
          className="inline-block px-8 py-3.5 rounded-xl font-bold transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-amber-mid)', color: 'var(--color-amber-light)', boxShadow: 'var(--shadow-button)' }}
        >
          Create My Free Profile →
        </Link>
      </section>

      <Footer />
    </div>
  )
}




import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import WorkerCard from '@/components/WorkerCard'
import type { WorkerWithRatings } from '@/lib/types'
import { ALL_TRADES } from '@/lib/constants'
import { getTradeLabel } from '@/lib/constants'
import Form from 'next/form'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

interface HomePageProps {
  searchParams: Promise<{ trade?: string; city?: string; q?: string, state?: string }>
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
    query = query.or(`name.ilike.%${q}%,area.ilike.%${q}%,trade.ilike.%${q}%`)
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

async function getActiveTrades(): Promise<string[]> {
  const { data, error } = await supabase
    .from('trades')
    .select('name')
  // .eq('is_active', true)

  if (error || !data) return ALL_TRADES

  return data.map(t => t.name)
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { trade, city, q, state } = await searchParams
  const workers = await getWorkers(trade, city, q, state)
  const dynamicTrades = await getActiveTrades()
  const isFiltered = !!(trade || city || q)

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

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FAF9F6 0%, #FAEEDA 50%, #EF9F2710 100%)',
          paddingTop: '4rem',
          paddingBottom: '4rem',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: -80, right: -80,
            width: 320, height: 320, borderRadius: '50%',
            background: 'linear-gradient(135deg, #EF9F2720, #1D9E7510)',
            pointerEvents: 'none',
          }}
        />
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 mb-5"
            style={{ backgroundColor: 'var(--color-teal-light)', color: 'var(--color-teal-dark)' }}
          >
            <img src="https://img.icons8.com/?size=100&id=iwadWaGLpC8E&format=png&color=000000" width={24} height={24} alt="trusted" />
            Trusted. Local. Verified.
          </div>

          <h1
            className="text-3xl sm:text-5xl font-bold leading-tight mb-4"
            style={{ color: 'var(--color-charcoal)' }}
          >
            Find Skilled Workers
            <br />
            <span style={{ color: 'var(--color-amber-mid)' }}>Near You</span>
          </h1>
          <p className="text-base sm:text-lg max-w-xl mx-auto mb-8" style={{ color: 'var(--color-charcoal-60)' }}>
            Connect directly with verified carpenters, electricians, plumbers, and more — no middlemen, no app downloads.
          </p>

          {/* Search bar */}
          {/* <Form action="/" className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" role="search">
            <input
              type="text"
              name="q"
              id="search-input"
              defaultValue={q}
              placeholder="Search by name, city, trade…"
              className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none"
              style={{ borderColor: '#d9d4ce', backgroundColor: 'white', color: 'var(--color-charcoal)' }}
              aria-label="Search workers"
            />
            <input type="hidden" name="trade" value={trade ?? ''} />
            <input type="hidden" name="city" value={city ?? ''} />
            <input type="hidden" name="state" value={state ?? ''} />
            <button
              type="submit"
              id="search-btn"
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: 'var(--color-black)', color: 'white' }}
            >
              Search
            </button>
          </Form> */}
        </div>
      </section>

      {/* Trade filter pills */}
      <div className="bg-white border-b" style={{ borderColor: '#e8e4df' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-center gap-2 min-w-max" role="group" aria-label="Filter by trade">
            <a
              href="/"
              id="filter-all"
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap"
              style={!trade
                ? { backgroundColor: 'var(--color-amber-mid)', color: 'var(--color-amber-dark)' }
                : { backgroundColor: 'var(--color-amber-light)', color: 'var(--color-amber-dark)' }}
            >
              All Trades
            </a>
            {dynamicTrades.map((t) => {
              const params = new URLSearchParams()
              if (q) params.set('q', q)
              if (city) params.set('city', city)
              params.set('trade', t)

              return (
                <a
                  key={t}
                  href={`/?${params.toString()}`}
                  id={`filter-${t.toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 mx-1 rounded-full transition-colors whitespace-nowrap"
                  style={trade === t
                    ? { backgroundColor: 'var(--color-amber-mid)', color: 'var(--color-amber-dark)' }
                    : { backgroundColor: 'var(--color-amber-light)', color: 'var(--color-amber-dark)' }}
                  aria-current={trade === t ? 'page' : undefined}
                >
                  {getTradeLabel(t as string)}
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Workers grid */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-lg" style={{ color: 'var(--color-charcoal)' }}>
              {isFiltered ? 'Search Results' : 'Available Workers'}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-charcoal-60)' }}>
              {workers.length} worker{workers.length !== 1 ? 's' : ''} found
              {trade ? ` · ${getTradeLabel(trade as string)}` : ''}
              {city ? ` in ${city}` : ''}
            </p>
          </div>
          {isFiltered && (
            <a
              href="/"
              className="text-sm font-medium rounded-lg px-3 py-1.5 transition-colors"
              style={{ backgroundColor: 'var(--color-amber-light)', color: 'var(--color-amber-dark)' }}
            >
              Clear filters
            </a>
          )}
        </div> */}

        {workers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            {/* <div className="text-5xl mb-4">🔍</div> */}
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-charcoal)' }}>
              No workers found
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-charcoal-60)' }}>
              Try a different trade or area. Or help us grow!
            </p>
            <Link
              href="/register"
              className="inline-block px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-amber-mid)', color: 'var(--color-amber-dark)' }}
            >
              Register as a Worker
            </Link>
          </div>
        )}
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

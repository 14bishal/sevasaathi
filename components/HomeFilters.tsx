'use client'

import { useState, useEffect } from 'react'
import Form from 'next/form'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getTradeLabel } from '@/lib/constants'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      id="search-btn"
      disabled={pending}
      className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-2 ${pending ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:opacity-90 active:scale-95 hover:-translate-y-0.5 shadow-md hover:shadow-lg'}`}
      style={{ backgroundColor: 'var(--color-black)', color: 'white' }}
    >
      {pending ? (
        <>
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Searching...
        </>
      ) : (
        'Search'
      )}
    </button>
  )
}

interface HomeFiltersProps {
  dynamicTrades: string[]
}

export default function HomeFilters({ dynamicTrades }: HomeFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const trade = searchParams.get('trade') || ''
  const city = searchParams.get('city') || ''
  const state = searchParams.get('state') || ''

  const [searchQuery, setSearchQuery] = useState(q)

  useEffect(() => {
    setSearchQuery(q)
  }, [q])

  const handleClear = () => {
    setSearchQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.push(`/?${params.toString()}`)
  }

  return (
    <>
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
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 mb-5 rounded-full"
            style={{ backgroundColor: 'var(--color-teal-light)', color: 'var(--color-teal-dark)' }}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/5962/5962703.png" width={28} height={28} alt="trusted" />
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
          <Form action="/" className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" role="search">
            <div className="relative flex-1">
              <input
                type="text"
                name="q"
                id="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, city, trade…"
                className="w-full px-4 py-3 pr-10 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#d9d4ce', backgroundColor: 'white', color: 'var(--color-charcoal)' }}
                aria-label="Search workers"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="Clear search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            <input type="hidden" name="trade" value={trade} />
            <input type="hidden" name="city" value={city} />
            <input type="hidden" name="state" value={state} />
            <SubmitButton />
          </Form>
        </div>
      </section>

      {/* Trade filter pills */}
      <div className="bg-white border-b" style={{ borderColor: '#e8e4df' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-center gap-2 min-w-max" role="group" aria-label="Filter by trade">
            <Link
              href="/"
              id="filter-all"
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap"
              style={!trade
                ? { backgroundColor: 'var(--color-amber-mid)', color: 'var(--color-amber-dark)' }
                : { backgroundColor: 'var(--color-amber-light)', color: 'var(--color-amber-dark)' }}
            >
              All Trades
            </Link>
            {dynamicTrades.map((t) => {
              const params = new URLSearchParams()
              if (q) params.set('q', q)
              if (city) params.set('city', city)
              params.set('trade', t)

              return (
                <Link
                  key={t}
                  href={`/?${params.toString()}`}
                  id={`filter-${t.toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 mx-1 rounded-full transition-colors whitespace-nowrap"
                  style={trade === t
                    ? { backgroundColor: 'var(--color-amber-mid)', color: 'var(--color-amber-dark)' }
                    : { backgroundColor: 'var(--color-amber-light)', color: 'var(--color-amber-dark)' }}
                  aria-current={trade === t ? 'page' : undefined}
                >
                  {getTradeLabel(t)}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

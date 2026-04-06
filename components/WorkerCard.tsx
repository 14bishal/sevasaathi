'use client'

import Link from 'next/link'
import type { Trade } from '@/lib/types'
import { getTradeLabel } from '@/lib/constants'
import { formatTradeUrl } from '@/lib/trade'

interface WorkerCardProps {
  worker: {
    id: string
    name: string
    slug: string
    trade: Trade
    city: string
    area: string
    experience: number
    is_verified: boolean
    profile_pic_url: string | null
    reviews: { rating: number }[]
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <span style={{ color: 'var(--color-amber-mid)', fontSize: 14 }}>
        {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
      </span>
      <span className="text-xs" style={{ color: 'var(--color-charcoal-60)' }}>
        {rating.toFixed(1)} ({count})
      </span>
    </div>
  )
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  const profileUrl = `/${worker.city}/${formatTradeUrl(worker.trade)}/${worker.slug}`
  const avgRating =
    worker.reviews.length > 0
      ? worker.reviews.reduce((s, r) => s + r.rating, 0) / worker.reviews.length
      : null

  return (
    <Link
      href={profileUrl}
      id={`worker-card-${worker.slug}`}
      className="block bg-white rounded-2xl p-5 transition-all duration-200 group focus:outline-none focus-visible:ring-2"
      style={{
        boxShadow: 'var(--shadow-card)',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        ; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card-hover)'
          ; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        ; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)'
          ; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
      aria-label={`${worker.name} — ${getTradeLabel(worker.trade)} in ${worker.area}`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {worker.profile_pic_url ? (
          <img
            src={worker.profile_pic_url}
            alt={worker.name}
            className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
            style={{ backgroundColor: 'var(--color-amber-light)', color: 'var(--color-amber-dark)' }}
            aria-hidden="true"
          >
            {getInitials(worker.name)}
          </div>
        )}

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="font-bold text-base leading-tight" style={{ color: 'var(--color-charcoal)' }}>
              {worker.name}
            </h3>
            {worker.is_verified && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1"
                style={{ backgroundColor: 'var(--color-teal-light)', color: 'var(--color-teal-dark)' }}
              >
                Verified
              </span>
            )}
          </div>

          {/* Trade + experience */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'var(--color-amber-light)', color: 'var(--color-amber-dark)' }}
            >
              {getTradeLabel(worker.trade)}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-charcoal-60)' }}>
              {worker.experience} yr{worker.experience !== 1 ? 's' : ''} exp
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 mt-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-charcoal-60)', flexShrink: 0 }} aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-xs truncate" style={{ color: 'var(--color-charcoal-60)' }}>
              {worker.area},{' '}
              <span className="capitalize">{worker.city}</span>
            </span>
          </div>

          {/* Rating */}
          {avgRating !== null && (
            <div className="mt-2">
              <StarRating rating={avgRating} count={worker.reviews.length} />
            </div>
          )}
        </div>
      </div>

      {/* CTA hint */}
      <div
        className="mt-4 pt-3 text-xs font-semibold flex items-center justify-between border-t"
        style={{ borderColor: '#f0ede9', color: 'var(--color-amber-mid)' }}
      >
        View Profile
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transition: 'transform 0.2s' }} className="group-hover:translate-x-1" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}

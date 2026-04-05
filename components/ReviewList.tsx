'use client'

import { useState } from 'react'
import StarDisplay from './common/StarDisplay'

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

interface ReviewListProps {
  reviews: any[]
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const [showAll, setShowAll] = useState(false)

  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-sm py-4" style={{ color: 'var(--color-charcoal-60)' }}>
        No reviews yet. Be the first to leave a review!
      </p>
    )
  }

  const sorted = [...reviews].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const displayed = showAll ? sorted : sorted.slice(0, 2)

  return (
    <div>
      <div className="divide-y" style={{ borderColor: '#f0ede9' }}>
        {displayed?.map((review) => (
          <div key={review.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: 'var(--color-amber-light)', color: 'var(--color-amber-dark)' }}
                  aria-hidden="true"
                >
                  {getInitials(review.reviewer_name)}
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-charcoal)' }}>
                  {review.reviewer_name}
                </span>
              </div>
              <time dateTime={review.created_at} className="text-xs flex-shrink-0" style={{ color: 'var(--color-charcoal-60)' }}>
                {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </time>
            </div>
            <div className="mt-1.5 ml-10">
              <StarDisplay rating={review.rating} />
              {review.comment && (
                <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--color-charcoal)' }}>
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {sorted.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg transition-colors w-full"
          style={{ backgroundColor: 'var(--color-amber-light)', color: 'var(--color-amber-dark)' }}
        >
          {showAll ? 'Show less' : `View all ${reviews.length} reviews`}
        </button>
      )}
    </div>
  )
}

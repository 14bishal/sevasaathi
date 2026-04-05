'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitReview } from '@/lib/services/api'

interface ReviewFormProps {
  workerId: string
  onSuccess?: () => void
}

const STARS = [1, 2, 3, 4, 5]

export default function ReviewForm({ workerId, onSuccess }: ReviewFormProps) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [reviewerName, setReviewerName] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (rating === 0) {
      setError('Please select a star rating.')
      return
    }
    if (reviewerName.trim().length < 2) {
      setError('Please enter your name (at least 2 characters).')
      return
    }

    setSubmitting(true)
    try {
      await submitReview({
        worker_id: workerId,
        rating,
        comment: comment.trim() || undefined,
        reviewer_name: reviewerName.trim(),
      })

      setSuccess(true)
      setRating(0)
      setReviewerName('')
      setComment('')
      router.refresh()
      onSuccess?.()
    } catch (err: any) {
      setError(err?.data?.error || err?.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div
        className="rounded-2xl p-5 text-center"
        style={{ backgroundColor: 'var(--color-teal-light)' }}
      >
        <div className="text-3xl mb-2">🌟</div>
        <p className="font-semibold" style={{ color: 'var(--color-teal-dark)' }}>
          Thank you for your review!
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--color-teal-dark)', opacity: 0.8 }}>
          Your feedback helps others find trusted workers.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-3 text-sm underline"
          style={{ color: 'var(--color-teal-mid)' }}
        >
          Write another review
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star rating */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-charcoal)' }}>
          Your rating <span aria-hidden="true" style={{ color: 'var(--color-amber-mid)' }}>*</span>
        </label>
        <div className="flex gap-1" role="group" aria-label="Star rating">
          {STARS.map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-3xl transition-transform hover:scale-110 focus:outline-none"
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
              aria-pressed={rating === star}
            >
              <span style={{ color: star <= (hovered || rating) ? 'var(--color-amber-mid)' : '#d9d4ce' }}>
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="reviewer-name"
          className="block text-sm font-semibold mb-1"
          style={{ color: 'var(--color-charcoal)' }}
        >
          Your name <span aria-hidden="true" style={{ color: 'var(--color-amber-mid)' }}>*</span>
        </label>
        <input
          id="reviewer-name"
          type="text"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="e.g. Priya Gupta"
          maxLength={60}
          className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors"
          style={{
            borderColor: '#d9d4ce',
            backgroundColor: 'white',
            color: 'var(--color-charcoal)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-amber-mid)')}
          onBlur={(e) => (e.target.style.borderColor = '#d9d4ce')}
        />
      </div>

      {/* Comment */}
      <div>
        <label
          htmlFor="review-comment"
          className="block text-sm font-semibold mb-1"
          style={{ color: 'var(--color-charcoal)' }}
        >
          Review <span className="font-normal" style={{ color: 'var(--color-charcoal-60)' }}>(optional)</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was your experience? (max 500 characters)"
          maxLength={500}
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors resize-none"
          style={{
            borderColor: '#d9d4ce',
            backgroundColor: 'white',
            color: 'var(--color-charcoal)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-amber-mid)')}
          onBlur={(e) => (e.target.style.borderColor = '#d9d4ce')}
        />
        <div className="text-right text-xs mt-0.5" style={{ color: 'var(--color-charcoal-60)' }}>
          {comment.length}/500
        </div>
      </div>

      {error && (
        <p className="text-sm rounded-lg px-3 py-2" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        id="submit-review-btn"
        disabled={submitting}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-60"
        style={{ backgroundColor: 'var(--color-amber-mid)', color: 'var(--color-amber-dark)' }}
      >
        {submitting ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  )
}

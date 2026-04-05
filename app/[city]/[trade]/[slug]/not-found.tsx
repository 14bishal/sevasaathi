import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: 'var(--color-warm-bg)' }}>
      <div className="text-center max-w-md">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'var(--color-amber-light)' }}
        >
          <span className="text-3xl">🔍</span>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-charcoal)' }}>
          Worker not found
        </h1>
        <p className="text-base mb-8" style={{ color: 'var(--color-charcoal-60)' }}>
          This profile doesn't exist or may have been removed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-amber-mid)', color: 'var(--color-amber-dark)' }}
          >
            ← Browse Workers
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-colors"
            style={{ borderColor: 'var(--color-charcoal)', color: 'var(--color-charcoal)' }}
          >
            Register as a Worker
          </Link>
        </div>
      </div>
    </div>
  )
}

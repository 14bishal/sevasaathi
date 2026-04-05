'use client'

import Link from 'next/link'

export default function WorkerDashboard() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-warm-bg)' }}>
      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: '#e8e4df' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold" style={{ color: 'var(--color-amber-dark)' }}>
            Sevasaathi
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'var(--color-teal-light)' }}
        >
          <span className="text-3xl">🔧</span>
        </div>

        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-charcoal)' }}>
          Worker Dashboard
        </h1>
        <p className="text-base max-w-md mx-auto mb-8" style={{ color: 'var(--color-charcoal-60)' }}>
          Your personal dashboard is coming in <strong>Phase 3</strong>. It will show your leads, reviews, and profile views — and let you update your profile.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
          {[
            { label: 'Phone calls', icon: '📞', desc: 'Coming soon' },
            { label: 'WhatsApp taps', icon: '💬', desc: 'Coming soon' },
            { label: 'Star rating', icon: '⭐', desc: 'Coming soon' },
          ].map(({ label, icon, desc }) => (
            <div key={label} className="bg-white rounded-2xl p-5 text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="text-3xl mb-2">{icon}</div>
              <div className="font-semibold text-sm" style={{ color: 'var(--color-charcoal)' }}>{label}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-charcoal-60)' }}>{desc}</div>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-amber-mid)', color: 'var(--color-amber-dark)' }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

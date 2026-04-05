'use client'

import { useState } from 'react'
import Header from '@/components/common/Header'
import RegisterForm from './components/RegisterForm'
import RegisterSuccess from './components/RegisterSuccess'
import Link from 'next/link'

export default function RegisterPage() {
  const [success, setSuccess] = useState<{ profileUrl: string; phone: string } | null>(null)

  if (success) {
    return <RegisterSuccess
      profileUrl={success?.profileUrl}
      phone={success?.phone}
      onReset={() => setSuccess(null)}
    />
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-warm-bg)' }}>
      {/* Header */}
      <Header
        rightNode={
          <Link href="/" className="text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90" style={{ backgroundColor: 'var(--color-amber-mid)', color: 'var(--color-amber-dark)', boxShadow: 'var(--shadow-button)' }}>
            Browse Workers
          </Link>
        }
      />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8" >
        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-charcoal)' }}>
            Register Your Trade
          </h1>
          <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--color-charcoal-60)' }}>
            Create your free profile on Madad. Customers find you on Google and call you directly.
          </p>
        </div>

        <RegisterForm onSuccess={setSuccess} />
      </main>
    </div>
  )
}

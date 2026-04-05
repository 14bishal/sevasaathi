import React, { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/common/Header'
import WhatsAppShareButton from '@/components/WhatsAppShareButton'

interface RegisterSuccessProps {
  profileUrl: string
  phone: string
  onReset: () => void
}

export default function RegisterSuccess({ profileUrl, phone, onReset }: RegisterSuccessProps) {
  const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}${profileUrl}`

  const [copy, setCopy] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopy(true)
  }

  return (
    <>
      <Header />
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--color-warm-bg)' }}>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center" style={{ boxShadow: 'var(--shadow-card-hover)' }}>
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-charcoal)' }}>
            Your profile is live!
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--color-charcoal-60)' }}>
            Customers can now find you on Madad. Share your profile link to get more work.
          </p>

          <div
            className="rounded-xl p-4 mb-5 text-left"
            style={{ backgroundColor: 'var(--color-amber-light)' }}
          >
            <div className='flex items-center justify-between mb-1'>
              <p className="text-xs font-semibold" style={{ color: 'var(--color-amber-dark)' }}>Your profile URL</p>
              <div onClick={handleCopy} className='cursor-pointer'>
                <img src={copy ?
                  "https://img.icons8.com/?size=100&id=59850&format=png&color=000000" :
                  "https://img.icons8.com/?size=100&id=AGLXTiVVflkt&format=png&color=000000"}
                  width={16} height={16} alt='copy'
                />
              </div>
            </div>
            <a
              href={profileUrl}
              className="text-sm font-medium break-all hover:underline"
              style={{ color: 'var(--color-amber-dark)' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {process.env.NEXT_PUBLIC_APP_URL}{profileUrl}
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={profileUrl}
              id="view-profile-btn"
              className="block w-full py-3.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-amber-mid)', color: 'var(--color-amber-dark)', boxShadow: 'var(--shadow-button)' }}
            >
              View My Profile
            </a>
            <WhatsAppShareButton phone={phone} fullUrl={fullUrl} />
            <button
              onClick={onReset}
              className="text-sm underline mt-1"
              style={{ color: 'var(--color-charcoal-60)' }}
            >
              Register another worker
            </button>
            <Link
              href="/"
              className="text-sm underline mt-1"
              style={{ color: 'var(--color-charcoal-60)' }}
            >
              Back to Home Page
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

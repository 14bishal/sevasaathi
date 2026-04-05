'use client'

import { useState } from 'react'
import { logLead } from '@/lib/services/api'
import type { Trade } from '@/lib/types'
import { getTradeLabel } from '@/lib/constants'
import { buildWhatsAppUrl, buildWorkerContactMessage } from '@/lib/whatsapp'

interface ContactButtonsProps {
  workerId: string
  phone: string
  trade: Trade
  workerName: string
}

export default function ContactButtons({ workerId, phone, trade, workerName }: ContactButtonsProps) {
  const [callLoading, setCallLoading] = useState(false)
  const [waLoading, setWaLoading] = useState(false)

  async function handleCall() {
    if (callLoading) return
    setCallLoading(true)
    try {
      await logLead(workerId, 'CALL')
    } finally {
      setCallLoading(false)
      window.location.href = `tel:${phone}`
    }
  }

  async function handleWhatsApp() {
    if (waLoading) return
    setWaLoading(true)
    try {
      await logLead(workerId, 'WHATSAPP')
    } finally {
      setWaLoading(false)
      const tradeLabel = getTradeLabel(trade as string)
      const message = buildWorkerContactMessage(workerName, tradeLabel)
      window.open(buildWhatsAppUrl(phone, message), '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        id="call-now-btn"
        onClick={handleCall}
        disabled={callLoading}
        className="w-full flex items-center justify-center gap-1 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-70 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          backgroundColor: 'var(--color-amber-mid)',
          color: 'var(--color-amber-dark)',
          boxShadow: 'var(--shadow-button)',
        }}
        aria-label={`Call ${workerName} now`}
      >
        {callLoading ? (
          <span className="animate-pulse">Connecting…</span>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#633806" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 6.72 6.72l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call Now
          </>
        )}
      </button>

      <button
        id="whatsapp-btn"
        onClick={handleWhatsApp}
        disabled={waLoading}
        className="w-full flex items-center justify-center gap-1 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-70 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          backgroundColor: 'var(--color-teal-light)',
          color: 'var(--color-teal-dark)',
          border: '1.5px solid var(--color-teal-mid)',
        }}
        aria-label={`WhatsApp ${workerName}`}
      >
        {waLoading ? (
          <span className="animate-pulse">Opening…</span>
        ) : (
          <>
            <img src='https://img.icons8.com/?size=100&id=16713&format=png&color=000000' width={24} height={24} alt='whatsapp' />
            WhatsApp
          </>
        )}
      </button>
    </div>
  )
}

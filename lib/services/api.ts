import type { Trade } from '../types'

interface RegisterWorkerPayload {
  name: string
  phone: string
  whatsapp?: string
  trade: string
  city: string
  area: string
  state: string
  pincode?: string
  experience: number
  bio?: string
}

export async function registerWorker(data: RegisterWorkerPayload) {
  const res = await fetch('/api/workers/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) {
    throw { response: res, data: json }
  }
  return json
}

export async function submitReview(data: { worker_id: string; rating: number; comment?: string; reviewer_name: string }) {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) {
    throw { response: res, data: json }
  }
  return json
}

export async function logLead(workerId: string, source: 'CALL' | 'WHATSAPP') {
  try {
    await fetch('/api/workers/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ worker_id: workerId, source }),
    })
  } catch (e) {
    console.error('Failed to log lead', e)
  }
}

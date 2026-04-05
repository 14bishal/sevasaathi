/**
 * Builds a WhatsApp deep-link URL for an Indian mobile number.
 * Opens directly in the WhatsApp app on mobile.
 */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const number = `91${phone}`
  const encoded = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${number}${encoded}`
}

/**
 * Default greeting message sent when a customer taps WhatsApp on a worker profile.
 */
export function buildWorkerContactMessage(workerName: string, trade: string): string {
  return `Hi ${workerName}, I found your profile on Madad. I need a ${trade.toLowerCase()} — are you available?`
}

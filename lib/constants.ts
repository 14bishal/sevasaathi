import { formatTradeDisplay } from "./trade"

export const ALL_TRADES: string[] = [
  'ELECTRICIAN', 'PLUMBER', 'CARPENTER', 'PAINTER',
  'MECHANIC', 'WELDER', 'AC_TECHNICIAN', 'CONSTRUCTION',
]

export function getTradeLabel(trade: string): string {
  return formatTradeDisplay(trade)
}

// export const TRADE_LABELS: Record<string, string> = {
//   ELECTRICIAN: 'Electrician',
//   PLUMBER: 'Plumber',
//   CARPENTER: 'Carpenter',
//   PAINTER: 'Painter',
//   MECHANIC: 'Mechanic',
//   WELDER: 'Welder',
//   AC_TECHNICIAN: 'AC Technician',
//   CONSTRUCTION: 'Construction',
// }

// export function getTradeLabel(trade: string | null | undefined): string {
//   if (!trade) return ''
//   return TRADE_LABELS[trade] || trade
// }

export const INITIAL_FORM = {
  name: '',
  phone: '',
  whatsapp: '',
  trade: '',
  city: '',
  state: '',
  area: '',
  pincode: '',
  experience: '',
  bio: '',
}

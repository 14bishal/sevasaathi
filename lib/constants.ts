import { formatTradeDisplay } from "./trade"

export const ALL_TRADES: string[] = [
  'ELECTRICIAN', 'PLUMBER', 'CARPENTER', 'PAINTER',
  'MECHANIC', 'WELDER', 'AC_TECHNICIAN', 'CONSTRUCTION',
]

export function getTradeLabel(trade: string): string {
  return formatTradeDisplay(trade)
}

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

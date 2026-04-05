// Shared TypeScript types for Sevasaathi — replaces Prisma's generated types.
// Keep in sync with the Supabase table columns.

export type Trade =
  | 'ELECTRICIAN'
  | 'PLUMBER'
  | 'CARPENTER'
  | 'PAINTER'
  | 'MECHANIC'
  | 'WELDER'
  | 'AC_TECHNICIAN'
  | 'CONSTRUCTION'
  | (string & {})

export type LeadSource = 'CALL' | 'WHATSAPP'

export interface Worker {
  id: string
  name: string
  slug: string
  phone: string
  whatsapp: string | null
  trade: Trade
  city: string
  area: string
  pincode: string | null
  experience: number
  bio: string | null
  profile_pic_url: string | null
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  state: string
}

export interface Review {
  id: string
  worker_id: string
  rating: number
  comment: string | null
  reviewer_name: string
  created_at: string
}

export interface Lead {
  id: string
  worker_id: string
  source: LeadSource
  created_at: string
}

/** Worker row joined with its reviews (used on the profile page) */
export interface WorkerWithReviews extends Worker {
  reviews: Review[]
}

/** Minimal review shape used on worker cards (just the rating) */
export type ReviewRating = Pick<Review, 'rating'>

/** Worker row joined with minimal review ratings (used on the homepage grid) */
export interface WorkerWithRatings extends Worker {
  reviews: ReviewRating[]
}

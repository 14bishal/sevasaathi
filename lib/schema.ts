import { z } from 'zod'

export const TradeEnum = z.string().min(2, 'Trade must be at least 2 characters').max(50, 'Trade must be less than 50 characters')

export const WorkerRegistrationSchema = z.object({
  name: z.string().min(2).max(60),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  whatsapp: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional()
    .or(z.literal('')),
  trade: TradeEnum,
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(50),
  area: z.string().min(2).max(80),
  pincode: z
    .string()
    .regex(/^\d{6}$/)
    .optional()
    .or(z.literal('')),
  experience: z.coerce.number().min(0).max(50),
  bio: z.string().max(300).optional().or(z.literal('')),
  profile_pic_url: z.string().url().optional(),
})

export type WorkerRegistrationInput = z.infer<typeof WorkerRegistrationSchema>

export const LeadSchema = z.object({
  worker_id: z.string(),
  source: z.enum(['CALL', 'WHATSAPP']),
})

export const ReviewSchema = z.object({
  worker_id: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(500).optional().or(z.literal('')),
  reviewer_name: z.string().min(2).max(60),
})

export type ReviewInput = z.infer<typeof ReviewSchema>

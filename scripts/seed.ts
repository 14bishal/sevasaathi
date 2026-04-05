/**
 * Seed script — run with: npm run seed
 * Inserts sample workers + reviews directly via Supabase.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import { buildBaseSlug } from '../lib/slug-util'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const workers = [
  {
    name: 'Ramesh Kumar',
    phone: '9876543210',
    whatsapp: '9876543210',
    trade: 'ELECTRICIAN',
    city: 'delhi',
    area: 'Lajpat Nagar',
    pincode: '110024',
    experience: 12,
    bio: 'Expert in domestic wiring, inverter setup, and MCB board upgrades. Available 7 days.',
    is_verified: true,
  },
  {
    name: 'Suresh Plumber',
    phone: '9876543211',
    whatsapp: null,
    trade: 'PLUMBER',
    city: 'delhi',
    area: 'Saket',
    pincode: '110017',
    experience: 8,
    bio: 'Specialise in bathroom fittings, pipe leaks, and geyser installation.',
    is_verified: false,
  },
  {
    name: 'Mohan Carpenter',
    phone: '9876543212',
    whatsapp: '9876543212',
    trade: 'CARPENTER',
    city: 'mumbai',
    area: 'Andheri West',
    pincode: '400053',
    experience: 15,
    bio: 'Custom furniture, modular kitchen, and door fitting. Free measurement visit.',
    is_verified: true,
  },
  {
    name: 'Vikram AC Tech',
    phone: '9876543213',
    whatsapp: '9876543213',
    trade: 'AC_TECHNICIAN',
    city: 'mumbai',
    area: 'Powai',
    pincode: '400076',
    experience: 6,
    bio: 'AC servicing, gas refilling, and new installation. Same-day service available.',
    is_verified: true,
  },
  {
    name: 'Arjun Painter',
    phone: '9876543214',
    whatsapp: null,
    trade: 'PAINTER',
    city: 'delhi',
    area: 'Dwarka',
    pincode: '110078',
    experience: 9,
    bio: 'Interior and exterior painting, texture and putty work. Quick and clean.',
    is_verified: false,
  },
]

async function seed() {
  console.log('🌱 Seeding workers…')

  for (const w of workers) {
    const slug = buildBaseSlug(w.name)

    const { data: worker, error } = await supabase
      .from('workers')
      .upsert({ ...w, slug }, { onConflict: 'slug', ignoreDuplicates: false })
      .select('id, name')
      .single()

    if (error) {
      console.error(`❌ Failed to upsert ${w.name}:`, error.message)
      continue
    }

    console.log(`✅ ${worker.name} (id: ${worker.id})`)

    // Add reviews for verified workers
    if (w.is_verified) {
      await supabase.from('reviews').upsert([
        { worker_id: worker.id, rating: 5, comment: 'Excellent work, highly recommended!', reviewer_name: 'Priya Sharma' },
        { worker_id: worker.id, rating: 4, comment: 'Good work, came on time.', reviewer_name: 'Anil Mehta' },
      ], { ignoreDuplicates: true })
    }
  }

  console.log('\n✨ Seed complete.')
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { WorkerRegistrationSchema } from '@/lib/schema'
import { buildBaseSlug, generateUniqueSlug } from '@/lib/slug'
import { formatTradeSlug, formatTradeUrl } from '@/lib/trade'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = WorkerRegistrationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data
    const slug = await generateUniqueSlug(data.name)
    const city = buildBaseSlug(data.city)
    const trade = formatTradeSlug(data.trade)

    // Validate trade exists in trades table
    const { data: tradeExists } = await supabase
      .from('trades')
      .select('name')
      .eq('name', trade)
      .single()

    if (!tradeExists) {
      return NextResponse.json(
        { error: { trade: ['Invalid trade. Please select or create a valid trade.'] } },
        { status: 400 }
      )
    }

    const { data: worker, error } = await supabase
      .from('workers')
      .insert({
        name: data.name,
        slug,
        phone: data.phone,
        whatsapp: data.whatsapp || null,
        trade,                          // formatTradeSlug — "ac technician" → "ac_technician"
        city,                           // buildBaseSlug   — "East Sikkim"  → "east-sikkim"
        state: data.state,
        area: data.area,
        pincode: data.pincode || null,
        experience: data.experience,
        bio: data.bio || null,
      })
      .select('id, name, slug, phone, trade, city, state')
      .single()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json(
        { error: 'Failed to create profile. Please try again.' },
        { status: 500 }
      )
    }

    const profileUrl = `/${worker.city}/${formatTradeUrl(worker.trade)}/${worker.slug}`

    return NextResponse.json({ success: true, profileUrl, worker })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
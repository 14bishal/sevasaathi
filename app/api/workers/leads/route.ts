import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { LeadSchema } from '@/lib/schema'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = LeadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { worker_id, source } = parsed.data

    const { error } = await supabase
      .from('leads')
      .insert({ worker_id, source })

    if (error) {
      console.error('Lead insert error:', error)
      // Non-fatal — don't block the UX if lead logging fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Leads error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ReviewSchema } from '@/lib/schema'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = ReviewSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { worker_id, rating, comment, reviewer_name } = parsed.data

    // Verify worker exists before inserting review
    const { data: worker, error: workerError } = await supabase
      .from('workers')
      .select('id')
      .eq('id', worker_id)
      .eq('is_active', true)
      .maybeSingle()

    if (workerError || !worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 })
    }

    const { error } = await supabase.from('reviews').insert({
      worker_id,
      rating,
      comment: comment || null,
      reviewer_name,
    })

    if (error) {
      console.error('Review insert error:', error)
      return NextResponse.json(
        { error: 'Failed to submit review. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Review error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

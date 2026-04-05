// app/api/trades/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { formatTradeSlug } from '@/lib/trade'
import { z } from 'zod'

const TradeSchema = z.object({
    name: z.string().min(2).max(50)
})

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('trades')
            .select('name')
            .order('name', { ascending: true })

        if (error) throw error

        return NextResponse.json({ trades: data.map(t => t.name) })

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const parsed = TradeSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        // Always store as lowercase slug
        const slug = formatTradeSlug(parsed.data.name)

        // Upsert — if trade already exists, don't error, just return it
        const { data, error } = await supabase
            .from('trades')
            .upsert({ name: slug }, { onConflict: 'name' })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ trade: data.name })

    } catch (error) {
        return NextResponse.json({ error: 'Failed to create trade' }, { status: 500 })
    }
}
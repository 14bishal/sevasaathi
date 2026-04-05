import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Limit upload to 1MB (1,048,576 bytes) to protect Supabase Storage
    if (file.size > 1048576) {
      return NextResponse.json({ error: 'File size exceeds the 1MB limit' }, { status: 413 })
    }

    // File name is safely validated on the client and passed back
    const fileName = file.name || `profile-${Date.now()}.webp`

    // Convert the Web File object to an ArrayBuffer/Buffer sequence.
    // Supabase JS running in Node.js environments sometimes fails to digest Next.js standard 'File' objects directly.
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload it to Supabase
    // We expect a bucket named 'profiles' to exist and be public
    const { data, error } = await supabase.storage
      .from('profiles')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (error) {
      console.error('Supabase upload error DETAILS:', error)
      return NextResponse.json({
        error: 'Failed to upload to storage. Check if the "profiles" bucket exists.',
        details: error
      }, { status: 500 })
    }

    // Get the final public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName)

    return NextResponse.json({ publicUrl })
  } catch (error) {
    console.error('Upload route error:', error)
    return NextResponse.json({ error: 'Internal server error during upload' }, { status: 500 })
  }
}

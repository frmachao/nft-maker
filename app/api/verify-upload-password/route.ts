import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const validPasswords = process.env.UPLOAD_PASSWORD?.split(',') || []
    
    if (!validPasswords.includes(password)) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    return NextResponse.json({ valid: true })
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
} 
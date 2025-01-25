import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { signToken } from '@/lib/jwt'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (
    username === process.env.USER_NAME &&
    password === process.env.PASSWORD
  ) {
    const token = await signToken(username)
    
    cookies().set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    { success: false, message: "Invalid credentials" },
    { status: 401 }
  )
} 
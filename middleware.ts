import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth")
  const isAuthenticated = authCookie?.value && await verifyToken(authCookie.value)
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard")
  const isLoginPage = request.nextUrl.pathname === "/dashboard/login"

  if (isDashboard && !isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard/login", request.url))
  }

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/dashboard/:path*",
} 
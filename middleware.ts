import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
  // 处理 /api/nft-mints 的 CORS
  if (request.nextUrl.pathname === '/api/nft-mints' && 
      (request.method === 'GET' || request.method === 'OPTIONS')) {
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }

  // 原有的认证逻辑
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
  matcher: ['/dashboard/:path*', '/api/nft-mints']
} 
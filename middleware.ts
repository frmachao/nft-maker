import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
  // 处理 /api/nft-mints 的 CORS，不需要认证
  if (request.nextUrl.pathname === '/api/nft-mints' && 
      (request.method === 'GET' || request.method === 'OPTIONS')) {
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }

  // 认证逻辑 - 现在适用于所有页面（除了登录页面）
  const authCookie = request.cookies.get("auth")
  const isAuthenticated = authCookie?.value && await verifyToken(authCookie.value)
  const isLoginPage = request.nextUrl.pathname === "/login"
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')
  
  // API路由认证（除了公开接口）
  const publicApiRoutes = ['/api/nft-mints', '/api/auth/login', '/api/auth/logout']
  const isPublicApiRoute = publicApiRoutes.some(route => request.nextUrl.pathname === route)
  
  if (isApiRoute && !isPublicApiRoute) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  
  // 页面路由认证
  if (!isApiRoute && !isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // 如果已认证且访问登录页面，重定向到首页
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
} 
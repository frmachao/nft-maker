import * as jose from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET
)

export async function signToken(username: string) {
  return await new jose.SignJWT({ username })
    .setExpirationTime('7d')
    .setProtectedHeader({ alg: 'HS256' })
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET)
    return payload as { username: string }
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
} 
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { isAddress } from "viem"
import { Prisma } from "@prisma/client"
import { cookies } from "next/headers"
import { verifyToken } from '@/lib/jwt'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chainId = searchParams.get('chainId')

  if (!chainId) {
    return NextResponse.json(
      { error: "Missing chainId parameter" },
      { status: 400 }
    )
  }

  try {
    const nftMints = await prisma.nFTMint.findMany({
      where: {
        chainId: parseInt(chainId)
      },
      orderBy: { createdAt: "desc" },
    })
    
    return NextResponse.json(nftMints)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch NFT mints" },
      { status: 500 }
    )
  }
}

// 处理预检请求
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// 创建新的 NFT Mint
export async function POST(request: Request) {
  const authCookie = cookies().get("auth")
  
  if (!authCookie?.value || !verifyToken(authCookie.value)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const { address, chainId } = await request.json()
    
    if (!isAddress(address)) {
      return NextResponse.json(
        { error: "Invalid contract address" },
        { status: 400 }
      )
    }

    if (!chainId) {
      return NextResponse.json(
        { error: "Missing chainId" },
        { status: 400 }
      )
    }

    const nftMint = await prisma.nFTMint.create({
      data: { 
        address,
        chainId: parseInt(chainId)
      },
    })
    return NextResponse.json(nftMint)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Collection already exists on this chain" },
          { status: 400 }
        )
      }
    }
    return NextResponse.json(
      { error: "Failed to create NFT mint" },
      { status: 500 }
    )
  }
} 
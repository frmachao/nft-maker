import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { isAddress } from "viem"
import { Prisma } from "@prisma/client"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const nftMints = await prisma.nFTMint.findMany({
      orderBy: { createdAt: "desc" },
    })
    
    return new NextResponse(JSON.stringify(nftMints), {
      headers: {
        'Access-Control-Allow-Origin': 'https://mint-nft-single.vercel.app',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error(error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch NFT mints" }), 
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'https://mint-nft-single.vercel.app',
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

// 处理预检请求
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://mint-nft-single.vercel.app',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// 创建新的 NFT Mint
export async function POST(request: Request) {
  // 检查认证
  if (!cookies().has("auth")) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const { address } = await request.json()
    
    if (!isAddress(address)) {
      return NextResponse.json(
        { error: "Invalid contract address" },
        { status: 400 }
      )
    }

    const nftMint = await prisma.nFTMint.create({
      data: { address },
    })
    return NextResponse.json(nftMint)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Contract address already exists" },
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
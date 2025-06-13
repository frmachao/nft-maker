import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const creator = searchParams.get('creator')
  const chainId = searchParams.get('chainId')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!creator || !chainId) {
    return new NextResponse(
      JSON.stringify({ error: "Missing creator or chainId" }),
      { status: 400 }
    )
  }

  try {
    const skip = (page - 1) * limit

    const [collections, total] = await Promise.all([
      prisma.nFTCollection.findMany({
        where: {
          creator,
          chainId: parseInt(chainId),
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.nFTCollection.count({
        where: {
          creator,
          chainId: parseInt(chainId),
        },
      })
    ])
    
    return NextResponse.json({
      collections,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      }
    })
  } catch (error) {
    console.error(error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch collections" }), 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const collection = await prisma.nFTCollection.create({
      data: body,
    })
    return NextResponse.json(collection)
  } catch (error) {
    console.error(error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to create collection" }), 
      { status: 500 }
    )
  }
} 
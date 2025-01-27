import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const creator = searchParams.get('creator')
  const chainId = searchParams.get('chainId')

  if (!creator || !chainId) {
    return new NextResponse(
      JSON.stringify({ error: "Missing creator or chainId" }),
      { status: 400 }
    )
  }

  try {
    const collections = await prisma.nFTCollection.findMany({
      where: {
        creator,
        chainId: parseInt(chainId),
      },
      orderBy: { createdAt: "desc" },
    })
    
    return NextResponse.json(collections)
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
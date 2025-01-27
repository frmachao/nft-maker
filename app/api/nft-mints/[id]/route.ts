import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// 删除 NFT Mint
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 检查认证
  if (!cookies().has("auth")) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    await prisma.nFTMint.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to delete NFT mint" },
      { status: 500 }
    )
  }
} 
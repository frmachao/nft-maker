import { prisma } from "@/lib/prisma"
import { DataTable } from "./data-table"
import { columns } from "./columns"
// import { Button } from "@/components/ui/button"
// import { Plus } from "lucide-react"
import { AddNFTDialog } from "./add-nft-dialog"

export default async function Dashboard() {
  const nftMints = await prisma.nFTMint.findMany({
    orderBy: { createdAt: "desc" },
  })
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">NFT Collections</h1>
        <AddNFTDialog />
      </div>
      <DataTable columns={columns} data={nftMints} />
    </div>
  )
}
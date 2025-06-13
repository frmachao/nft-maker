"use client"

import { DataTable } from "./data-table"
import { columns } from "./columns"
import { AddNFTDialog } from "./add-nft-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sepolia, bsc } from 'viem/chains'
import { useState, useEffect, useCallback } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const chains = [
  { id: bsc.id, name: "BSC" },
  { id: sepolia.id, name: "Sepolia" },
]

export default function MintManagement() {
  const [selectedChainId, setSelectedChainId] = useState<number>(sepolia.id)
  const [nftMints, setNftMints] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNFTMints = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/nft-mints?chainId=${selectedChainId}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setNftMints(data)
    } catch (error) {
      console.error("Failed to fetch NFT mints:", error)
    } finally {
      setLoading(false)
    }
  }, [selectedChainId])

  useEffect(() => {
    fetchNFTMints()
  }, [fetchNFTMints])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        
        <div className="rounded-md border">
          <div className="border-b">
            <div className="flex h-10 items-center px-4">
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b">
              <div className="flex items-center space-x-4 p-4">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">铸造管理</h1>
            <Select
              value={selectedChainId.toString()}
              onValueChange={(value) => setSelectedChainId(parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                {chains.map((chain) => (
                  <SelectItem key={chain.id} value={chain.id.toString()}>
                    {chain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            管理将发布到NFT铸造应用程序的NFT集合。
          </p>
        </div>
        <AddNFTDialog chainId={selectedChainId} onSuccess={fetchNFTMints} />
      </div>
      <DataTable columns={columns({ onDelete: fetchNFTMints })} data={nftMints} />
    </div>
  )
}
'use client'

import { useAccount, usePublicClient } from 'wagmi'
import { contracts, NFTFactoryABI } from "@/config/contracts"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Stamp } from "lucide-react"
import { useEffect, useState } from 'react'
import { decodeEventLog,parseAbiItem } from 'viem'

interface Collection {
  creator: string
  collection: string
  name: string
  imageUrl: string
}

export default function CollectionsList() {
  const { address } = useAccount()
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const publicClient = usePublicClient()

  useEffect(() => {
    async function getCollections() {
      if (!address || !publicClient) return

      try {
        setIsLoading(true)
        const logs = await publicClient.getLogs({
          address: contracts.sepolia.NFTFactory,
          event: parseAbiItem('event CollectionCreated(address indexed creator, address indexed collection, string name, string imageUrl, uint256 maxSupply, uint256 mintPrice, uint256 mintStartTime, uint256 mintEndTime)'),
          args: {
            creator: address
          },
          fromBlock: 0n,
          toBlock: 'latest'
        })

        const collections = logs.map((log) => {
          const {
            args: { creator, collection, name, imageUrl }
          } = decodeEventLog({
            abi: NFTFactoryABI,
            data: log.data,
            topics: log.topics,
            eventName: 'CollectionCreated'
          })

          return {
            creator,
            collection,
            name,
            imageUrl
          }
        })

        setCollections(collections)
      } catch (error) {
        console.error('Failed to fetch collections:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getCollections()
  }, [address, publicClient])

  if (address&&isLoading) {
    return <LoadingSkeleton />
  }
  if (!address) {
    return <div>Please connect your wallet</div>
  }
  if (collections.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No collections found. Create your first NFT collection!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-2xl font-bold">Your Collections</h2>
      <div className="grid gap-4">
        {collections.map((collection) => (
          <Card key={collection.collection}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={collection.imageUrl} 
                    alt={collection.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold truncate">{collection.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono truncate">
                    {collection.collection}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/collection/${collection.collection}`}>
                      <Stamp className="h-4 w-4 mr-2" />
                      Mint NFT
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-9 w-28" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 
"use client";

import { useAccount, usePublicClient } from "wagmi";
import { contracts } from "@/config/contracts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Settings, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { AbiEvent } from "viem";
import { CollectionManageDialog } from "./collection-manage-dialog"
import { CollectionCreatedEvent } from "@/config/abis/NFTFactory"
import { useToast } from "@/hooks/use-toast"

export interface Collection {
  creator: string;
  collection: string;
  name: string;
  imageUrl: string;
  whitelistOnly: boolean;
  maxMintsPerWallet: number;
}

// 添加地址格式化函数
function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function CollectionsList() {
  const { address } = useAccount();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();
  const [selectedCollection, setSelectedCollection] = useState<Collection>({
    creator: "",
    collection: "",
    name: "",
    imageUrl: "",
    whitelistOnly: false,
    maxMintsPerWallet: 0,
  });
  const [manageDialogOpen, setManageDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast();
  const [copiedAddress, setCopiedAddress] = useState<string>("");

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function getCollections() {
      if (!address || !publicClient) return;
      try {
        setIsLoading(true);
        const logs = await publicClient.getLogs({
          address: contracts.sepolia.NFTFactory,
          event: CollectionCreatedEvent as AbiEvent,
          args: {
            creator: address,
          },
          fromBlock: 0n,
          toBlock: "latest",
        });
        const collections = logs.map((log) => {
          return log.args
        });
        setCollections(collections as unknown as Collection[]);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getCollections();
  }, [address, publicClient]);

  const handleCopy = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      toast({
        description: "Address copied to clipboard",
      });
      setTimeout(() => setCopiedAddress(""), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
      toast({
        variant: "destructive",
        description: "Failed to copy address",
      });
    }
  };

  if (!mounted) {
    return <div className="mt-8">Loading...</div>
  }

  if (address && isLoading) {
    return <LoadingSkeleton />;
  }
  if (!address) {
    return <div>Please connect your wallet</div>;
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
    );
  }

  return (
    <div className="mt-8 space-y-4 max-w-full">
      <h2 className="text-2xl font-bold">Your Collections</h2>
      <div className="space-y-4">
        {collections.map((collection) => (
          <Card key={collection.collection}>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              {/* Top Row: Thumbnail and Info */}
              <div className="flex items-center gap-4 min-w-[200px]">
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
                  <button
                    onClick={() => handleCopy(collection.collection)}
                    className="flex items-center gap-2 group hover:text-primary transition-colors"
                    title={collection.collection}
                  >
                    <p className="text-sm text-muted-foreground font-mono group-hover:text-primary">
                      {formatAddress(collection.collection)}
                    </p>
                    {copiedAddress === collection.collection ? (
                      <Check className="h-4 w-4 shrink-0" />
                    ) : (
                      <Copy className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto justify-center sm:flex-1 items-center">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/collection/${collection.collection}`}>
                    Details
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCollection(collection)
                    setManageDialogOpen(true)
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        ))}
      </div>
      {selectedCollection && (
        <CollectionManageDialog
          open={manageDialogOpen}
          onOpenChange={setManageDialogOpen}
          collection={selectedCollection}
        />
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mt-8 space-y-4 min-w-full">
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
  );
}

"use client";

import { useReadContracts } from "wagmi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { NFTCollectionABI } from "@/config/abis/NFTCollection";

interface CollectionCardProps {
  address: string;
}

// 地址格式化函数
function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function CollectionCard({ address }: CollectionCardProps) {
  const { toast } = useToast();
  const [copiedAddress, setCopiedAddress] = useState<string>("");

  const { data, isLoading, error } = useReadContracts({
    contracts: [
      {
        address: address as `0x${string}`,
        abi: NFTCollectionABI,
        functionName: "name",
      },
      {
        address: address as `0x${string}`,
        abi: NFTCollectionABI,
        functionName: "description",
      },
      {
        address: address as `0x${string}`,
        abi: NFTCollectionABI,
        functionName: "image",
      },
    ],
  });

  const handleCopy = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      toast({
        description: "地址已复制到剪贴板",
      });
      setTimeout(() => setCopiedAddress(""), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
      toast({
        variant: "destructive",
        description: "复制地址失败",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            {/* Loading skeleton */}
            <div className="flex items-center gap-4 min-w-[200px]">
              <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
              <div className="flex-grow min-w-0 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto justify-center sm:flex-1 items-center">
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-red-500">
            加载合约数据失败
          </div>
        </CardContent>
      </Card>
    );
  }

  const [nameResult, descriptionResult, imageResult] = data;
  const name = nameResult.result as string;
  const description = descriptionResult.result as string;
  const imageUrl = imageResult.result as string;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4">
          {/* Thumbnail and Info */}
          <div className="flex items-start gap-4 min-w-[375px] flex-1">
            {/* Thumbnail */}
            <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={imageUrl}
                alt={name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-image.png"; // 可以添加一个默认图片
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-grow min-w-0 space-y-1">
              <h3 className="font-semibold truncate text-lg">{name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
              <button
                onClick={() => handleCopy(address)}
                className="flex items-center gap-2 group hover:text-primary transition-colors"
                title={address}
              >
                <p className="text-sm text-muted-foreground font-mono group-hover:text-primary">
                  {formatAddress(address)}
                </p>
                {copiedAddress === address ? (
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
              <Link href={`/collection/${address}`}>详情</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
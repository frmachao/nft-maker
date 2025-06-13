"use client";

import { useState } from "react";
import { useReadContracts } from "wagmi";
import { Skeleton } from "@/components/ui/skeleton";

import { NFTCollectionABI } from "@/config/abis/NFTCollection";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CollectionBasicInfoSectionProps {
  address: string;
}

// 地址格式化函数
function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function CollectionBasicInfoSection({ address }: CollectionBasicInfoSectionProps) {
  const [copiedAddress, setCopiedAddress] = useState<string>("");
  const { toast } = useToast();

  const { data, isLoading } = useReadContracts({
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
      <div className="space-y-6">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-48" />
      </div>
    );
  }

  const [nameResult, descriptionResult] = data || [];
  const name = nameResult?.result as string;
  const description = descriptionResult?.result as string;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">{name}</h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
        
        {/* 合约地址 */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">合约地址:</span>
          <button
            onClick={() => handleCopy(address)}
            className="flex items-center gap-2 group hover:text-primary transition-colors"
            title={address}
          >
            <span className="text-sm text-muted-foreground font-mono group-hover:text-primary">
              {formatAddress(address)}
            </span>
            {copiedAddress === address ? (
              <Check className="h-4 w-4 shrink-0 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 shrink-0" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useReadContract, useChainId } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUnits } from "viem";
import { NFTCollectionABI } from "@/config/abis/NFTCollection";
import { getNativeTokenSymbol } from "@/lib/chain";

interface CollectionMintPriceSectionProps {
  address: string;
}

export function CollectionMintPriceSection({ address }: CollectionMintPriceSectionProps) {
  const chainId = useChainId();
  
  const { data: mintPrice, isLoading } = useReadContract({
    address: address as `0x${string}`,
    abi: NFTCollectionABI,
    functionName: "mintPrice",
  });

  const nativeToken = chainId ? getNativeTokenSymbol(chainId) : "ETH";

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>铸造价格</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>铸造价格</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">
          {formatUnits(mintPrice as bigint, 18)} {nativeToken}
        </p>
      </CardContent>
    </Card>
  );
} 
"use client";

import { useReadContracts } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { NFTCollectionABI } from "@/config/abis/NFTCollection";

interface CollectionMintProgressSectionProps {
  address: string;
}

export function CollectionMintProgressSection({ address }: CollectionMintProgressSectionProps) {
  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        address: address as `0x${string}`,
        abi: NFTCollectionABI,
        functionName: "totalSupply",
      },
      {
        address: address as `0x${string}`,
        abi: NFTCollectionABI,
        functionName: "maxSupply",
      },
    ],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>铸造进度</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  const [totalSupplyResult, maxSupplyResult] = data || [];
  const totalSupply = Number(totalSupplyResult?.result) || 0;
  const maxSupply = Number(maxSupplyResult?.result) || 0;

  const progress = maxSupply > 0 ? (totalSupply / maxSupply) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>铸造进度</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground">
          {totalSupply} / {maxSupply} 已铸造
        </p>
      </CardContent>
    </Card>
  );
} 
"use client";

import { useReadContracts } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NFTCollectionABI } from "@/config/abis/NFTCollection";
import MintPeriod from "@/app/collection/[address]/mint-period";

interface CollectionMintPeriodSectionProps {
  address: string;
}

export function CollectionMintPeriodSection({ address }: CollectionMintPeriodSectionProps) {
  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        address: address as `0x${string}`,
        abi: NFTCollectionABI,
        functionName: "mintStartTime",
      },
      {
        address: address as `0x${string}`,
        abi: NFTCollectionABI,
        functionName: "mintEndTime",
      },
    ],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>铸造周期</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const [mintStartTimeResult, mintEndTimeResult] = data || [];
  const mintStartTime = mintStartTimeResult?.result as bigint;
  const mintEndTime = mintEndTimeResult?.result as bigint;

  return (
    <Card>
      <CardHeader>
        <CardTitle>铸造周期</CardTitle>
      </CardHeader>
      <MintPeriod startTime={mintStartTime} endTime={mintEndTime} />
    </Card>
  );
} 
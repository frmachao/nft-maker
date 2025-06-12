"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
  useChainId,
} from "wagmi";
import { NFTCollectionABI } from "@/config/abis/NFTCollection";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingSkeleton from "./loading-skeleton";
import MintPeriod from "./mint-period";
import { getNativeTokenSymbol } from '@/lib/chain'

export default function CollectionDetail() {
  const { address } = useParams<{ address: string }>();
  const { isConnected, address: userAddress } = useAccount();
  const { openConnectModal } = useConnectModal();
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
      {
        address: address as `0x${string}`,
        abi: NFTCollectionABI,
        functionName: "image",
      },
      {
        address: address as `0x${string}`,
        abi: NFTCollectionABI,
        functionName: "maxSupply",
      },
      {
        address: address as `0x${string}`,
        abi: NFTCollectionABI,
        functionName: "mintPrice",
      },
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
      {
        address: address as `0x${string}`,
        abi: NFTCollectionABI,
        functionName: "paused",
      },
      {
        address: address as `0x${string}`,
        abi: NFTCollectionABI,
        functionName: "whitelistOnly",
      },
      {
        address: address as `0x${string}`,
        abi: NFTCollectionABI,
        functionName: "whitelist",
        args: [userAddress as `0x${string}`],
      },
    ],
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const {
    writeContract,
    isPending: isWritePending,
    data: hash,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isMintError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // 重新获取 totalSupply
  const { data: totalSupplyData, refetch: refetchTotalSupply } =
    useReadContract({
      address: address as `0x${string}`,
      abi: NFTCollectionABI,
      functionName: "totalSupply",
    });

  const chainId = useChainId()
  const nativeToken = chainId ? getNativeTokenSymbol(chainId) : 'ETH'

  const handleMint = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    writeContract({
      address: address as `0x${string}`,
      abi: NFTCollectionABI,
      functionName: "mint",
      value: mintPrice as bigint,
    });
  };

  // 监听 mint 成功
  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      refetchTotalSupply();
      // 3秒后隐藏成功提示
      setTimeout(() => setShowSuccess(false), 3000);
    }
    if (isMintError) {
      setShowError(true);
      // 3秒后隐藏错误提示
      setTimeout(() => setShowError(false), 3000);
    }
  }, [isSuccess, isMintError]);

  const [
    name,
    description,
    image,
    maxSupply,
    mintPrice,
    mintStartTime,
    mintEndTime,
    paused,
    whitelistOnly,
    userIsWhitelisted,
  ] = data?.map((result) => result.result) ?? [];
  const isDisabled = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    const notStarted = Number(mintStartTime) > 0 && Number(mintStartTime) > now;
    const hasExpired = Number(mintEndTime) > 0 && Number(mintEndTime) < now;

    const isNotWhitelisted = whitelistOnly && !userIsWhitelisted;

    return Boolean(
      isWritePending ||
        isConfirming ||
        notStarted ||
        hasExpired ||
        paused ||
        isNotWhitelisted
    );
  }, [
    mintStartTime,
    mintEndTime,
    isWritePending,
    isConfirming,
    paused,
    userIsWhitelisted,
    whitelistOnly,
  ]);

  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet";
    if (isWritePending) return "Confirming...";
    if (isConfirming) return "Minting...";
    return "Mint NFT";
  };

  const progress = (Number(totalSupplyData) / Number(maxSupply)) * 100;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="mx-auto container max-w-5xl min-h-screen p-8">
      <div className="grid gap-8">
        {/* Image Section */}
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <img
            src={image as string}
            alt={name as string}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Mint Button */}
        <div className="flex justify-center">
          <Button onClick={handleMint} disabled={isDisabled} size="lg">
            {getButtonText()}
          </Button>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <Alert className="bg-green-500/15 text-green-500">
            <AlertDescription>Successfully minted your NFT!</AlertDescription>
          </Alert>
        )}
        {showError && (
          <Alert className="bg-red-500/15 text-red-500">
            <AlertDescription>Mint failed!</AlertDescription>
          </Alert>
        )}

        {/* Info Section */}
        <div className="grid gap-6">
          <div>
            <h1 className="text-4xl font-bold">{name}</h1>
            <p className="mt-2 text-muted-foreground">{description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mint Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">
                {totalSupplyData?.toString()} / {maxSupply?.toString()} minted
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Mint Price</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{formatUnits(mintPrice as bigint, 18)} {nativeToken}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mint Period</CardTitle>
              </CardHeader>
              <MintPeriod
                startTime={mintStartTime as bigint}
                endTime={mintEndTime as bigint}
              />
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Paused</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{paused ? "Yes" : "No"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Whitelist Only</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{whitelistOnly ? "Yes" : "No"}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

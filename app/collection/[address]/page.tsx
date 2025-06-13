"use client";

import { useParams } from "next/navigation";
import { useReadContract, useAccount, useChainId } from "wagmi";
import { NFTCollectionABI } from "@/config/abis/NFTCollection";
import LoadingSkeleton from "./loading-skeleton";
import { CollectionImageSection } from "@/components/collection/collection-image-section";
import { CollectionBasicInfoSection } from "@/components/collection/collection-basic-info-section";
import { CollectionMintProgressSection } from "@/components/collection/collection-mint-progress-section";
import { CollectionMintPriceSection } from "@/components/collection/collection-mint-price-section";
import { CollectionMintPeriodSection } from "@/components/collection/collection-mint-period-section";
import { CollectionMintingStatusSection } from "@/components/collection/collection-minting-status-section";
import { CollectionWhitelistSection } from "@/components/collection/collection-whitelist-section";
import { CollectionPublishSection } from "@/components/collection/collection-publish-section";

export default function CollectionDetail() {
  const { address } = useParams<{ address: string }>();
  const { address: userAddress } = useAccount();
  const chainId = useChainId();

  // 统一查询合约拥有者
  const { data: owner, isLoading: ownerLoading } = useReadContract({
    address: address as `0x${string}`,
    abi: NFTCollectionABI,
    functionName: "owner",
  });

  const isOwner = !!(userAddress && owner && 
    userAddress.toLowerCase() === (owner as string).toLowerCase());

  if (!address) {
    return (
      <div className="mx-auto container max-w-5xl min-h-screen p-8">
        <div className="text-center">
          <p className="text-red-500">无效的合约地址</p>
        </div>
      </div>
    );
  }

  if (ownerLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="mx-auto container max-w-5xl min-h-screen p-8">
      <div className="grid gap-8">
        {/* 图片部分 */}
        <CollectionImageSection 
          address={address} 
          owner={owner as string}
          isOwner={isOwner}
        />

        {/* 基本信息 */}
        <CollectionBasicInfoSection address={address} />

        {/* 发布集合 */}
        <CollectionPublishSection 
          address={address}
          chainId={chainId || 1}
          isOwner={isOwner}
        />

        {/* 铸造进度 */}
        <CollectionMintProgressSection address={address} />

        {/* 详细信息卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 铸造价格 */}
          <CollectionMintPriceSection address={address} />

          {/* 铸造周期 */}
          <CollectionMintPeriodSection address={address} />

          {/* 铸造状态 */}
          <CollectionMintingStatusSection 
            address={address}
            owner={owner as string}
            isOwner={isOwner}
          />
        </div>

        {/* 白名单设置 */}
        <CollectionWhitelistSection 
          address={address}
          owner={owner as string}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
}

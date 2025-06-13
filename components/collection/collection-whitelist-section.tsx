"use client";

import { useState } from "react";
import { useReadContracts, useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, X } from "lucide-react";
import { NFTCollectionABI } from "@/config/abis/NFTCollection";
import WhitelistManageButton from "@/components/home/whitelist-manage-button";
import { Label } from "@/components/ui/label";

interface CollectionWhitelistSectionProps {
  address: string;
  owner: string;
  isOwner: boolean;
}

export function CollectionWhitelistSection({ address, isOwner }: CollectionWhitelistSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { address: userAddress } = useAccount();

    // 获取白名单相关信息
  const contracts = [
    {
      address: address as `0x${string}`,
      abi: NFTCollectionABI,
      functionName: "whitelistOnly" as const,
    },
    ...(userAddress ? [{
      address: address as `0x${string}`,
      abi: NFTCollectionABI,
      functionName: "whitelist" as const,
      args: [userAddress as `0x${string}`],
    }] : [])
  ];

  const { data, isLoading, refetch: refetchWhitelist } = useReadContracts({
    contracts,
  });

  const handleUpdateStart = () => {
    setIsUpdating(true);
  };

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    setIsUpdating(false);
    refetchWhitelist();
  };

  const handleUpdateError = () => {
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            白名单设置
            <Skeleton className="h-9 w-20" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const whitelistOnly = data?.[0]?.result as boolean;
  const userIsWhitelisted = userAddress && data?.[1] ? (data[1].result as boolean) : false;

  // 如果不是白名单模式，则不显示此组件
  if (!whitelistOnly) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          白名单设置
          {isOwner && (
            isEditing ? (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4" />
                  取消
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={isUpdating}
              >
                <Edit className="h-4 w-4" />
                {isUpdating ? "更新中..." : "编辑"}
              </Button>
            )
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-6">
            {/* Add to Whitelist */}
            <div className="space-y-2">
              <Label>添加地址到白名单</Label>
              <WhitelistManageButton 
                collectionAddress={address} 
                mode="add"
                onSuccess={handleUpdateSuccess}
                onError={handleUpdateError}
                onStart={handleUpdateStart}
              />
            </div>

            {/* Remove from Whitelist */}
            <div className="space-y-2">
              <Label>从白名单中移除地址</Label>
              <WhitelistManageButton 
                collectionAddress={address} 
                mode="remove"
                onSuccess={handleUpdateSuccess}
                onError={handleUpdateError}
                onStart={handleUpdateStart}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <span className="font-medium">模式：</span>
              <span className="text-green-600 ml-2">仅白名单</span>
            </p>
            {userAddress && (
              <p>
                <span className="font-medium">您的状态：</span>
                <span className={`ml-2 ${userIsWhitelisted ? 'text-green-600' : 'text-red-600'}`}>
                  {userIsWhitelisted ? "✅ 已在白名单" : "❌ 不在白名单"}
                </span>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
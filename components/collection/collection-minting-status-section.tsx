"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, X } from "lucide-react";
import { NFTCollectionABI } from "@/config/abis/NFTCollection";
import { PauseToggleButton } from "@/components/home/pause-toggle-button";

interface CollectionMintingStatusSectionProps {
  address: string;
  owner: string;
  isOwner: boolean;
}

export function CollectionMintingStatusSection({ address, isOwner }: CollectionMintingStatusSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // 获取暂停状态
  const { data: paused, isLoading: pausedLoading, refetch: refetchPaused } = useReadContract({
    address: address as `0x${string}`,
    abi: NFTCollectionABI,
    functionName: "paused",
  });

  const handleUpdateStart = () => {
    setIsUpdating(true);
  };

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    setIsUpdating(false);
    refetchPaused();
  };

  const handleUpdateError = () => {
    setIsUpdating(false);
  };

  if (pausedLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            铸造状态
            <Skeleton className="h-9 w-20" />
          </CardTitle>
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
        <CardTitle className="flex items-center justify-between">
          铸造状态
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
          <div className="space-y-4">
            <PauseToggleButton 
              collectionAddress={address}
              onSuccess={handleUpdateSuccess}
              onError={handleUpdateError}
              onStart={handleUpdateStart}
            />
          </div>
        ) : (
          <p className="text-lg">
            {paused ? (
              <span className="text-red-600">已暂停</span>
            ) : (
              <span className="text-green-600">正常</span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
} 
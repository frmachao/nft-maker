"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, X } from "lucide-react";
import { NFTCollectionABI } from "@/config/abis/NFTCollection";
import { UpdateImageSection } from "@/components/home/update-image-section";

interface CollectionImageSectionProps {
  address: string;
  owner: string;
  isOwner: boolean;
}

export function CollectionImageSection({ address, isOwner }: CollectionImageSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // 获取图片URL
  const { data: imageUrl, isLoading: imageLoading, refetch: refetchImage } = useReadContract({
    address: address as `0x${string}`,
    abi: NFTCollectionABI,
    functionName: "image",
  });

  const handleUpdateStart = () => {
    setIsUpdating(true);
  };

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    setIsUpdating(false);
    refetchImage();
  };

  const handleUpdateError = () => {
    setIsUpdating(false);
  };

  if (imageLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            集合图片
            <Skeleton className="h-9 w-20" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="aspect-video w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          集合图片
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
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <UpdateImageSection 
              collectionAddress={address}
              currentImageUrl={imageUrl as string}
              onSuccess={handleUpdateSuccess}
              onError={handleUpdateError}
              onStart={handleUpdateStart}
            />
          </div>
        ) : (
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img
              src={imageUrl as string}
              alt="Collection Image"
              className="object-cover w-full h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-image.png";
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
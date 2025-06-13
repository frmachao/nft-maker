"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CollectionPublishSectionProps {
  address: string;
  chainId: number;
  isOwner: boolean;
}

export function CollectionPublishSection({ address, chainId, isOwner }: CollectionPublishSectionProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPublishedStatus = async () => {
      setIsLoading(true);
      const published = await checkIsPublished();
      setIsPublished(published);
      setIsLoading(false);
    };
    fetchPublishedStatus();
  }, [address]);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      
      const res = await fetch("/api/nft-mints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          chainId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      
      setIsPublished(true);
    } catch (error: Error | unknown) {
      toast({
        variant: "destructive",
        title: "错误",
        description: error instanceof Error ? error.message : "发布失败，请重试",
      });
    } finally {
      setIsPublishing(false);
    }
  };
  const checkIsPublished = async (): Promise<boolean> => {
    const res = await fetch(`/api/nft-mints/${address}`);
    const data = await res.json();
    return data.published;
  };
  const getButtonText = (): string => {
    if (isLoading) {
      return "检查是否发布...";
    }
    return isPublishing ? "发布中..." : "发布集合给用户铸造";
  }

  if (!isOwner) {
    return null; // 只有合约拥有者才能看到发布功能
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          发布集合
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            将此集合发布到铸造管理系统，让用户可以发现和铸造您的 NFT。
          </p>
          
          {isPublished ? (
            <Button
              disabled
              className="w-full"
              size="lg"
              variant="outline"
            >
              <Check className="mr-2 h-4 w-4" />
              已发布
            </Button>
          ) : (
            <Button
              onClick={handlePublish}
              disabled={isPublishing || isLoading}
              className="w-full"
              size="lg"
            >
              <Share2 className="mr-2 h-4 w-4" />
              {getButtonText()}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
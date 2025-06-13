"use client";

import { useAccount, useChainId } from "wagmi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import CollectionCard from "./collection-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Collection {
  address: string;
  creator: string;
  chainId: number;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface CollectionsResponse {
  collections: Collection[];
  pagination: PaginationInfo;
}

export default function CollectionsList() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [collectionsData, setCollectionsData] = useState<CollectionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function getCollections() {
      if (!address || !chainId) return;
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/collections?creator=${address}&chainId=${chainId}&page=${currentPage}&limit=10`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data: CollectionsResponse = await res.json();
        setCollectionsData(data);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
        toast({
          variant: "destructive",
          description: "获取集合列表失败",
        });
      } finally {
        setIsLoading(false);
      }
    }

    getCollections();
  }, [address, chainId, currentPage, toast]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!mounted) {
    return <div className="mt-8">加载中...</div>;
  }

  if (!address) {
    return (
      <Card className="mt-8">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            请连接您的钱包
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!collectionsData || collectionsData.collections.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            未找到集合。创建您的第一个 NFT 集合！
          </p>
        </CardContent>
      </Card>
    );
  }

  const { collections, pagination } = collectionsData;

  return (
    <div className="mt-8 space-y-4 max-w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">您的集合</h2>
        <div className="text-sm text-muted-foreground">
          共 {pagination.total} 个集合
        </div>
      </div>

      <div className="space-y-4">
        {collections.map((collection) => (
          <CollectionCard key={collection.address} address={collection.address} />
        ))}
      </div>

      {/* 分页控件 */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrev}
          >
            <ChevronLeft className="h-4 w-4" />
            上一页
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="min-w-[2.5rem]"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNext}
          >
            下一页
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* 分页信息 */}
      <div className="text-center text-sm text-muted-foreground">
        第 {pagination.page} 页，共 {pagination.totalPages} 页
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mt-8 space-y-4 min-w-full">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-4 min-w-[200px]">
                  <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
                  <div className="flex-grow min-w-0 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto justify-center sm:flex-1 items-center">
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

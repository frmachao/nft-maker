"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount, useReadContract } from "wagmi";
import { NFTCollectionABI } from "@/config/abis/NFTCollection";
import { Copy, Check, Bug } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DebugContractInfoProps {
  collectionAddress: string;
}

export function DebugContractInfo({ collectionAddress }: DebugContractInfoProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const { address: walletAddress } = useAccount();
  const { toast } = useToast();

  // 检查合约是否可读取（验证合约地址和连接状态）
  const { data: contractName, error: nameError } = useReadContract({
    address: collectionAddress as `0x${string}`,
    abi: NFTCollectionABI,
    functionName: "name",
  });

  // 读取合约 owner
  const { data: contractOwner, error: ownerError } = useReadContract({
    address: collectionAddress as `0x${string}`,
    abi: NFTCollectionABI,
    functionName: "owner",
  });

  // 读取合约暂停状态
  const { data: isPaused, error: pausedError } = useReadContract({
    address: collectionAddress as `0x${string}`,
    abi: NFTCollectionABI,
    functionName: "paused",
  });

  // 读取当前图片URL
  const { data: currentImage, error: imageError } = useReadContract({
    address: collectionAddress as `0x${string}`,
    abi: NFTCollectionABI,
    functionName: "image",
  });

  const handleCopyAddress = async (addr: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopiedAddress(true);
      toast({
        description: "地址已复制到剪贴板",
      });
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      toast({
        variant: "destructive",
        description: "复制失败",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 检查当前钱包是否为合约 owner
  const isOwner = walletAddress && contractOwner && 
    walletAddress.toLowerCase() === (contractOwner as string).toLowerCase();

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="mt-2"
      >
        <Bug className="mr-2 h-4 w-4" />
        调试合约信息
      </Button>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            合约调试信息
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
          >
            收起
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 基本信息 */}
        <div className="space-y-2">
          <h4 className="font-medium">基本信息</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between items-center">
              <span>合约地址:</span>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {formatAddress(collectionAddress)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyAddress(collectionAddress)}
                >
                  {copiedAddress ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>合约名称:</span>
              <span className={nameError ? "text-red-500" : ""}>
                {nameError ? "读取失败" : contractName || "加载中..."}
              </span>
            </div>
            
                         <div className="flex justify-between items-center">
               <span>当前钱包:</span>
               <code className="bg-muted px-2 py-1 rounded text-xs">
                 {walletAddress ? formatAddress(walletAddress) : "未连接"}
               </code>
             </div>
           </div>
         </div>

         {/* 权限检查 */}
         <div className="space-y-2">
           <h4 className="font-medium">权限检查</h4>
           <div className="grid grid-cols-1 gap-2 text-sm">
             <div className="flex justify-between items-center">
               <span>合约 Owner:</span>
               <div className="flex items-center gap-2">
                 {ownerError ? (
                   <span className="text-red-500">读取失败</span>
                 ) : contractOwner ? (
                   <>
                     <code className="bg-muted px-2 py-1 rounded text-xs">
                       {formatAddress(contractOwner as string)}
                     </code>
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => handleCopyAddress(contractOwner as string)}
                     >
                       <Copy className="h-3 w-3" />
                     </Button>
                   </>
                 ) : (
                   <span className="text-gray-500">加载中...</span>
                 )}
               </div>
             </div>
             
             <div className="flex justify-between items-center">
               <span>是否有权限:</span>
               <span className={isOwner ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                 {isOwner ? "✓ 是 Owner" : "✗ 不是 Owner"}
               </span>
             </div>
           </div>
         </div>

        {/* 合约状态 */}
        <div className="space-y-2">
          <h4 className="font-medium">合约状态</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between items-center">
              <span>是否暂停:</span>
              <span className={pausedError ? "text-red-500" : isPaused ? "text-red-500" : "text-green-600"}>
                {pausedError ? "读取失败" : isPaused ? "已暂停" : "正常"}
              </span>
            </div>
            
            <div className="flex justify-between items-start">
              <span>当前图片:</span>
              <div className="max-w-xs">
                {imageError ? (
                  <span className="text-red-500">读取失败</span>
                ) : currentImage ? (
                  <code className="bg-muted px-2 py-1 rounded text-xs break-all">
                    {typeof currentImage === 'string' && currentImage.length > 50 
                      ? `${currentImage.substring(0, 100)}...` 
                      : String(currentImage)
                    }
                  </code>
                ) : (
                  <span className="text-gray-500">加载中...</span>
                )}
              </div>
            </div>
          </div>
        </div>

                 {/* 问题诊断 */}
         <div className="space-y-2">
           <h4 className="font-medium">问题诊断</h4>
           <div className="space-y-2 text-sm">
             {!isOwner && !ownerError && (
               <div className="p-3 bg-red-50 border border-red-200 rounded">
                 <p className="font-medium text-red-800">❌ 权限不足</p>
                 <p className="text-red-700">当前钱包不是合约 Owner，无法调用 setImage 方法</p>
               </div>
             )}
             
             {isOwner && !isPaused && (
               <div className="p-3 bg-green-50 border border-green-200 rounded">
                 <p className="font-medium text-green-800">✅ 权限检查通过</p>
                 <p className="text-green-700">当前钱包是合约 Owner，应该可以正常调用 setImage</p>
               </div>
             )}
             
             {ownerError && (
               <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                 <p className="font-medium text-yellow-800">⚠️ 无法确认权限</p>
                 <p className="text-yellow-700">无法读取合约 Owner 信息，可能是网络问题</p>
               </div>
             )}
            
            {nameError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="font-medium text-red-800">合约连接异常</p>
                <p className="text-red-700">无法读取合约信息，请检查：</p>
                <ul className="list-disc list-inside mt-1 text-red-600">
                  <li>合约地址是否正确</li>
                  <li>网络连接是否正常</li>
                  <li>是否连接到正确的区块链网络</li>
                </ul>
              </div>
            )}

            {isPaused && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="font-medium text-red-800">合约已暂停</p>
                <p className="text-red-700">合约处于暂停状态，某些功能不可用</p>
              </div>
            )}
          </div>
        </div>

        {/* 解决方案 */}
        <div className="space-y-2">
          <h4 className="font-medium">建议解决方案</h4>
          <div className="text-sm space-y-1">
            <p>1. <strong>检查权限</strong>: 确认当前钱包是否为合约创建者</p>
            <p>2. <strong>切换钱包</strong>: 如果不是，请切换到正确的钱包地址</p>
            <p>3. <strong>检查网络</strong>: 确认连接到 Sepolia 测试网络</p>
            <p>4. <strong>检查参数</strong>: 确认上传的图片 URL 不为空</p>
          </div>
        </div>

        {/* 在 Etherscan 上查看 */}
        <div className="pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => 
              window.open(
                `https://sepolia.etherscan.io/address/${collectionAddress}`,
                '_blank'
              )
            }
          >
            在 Etherscan 上查看合约
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { NFTCollectionABI } from "@/config/abis/NFTCollection";
import { UploadCloud, ZoomIn, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useImageUpload } from "@/hooks/use-image-upload";

interface UpdateImageSectionProps {
  collectionAddress: string;
  currentImageUrl?: string;
}

export function UpdateImageSection({ 
  collectionAddress, 
  currentImageUrl 
}: UpdateImageSectionProps) {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const { toast } = useToast();
  
  const {
    // 状态
    file,
    uploading,
    showPasswordDialog,
    password,
    isVerifying,
    showPassword,
    
    // 设置状态的函数
    setShowPasswordDialog,
    setPassword,
    setShowPassword,
    
    // 核心功能函数
    handleFileChange,
    uploadFile,
    handlePasswordSubmit,
  } = useImageUpload({
    onUploadSuccess: (imageUrl) => {
      setNewImageUrl(imageUrl);
    },
  });

  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: receiptError 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const updateImage = async () => {
    if (!newImageUrl) {
      toast({
        title: "错误",
        description: "请先上传新图片",
        variant: "destructive",
      });
      return;
    }

    if (newImageUrl === currentImageUrl) {
      toast({
        title: "提示",
        description: "新图片与当前图片相同，无需更新",
        variant: "default",
      });
      return;
    }

    try {
      setIsUpdating(true);
      
      writeContract({
        address: collectionAddress as `0x${string}`,
        abi: NFTCollectionABI,
        functionName: "setImage",
        args: [newImageUrl],
      });

    } catch (error) {
      console.error("更新图片失败:", error);
      toast({
        title: "错误",
        description: "更新图片失败，请重试",
        variant: "destructive",
      });
      setIsUpdating(false);
    }
  };

  // 监听交易状态变化
  if (isConfirmed && isUpdating) {
    setIsUpdating(false);
    setNewImageUrl("");
    toast({
      title: "成功",
      description: "图片已成功更新！",
    });
  }

  if (writeError || receiptError) {
    setIsUpdating(false);
    toast({
      title: "错误",
      description: writeError?.message || receiptError?.message || "交易失败",
      variant: "destructive",
    });
  }

  const isProcessing = isUpdating || isConfirming;

  return (
    <div className="space-y-4">
      {/* 上传新图片 */}
      <div className="space-y-3">
        <Label>上传新图片</Label>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={uploadFile}
            disabled={!file || uploading || isVerifying}
            variant="outline"
          >
            {uploading ? "上传中..." : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                上传
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 新上传的图片预览 */}
      {newImageUrl && (
        <div className="space-y-3">
          <Label>新图片预览</Label>
          <div className="flex items-center gap-4">
            <Input 
              value={newImageUrl}
              disabled
              readOnly 
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowImagePreview(true)}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border">
            <img 
              src={newImageUrl} 
              alt="New image preview" 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      )}

      {/* 更新按钮 */}
      <div className="flex gap-2">
        <Button 
          onClick={updateImage}
          disabled={isProcessing || !newImageUrl}
          className="flex-1"
        >
          {isProcessing ? "更新中..." : "更新图片"}
        </Button>
        
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setNewImageUrl("")}
          disabled={isProcessing || !newImageUrl}
        >
          重置
        </Button>
      </div>

      {/* 当前图片显示 */}
      {currentImageUrl && (
        <div className="space-y-3">
          <Label>当前图片</Label>
          <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border">
            <img 
              src={currentImageUrl} 
              alt="Current collection image" 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      )}

      {/* 图片预览对话框 */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>图片预览</DialogTitle>
          </DialogHeader>
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
            <img 
              src={newImageUrl} 
              alt="Full size preview" 
              className="object-contain w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* 密码验证对话框 */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>需要上传密码</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入上传密码"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={handlePasswordSubmit} 
              disabled={isVerifying || !password}
            >
              {isVerifying ? "验证中..." : "确认"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
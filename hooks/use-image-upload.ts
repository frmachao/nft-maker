import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

export interface UseImageUploadOptions {
  onUploadSuccess?: (imageUrl: string) => void;
  onUploadError?: (error: Error) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: "错误",
        description: "文件过大，请选择小于1MB的图片",
        variant: "destructive",
      });
      e.target.value = '';
      return;
    }
    setFile(selectedFile);
  };

  const uploadFile = async () => {

    try {
      if (!file) {
        toast({
          title: "错误",
          description: "请选择要上传的文件",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      const data = new FormData();
      data.set("file", file);

      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
        headers: {
          "Upload-Password": Cookies.get("upload_password") || "",
        },
      });

      if (!uploadRequest.ok) {
        throw new Error("Upload failed");
      }

      const ipfsUrl = await uploadRequest.json();
      setFile(undefined);
      
      toast({
        title: "成功",
        description: "图片上传成功！",
      });

      // 调用成功回调
      options.onUploadSuccess?.(ipfsUrl);
      
    } catch (e) {
      console.error(e);
      const error = e instanceof Error ? e : new Error("上传失败");
      
      toast({
        title: "错误",
        description: "上传失败，请重试",
        variant: "destructive",
      });

      // 调用错误回调
      options.onUploadError?.(error);
    } finally {
      setUploading(false);
    }
  };

  const resetFile = () => {
    setFile(undefined);
  };

  return {
    // 状态
    file,
    uploading,
    
    // 设置状态的函数
    setFile,
    
    // 核心功能函数
    handleFileChange,
    uploadFile,
    resetFile,
    
    // 常量
    MAX_FILE_SIZE,
  };
} 
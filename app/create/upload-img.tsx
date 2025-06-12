"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UploadCloud, ZoomIn } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";
import { FormValues } from "./types";
import { useImageUpload } from "@/hooks/use-image-upload";

interface UploadImageProps {
  field: ControllerRenderProps<FormValues, "imageUrl">;
}

export default function UploadImage({ field }: UploadImageProps) {
  const [showImagePreview, setShowImagePreview] = useState(false);

  const {
    // 状态
    file,
    uploading,
    
    // 核心功能函数
    handleFileChange,
    uploadFile,
  } = useImageUpload({
    onUploadSuccess: (imageUrl) => {
      field.onChange(imageUrl);
    },
  });

  const getButtonText = () => {
    if (uploading) return "Uploading...";
    return (
      <>
        <UploadCloud className="mr-2 h-4 w-4" />
        Upload
      </>
    );
  };
  
  return (
    <FormItem>
      <FormLabel>Collection Image</FormLabel>
      <FormControl>
        <div className="space-y-4">
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
              disabled={!file || uploading}
            >
              {getButtonText()}
            </Button>
          </div>

          {field.value && (
            <div className="space-y-4">
              <Input 
                value={field.value}
                disabled
                readOnly 
                className="flex-1"
              />
              <div 
                className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-lg border group cursor-pointer hover:opacity-95 transition-all"
                onClick={() => setShowImagePreview(true)}
              >
                <img 
                  src={field.value} 
                  alt="Collection preview" 
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>

              <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Image Preview</DialogTitle>
                  </DialogHeader>
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
                    <img 
                      src={field.value} 
                      alt="Full size preview" 
                      className="object-contain w-full h-full"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </FormControl>
      <FormDescription>Upload an image for your NFT collection</FormDescription>
      <FormMessage />
    </FormItem>
  );
}

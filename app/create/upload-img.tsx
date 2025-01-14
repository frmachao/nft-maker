"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

interface FormValues {
  imageUrl: string;
  name: string;
  description: string;
  maxSupply: string;
  mintPrice: string;
  whitelistOnly: boolean;
  maxMintsPerWallet: string;
  initialWhitelist?: string;
  mintStartTime?: string;
  mintEndTime?: string;
}

interface UploadImageProps {
  field: ControllerRenderProps<FormValues, "imageUrl">;
}

export default function UploadImage({ field }: UploadImageProps) {
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    try {
      if (!file) {
        window.alert("No file selected");
        return;
      }

      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      
      if (!uploadRequest.ok) {
        throw new Error('Upload failed');
      }
      
      const ipfsUrl = await uploadRequest.json();
      field.onChange(ipfsUrl);
      setFile(undefined);
    } catch (e) {
      console.error(e);
      window.alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
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
              onChange={(e) => setFile(e.target.files?.[0])}
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={uploadFile}
              disabled={!file || uploading}
            >
              {uploading ? (
                "Uploading..."
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
          
          {field.value && (
            <div className="flex items-center gap-4">
              <Input 
                value={field.value} 
                readOnly 
                className="flex-1"
              />
            </div>
          )}
        </div>
      </FormControl>
      <FormDescription>
        Upload an image for your NFT collection
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
}

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
  DialogDescription,
} from "@/components/ui/dialog";
import { UploadCloud,Eye, EyeOff,ZoomIn } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";
import Cookies from "js-cookie";
import { Label } from "@/components/ui/label";
import { FormValues } from "./types";

interface UploadImageProps {
  field: ControllerRenderProps<FormValues, "imageUrl">;
}

export default function UploadImage({ field }: UploadImageProps) {
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false)

  const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB in bytes

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0]
  if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
    alert("File too large: Please select an image under 1MB")
    e.target.value = ''
    return
  }
  
  setFile(selectedFile)
}
  const uploadFile = async () => {
    if (!Cookies.get("upload_password")) {
      setShowPasswordDialog(true);
      return;
    }
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
        headers: {
          "Upload-Password": Cookies.get("upload_password") || "",
        },
      });

      if (!uploadRequest.ok) {
        if (uploadRequest.status === 401) {
          Cookies.remove("upload_password");
          setShowPasswordDialog(true);
        }
        throw new Error("Upload failed");
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
  const handlePasswordSubmit = async () => {
    try {
      setIsVerifying(true);
      const response = await fetch("/api/verify-upload-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        Cookies.set("upload_password", password, { expires: 7 });
        setShowPasswordDialog(false);
      } else {
        Cookies.remove("upload_password");
        alert("Invalid password");
      }
    } catch (error) {
      console.error("Failed to verify password:", error);
      alert("Failed to verify password");
    } finally {
      setIsVerifying(false);
    }
  };
  const getButtonText = () => {
    if (isVerifying) return "Verifying Password...";
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
              onChange={(e) => handleFileChange(e)}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={uploadFile}
              disabled={!file || uploading || isVerifying}
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
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Password Required</DialogTitle>
            <DialogDescription>
              To prevent abuse of our IPFS service, image uploads require a
              password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            <Button className="w-full" onClick={handlePasswordSubmit} disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </FormItem>
  );
}

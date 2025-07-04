"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PauseToggleButton } from "./pause-toggle-button";
import WhitelistManageButton from "./whitelist-manage-button";
import { UpdateImageSection } from "./update-image-section";
import { DebugContractInfo } from "./debug-contract-info";


type Collection = {
  address: string;
  name: string;
  whitelistOnly: boolean;
  imageUrl: string;
}

interface CollectionManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: Collection;
  refetch: () => void;
}

export function CollectionManageDialog({
  open,
  onOpenChange,
  collection,
}: CollectionManageDialogProps) {
const {address,name,whitelistOnly} = collection
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-h-[90vh] flex flex-col"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            Contract updates require gas fees for on-chain transactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          {/* Pause/Unpause Section */}
          <div className="space-y-2">
          <Label>Minting Status</Label>
          <PauseToggleButton collectionAddress={address} />
          </div>

          <Separator />
          
          {/* 更新图片功能 */}
          <div className="space-y-4">
            <Label>更新nft图片</Label>
            <UpdateImageSection 
              collectionAddress={address}
              currentImageUrl={collection.imageUrl}
            />
          </div>
          
          <Separator />
          {whitelistOnly && (
            <>
          {/* Whitelist Management Section */}
          <div className="space-y-4">
            <Label>Whitelist Management</Label>

            {/* Add to Whitelist */}
            <div className="space-y-2">
              <Label>Add Addresses to Whitelist</Label>
              <WhitelistManageButton 
                collectionAddress={address} 
                mode="add" 
              />
            </div>

            {/* Remove from Whitelist */}
            <div className="space-y-2">
              <Label>Remove Addresses from Whitelist</Label>
              <WhitelistManageButton 
                collectionAddress={address} 
                mode="remove" 
              />
            </div>
          </div>
          </>
          )}
          
          {/* 调试信息 */}
          <DebugContractInfo collectionAddress={address} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

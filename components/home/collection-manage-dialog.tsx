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
import WhitelistManageButton from "./whitelist-manage-button"


interface CollectionManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionAddress: string;
}

export function CollectionManageDialog({
  open,
  onOpenChange,
  collectionAddress,
}: CollectionManageDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Collection Management</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            Contract updates require gas fees for on-chain transactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pause/Unpause Section */}
          <div className="space-y-2">
          <Label>Minting Status</Label>
          <PauseToggleButton collectionAddress={collectionAddress} />
          </div>

          <Separator />

          {/* Whitelist Management Section */}
          <div className="space-y-4">
            <Label>Whitelist Management</Label>

            {/* Add to Whitelist */}
            <div className="space-y-2">
              <Label>Add Addresses to Whitelist</Label>
              <WhitelistManageButton 
                collectionAddress={collectionAddress} 
                mode="add" 
              />
            </div>

            {/* Remove from Whitelist */}
            <div className="space-y-2">
              <Label>Remove Addresses from Whitelist</Label>
              <WhitelistManageButton 
                collectionAddress={collectionAddress} 
                mode="remove" 
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

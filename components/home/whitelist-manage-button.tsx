"use client"

import { useState,useEffect,useMemo } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { NFTCollectionABI } from "@/config/contracts"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, UserMinus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { isAddress } from "viem";

interface WhitelistManageButtonProps {
  collectionAddress: string
  mode: 'add' | 'remove'
}

export default function WhitelistManageButton({ 
  collectionAddress, 
  mode 
}: WhitelistManageButtonProps) {
  const [addresses, setAddresses] = useState("")
  const { toast } = useToast()
  const [isTouched, setIsTouched] = useState(false)
  const { writeContract, isPending: isWritePending, data: hash } = useWriteContract()
  
  const { 
    isLoading: isConfirming,
    isError,
    isSuccess
  } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: `Failed to ${mode === 'add' ? 'add' : 'remove'} to whitelist`,
      })
    }
    if (isSuccess) {
      toast({
        title: "Success",
        description: `Whitelist ${mode === 'add' ? 'added' : 'removed'} successfully`,
      })
    }
  }, [isError,toast,isSuccess,mode])


  const validation = useMemo(() => {
    if (!addresses.trim()) return null

    const addressList = addresses
      .split(",")
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0)

    const invalidAddresses = addressList.filter(addr => !isAddress(addr))
    
    if (invalidAddresses.length > 0) {
      return {
        isValid: false,
        message: `Invalid addresses: ${invalidAddresses.join(", ")}`
      }
    }

    return { isValid: true, message: null }
  }, [addresses])


  const handleWhitelistUpdate = () => {
    if (!validation?.isValid) return
    const addressList = addresses
      .split(",")
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0)

    writeContract({
      address: collectionAddress as `0x${string}`,
      abi: NFTCollectionABI,
      functionName: mode === 'add' ? 'addToWhitelist' : 'removeFromWhitelist',
      args: [addressList as `0x${string}`[]],
    })
  }

  const getButtonText = () => {
    if (isWritePending || isConfirming) {
      return mode === 'add' ? "Adding to Whitelist..." : "Removing from Whitelist..."
    }
    return mode === 'add' ? (
      <>
        <UserPlus className="mr-2 h-4 w-4" />
        Add to Whitelist
      </>
    ) : (
      <>
        <UserMinus className="mr-2 h-4 w-4" />
        Remove from Whitelist
      </>
    )
  }

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Enter addresses (comma separated)"
        value={addresses}
        disabled={isWritePending || isConfirming}
        onChange={(e) => setAddresses(e.target.value)}
        onBlur={() => setIsTouched(true)}
        className={isTouched && validation?.isValid === false ? "border-red-500" : ""}
      />
      {isTouched && validation?.message && (
        <p className="text-sm text-red-500">
          {validation.message}
        </p>
      )}
      <Button
        variant="outline"
        className="w-full"
        disabled={isWritePending || isConfirming || !addresses.trim()}
        onClick={handleWhitelistUpdate}
      >
        {getButtonText()}
      </Button>
    </div>
  )
}
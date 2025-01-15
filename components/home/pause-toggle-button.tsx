"use client"

import { useState, useEffect } from "react"
import { useWriteContract, useWaitForTransactionReceipt,useReadContract } from "wagmi"
import { NFTCollectionABI } from "@/config/contracts"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
interface PauseToggleButtonProps {
  collectionAddress: string
}

export function PauseToggleButton({ collectionAddress }: PauseToggleButtonProps) {
  const { toast } = useToast()
  const { writeContract, isPending: isWritePending, data: hash } = useWriteContract()
  const { 
    isLoading: isConfirming,
    isSuccess,
    isError
  } = useWaitForTransactionReceipt({
    hash,
  })
  const { data: initialPaused, isLoading: isInitialPausedLoading } = useReadContract({
    address: collectionAddress as `0x${string}`,
    abi: NFTCollectionABI,
    functionName: 'paused',
  })

  const [isPaused, setIsPaused] = useState(initialPaused)
  console.log('initialPaused',initialPaused)

  useEffect(() => {
    if (isSuccess) {
        toast({
            title: "Hit",
            description: `Collection ${isPaused ? "resumed" : "paused"}!`,
          })
    setIsPaused(prev => !prev)
    }
    if (isError) {
      toast({
        title: "Error",
        description: `Failed to ${isPaused ? "resume" : "pause"} collection`,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess,isError])

  const handlePauseToggle = () => {
    writeContract({
      address: collectionAddress as `0x${string}`,
      abi: NFTCollectionABI,
      functionName: isPaused ? 'unpause' : 'pause',
    })
  }

  const getButtonText = () => {
    if (isWritePending || isConfirming) {
      return isPaused ? "Resuming..." : "Pausing..."
    }
    if (isInitialPausedLoading) {
      return "Checking pause status..."
    }
    return isPaused ? (
      <>
        <Play className="mr-2 h-4 w-4" />
        Resume Minting
      </>
    ) : (
      <>
        <Pause className="mr-2 h-4 w-4" />
        Pause Minting
      </>
    )
  }

  return (
    <Button
      variant={isPaused ? "destructive" : "outline"}
      className="w-full"
      disabled={isWritePending || isConfirming || isInitialPausedLoading}
      onClick={handlePauseToggle}
    >
      {getButtonText()}
    </Button>
  )
}
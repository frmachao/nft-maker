"use client"

import { useState, useEffect } from "react"
import { useWriteContract, useWaitForTransactionReceipt,useReadContract } from "wagmi"
import { NFTCollectionABI } from "@/config/abis/NFTCollection"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
interface PauseToggleButtonProps {
  collectionAddress: string
  onSuccess?: () => void
  onError?: () => void
  onStart?: () => void
}

export function PauseToggleButton({ collectionAddress, onSuccess, onError, onStart }: PauseToggleButtonProps) {
  const { toast } = useToast()
  const { writeContract, isPending: isWritePending, data: hash } = useWriteContract()
  const { 
    isLoading: isConfirming,
    isSuccess,
    isError
  } = useWaitForTransactionReceipt({
    hash,
  })
  const [isPaused, setIsPaused] = useState(false)

  const { data: initialPaused, isLoading: isInitialPausedLoading } = useReadContract({
    address: collectionAddress as `0x${string}`,
    abi: NFTCollectionABI,
    functionName: 'paused',
  })

  useEffect(() => {
    if (initialPaused !== undefined) {
        setIsPaused(initialPaused)
      }
  }, [initialPaused])

  useEffect(() => {
    if (isSuccess) {
        toast({
            title: "成功",
            description: `集合已${isPaused ? "恢复" : "暂停"}铸造!`,
          })
        setIsPaused(prev => !prev)
        onSuccess?.()
    }
    if (isError) {
      toast({
        title: "错误",
        description: `${isPaused ? "恢复" : "暂停"}集合失败`,
        variant: "destructive",
      })
      onError?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess,isError])

  const handlePauseToggle = () => {
    onStart?.()
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
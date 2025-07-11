"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { isAddress } from "viem"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

const formSchema = z.object({
  address: z.string().refine((val) => isAddress(val), {
    message: "Invalid contract address",
  }),
})

interface AddNFTDialogProps {
  chainId: number
  onSuccess: () => void
}

export function AddNFTDialog({ chainId, onSuccess }: AddNFTDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  console.log('chainId===',chainId)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const res = await fetch("/api/nft-mints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: values.address,
          chainId: chainId
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }
      toast({
        title: "成功",
        description: "集合已成功发布到铸造系统",
      });
      setOpen(false)
      form.reset()
      onSuccess()
    } catch (error: Error | unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Collection
        </Button>
      </DialogTrigger>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add New Collection</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0x..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "loading..." : "Add Collection"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 
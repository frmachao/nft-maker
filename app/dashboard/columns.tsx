"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Copy, Trash, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NFTMint } from "@prisma/client"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export const columns: ColumnDef<NFTMint>[] = [
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contract Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const nft = row.original
      const { toast } = useToast()
      const [isDeleting, setIsDeleting] = useState(false)

      const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this collection?")) return
        setIsDeleting(true)
        const res = await fetch(`/api/nft-mints/${nft.id}`, {
          method: "DELETE",
        })

        if (res.ok) {
          toast({
            title: "Success",
            description: "Collection deleted successfully",
          })
          window.location.reload()
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete collection",
          })
        }
      }

      const handleCopy = () => {
        navigator.clipboard.writeText(nft.address)
        toast({
          title: "Copied",
          description: "Address copied to clipboard",
        })
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {isDeleting ? (
              <Button variant="ghost" className="h-8 w-8 p-0">
                <Loader2 className="h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Address
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 
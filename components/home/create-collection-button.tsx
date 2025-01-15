'use client'

import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CreateCollectionButton() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <Button disabled>Create Collection</Button>
    )
  }

  return (
    <Button asChild>
      <Link href="/create">Create Collection</Link>
    </Button>
  )
}
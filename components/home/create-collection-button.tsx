'use client'

import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function CreateCollectionButton() {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])


  if (!mounted) {
    return <Button>Create Collection</Button>
  }

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
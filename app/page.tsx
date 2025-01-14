import { Button } from "@/components/ui/button"
import Link from "next/link"
import CollectionsList from "@/components/collections-list"

export default function Home() {
  return (
    <main className="container p-8 mx-auto max-w-5xl">
      <div className="flex flex-col items-center gap-4 w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-center">Welcome to NFT Maker</h1>
        <p className="text-muted-foreground text-center">Create your own NFT collection in minutes</p>
        <Button asChild>
          <Link href="/create">Create Collection</Link>
        </Button>
        <CollectionsList />
      </div>
    </main>
  )
}

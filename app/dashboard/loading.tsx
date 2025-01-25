import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>
      
      <div className="rounded-md border">
        <div className="border-b">
          <div className="flex h-10 items-center px-4">
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        
        {/* 表格行骨架 */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b">
            <div className="flex items-center space-x-4 p-4">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
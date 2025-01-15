import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function LoadingSkeleton() {
    return (
      <div className="mx-auto container max-w-5xl min-h-screen p-8">
        <div className="grid gap-8">
          <Skeleton className="aspect-video w-full" />
          <div className="grid gap-6">
            <div>
              <Skeleton className="h-10 w-[250px]" />
              <Skeleton className="h-20 w-full mt-2" />
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-[100px]" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[100px]" />
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-[100px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-[80px]" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-[100px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full mt-2" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  } 
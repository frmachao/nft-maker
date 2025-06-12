"use client"
import { CardContent } from "@/components/ui/card"

export default function MintPeriod({ startTime, endTime }: { startTime: bigint, endTime: bigint }) {
    if (Number(startTime) === 0 && Number(endTime) === 0) {
      return (
        <CardContent>
          <p className="text-sm text-muted-foreground">No time limit</p>
        </CardContent>
      )
    }
  
    return (
      <CardContent className="space-y-2">
        {Number(startTime) > 0 && (
          <div>
            <p className="text-sm text-muted-foreground">Start:</p>
            <p>{new Date(Number(startTime) * 1000).toLocaleString()}</p>
          </div>
        )}
        {Number(endTime) > 0 && (
          <div>
            <p className="text-sm text-muted-foreground">End:</p>
            <p>{new Date(Number(endTime) * 1000).toLocaleString()}</p>
          </div>
        )}
      </CardContent>
    )
  }
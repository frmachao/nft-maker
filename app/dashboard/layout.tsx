import { DashboardHeader } from "@/components/dashboard/header"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <DashboardHeader />
      {children}
      <Toaster />
    </div>
  )
}
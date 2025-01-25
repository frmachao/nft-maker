import { Header } from "@/components/Header"
import { Toaster } from "@/components/ui/toaster"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      {children}
      <Toaster />
    </>
  )
}

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ContextProvider } from "@/context";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFT Maker",
  description: "Create your own NFT collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider>
          <UnifiedHeader />
          {children}
          <Toaster />
        </ContextProvider>
      </body>
    </html>
  );
}

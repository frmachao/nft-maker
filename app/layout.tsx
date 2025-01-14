import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ContextProvider } from "@/context";
import { Header } from "@/components/Header";

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
      <Header />
            {children}
      </ContextProvider>
      </body>
    </html>
  );
}

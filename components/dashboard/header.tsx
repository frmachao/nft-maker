import Link from "next/link";
import { cookies } from "next/headers";
import { UserButton } from "@/components/dashboard/user-button";

export function DashboardHeader() {
  const isAuthenticated = cookies().has("auth");

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link  href="/dashboard"  className="font-bold text-xl flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full"></div>
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            NFT Maker
          </Link>
        </div>
        {isAuthenticated && <UserButton />}
      </div>
    </header>
  );
}

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cookies } from "next/headers";
import Link from "next/link";
import { UserButton } from "@/components/user-button";

export function UnifiedHeader() {
  const isAuthenticated = cookies().has("auth");

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full"></div>
            <span className="text-xl font-bold">NFT Maker</span>
          </Link>

          {/* 导航菜单 */}
          {isAuthenticated && (
            <nav className="flex items-center space-x-6">
              <Link
                href="/create"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                create collection
              </Link>

              <Link
                href="/mint_management"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                mint management
              </Link>
            </nav>
          )}
        </div>

        {/* 右侧按钮区域 */}
        <div className="flex items-center space-x-4">
          <ConnectButton />
          {isAuthenticated && <UserButton />}
        </div>
      </div>
    </header>
  );
}

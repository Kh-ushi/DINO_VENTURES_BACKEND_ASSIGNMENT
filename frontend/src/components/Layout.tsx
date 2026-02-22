import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 pb-20 md:pb-0">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-3 border-b border-border px-4 md:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg balance-gradient">
            <span className="text-xs font-bold text-primary-foreground">🦕</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Dino Wallet
          </span>
        </header>
        <div className="mx-auto max-w-4xl px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}

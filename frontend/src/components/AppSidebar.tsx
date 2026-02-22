import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowUpCircle,
  ArrowDownCircle,
  Receipt,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/topup", icon: ArrowUpCircle, label: "Top Up" },
  { to: "/spend", icon: ArrowDownCircle, label: "Spend" },
  { to: "/transactions", icon: Receipt, label: "Transactions" },
];

export function AppSidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-sidebar border-r border-sidebar-border">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg balance-gradient">
          <span className="text-sm font-bold text-primary-foreground">🦕</span>
        </div>
        <span className="text-lg font-semibold text-sidebar-accent-foreground tracking-tight">
          Dino Wallet
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-sidebar-foreground/50">Dino Wallet v1.0</p>
      </div>
    </aside>
  );
}

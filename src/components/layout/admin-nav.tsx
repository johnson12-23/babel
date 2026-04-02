"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/admin", label: "Inbox" },
    { href: "/admin/menu", label: "Menu Items" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/analytics", label: "Analytics" },
  ];

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="border-b border-mist/20 bg-charcoal/80 px-4 py-3 sm:px-8 sm:py-4 lg:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4 sm:gap-8">
          <Link href="/admin" className="text-xl font-semibold tracking-[0.15em] text-gold">
            BABEL ADMIN
          </Link>
          <div className="hidden gap-4 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold transition ${
                  pathname === item.href ? "text-gold" : "text-mist hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full border border-mist/35 px-3 py-2 text-sm font-semibold text-mist transition hover:border-gold hover:text-gold md:hidden"
            aria-label="Toggle admin navigation"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            <span className="hidden sm:inline">Menu</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-mist/35 px-4 py-2 text-sm font-semibold text-mist transition hover:border-gold hover:text-gold"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-3 max-w-7xl rounded-2xl border border-mist/20 bg-onyx/95 px-3 py-3 md:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  pathname === item.href ? "bg-gold text-onyx" : "text-mist hover:bg-charcoal/80 hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

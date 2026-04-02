"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="border-b border-mist/15 bg-charcoal/75 px-5 py-4 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="text-xl font-semibold tracking-[0.15em] text-gold">
            BABEL ADMIN
          </Link>
          <div className="hidden gap-4 md:flex">
            <Link
              href="/admin"
              className={`text-sm font-semibold transition ${
                pathname === "/admin" ? "text-gold" : "text-mist hover:text-cream"
              }`}
            >
              Inbox
            </Link>
            <Link
              href="/admin/menu"
              className={`text-sm font-semibold transition ${
                pathname === "/admin/menu" ? "text-gold" : "text-mist hover:text-cream"
              }`}
            >
              Menu Items
            </Link>
            <Link
              href="/admin/events"
              className={`text-sm font-semibold transition ${
                pathname === "/admin/events" ? "text-gold" : "text-mist hover:text-cream"
              }`}
            >
              Events
            </Link>
            <Link
              href="/admin/analytics"
              className={`text-sm font-semibold transition ${
                pathname === "/admin/analytics" ? "text-gold" : "text-mist hover:text-cream"
              }`}
            >
              Analytics
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full border border-mist/25 px-4 py-2 text-sm font-semibold text-mist transition hover:border-gold hover:text-gold"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}

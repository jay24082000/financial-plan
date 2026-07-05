"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Clock,
  Calculator,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { BrandMark } from "./BrandMark";
import { ProfileBadge } from "./ProfileBadge";

const NAV = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutGrid },
  { href: "/retirement", label: "Retirement", Icon: Clock },
  { href: "/calculator", label: "Calculator", Icon: Calculator },
  { href: "/markets", label: "Markets", Icon: TrendingUp },
  { href: "/portfolio", label: "Portfolio", Icon: Briefcase },
];

export function PillNav() {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/onboarding")
  ) {
    return null;
  }

  return (
    <header className="pointer-events-none sticky top-0 z-30 grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-4 md:px-8">
      <BrandMark className="pointer-events-auto justify-self-start" />

      <nav className="no-scrollbar pointer-events-auto flex max-w-full justify-self-center gap-0.5 overflow-x-auto rounded-full border border-[#ebebe3] bg-white p-1.25 shadow-[0_4px_16px_rgba(20,25,30,0.07)]">
        {NAV.map(({ href, label, Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-semibold transition-colors ${
                active
                  ? "bg-[#10141a] text-white"
                  : "text-[#646b74] hover:text-[#1a1d21]"
              }`}
            >
              <Icon size={15} strokeWidth={1.8} />
              <span className="hidden md:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <ProfileBadge className="pointer-events-auto justify-self-end" />
    </header>
  );
}

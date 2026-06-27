"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

function initials(user: User): string {
  const name = (user.user_metadata?.full_name as string | undefined)?.trim();
  if (name) {
    const parts = name.split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return (user.email?.[0] ?? "?").toUpperCase();
}

export function ProfileBadge({ className = "" }: { className?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!ready) {
    return <div className={`h-[38px] w-[38px] ${className}`} />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className={`flex items-center rounded-full bg-[#10141a] px-4 py-2 text-[13px] font-semibold text-white ${className}`}
      >
        Sign in
      </Link>
    );
  }

  const name =
    (user.user_metadata?.full_name as string | undefined) ?? "Account";

  return (
    <div
      className={`relative flex items-center gap-3.5 ${className}`}
      ref={ref}
    >
      <div className="hidden shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-[#ebebe3] bg-white px-3.5 py-[7px] shadow-[0_1px_2px_rgba(20,25,30,0.04)] lg:flex">
        <span className="h-[7px] w-[7px] rounded-full bg-[#13b07a] shadow-[0_0_0_3px_rgba(19,176,122,0.18)]" />
        <span className="hidden text-[12.5px] font-semibold text-[#3a4048] min-[1120px]:inline">
          On track
        </span>
        <span className="mer-num text-[12.5px] font-semibold text-[#0e9466]">
          92%
        </span>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-gradient-to-br from-[#2a3340] to-[#3c4a5c] text-[13px] font-bold text-white shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
      >
        {initials(user)}
      </button>

      {open && (
        <div className="absolute right-0 top-[46px] w-56 overflow-hidden rounded-[14px] border border-[#ecece4] bg-white shadow-[0_8px_28px_rgba(20,25,30,0.12)]">
          <div className="border-b border-[#f1f1ea] px-4 py-3">
            <div className="truncate text-[13.5px] font-bold">{name}</div>
            <div className="truncate text-[12px] text-[#9aa0a8]">
              {user.email}
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full px-4 py-3 text-left text-[13.5px] font-semibold text-[#cf4842] transition hover:bg-[#faf6f5]"
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

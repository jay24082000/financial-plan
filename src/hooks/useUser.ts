"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return user;
}

export function displayName(user: User | null): string {
  if (!user) return "there";
  const full = (user.user_metadata?.full_name as string | undefined)?.trim();
  if (full) return full.split(/\s+/)[0];
  if (user.email) return user.email.split("@")[0];
  return "there";
}

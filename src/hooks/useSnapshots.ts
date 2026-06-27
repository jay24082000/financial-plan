"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Snapshot {
  day: string;
  value: number;
}

export function useSnapshots() {
  const supabase = useMemo(() => createClient(), []);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [loaded, setLoaded] = useState(false);
  const recordedRef = useRef(false);

  useEffect(() => {
    supabase
      .from("portfolio_snapshots")
      .select("day, value")
      .order("day", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setHistory(
            data.map((r) => ({ day: r.day as string, value: Number(r.value) })),
          );
        }
        setLoaded(true);
      });
  }, [supabase]);

  const recordToday = useCallback(
    async (value: number) => {
      if (recordedRef.current || value <= 0) return;
      recordedRef.current = true;
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const day = new Date().toISOString().slice(0, 10);
      await supabase
        .from("portfolio_snapshots")
        .upsert({ user_id: uid, day, value }, { onConflict: "user_id,day" });
      setHistory((prev) => {
        const rest = prev.filter((s) => s.day !== day);
        return [...rest, { day, value }];
      });
    },
    [supabase],
  );

  return { history, loaded, recordToday };
}

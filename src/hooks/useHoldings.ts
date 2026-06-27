"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Holding } from "@/lib/types";

interface HoldingRow {
  id: string;
  type: Holding["type"];
  symbol: string;
  label: string;
  quantity: number | string;
  avg_cost: number | string;
}

function rowToHolding(r: HoldingRow): Holding {
  return {
    id: r.id,
    type: r.type,
    symbol: r.symbol,
    label: r.label,
    quantity: Number(r.quantity),
    avgCost: Number(r.avg_cost),
  };
}

export function useHoldings() {
  const supabase = useMemo(() => createClient(), []);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("holdings")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data) setHoldings((data as HoldingRow[]).map(rowToHolding));
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const addHolding = useCallback(
    async (h: Omit<Holding, "id">) => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const { data, error } = await supabase
        .from("holdings")
        .insert({
          user_id: uid,
          type: h.type,
          symbol: h.symbol,
          label: h.label,
          quantity: h.quantity,
          avg_cost: h.avgCost,
        })
        .select()
        .single();
      if (!error && data) {
        setHoldings((prev) => [...prev, rowToHolding(data as HoldingRow)]);
      }
    },
    [supabase],
  );

  const updateHolding = useCallback(
    async (id: string, patch: Omit<Holding, "id">) => {
      const { data, error } = await supabase
        .from("holdings")
        .update({
          type: patch.type,
          symbol: patch.symbol,
          label: patch.label,
          quantity: patch.quantity,
          avg_cost: patch.avgCost,
        })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        const updated = rowToHolding(data as HoldingRow);
        setHoldings((prev) => prev.map((h) => (h.id === id ? updated : h)));
      }
    },
    [supabase],
  );

  const removeHolding = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("holdings").delete().eq("id", id);
      if (!error) setHoldings((prev) => prev.filter((h) => h.id !== id));
    },
    [supabase],
  );

  return {
    holdings,
    loading,
    addHolding,
    updateHolding,
    removeHolding,
    reload: load,
  };
}

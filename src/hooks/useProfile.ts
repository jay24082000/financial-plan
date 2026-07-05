"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_PROFILE, type Profile } from "@/lib/profile";

interface ProfileRow {
  age: number | null;
  occupation: string | null;
  monthly_income: number | string | null;
  current_savings: number | string | null;
  monthly_contribution: number | string | null;
  goal: string | null;
  retirement_age: number | null;
  risk: string | null;
  experience: string | null;
  currency: string | null;
  onboarded: boolean | null;
}

function rowToProfile(r: ProfileRow): Profile {
  return {
    age: r.age ?? DEFAULT_PROFILE.age,
    occupation: r.occupation ?? "",
    monthlyIncome: Number(r.monthly_income ?? DEFAULT_PROFILE.monthlyIncome),
    currentSavings: Number(r.current_savings ?? DEFAULT_PROFILE.currentSavings),
    monthlyContribution: Number(
      r.monthly_contribution ?? DEFAULT_PROFILE.monthlyContribution,
    ),
    goal: (r.goal as Profile["goal"]) ?? DEFAULT_PROFILE.goal,
    retirementAge: r.retirement_age ?? DEFAULT_PROFILE.retirementAge,
    risk: (r.risk as Profile["risk"]) ?? DEFAULT_PROFILE.risk,
    experience:
      (r.experience as Profile["experience"]) ?? DEFAULT_PROFILE.experience,
    currency: r.currency ?? "USD",
    onboarded: r.onboarded ?? false,
  };
}

function profileToRow(p: Profile) {
  return {
    age: p.age,
    occupation: p.occupation,
    monthly_income: p.monthlyIncome,
    current_savings: p.currentSavings,
    monthly_contribution: p.monthlyContribution,
    goal: p.goal,
    retirement_age: p.retirementAge,
    risk: p.risk,
    experience: p.experience,
    currency: p.currency,
    onboarded: p.onboarded,
  };
}

export function useProfile() {
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data ? rowToProfile(data as ProfileRow) : null);
        setLoading(false);
      });
  }, [supabase]);

  const save = useCallback(
    async (p: Profile) => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: uid,
            ...profileToRow(p),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        )
        .select()
        .single();
      if (!error && data) setProfile(rowToProfile(data as ProfileRow));
    },
    [supabase],
  );

  return { profile, loading, save };
}

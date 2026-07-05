"use client";

import { useEffect, useState } from "react";
import { Check, Pencil } from "lucide-react";
import { PageShell } from "@/components/PageHeader";
import { MoneyField, NumberField } from "@/components/Fields";
import { useCurrency } from "@/components/CurrencyProvider";
import { useProfile } from "@/hooks/useProfile";
import { useUser } from "@/hooks/useUser";
import { useMounted } from "@/hooks/useMounted";
import {
  DEFAULT_PROFILE,
  GOAL_OPTIONS,
  RISK_OPTIONS,
  EXP_OPTIONS,
  GOAL_LABEL,
  RISK_LABEL,
  EXP_LABEL,
  type Profile,
} from "@/lib/profile";

function initials(name: string, email: string) {
  const n = name.trim();
  if (n) {
    const p = n.split(/\s+/);
    return (p[0][0] + (p[1]?.[0] ?? "")).toUpperCase();
  }
  return (email[0] ?? "?").toUpperCase();
}

export default function ProfilePage() {
  const mounted = useMounted();
  const { fmt } = useCurrency();
  const user = useUser();
  const { profile, save } = useProfile();
  const [editing, setEditing] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [draft, setDraft] = useState<Profile>({ ...DEFAULT_PROFILE });

  useEffect(() => {
    if (profile) setDraft(profile);
  }, [profile]);

  const set = (p: Partial<Profile>) => setDraft((d) => ({ ...d, ...p }));
  const view = profile ?? DEFAULT_PROFILE;

  const fullName =
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    "Your account";
  const email = user?.email ?? "";
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "—";

  const onSave = async () => {
    await save({ ...draft, onboarded: true });
    setEditing(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2600);
  };

  if (!mounted) return <div className="min-h-[60vh]" />;

  const d = editing ? draft : view;

  return (
    <PageShell>
      <div className="mb-6 flex items-end justify-between gap-5">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight">
            Your profile
          </h1>
          <div className="mt-1 text-[14px] font-medium text-[#8a8f98]">
            The details behind your personalized plan.
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {justSaved && (
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0e9466]">
              <Check size={15} strokeWidth={2} /> Saved
            </span>
          )}
          {editing ? (
            <>
              <button
                onClick={() => {
                  setDraft(view);
                  setEditing(false);
                }}
                className="rounded-[11px] border border-[#e4e4dc] bg-white px-4 py-2.75 text-[13.5px] font-semibold text-[#3a4048]"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="rounded-[11px] bg-[#13b07a] px-5 py-2.75 text-[13.5px] font-bold text-white shadow-[0_4px_14px_rgba(19,176,122,0.3)]"
              >
                Save changes
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setDraft(view);
                setEditing(true);
              }}
              className="flex items-center gap-2 rounded-[11px] bg-[#10141a] px-4.5 py-2.75 text-[13.5px] font-semibold text-white"
            >
              <Pencil size={14} /> Edit profile
            </button>
          )}
        </div>
      </div>

      <div className="mb-4.5 flex items-center gap-4.5 rounded-[18px] border border-[#ecece4] bg-white p-6 shadow-[0_1px_2px_rgba(20,25,30,0.03)]">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#13b07a] to-[#0c7a53] text-[22px] font-bold text-white shadow-[0_4px_14px_rgba(19,176,122,0.3)]">
          {initials(fullName, email)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[19px] font-extrabold tracking-[-0.015em]">
            {fullName}
          </div>
          <div className="mt-0.5 text-[14px] font-medium text-[#787e87]">
            {email}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11.5px] font-semibold uppercase tracking-[0.04em] text-[#9aa0a8]">
            Member since
          </div>
          <div className="mer-num mt-0.5 text-[14px] font-semibold">
            {memberSince}
          </div>
        </div>
      </div>

      <Section title="Personal">
        <div className="grid gap-x-7 gap-y-5.5 sm:grid-cols-2">
          <Field label="Age">
            {editing ? (
              <NumberField
                label=""
                value={d.age}
                min={18}
                max={70}
                suffix=" yrs"
                onChange={(v) => set({ age: v })}
              />
            ) : (
              <Value mono>{d.age} years</Value>
            )}
          </Field>
          <Field label="Occupation">
            {editing ? (
              <input
                type="text"
                value={d.occupation}
                onChange={(e) => set({ occupation: e.target.value })}
                placeholder="e.g. Software engineer"
                className="w-full rounded-xl border border-[#e2e2da] bg-[#fafaf6] px-3.25 py-2.75 text-[15px] font-medium outline-hidden focus:border-[#13b07a] focus:bg-white"
              />
            ) : (
              <Value>{d.occupation || "Not set"}</Value>
            )}
          </Field>
        </div>
      </Section>

      <Section title="Finances">
        <div className="grid gap-x-7 gap-y-5.5 sm:grid-cols-3">
          <Field label="Monthly income">
            {editing ? (
              <MoneyField
                label=""
                usdValue={d.monthlyIncome}
                usdMin={0}
                usdMax={20000}
                usdStep={100}
                onChangeUSD={(v) => set({ monthlyIncome: v })}
              />
            ) : (
              <Value mono>{fmt(d.monthlyIncome)}/mo</Value>
            )}
          </Field>
          <Field label="Current savings">
            {editing ? (
              <MoneyField
                label=""
                usdValue={d.currentSavings}
                usdMin={0}
                usdMax={300000}
                usdStep={1000}
                onChangeUSD={(v) => set({ currentSavings: v })}
              />
            ) : (
              <Value mono>{fmt(d.currentSavings)}</Value>
            )}
          </Field>
          <Field label="Monthly contribution">
            {editing ? (
              <MoneyField
                label=""
                usdValue={d.monthlyContribution}
                usdMin={0}
                usdMax={5000}
                usdStep={50}
                accent
                onChangeUSD={(v) => set({ monthlyContribution: v })}
              />
            ) : (
              <Value mono accent>
                {fmt(d.monthlyContribution)}/mo
              </Value>
            )}
          </Field>
        </div>
      </Section>

      <Section title="Plan">
        <Field label="Primary goal">
          {editing ? (
            <Segmented
              options={GOAL_OPTIONS.map((g) => ({
                key: g.key,
                label: g.label,
              }))}
              value={d.goal}
              onChange={(k) => set({ goal: k as Profile["goal"] })}
            />
          ) : (
            <Value>{GOAL_LABEL[d.goal]}</Value>
          )}
        </Field>
        <div className="mt-5.5">
          <Field label="Target retirement age">
            {editing ? (
              <div className="max-w-90">
                <NumberField
                  label=""
                  value={d.retirementAge}
                  min={50}
                  max={75}
                  prefix="Age "
                  onChange={(v) => set({ retirementAge: v })}
                />
              </div>
            ) : (
              <Value mono>Age {d.retirementAge}</Value>
            )}
          </Field>
        </div>
      </Section>

      <Section title="Investing" last>
        <Field label="Risk comfort">
          {editing ? (
            <Segmented
              options={RISK_OPTIONS.map((r) => ({
                key: r.key,
                label: r.label,
              }))}
              value={d.risk}
              onChange={(k) => set({ risk: k as Profile["risk"] })}
            />
          ) : (
            <Value>{RISK_LABEL[d.risk]}</Value>
          )}
        </Field>
        <div className="mt-5.5">
          <Field label="Investing experience">
            {editing ? (
              <Segmented
                options={EXP_OPTIONS.map((e) => ({
                  key: e.key,
                  label: e.label,
                }))}
                value={d.experience}
                onChange={(k) =>
                  set({ experience: k as Profile["experience"] })
                }
              />
            ) : (
              <Value>{EXP_LABEL[d.experience]}</Value>
            )}
          </Field>
        </div>
      </Section>
    </PageShell>
  );
}

function Section({
  title,
  children,
  last,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`rounded-[18px] border border-[#ecece4] bg-white p-6 shadow-[0_1px_2px_rgba(20,25,30,0.03)] ${last ? "" : "mb-4.5"}`}
    >
      <div className="mb-5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#0e9466]">
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-[13px] font-semibold text-[#8a8f98]">
        {label}
      </div>
      {children}
    </div>
  );
}

function Value({
  children,
  mono,
  accent,
}: {
  children: React.ReactNode;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`text-[17px] ${mono ? "mer-num font-semibold" : "font-bold"}`}
      style={accent ? { color: "#0e9466" } : undefined}
    >
      {children}
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const sel = value === o.key;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className="rounded-[11px] px-4 py-2.25 text-[13.5px] font-semibold transition"
            style={
              sel
                ? {
                    background: "#13b07a",
                    border: "1px solid #13b07a",
                    color: "#fff",
                  }
                : {
                    background: "#fafaf6",
                    border: "1px solid #e4e4dc",
                    color: "#5c636c",
                  }
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

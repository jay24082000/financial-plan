"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Home, Shield, TrendingUp, Check } from "lucide-react";
import { StaxLogo } from "@/components/StaxLogo";
import { MoneyField, NumberField } from "@/components/Fields";
import { useCurrency } from "@/components/CurrencyProvider";
import { useProfile } from "@/hooks/useProfile";
import {
  DEFAULT_PROFILE,
  GOAL_OPTIONS,
  RISK_OPTIONS,
  EXP_OPTIONS,
  OCCUPATION_SUGGESTIONS,
  expectedReturnForRisk,
  type Profile,
} from "@/lib/profile";
import { futureValue } from "@/lib/finance";

const STEP_LABELS = ["About you", "Your money", "Your goals", "Your style"];
const GOAL_ICON = {
  retirement: Clock,
  home: Home,
  emergency: Shield,
  wealth: TrendingUp,
};
const GOAL_TINT = {
  retirement: { bg: "#eaf4f0", color: "#0e9466" },
  home: { bg: "#eef1f6", color: "#3174b8" },
  emergency: { bg: "#fbf1e3", color: "#c28a2a" },
  wealth: { bg: "#f2eefb", color: "#7a5cf0" },
};

export default function OnboardingPage() {
  const { profile, save } = useProfile();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<Profile>({ ...DEFAULT_PROFILE });

  useEffect(() => {
    if (profile) setData((d) => ({ ...d, ...profile, onboarded: d.onboarded }));
  }, [profile]);

  const set = (patch: Partial<Profile>) => setData((d) => ({ ...d, ...patch }));
  const go = (delta: number) =>
    setStep((s) => Math.max(0, Math.min(4, s + delta)));

  const projection = useMemo(() => {
    const years = Math.max(0, data.retirementAge - data.age);
    const rate = expectedReturnForRisk(data.risk);
    const bal = futureValue(
      data.currentSavings,
      data.monthlyContribution,
      rate,
      years,
    );
    return { bal, income: bal * 0.04 };
  }, [data]);

  const finish = async () => {
    setSaving(true);
    await save({ ...data, onboarded: true });
    window.location.assign("/dashboard");
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f6f6f2] text-[#1a1d21]">
      <aside className="hidden w-[380px] shrink-0 flex-col bg-[#10141a] p-11 text-white lg:flex">
        <div className="mb-[54px] flex items-center gap-2.5">
          <StaxLogo size={34} shadow={false} />
          <span className="text-[19px] font-extrabold tracking-tight">
            Stax
          </span>
        </div>
        <h1 className="max-w-[280px] text-[30px] font-extrabold leading-[1.18] tracking-[-0.03em]">
          Let&apos;s set up your plan.
        </h1>
        <p className="mb-11 mt-4 max-w-[270px] text-[15px] leading-relaxed text-[#9aa3ae]">
          Answer a few friendly questions and we&apos;ll tailor your dashboard
          and retirement plan to you.
        </p>
        <div className="flex flex-col">
          {STEP_LABELS.map((label, i) => {
            const done = i < step || step === 4;
            const active = i === step && step < 4;
            return (
              <div key={label} className="flex items-start gap-[15px]">
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-bold"
                    style={
                      done
                        ? { background: "#13b07a", color: "#fff" }
                        : active
                          ? {
                              background: "rgba(19,176,122,0.12)",
                              color: "#fff",
                              border: "1.5px solid #13b07a",
                            }
                          : {
                              background: "rgba(255,255,255,0.05)",
                              color: "#6a727c",
                              border: "1px solid rgba(255,255,255,0.13)",
                            }
                    }
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div
                      className="my-1.5 h-[26px] w-0.5 rounded"
                      style={{
                        background:
                          i < step || step === 4
                            ? "#13b07a"
                            : "rgba(255,255,255,0.13)",
                      }}
                    />
                  )}
                </div>
                <div className="pt-1">
                  <div
                    className="mb-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em]"
                    style={{ color: active || done ? "#9ce3c4" : "#6a727c" }}
                  >
                    Step {i + 1}
                  </div>
                  <div
                    className="text-[14.5px] font-bold"
                    style={{ color: active || done ? "#fff" : "#8a929c" }}
                  >
                    {label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-auto flex items-center gap-2.5 text-[13px] font-medium text-[#7a828d]">
          <Clock size={15} /> Takes about 2 minutes
        </div>
      </aside>

      <main className="flex flex-1 flex-col items-center overflow-y-auto px-6 py-10">
        <div className="my-auto w-full max-w-[560px]">
          <div className="mb-6">
            <div className="mb-2.5 flex items-baseline justify-between">
              <span className="text-[13px] font-bold tracking-[0.02em] text-[#0e9466]">
                {step < 4 ? STEP_LABELS[step] : "All done"}
              </span>
              <span className="mer-num text-[12.5px] font-semibold text-[#9aa0a8]">
                {step < 4 ? `Step ${step + 1} of 4` : "100%"}
              </span>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[5px] flex-1 rounded-[3px] transition-colors"
                  style={{ background: i <= step ? "#13b07a" : "#e5e5dd" }}
                />
              ))}
            </div>
          </div>

          {step < 4 ? (
            <div className="mer-fade rounded-[22px] border border-[#ecece4] bg-white p-8 pb-7 shadow-[0_1px_2px_rgba(20,25,30,0.04),0_18px_40px_rgba(20,25,30,0.05)]">
              {step === 0 && <StepBasics data={data} set={set} />}
              {step === 1 && <StepMoney data={data} set={set} />}
              {step === 2 && <StepGoals data={data} set={set} />}
              {step === 3 && <StepStyle data={data} set={set} />}

              <div className="mt-[30px] flex items-center justify-between border-t border-[#f0f0ea] pt-6">
                {step > 0 ? (
                  <button
                    onClick={() => go(-1)}
                    className="rounded-[13px] border border-[#deded6] bg-white px-6 py-3.5 text-[15px] font-bold text-[#3a4048]"
                  >
                    Back
                  </button>
                ) : (
                  <span />
                )}
                <button
                  onClick={() => go(1)}
                  className="rounded-[13px] bg-[#10141a] px-6 py-3.5 text-[15px] font-bold text-white transition hover:bg-[#20272f]"
                >
                  {step < 3 ? "Continue" : "See my plan"}
                </button>
              </div>
            </div>
          ) : (
            <Summary
              data={data}
              projection={projection}
              saving={saving}
              onFinish={finish}
              onEdit={(i) => setStep(i)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function StepBasics({
  data,
  set,
}: {
  data: Profile;
  set: (p: Partial<Profile>) => void;
}) {
  return (
    <>
      <h2 className="mb-1.5 text-[24px] font-extrabold tracking-[-0.025em]">
        First, the basics
      </h2>
      <p className="mb-7 text-[15px] leading-snug text-[#646b74]">
        A few quick details so we can shape the plan around you.
      </p>
      <div className="mb-[26px]">
        <NumberField
          label="How old are you?"
          value={data.age}
          min={18}
          max={70}
          suffix=" yrs"
          onChange={(v) => set({ age: v })}
        />
      </div>
      <div className="mb-[26px]">
        <div className="mb-3 text-[14px] font-semibold text-[#3a4048]">
          What do you do?
        </div>
        <input
          type="text"
          placeholder="e.g. Software engineer"
          value={data.occupation}
          onChange={(e) => set({ occupation: e.target.value })}
          className="w-full rounded-xl border border-[#e2e2da] bg-[#fafaf6] px-[15px] py-[13px] text-[15px] font-medium outline-none focus:border-[#13b07a] focus:bg-white"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {OCCUPATION_SUGGESTIONS.map((o) => {
            const sel = data.occupation === o;
            return (
              <button
                key={o}
                onClick={() => set({ occupation: o })}
                className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition"
                style={
                  sel
                    ? {
                        background: "#13b07a",
                        border: "1px solid #13b07a",
                        color: "#fff",
                      }
                    : {
                        background: "#fff",
                        border: "1px solid #e4e4dc",
                        color: "#5c636c",
                      }
                }
              >
                {o}
              </button>
            );
          })}
        </div>
      </div>
      <MoneyField
        label="Monthly income (after tax)"
        usdValue={data.monthlyIncome}
        usdMin={0}
        usdMax={20000}
        usdStep={100}
        onChangeUSD={(v) => set({ monthlyIncome: v })}
      />
    </>
  );
}

function StepMoney({
  data,
  set,
}: {
  data: Profile;
  set: (p: Partial<Profile>) => void;
}) {
  return (
    <>
      <h2 className="mb-1.5 text-[24px] font-extrabold tracking-[-0.025em]">
        Where you are today
      </h2>
      <p className="mb-7 text-[15px] leading-snug text-[#646b74]">
        No judgment here — every starting point is a good one.
      </p>
      <div className="mb-[26px]">
        <MoneyField
          label="Current savings & investments"
          usdValue={data.currentSavings}
          usdMin={0}
          usdMax={200000}
          usdStep={1000}
          onChangeUSD={(v) => set({ currentSavings: v })}
        />
      </div>
      <div className="rounded-2xl border border-[#efefe8] bg-[#fafaf6] p-5">
        <MoneyField
          label="How much can you save each month?"
          usdValue={data.monthlyContribution}
          usdMin={0}
          usdMax={5000}
          usdStep={50}
          onChangeUSD={(v) => set({ monthlyContribution: v })}
          accent
        />
        <div className="mt-4 flex items-start gap-2.5 text-[12.5px] leading-relaxed text-[#787e87]">
          <Check size={15} className="mt-px shrink-0 text-[#13b07a]" />
          Even small, steady amounts compound into a lot over time. You can
          change this anytime.
        </div>
      </div>
    </>
  );
}

function StepGoals({
  data,
  set,
}: {
  data: Profile;
  set: (p: Partial<Profile>) => void;
}) {
  return (
    <>
      <h2 className="mb-1.5 text-[24px] font-extrabold tracking-[-0.025em]">
        What are you working toward?
      </h2>
      <p className="mb-6 text-[15px] leading-snug text-[#646b74]">
        Pick what matters most right now. You can add more later.
      </p>
      <div className="mb-7 grid grid-cols-2 gap-3">
        {GOAL_OPTIONS.map((g) => {
          const sel = data.goal === g.key;
          const Icon = GOAL_ICON[g.key];
          const tint = GOAL_TINT[g.key];
          return (
            <button
              key={g.key}
              onClick={() => set({ goal: g.key })}
              className="relative flex flex-col items-start rounded-2xl p-5 text-left transition hover:-translate-y-0.5"
              style={
                sel
                  ? { border: "1.5px solid #13b07a", background: "#f1faf5" }
                  : { border: "1px solid #ecece4", background: "#fff" }
              }
            >
              <div
                className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl"
                style={
                  sel
                    ? { background: "#13b07a", color: "#fff" }
                    : { background: tint.bg, color: tint.color }
                }
              >
                <Icon size={22} strokeWidth={1.7} />
              </div>
              <div className="text-[15.5px] font-bold tracking-[-0.01em]">
                {g.label}
              </div>
              <div className="mt-1 text-[12.5px] leading-snug text-[#787e87]">
                {g.desc}
              </div>
              {sel && (
                <div className="absolute right-3.5 top-3.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#13b07a]">
                  <Check size={12} className="text-white" strokeWidth={2.4} />
                </div>
              )}
            </button>
          );
        })}
      </div>
      <NumberField
        label="When would you like to retire?"
        value={data.retirementAge}
        min={50}
        max={75}
        prefix="Age "
        onChange={(v) => set({ retirementAge: v })}
      />
    </>
  );
}

function LevelBars({ level }: { level: number }) {
  return (
    <span className="inline-flex h-[22px] items-end gap-1">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[5px] rounded-[2px]"
          style={{
            height: 7 + i * 4,
            background: i <= level ? "#13b07a" : "#daddd6",
          }}
        />
      ))}
    </span>
  );
}

function ChoiceRow({
  selected,
  onClick,
  left,
  label,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  left?: React.ReactNode;
  label: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-[14px] px-[18px] py-[15px] text-left transition hover:-translate-y-0.5"
      style={
        selected
          ? { border: "1.5px solid #13b07a", background: "#f1faf5" }
          : { border: "1px solid #ecece4", background: "#fff" }
      }
    >
      {left}
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold">{label}</span>
        <span className="mt-0.5 block text-[12.5px] text-[#787e87]">
          {desc}
        </span>
      </span>
      {selected && (
        <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#13b07a]">
          <Check size={12} className="text-white" strokeWidth={2.4} />
        </span>
      )}
    </button>
  );
}

function StepStyle({
  data,
  set,
}: {
  data: Profile;
  set: (p: Partial<Profile>) => void;
}) {
  return (
    <>
      <h2 className="mb-1.5 text-[24px] font-extrabold tracking-[-0.025em]">
        Your investing style
      </h2>
      <p className="mb-5 text-[15px] leading-snug text-[#646b74]">
        This helps us suggest a mix you&apos;ll feel good about.
      </p>
      <div className="mb-3 text-[13px] font-bold uppercase tracking-[0.05em] text-[#8a8f98]">
        How do you feel about risk?
      </div>
      <div className="mb-7 flex flex-col gap-2.5">
        {RISK_OPTIONS.map((r) => (
          <ChoiceRow
            key={r.key}
            selected={data.risk === r.key}
            onClick={() => set({ risk: r.key })}
            left={<LevelBars level={r.level} />}
            label={r.label}
            desc={r.desc}
          />
        ))}
      </div>
      <div className="mb-3 text-[13px] font-bold uppercase tracking-[0.05em] text-[#8a8f98]">
        How much have you invested before?
      </div>
      <div className="flex flex-col gap-2.5">
        {EXP_OPTIONS.map((e) => (
          <ChoiceRow
            key={e.key}
            selected={data.experience === e.key}
            onClick={() => set({ experience: e.key })}
            label={e.label}
            desc={e.desc}
          />
        ))}
      </div>
    </>
  );
}

function Summary({
  data,
  projection,
  saving,
  onFinish,
  onEdit,
}: {
  data: Profile;
  projection: { bal: number; income: number };
  saving: boolean;
  onFinish: () => void;
  onEdit: (step: number) => void;
}) {
  const { fmt } = useCurrency();
  const recap = [
    {
      title: "About you",
      step: 0,
      rows: [
        ["Age", String(data.age)],
        ["Occupation", data.occupation || "Not set"],
        ["Income", `${fmt(data.monthlyIncome)}/mo`],
      ],
    },
    {
      title: "Your money",
      step: 1,
      rows: [
        ["Savings", fmt(data.currentSavings)],
        ["Monthly save", `${fmt(data.monthlyContribution)}/mo`],
      ],
    },
    {
      title: "Your goals",
      step: 2,
      rows: [
        [
          "Primary goal",
          GOAL_OPTIONS.find((g) => g.key === data.goal)?.label ?? "",
        ],
        ["Retire at", `Age ${data.retirementAge}`],
      ],
    },
    {
      title: "Your style",
      step: 3,
      rows: [
        ["Risk comfort", data.risk[0].toUpperCase() + data.risk.slice(1)],
        [
          "Experience",
          EXP_OPTIONS.find((e) => e.key === data.experience)?.label ?? "",
        ],
      ],
    },
  ];

  return (
    <div className="mer-fade">
      <div className="mb-6 text-center">
        <div className="mb-4 inline-flex h-[62px] w-[62px] items-center justify-center rounded-[18px] bg-[#13b07a] shadow-[0_10px_26px_rgba(19,176,122,0.35)]">
          <Check size={30} className="text-white" strokeWidth={2.4} />
        </div>
        <h2 className="text-[28px] font-extrabold tracking-[-0.03em]">
          You&apos;re all set!
        </h2>
        <p className="mx-auto mt-3 max-w-[400px] text-[15.5px] leading-relaxed text-[#646b74]">
          Here&apos;s the plan we&apos;ve shaped from your answers. You can
          fine-tune any of it from your dashboard.
        </p>
      </div>

      <div className="mb-[18px] rounded-[20px] bg-[#10141a] px-7 py-[26px] text-white">
        <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#9aa3ae]">
          <span className="h-[7px] w-[7px] rounded-full bg-[#13b07a] shadow-[0_0_0_3px_rgba(19,176,122,0.25)]" />
          Projected at age {data.retirementAge}
        </div>
        <div className="mer-num text-[42px] font-semibold tracking-[-0.03em]">
          {fmt(projection.bal)}
        </div>
        <div className="mt-2 max-w-[380px] text-[13.5px] leading-relaxed text-[#a7aeb8]">
          That&apos;s roughly{" "}
          <span className="mer-num font-semibold text-[#3fd49a]">
            {fmt(projection.income)}
          </span>{" "}
          a year in retirement income at a 4% withdrawal rate.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {recap.map((g) => (
          <div
            key={g.title}
            className="rounded-2xl border border-[#ecece4] bg-white p-5 shadow-[0_1px_2px_rgba(20,25,30,0.03)]"
          >
            <div className="mb-3.5 flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#8a8f98]">
                {g.title}
              </span>
              <button
                onClick={() => onEdit(g.step)}
                className="text-[12.5px] font-semibold text-[#0e9466]"
              >
                Edit
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              {g.rows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span className="text-[13px] font-medium text-[#787e87]">
                    {label}
                  </span>
                  <span className="mer-num text-right text-[13.5px] font-semibold">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onFinish}
        disabled={saving}
        className="mt-[22px] block w-full rounded-[14px] bg-[#13b07a] py-4 text-center text-[16px] font-bold text-white shadow-[0_8px_22px_rgba(19,176,122,0.32)] transition hover:bg-[#0fa06d] disabled:opacity-60"
      >
        {saving ? "Saving…" : "Go to my dashboard"}
      </button>
      <button
        onClick={() => onEdit(3)}
        className="mt-3 block w-full py-1.5 text-center text-[14px] font-semibold text-[#787e87]"
      >
        Back to edit
      </button>
    </div>
  );
}

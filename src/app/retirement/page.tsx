"use client";

import { useMemo, useState } from "react";
import { Check, AlertTriangle } from "lucide-react";
import { Card, SectionTitle } from "@/components/Card";
import { RangeSlider } from "@/components/RangeSlider";
import { PageHeader, PageShell } from "@/components/PageHeader";
import { ProjectionChart } from "@/components/ProjectionChart";
import { Disclaimer } from "@/components/Disclaimer";
import { calculateRetirement } from "@/lib/finance";
import { formatUSD, formatPercent } from "@/lib/format";

export default function RetirementPage() {
  const [currentAge, setCurrentAge] = useState(32);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(85000);
  const [monthlyContribution, setMonthlyContribution] = useState(1500);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [inflation, setInflation] = useState(3);
  const [monthlyExpense, setMonthlyExpense] = useState(4000);

  const result = useMemo(
    () =>
      calculateRetirement({
        currentAge,
        retirementAge,
        lifeExpectancy: 90,
        currentSavings,
        monthlyContribution,
        expectedReturnPct: expectedReturn,
        inflationPct: inflation,
        monthlyExpenseToday: monthlyExpense,
        postRetirementReturnPct: Math.max(2, expectedReturn - 2),
      }),
    [
      currentAge,
      retirementAge,
      currentSavings,
      monthlyContribution,
      expectedReturn,
      inflation,
      monthlyExpense,
    ],
  );

  const chartData = useMemo(() => {
    const acc = result.accumulationSeries.map((p) => ({
      age: p.age ?? 0,
      balance: p.balance,
    }));
    const draw = result.drawdownSeries
      .slice(1)
      .map((p) => ({ age: p.age ?? 0, balance: p.balance }));
    return [...acc, ...draw];
  }, [result]);

  const onTrack = result.isOnTrack;
  const fundedPct = Math.min(999, Math.round(result.fundedRatio * 100));
  const gap = Math.abs(result.surplus);

  return (
    <>
      <PageShell>
        <PageHeader
          title="Retirement planning"
          subtitle="Project your savings and check if you're on track"
        />

        <div
          className="mb-[18px] rounded-[18px] border p-5"
          style={{
            background: onTrack ? "#eef8f2" : "#fbf4e6",
            borderColor: onTrack ? "#d2eadd" : "#efe0be",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
                style={{ background: onTrack ? "#13b07a" : "#d29b26" }}
              >
                {onTrack ? <Check size={22} /> : <AlertTriangle size={20} />}
              </div>
              <div>
                <div
                  className="text-[19px] font-extrabold"
                  style={{ color: onTrack ? "#0c7a53" : "#9a6f12" }}
                >
                  {onTrack ? "You're on track" : "Slightly behind"}
                </div>
                <div className="mt-0.5 text-[13.5px] text-[#5a6068]">
                  {onTrack
                    ? `Projected to exceed your goal by ${formatUSD(gap)} at age ${retirementAge}.`
                    : `You're ${formatUSD(gap)} short. Try raising your monthly contribution to ${formatUSD(result.requiredMonthlyContribution)}.`}
                </div>
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <div className="text-[12px] font-semibold text-[#8a8f98]">
                Funded
              </div>
              <div
                className="mer-num text-[30px] font-bold"
                style={{ color: onTrack ? "#0e9466" : "#d29b26" }}
              >
                {fundedPct}%
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-[18px] lg:grid-cols-[0.85fr_1.15fr]">
          <Card>
            <SectionTitle>Your details</SectionTitle>
            <div className="mt-5 flex flex-col gap-5">
              <RangeSlider
                label="Current age"
                value={currentAge}
                min={18}
                max={70}
                displayValue={`${currentAge}`}
                onChange={(v) =>
                  setCurrentAge(Math.min(v, retirementAge - 1))
                }
              />
              <RangeSlider
                label="Retirement age"
                value={retirementAge}
                min={45}
                max={80}
                displayValue={`${retirementAge}`}
                onChange={(v) =>
                  setRetirementAge(Math.max(v, currentAge + 1))
                }
              />
              <RangeSlider
                label="Current savings"
                value={currentSavings}
                min={0}
                max={1000000}
                step={5000}
                displayValue={formatUSD(currentSavings)}
                onChange={setCurrentSavings}
              />
              <RangeSlider
                label="Monthly contribution"
                value={monthlyContribution}
                min={0}
                max={10000}
                step={100}
                displayValue={formatUSD(monthlyContribution)}
                onChange={setMonthlyContribution}
              />
              <RangeSlider
                label="Expected annual return"
                value={expectedReturn}
                min={0}
                max={15}
                step={0.5}
                displayValue={`${expectedReturn.toFixed(1)}%`}
                onChange={setExpectedReturn}
              />
              <RangeSlider
                label="Inflation"
                value={inflation}
                min={0}
                max={8}
                step={0.5}
                displayValue={`${inflation.toFixed(1)}%`}
                onChange={setInflation}
              />
              <RangeSlider
                label="Monthly spending in retirement"
                value={monthlyExpense}
                min={1000}
                max={20000}
                step={250}
                displayValue={formatUSD(monthlyExpense)}
                onChange={setMonthlyExpense}
              />
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <SectionTitle>Savings projection</SectionTitle>
              <span className="flex items-center gap-1.5 text-[12px] text-[#9aa0a8]">
                <span className="h-[2px] w-4 bg-[#d29b26]" /> Goal
              </span>
            </div>
            <ProjectionChart data={chartData} target={result.requiredNestEgg} />
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[12.5px] font-semibold text-[#8a8f98]">
                  Projected at {retirementAge}
                </div>
                <div className="mer-num mt-1 text-[22px] font-bold text-[#0e9466]">
                  {formatUSD(result.projectedNestEgg)}
                </div>
              </div>
              <div>
                <div className="text-[12.5px] font-semibold text-[#8a8f98]">
                  You&apos;ll need
                </div>
                <div className="mer-num mt-1 text-[22px] font-bold">
                  {formatUSD(result.requiredNestEgg)}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </PageShell>
      <Disclaimer />
    </>
  );
}

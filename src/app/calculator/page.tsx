"use client";

import { useMemo, useState } from "react";
import { Card, SectionTitle } from "@/components/Card";
import { RangeSlider } from "@/components/RangeSlider";
import { PageHeader, PageShell } from "@/components/PageHeader";
import { GrowthChart } from "@/components/GrowthChart";
import { Disclaimer } from "@/components/Disclaimer";
import { compoundSeries } from "@/lib/finance";
import { formatUSD, formatSignedUSD, formatPercent } from "@/lib/format";

export default function CalculatorPage() {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(600);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [years, setYears] = useState(25);

  const series = useMemo(
    () => compoundSeries(initial, monthly, annualReturn, years),
    [initial, monthly, annualReturn, years],
  );

  const final = series[series.length - 1];
  const totalContributed = final.contributed;
  const totalGrowth = final.growth;
  const gainPct =
    totalContributed > 0 ? (totalGrowth / totalContributed) * 100 : 0;

  return (
    <>
      <PageShell>
        <PageHeader
          title="Investment calculator"
          subtitle="See how compound growth builds your wealth over time"
        />

        <div className="grid gap-[18px] lg:grid-cols-[0.85fr_1.15fr]">
          <Card>
            <SectionTitle>Assumptions</SectionTitle>
            <div className="mt-5 flex flex-col gap-5">
              <RangeSlider
                label="Initial deposit"
                value={initial}
                min={0}
                max={200000}
                step={1000}
                displayValue={formatUSD(initial)}
                onChange={setInitial}
              />
              <RangeSlider
                label="Monthly contribution"
                value={monthly}
                min={0}
                max={10000}
                step={50}
                displayValue={formatUSD(monthly)}
                onChange={setMonthly}
              />
              <RangeSlider
                label="Expected annual return"
                value={annualReturn}
                min={0}
                max={15}
                step={0.5}
                displayValue={`${annualReturn.toFixed(1)}%`}
                onChange={setAnnualReturn}
              />
              <RangeSlider
                label="Time horizon"
                value={years}
                min={1}
                max={50}
                displayValue={`${years} yrs`}
                onChange={setYears}
              />
            </div>
          </Card>

          <div className="flex flex-col gap-[18px]">
            <Card dark className="!p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[13px] font-semibold text-white/60">
                    Projected balance in {years} yrs
                  </div>
                  <div className="mer-num mt-2 text-[40px] font-semibold tracking-tight">
                    {formatUSD(final.balance)}
                  </div>
                  <div className="mer-num mt-1 text-[14px] font-semibold text-[#46ad80]">
                    {formatSignedUSD(totalGrowth)} growth ·{" "}
                    {formatPercent(gainPct)}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-6 text-[12.5px]">
                <span className="flex items-center gap-2 text-white/70">
                  <span className="h-2.5 w-2.5 rounded-[3px] bg-[#3c4a5c]" />
                  Your contributions
                </span>
                <span className="flex items-center gap-2 text-white/70">
                  <span className="h-2.5 w-2.5 rounded-[3px] bg-[#13b07a]" />
                  Compound growth
                </span>
              </div>
            </Card>

            <Card>
              <GrowthChart data={series} />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[12.5px] font-semibold text-[#8a8f98]">
                    You put in
                  </div>
                  <div className="mer-num mt-1 text-[20px] font-bold">
                    {formatUSD(totalContributed)}
                  </div>
                </div>
                <div>
                  <div className="text-[12.5px] font-semibold text-[#8a8f98]">
                    Growth earned
                  </div>
                  <div className="mer-num mt-1 text-[20px] font-bold text-[#0e9466]">
                    {formatUSD(totalGrowth)}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </PageShell>
      <Disclaimer />
    </>
  );
}

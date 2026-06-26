export function realRate(nominalPct: number, inflationPct: number): number {
  const n = nominalPct / 100;
  const i = inflationPct / 100;
  return ((1 + n) / (1 + i) - 1) * 100;
}

export function futureValue(
  principal: number,
  contributionPerPeriod: number,
  annualRatePct: number,
  years: number,
  periodsPerYear = 12,
): number {
  const r = annualRatePct / 100 / periodsPerYear;
  const n = Math.round(years * periodsPerYear);
  const fvPrincipal = principal * Math.pow(1 + r, n);
  const fvContrib =
    r === 0
      ? contributionPerPeriod * n
      : contributionPerPeriod * ((Math.pow(1 + r, n) - 1) / r);
  return fvPrincipal + fvContrib;
}

export interface YearPoint {
  year: number;
  age?: number;
  balance: number;
  contributed: number;
  growth: number;
}

export function compoundSeries(
  principal: number,
  monthlyContribution: number,
  annualRatePct: number,
  years: number,
  startAge?: number,
): YearPoint[] {
  const points: YearPoint[] = [];
  const monthlyRate = annualRatePct / 100 / 12;
  let balance = principal;
  let contributed = principal;

  points.push({ year: 0, age: startAge, balance, contributed, growth: 0 });

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      contributed += monthlyContribution;
    }
    points.push({
      year: y,
      age: startAge !== undefined ? startAge + y : undefined,
      balance,
      contributed,
      growth: balance - contributed,
    });
  }
  return points;
}

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturnPct: number;
  inflationPct: number;
  monthlyExpenseToday: number;
  postRetirementReturnPct?: number;
}

export interface RetirementResult {
  yearsToRetirement: number;
  yearsInRetirement: number;
  projectedNestEgg: number;
  requiredNestEgg: number;
  monthlyExpenseAtRetirement: number;
  surplus: number;
  isOnTrack: boolean;
  fundedRatio: number;
  requiredMonthlyContribution: number;
  accumulationSeries: YearPoint[];
  drawdownSeries: YearPoint[];
}

export function requiredMonthlySaving(
  targetNestEgg: number,
  currentSavings: number,
  annualRatePct: number,
  years: number,
): number {
  const r = annualRatePct / 100 / 12;
  const n = Math.round(years * 12);
  if (n <= 0) return 0;
  const fvOfCurrent = currentSavings * Math.pow(1 + r, n);
  const remaining = targetNestEgg - fvOfCurrent;
  if (remaining <= 0) return 0;
  if (r === 0) return remaining / n;
  const annuityFactor = (Math.pow(1 + r, n) - 1) / r;
  return remaining / annuityFactor;
}

export function requiredNestEggForDrawdown(
  monthlyExpenseAtRetirement: number,
  postReturnPct: number,
  inflationPct: number,
  yearsInRetirement: number,
): number {
  const months = Math.round(yearsInRetirement * 12);
  if (months <= 0) return 0;
  const r = postReturnPct / 100 / 12;
  const g = inflationPct / 100 / 12;
  const pmt = monthlyExpenseAtRetirement;

  if (Math.abs(r - g) < 1e-9) {
    return (pmt * months) / (1 + r);
  }
  const factor = (1 - Math.pow((1 + g) / (1 + r), months)) / (r - g);
  return pmt * factor;
}

/** Full retirement projection */
export function calculateRetirement(input: RetirementInput): RetirementResult {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    expectedReturnPct,
    inflationPct,
    monthlyExpenseToday,
  } = input;

  const postReturnPct = input.postRetirementReturnPct ?? expectedReturnPct;
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);

  const monthlyExpenseAtRetirement =
    monthlyExpenseToday * Math.pow(1 + inflationPct / 100, yearsToRetirement);

  const accumulationSeries = compoundSeries(
    currentSavings,
    monthlyContribution,
    expectedReturnPct,
    yearsToRetirement,
    currentAge,
  );
  const projectedNestEgg =
    accumulationSeries[accumulationSeries.length - 1]?.balance ??
    currentSavings;

  const requiredNestEgg = requiredNestEggForDrawdown(
    monthlyExpenseAtRetirement,
    postReturnPct,
    inflationPct,
    yearsInRetirement,
  );

  const surplus = projectedNestEgg - requiredNestEgg;
  const isOnTrack = surplus >= 0;
  const fundedRatio =
    requiredNestEgg > 0 ? projectedNestEgg / requiredNestEgg : 1;

  const requiredMonthlyContribution = requiredMonthlySaving(
    requiredNestEgg,
    currentSavings,
    expectedReturnPct,
    yearsToRetirement,
  );

  const drawdownSeries: YearPoint[] = [];
  let balance = projectedNestEgg;
  const monthlyPostRate = postReturnPct / 100 / 12;
  let withdrawn = 0;
  drawdownSeries.push({
    year: 0,
    age: retirementAge,
    balance,
    contributed: 0,
    growth: 0,
  });
  for (let y = 1; y <= yearsInRetirement; y++) {
    for (let m = 0; m < 12; m++) {
      const monthIndex = (y - 1) * 12 + m;
      const expense =
        monthlyExpenseAtRetirement *
        Math.pow(1 + inflationPct / 100, monthIndex / 12);
      balance = (balance - expense) * (1 + monthlyPostRate);
      withdrawn += expense;
    }
    drawdownSeries.push({
      year: y,
      age: retirementAge + y,
      balance: Math.max(0, balance),
      contributed: -withdrawn,
      growth: 0,
    });
  }

  return {
    yearsToRetirement,
    yearsInRetirement,
    projectedNestEgg,
    requiredNestEgg,
    monthlyExpenseAtRetirement,
    surplus,
    isOnTrack,
    fundedRatio,
    requiredMonthlyContribution,
    accumulationSeries,
    drawdownSeries,
  };
}

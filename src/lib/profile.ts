export type Goal = "retirement" | "home" | "emergency" | "wealth";
export type Risk = "low" | "medium" | "high";
export type Experience = "new" | "some" | "experienced";

export interface Profile {
  age: number;
  occupation: string;
  monthlyIncome: number;
  currentSavings: number;
  monthlyContribution: number;
  goal: Goal;
  retirementAge: number;
  risk: Risk;
  experience: Experience;
  currency: string;
  onboarded: boolean;
}

export const DEFAULT_PROFILE: Profile = {
  age: 27,
  occupation: "",
  monthlyIncome: 4500,
  currentSavings: 12000,
  monthlyContribution: 600,
  goal: "retirement",
  retirementAge: 65,
  risk: "medium",
  experience: "some",
  currency: "USD",
  onboarded: false,
};

export const GOAL_OPTIONS: { key: Goal; label: string; desc: string }[] = [
  {
    key: "retirement",
    label: "Retirement",
    desc: "Build a comfortable nest egg",
  },
  { key: "home", label: "Buy a home", desc: "Save toward a down payment" },
  {
    key: "emergency",
    label: "Emergency fund",
    desc: "A cushion for the unexpected",
  },
  { key: "wealth", label: "Grow wealth", desc: "Make my money work harder" },
];

export const RISK_OPTIONS: {
  key: Risk;
  label: string;
  desc: string;
  level: number;
}[] = [
  { key: "low", label: "Low", desc: "Keep it steady and safe", level: 1 },
  {
    key: "medium",
    label: "Medium",
    desc: "A balanced mix of growth and safety",
    level: 2,
  },
  {
    key: "high",
    label: "High",
    desc: "Aim for maximum long-term growth",
    level: 3,
  },
];

export const EXP_OPTIONS: { key: Experience; label: string; desc: string }[] = [
  { key: "new", label: "New to investing", desc: "Just getting started" },
  { key: "some", label: "Some experience", desc: "I know the basics" },
  { key: "experienced", label: "Experienced", desc: "I invest regularly" },
];

export const GOAL_LABEL: Record<Goal, string> = {
  retirement: "Retirement",
  home: "Buy a home",
  emergency: "Emergency fund",
  wealth: "Grow wealth",
};

export const RISK_LABEL: Record<Risk, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const EXP_LABEL: Record<Experience, string> = {
  new: "New to investing",
  some: "Some experience",
  experienced: "Experienced",
};

const RETURN_BY_RISK: Record<Risk, number> = { low: 5, medium: 7, high: 9 };

export function expectedReturnForRisk(risk: Risk): number {
  return RETURN_BY_RISK[risk] ?? 7;
}

export const OCCUPATION_SUGGESTIONS = [
  "Software engineer",
  "Teacher",
  "Nurse",
  "Designer",
  "Consultant",
  "Student",
];

import Link from "next/link";
import {
  LayoutGrid,
  Clock,
  Calculator,
  TrendingUp,
  Briefcase,
  Lock,
  Check,
  ShieldCheck,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { StaxLogo } from "@/components/StaxLogo";

function profileOf(user: User) {
  const name =
    (user.user_metadata?.full_name as string | undefined)?.trim() ||
    user.email ||
    "Account";
  const base = name.includes("@") ? name.split("@")[0] : name;
  const parts = base.split(/\s+/);
  const initials = (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  return { name, initials };
}

const FEATURES = [
  {
    Icon: LayoutGrid,
    tint: "#eaf4f0",
    color: "#0e9466",
    title: "Unified dashboard",
    desc: "Your entire net worth — accounts, holdings, and cash — in one calm view that updates live.",
  },
  {
    Icon: Clock,
    tint: "#eef1f6",
    color: "#3174b8",
    title: "Retirement planning",
    desc: "Project your savings to retirement age and see, plainly, whether you're on track.",
  },
  {
    Icon: Calculator,
    tint: "#f2eefb",
    color: "#7a5cf0",
    title: "Investment calculator",
    desc: "Model compound growth over time and watch contributions turn into real wealth.",
  },
  {
    Icon: TrendingUp,
    tint: "#e9f5ec",
    color: "#3a9d5b",
    title: "Live markets",
    desc: "Real-time prices across crypto, US stocks, gold, and FX — all in one feed.",
  },
  {
    Icon: Briefcase,
    tint: "#fbf1e3",
    color: "#c28a2a",
    title: "Portfolio tracker",
    desc: "Every holding with live valuation and profit & loss, down to the cent.",
  },
  {
    Icon: Lock,
    tint: "#edeff2",
    color: "#5a6675",
    title: "Bank-level security",
    desc: "256-bit encryption, read-only connections, and SOC 2 Type II controls.",
  },
];

const TICKER = [
  { sym: "BTC", price: "$67,840", chg: "+2.41%", up: true },
  { sym: "ETH", price: "$3,512", chg: "+1.62%", up: true },
  { sym: "NVDA", price: "$1,268.41", chg: "+3.11%", up: true },
  { sym: "AAPL", price: "$213.60", chg: "+0.74%", up: true },
  { sym: "SOL", price: "$148.20", chg: "-2.10%", up: false },
  { sym: "GOLD", price: "$2,342.50", chg: "+0.41%", up: true },
  { sym: "MSFT", price: "$446.90", chg: "-0.52%", up: false },
  { sym: "TSLA", price: "$247.80", chg: "-1.83%", up: false },
  { sym: "EUR/USD", price: "1.0842", chg: "+0.21%", up: true },
  { sym: "S&P 500", price: "5,460.18", chg: "+0.63%", up: true },
];

const STEPS = [
  {
    n: "01",
    title: "Create your account",
    desc: "Sign up in seconds with email or Google — no card required.",
  },
  {
    n: "02",
    title: "See the full picture",
    desc: "Every balance, holding, and projection lands in one calm, organized dashboard.",
  },
  {
    n: "03",
    title: "Plan with confidence",
    desc: "Model retirement and growth, then act on clear, jargon-free next steps.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    popular: false,
    desc: "Everything you need to see your whole financial picture.",
    cta: "Get started",
    features: [
      "Unified net-worth dashboard",
      "Portfolio tracker with live P/L",
      "Real-time market prices",
      "Compound-interest calculator",
    ],
  },
  {
    name: "Plus",
    price: "$8",
    period: "/month",
    popular: true,
    desc: "Full planning tools for people getting serious about their goals.",
    cta: "Start free trial",
    features: [
      "Everything in Free",
      "Retirement planning & on-track score",
      "Unlimited linked accounts",
      "Historical performance & allocation",
      "Priority email support",
    ],
  },
  {
    name: "Pro",
    price: "$18",
    period: "/month",
    popular: false,
    desc: "Advanced modeling and exports for power planners.",
    cta: "Start free trial",
    features: [
      "Everything in Plus",
      "Multiple scenario modeling",
      "Tax-aware projections",
      "CSV & PDF reports",
      "Early access to new tools",
    ],
  },
];

const STATS = [
  { value: "Bank-level", label: "Encryption" },
  { value: "Read-only", label: "Account access" },
  { value: "Real-time", label: "Market prices" },
  { value: "99.99%", label: "Uptime" },
];

const SECURITY = [
  { title: "256-bit encryption", desc: "AES-256 at rest, TLS 1.3 in transit." },
  { title: "SOC 2 Type II", desc: "Independently audited controls." },
  { title: "Read-only access", desc: "We can view, never transact." },
  { title: "Biometric lock", desc: "Face & fingerprint sign-in." },
];

const HERO_AREA =
  "M0 120 L36 110 L72 116 L108 96 L144 103 L180 80 L216 87 L252 63 L288 70 L324 47 L360 53 L396 31 L432 22 L480 12 L480 150 L0 150 Z";
const HERO_LINE =
  "M0 120 L36 110 L72 116 L108 96 L144 103 L180 80 L216 87 L252 63 L288 70 L324 47 L360 53 L396 31 L432 22 L480 12";

function Logo({ size = 30 }: { size?: number }) {
  return <StaxLogo size={size} />;
}

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? profileOf(user) : null;
  const ctaHref = user ? "/dashboard" : "/login?mode=signup";
  const ctaLabel = user ? "Go to dashboard" : "Get started free";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f6f6f2] text-[#1a1d21]">
      <header className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <Logo />
          <span className="text-[18px] font-extrabold tracking-tight">
            Stax
          </span>
        </div>
        <nav className="hidden gap-[30px] text-[14px] font-semibold text-[#646b74] md:flex">
          <a href="#features" className="transition hover:text-[#1a1d21]">
            Features
          </a>
          <a href="#how" className="transition hover:text-[#1a1d21]">
            How it works
          </a>
          <a href="#pricing" className="transition hover:text-[#1a1d21]">
            Pricing
          </a>
          <a href="#security" className="transition hover:text-[#1a1d21]">
            Security
          </a>
        </nav>
        {profile ? (
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-[10px] bg-[#10141a] px-[18px] py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#20272f]"
            >
              Go to dashboard
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5"
              title={profile.name}
            >
              <span className="hidden text-[14px] font-semibold text-[#3a4048] sm:inline">
                {profile.name}
              </span>
              <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-gradient-to-br from-[#2a3340] to-[#3c4a5c] text-[13px] font-bold text-white shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
                {profile.initials}
              </span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-[10px] px-3.5 py-2 text-[14px] font-semibold text-[#3a4048] transition hover:bg-[#efefe9]"
            >
              Sign in
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-[10px] bg-[#10141a] px-[18px] py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#20272f]"
            >
              Get started free
            </Link>
          </div>
        )}
      </header>

      <section className="mx-auto max-w-[1180px] px-6 pb-10 pt-16">
        <div className="grid items-center gap-10 md:grid-cols-[1.02fr_1.1fr] md:gap-[52px]">
          <div>
            <div className="mb-[22px] inline-flex items-center gap-2 rounded-full border border-[#ecece4] bg-white py-1.5 pl-2.5 pr-3.5 text-[12.5px] font-semibold text-[#5c636c]">
              <span className="h-[7px] w-[7px] rounded-full bg-[#13b07a] shadow-[0_0_0_3px_rgba(19,176,122,0.18)]" />
              Live prices, real plans
            </div>
            <h1 className="text-[40px] font-extrabold leading-[1.04] tracking-[-0.035em] sm:text-[52px]">
              Your money,
              <br />
              clearly in view.
            </h1>
            <p className="my-7 max-w-[440px] text-[17.5px] leading-relaxed text-[#5e646d]">
              Plan for retirement, track every holding live, and watch
              compounding do the work — all in one calm, trustworthy place.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={ctaHref}
                className="rounded-[13px] bg-[#10141a] px-[26px] py-[15px] text-[15.5px] font-bold text-white transition hover:bg-[#20272f]"
              >
                {ctaLabel}
              </Link>
              <a
                href="#how"
                className="rounded-[13px] border border-[#deded6] bg-white px-[22px] py-[15px] text-[15.5px] font-bold text-[#1a1d21]"
              >
                See how it works
              </a>
            </div>
            <div className="mt-[26px] flex items-center gap-4 text-[13px] font-medium text-[#787e87]">
              <span className="flex items-center gap-[7px]">
                <Check size={14} className="text-[#13b07a]" strokeWidth={2.4} />
                Free to start
              </span>
              <span className="flex items-center gap-[7px]">
                <Check size={14} className="text-[#13b07a]" strokeWidth={2.4} />
                No card required
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[22px] border border-[#e8e8e0] bg-white p-[22px] shadow-[0_2px_4px_rgba(20,25,30,0.04),0_30px_60px_rgba(20,25,30,0.10)] [transform:rotate(0.4deg)]">
              <div className="mb-1.5 flex items-start justify-between">
                <div>
                  <div className="text-[12.5px] font-semibold text-[#8a8f98]">
                    Total net worth
                  </div>
                  <div className="mer-num mt-1 text-[33px] font-semibold tracking-[-0.03em]">
                    $273,726
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="mer-num text-[13px] font-semibold text-[#0e9466]">
                      +$5,127
                    </span>
                    <span className="mer-num rounded-full bg-[rgba(14,148,102,0.1)] px-[7px] py-0.5 text-[11.5px] font-semibold text-[#0e9466]">
                      +1.91%
                    </span>
                    <span className="text-[11.5px] text-[#9aa0a8]">today</span>
                  </div>
                </div>
                <div className="flex gap-[3px] rounded-[9px] bg-[#f4f4ef] p-[3px]">
                  <span className="px-2 py-1 text-[11px] font-semibold text-[#8a8f98]">
                    1M
                  </span>
                  <span className="rounded-md bg-white px-2 py-1 text-[11px] font-bold text-[#1a1d21] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                    1Y
                  </span>
                  <span className="px-2 py-1 text-[11px] font-semibold text-[#8a8f98]">
                    ALL
                  </span>
                </div>
              </div>
              <svg
                viewBox="0 0 480 150"
                preserveAspectRatio="none"
                className="mt-2 block h-[140px] w-full overflow-visible"
              >
                <defs>
                  <linearGradient id="herog" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#13b07a" stopOpacity="0.16" />
                    <stop offset="1" stopColor="#13b07a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={HERO_AREA} fill="url(#herog)" />
                <path
                  d={HERO_LINE}
                  fill="none"
                  stroke="#13b07a"
                  strokeWidth="2.4"
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[13px] border border-[#efefe8] bg-[#fafaf6] p-3.5">
                  <div className="text-[11.5px] font-semibold text-[#8a8f98]">
                    Total gain
                  </div>
                  <div className="mer-num mt-1 text-[18px] font-semibold text-[#0e9466]">
                    +$88,129
                  </div>
                </div>
                <div className="rounded-[13px] border border-[#efefe8] bg-[#fafaf6] p-3.5">
                  <div className="text-[11.5px] font-semibold text-[#8a8f98]">
                    Retirement
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="mer-num text-[18px] font-semibold">
                      On track
                    </span>
                    <span className="mer-num text-[12px] font-semibold text-[#0e9466]">
                      132%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-[22px] -left-6 flex items-center gap-2.5 rounded-[14px] border border-[#eaeae2] bg-white px-3.5 py-[11px] shadow-[0_12px_30px_rgba(20,25,30,0.12)]">
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-[#e9f5ec] text-[11px] font-bold text-[#3a9d5b]">
                N
              </div>
              <div>
                <div className="text-[12.5px] font-bold">NVDA</div>
                <div className="mer-num text-[11px] text-[#9aa0a8]">
                  $1,268.41
                </div>
              </div>
              <span className="mer-num ml-1 text-[12px] font-bold text-[#0e9466]">
                +78.6%
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-[30px]">
        <div className="mer-ticker-mask overflow-hidden border-y border-[#e9e9e1] bg-white py-[15px]">
          <div className="mer-ticker-track">
            {[...TICKER, ...TICKER].map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 whitespace-nowrap border-r border-[#efefe8] px-[26px]"
              >
                <span className="text-[13.5px] font-bold">{t.sym}</span>
                <span className="mer-num text-[13px] text-[#5c636c]">
                  {t.price}
                </span>
                <span
                  className="mer-num text-[12.5px] font-semibold"
                  style={{ color: t.up ? "#0e9466" : "#cf4842" }}
                >
                  {t.up ? "▲" : "▼"} {t.chg}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-[1180px] px-6 pb-5 pt-[88px]"
      >
        <div className="mx-auto mb-[52px] max-w-[600px] text-center">
          <div className="mb-3.5 text-[12.5px] font-bold uppercase tracking-[0.1em] text-[#0e9466]">
            Everything in one place
          </div>
          <h2 className="text-[38px] font-extrabold leading-[1.1] tracking-[-0.03em]">
            Five tools. One calm dashboard.
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-[#5e646d]">
            From your first deposit to your retirement date, Stax keeps the
            whole picture in focus — no spreadsheets, no guesswork.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="mer-card-lift rounded-[18px] border border-[#ecece4] bg-white p-[26px] shadow-[0_1px_2px_rgba(20,25,30,0.03)]"
            >
              <div
                className="mb-[18px] flex h-[46px] w-[46px] items-center justify-center rounded-[13px]"
                style={{ background: f.tint, color: f.color }}
              >
                <f.Icon size={22} strokeWidth={1.6} />
              </div>
              <h3 className="mb-2 text-[17.5px] font-bold tracking-[-0.01em]">
                {f.title}
              </h3>
              <p className="text-[14.5px] leading-relaxed text-[#646b74]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-[88px] bg-[#10141a] text-white">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-6 py-20 md:grid-cols-[1fr_1.06fr] md:gap-[56px]">
          <div>
            <div className="mb-3.5 text-[12.5px] font-bold uppercase tracking-[0.1em] text-[#3fd49a]">
              Retirement planning
            </div>
            <h2 className="max-w-[420px] text-[36px] font-extrabold leading-[1.12] tracking-[-0.03em]">
              Know exactly when you can retire.
            </h2>
            <p className="my-[18px] max-w-[430px] text-[16.5px] leading-relaxed text-[#a7aeb8]">
              Set a target, and Stax projects your savings to retirement age
              with a single, honest answer: are you on track?
            </p>
            <div className="flex flex-col gap-3.5">
              {[
                "Model contributions and expected returns",
                "See your projected nest egg vs. your goal",
                "Get a clear, jargon-free on-track score",
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-3 text-[15px] text-[#d7dce2]"
                >
                  <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[rgba(19,176,122,0.16)]">
                    <Check
                      size={12}
                      className="text-[#3fd49a]"
                      strokeWidth={2.5}
                    />
                  </span>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[20px] bg-white p-6 text-[#1a1d21] shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
            <div className="mb-[18px] flex items-center justify-between rounded-[14px] border border-[#d2eadd] bg-[#eef8f2] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-[#13b07a] text-[18px] font-bold text-white">
                  ✓
                </div>
                <div>
                  <div className="text-[15px] font-extrabold text-[#0c7a53]">
                    You&apos;re on track
                  </div>
                  <div className="text-[12.5px] font-medium text-[#5c636c]">
                    Projected to exceed your goal at 65
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold text-[#8a8f98]">
                  Funded
                </div>
                <div className="mer-num text-[24px] font-semibold text-[#0c7a53]">
                  132%
                </div>
              </div>
            </div>
            <svg
              viewBox="0 0 420 180"
              preserveAspectRatio="none"
              className="block h-[170px] w-full overflow-visible"
            >
              <defs>
                <linearGradient id="spotg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#13b07a" stopOpacity="0.18" />
                  <stop offset="1" stopColor="#13b07a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 162 L60 150 L120 134 L180 116 L240 92 L300 68 L360 40 L420 16 L420 180 L0 180 Z"
                fill="url(#spotg)"
              />
              <path
                d="M0 162 L60 150 L120 134 L180 116 L240 92 L300 68 L360 40 L420 16"
                fill="none"
                stroke="#13b07a"
                strokeWidth="2.4"
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <line
                x1="0"
                y1="34"
                x2="420"
                y2="34"
                stroke="#c99a1e"
                strokeWidth="1.4"
                strokeDasharray="6 5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="mer-num mt-2 flex justify-between text-[11.5px] text-[#9aa0a8]">
              <span>Age 32</span>
              <span>Age 65</span>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-[1180px] px-6 pb-5 pt-[88px]">
        <div className="mx-auto mb-[52px] max-w-[600px] text-center">
          <div className="mb-3.5 text-[12.5px] font-bold uppercase tracking-[0.1em] text-[#0e9466]">
            How it works
          </div>
          <h2 className="text-[38px] font-extrabold leading-[1.1] tracking-[-0.03em]">
            Set up once. Clarity from day one.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-[18px] border border-[#ecece4] bg-white p-[26px] py-[30px] shadow-[0_1px_2px_rgba(20,25,30,0.03)]"
            >
              <div className="mer-num mb-4 text-[14px] font-semibold text-[#13b07a]">
                {s.n}
              </div>
              <h3 className="mb-2.5 text-[19px] font-bold tracking-[-0.01em]">
                {s.title}
              </h3>
              <p className="text-[14.5px] leading-relaxed text-[#646b74]">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="pricing"
        className="mx-auto max-w-[1180px] px-6 pb-5 pt-[88px]"
      >
        <div className="mx-auto mb-[52px] max-w-[600px] text-center">
          <div className="mb-3.5 text-[12.5px] font-bold uppercase tracking-[0.1em] text-[#0e9466]">
            Pricing
          </div>
          <h2 className="text-[38px] font-extrabold leading-[1.1] tracking-[-0.03em]">
            Start free. Upgrade when you&apos;re ready.
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-[#5e646d]">
            Simple, honest pricing. No hidden fees, cancel anytime.
          </p>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-[18px] sm:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className="relative flex flex-col rounded-[18px] bg-white p-[28px] py-[30px] shadow-[0_1px_2px_rgba(20,25,30,0.03)]"
              style={{
                border: p.popular ? "1.5px solid #13b07a" : "1px solid #ecece4",
                boxShadow: p.popular
                  ? "0 2px 4px rgba(20,25,30,0.04), 0 22px 48px rgba(19,176,122,0.14)"
                  : undefined,
              }}
            >
              {p.popular && (
                <div className="absolute right-[18px] top-[18px] rounded-full bg-[#e6f4ee] px-[11px] py-[5px] text-[11px] font-bold uppercase tracking-[0.04em] text-[#0c7a53]">
                  Most popular
                </div>
              )}
              <div
                className="text-[15px] font-bold tracking-[-0.01em]"
                style={{ color: p.popular ? "#0c7a53" : "#1a1d21" }}
              >
                {p.name}
              </div>
              <div className="mt-3.5 flex items-baseline gap-1.5">
                <span className="mer-num text-[40px] font-semibold tracking-[-0.03em]">
                  {p.price}
                </span>
                <span className="text-[14px] font-semibold text-[#9aa0a8]">
                  {p.period}
                </span>
              </div>
              <p className="mb-[22px] mt-3 text-[14px] leading-snug text-[#646b74]">
                {p.desc}
              </p>
              <Link
                href={ctaHref}
                className="rounded-xl py-[13px] text-center text-[14.5px] font-bold transition"
                style={
                  p.popular
                    ? {
                        background: "#13b07a",
                        color: "#fff",
                        boxShadow: "0 6px 18px rgba(19,176,122,0.32)",
                      }
                    : {
                        border: "1px solid #deded6",
                        background: "#fff",
                        color: "#1a1d21",
                      }
                }
              >
                {profile ? "Go to dashboard" : p.cta}
              </Link>
              <div className="my-6 h-px bg-[#efefe8]" />
              <div className="flex flex-col gap-3.5">
                {p.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-start gap-2.5 text-[13.5px] font-medium leading-snug text-[#3a4048]"
                  >
                    <Check
                      size={15}
                      className="mt-px shrink-0 text-[#13b07a]"
                      strokeWidth={2}
                    />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="security"
        className="mx-auto max-w-[1180px] px-6 pb-5 pt-[88px]"
      >
        <div className="rounded-[22px] border border-[#ecece4] bg-white p-8 shadow-[0_1px_2px_rgba(20,25,30,0.03)] md:p-[44px]">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="mb-[18px] inline-flex items-center gap-2.5 rounded-full bg-[#eaf4f0] px-3.5 py-[7px]">
                <ShieldCheck
                  size={15}
                  className="text-[#0e9466]"
                  strokeWidth={1.7}
                />
                <span className="text-[12.5px] font-bold text-[#0c7a53]">
                  Security first
                </span>
              </div>
              <h2 className="text-[30px] font-extrabold leading-[1.15] tracking-[-0.025em]">
                Your data is protected like a bank vault.
              </h2>
              <p className="mt-3.5 text-[15.5px] leading-relaxed text-[#5e646d]">
                Connections are read-only and encrypted end to end. We can never
                move your money — only help you understand it.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              {SECURITY.map((s) => (
                <div
                  key={s.title}
                  className="rounded-[14px] border border-[#efefe8] bg-[#fafaf6] p-[18px]"
                >
                  <div className="mb-1 text-[13.5px] font-bold">{s.title}</div>
                  <div className="text-[12.5px] leading-snug text-[#787e87]">
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[#efefe8] pt-9 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="mer-num text-[30px] font-semibold tracking-[-0.02em]">
                  {s.value}
                </div>
                <div className="mt-1 text-[13px] font-medium text-[#787e87]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-[88px]">
        <div className="rounded-[24px] bg-[#10141a] px-10 py-16 text-center">
          <h2 className="text-[40px] font-extrabold leading-[1.1] tracking-[-0.03em] text-white">
            {profile ? "Pick up where you left off." : "Start planning today."}
          </h2>
          <p className="mx-auto mb-8 mt-4 max-w-[440px] text-[17px] leading-relaxed text-[#a7aeb8]">
            {profile
              ? "Your dashboard is ready with live prices and your latest portfolio."
              : "Build a calmer, clearer financial future with Stax. Free to start, no card required."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={ctaHref}
              className="rounded-[13px] bg-[#13b07a] px-7 py-[15px] text-[15.5px] font-bold text-white shadow-[0_6px_20px_rgba(19,176,122,0.35)]"
            >
              {ctaLabel}
            </Link>
            {!profile && (
              <Link
                href="/login"
                className="rounded-[13px] border border-white/15 bg-white/[0.08] px-6 py-[15px] text-[15.5px] font-bold text-white"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e9e9e1]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-8 px-6 pb-10 pt-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3.5 flex items-center gap-2.5">
              <Logo size={28} />
              <span className="text-[17px] font-extrabold tracking-tight">
                Stax
              </span>
            </div>
            <p className="max-w-[260px] text-[13.5px] leading-relaxed text-[#878d96]">
              Personal financial planning that keeps your whole picture in calm,
              clear view.
            </p>
          </div>
          {[
            {
              h: "Product",
              links: ["Features", "How it works", "Security", "Pricing"],
            },
            { h: "Company", links: ["About", "Careers", "Blog", "Security"] },
            { h: "Legal", links: ["Privacy", "Terms", "Disclosures"] },
          ].map((col) => (
            <div key={col.h}>
              <div className="mb-3.5 text-[12px] font-bold uppercase tracking-[0.05em] text-[#9aa0a8]">
                {col.h}
              </div>
              <div className="flex flex-col gap-2.5 text-[13.5px] font-medium text-[#5c636c]">
                {col.links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="transition hover:text-[#1a1d21]"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[#efefe8]">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-6 py-5">
            <span className="text-[12.5px] text-[#9aa0a8]">
              © 2026 Stax Finance, Inc. All rights reserved.
            </span>
            <span className="max-w-[560px] text-[12px] leading-snug text-[#a8aeb6]">
              Stax is not a broker-dealer or investment adviser. For
              informational purposes only; not financial advice.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

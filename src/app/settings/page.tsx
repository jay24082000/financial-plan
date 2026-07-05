"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageHeader";
import { useUser } from "@/hooks/useUser";
import { useProfile } from "@/hooks/useProfile";
import { useMounted } from "@/hooks/useMounted";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_PROFILE } from "@/lib/profile";
import { useCurrency } from "@/components/CurrencyProvider";
import type { CurrencyCode } from "@/lib/format";

const CURRENCIES = [
  { key: "USD", label: "USD $" },
  { key: "THB", label: "THB ฿" },
];
const THEMES = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "system", label: "System" },
];
const NOTIF_DEFS = [
  {
    key: "priceAlerts",
    title: "Price alerts",
    desc: "Get notified when your holdings move sharply.",
  },
  {
    key: "weeklySummary",
    title: "Weekly summary",
    desc: "A Monday digest of your portfolio and plan.",
  },
  {
    key: "milestones",
    title: "Goal milestones",
    desc: "Celebrate when you hit a savings milestone.",
  },
];

export default function SettingsPage() {
  const mounted = useMounted();
  const supabase = createClient();
  const user = useUser();
  const { profile, save } = useProfile();
  const { currency, setCurrency: setCurrencyCtx } = useCurrency();

  const [editingEmail, setEditingEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const [theme, setTheme] = useState("light");
  const [notif, setNotif] = useState<Record<string, boolean>>({
    priceAlerts: true,
    weeklySummary: true,
    milestones: false,
  });

  useEffect(() => {
    const t = localStorage.getItem("stax-theme");
    if (t) setTheme(t);
    const n = localStorage.getItem("stax-notif");
    if (n) {
      try {
        setNotif(JSON.parse(n));
      } catch {
        // ignore
      }
    }
  }, []);

  const setCurrency = (c: string) => {
    setCurrencyCtx(c as CurrencyCode);
    save({ ...(profile ?? DEFAULT_PROFILE), currency: c, onboarded: true });
  };

  const setThemePref = (t: string) => {
    setTheme(t);
    localStorage.setItem("stax-theme", t);
  };

  const toggleNotif = (k: string) => {
    setNotif((prev) => {
      const next = { ...prev, [k]: !prev[k] };
      localStorage.setItem("stax-notif", JSON.stringify(next));
      return next;
    });
  };

  const saveEmail = async () => {
    const { error } = await supabase.auth.updateUser({
      email: emailDraft.trim(),
    });
    setNotice(
      error ? error.message : "Check your new email to confirm the change.",
    );
    setEditingEmail(false);
  };

  const savePw = async () => {
    if (newPw.length < 8) {
      setNotice("Password must be at least 8 characters.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setNotice(error ? error.message : "Password updated.");
    setChangingPw(false);
    setNewPw("");
  };

  const deleteAccount = async () => {
    if (
      !window.confirm(
        "This permanently deletes your portfolio, history, and profile. Continue?",
      )
    )
      return;
    const { data } = await supabase.auth.getUser();
    const uid = data.user?.id;
    if (uid) {
      await supabase.from("holdings").delete().eq("user_id", uid);
      await supabase.from("portfolio_snapshots").delete().eq("user_id", uid);
      await supabase.from("profiles").delete().eq("user_id", uid);
    }
    await supabase.auth.signOut();
    window.location.assign("/");
  };

  if (!mounted) return <div className="min-h-[60vh]" />;

  return (
    <PageShell>
      <div className="mb-6.5">
        <h1 className="text-[28px] font-extrabold tracking-tight">
          Settings
        </h1>
        <div className="mt-1 text-[14px] font-medium text-[#8a8f98]">
          Manage your account, preferences, and notifications.
        </div>
      </div>

      {notice && (
        <div className="mb-4.5 rounded-[14px] border border-[#d2eadd] bg-[#eef8f2] px-4 py-3 text-[13.5px] font-medium text-[#0c7a53]">
          {notice}
        </div>
      )}

      <Card title="Account">
        <Row>
          <div className="min-w-0 flex-1">
            <div className="text-[14.5px] font-bold">Email address</div>
            {editingEmail ? (
              <input
                type="email"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
                className="mt-2 w-full max-w-80 rounded-xl border border-[#e2e2da] bg-[#fafaf6] px-3.25 py-2.5 text-[14px] outline-hidden focus:border-[#13b07a] focus:bg-white"
              />
            ) : (
              <div className="mt-0.5 text-[13.5px] text-[#787e87]">
                {user?.email}
              </div>
            )}
          </div>
          {editingEmail ? (
            <div className="flex shrink-0 gap-2">
              <GhostBtn onClick={() => setEditingEmail(false)}>Cancel</GhostBtn>
              <GreenBtn onClick={saveEmail}>Save</GreenBtn>
            </div>
          ) : (
            <GhostBtn
              onClick={() => {
                setEmailDraft(user?.email ?? "");
                setEditingEmail(true);
              }}
            >
              Change
            </GhostBtn>
          )}
        </Row>
        <Row>
          <div className="min-w-0 flex-1">
            <div className="text-[14.5px] font-bold">Password</div>
            {changingPw ? (
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="New password (min 8 chars)"
                className="mt-2 w-full max-w-80 rounded-xl border border-[#e2e2da] bg-[#fafaf6] px-3.25 py-2.5 text-[14px] outline-hidden focus:border-[#13b07a] focus:bg-white"
              />
            ) : (
              <div className="mer-num mt-1 text-[14px] tracking-[0.12em] text-[#787e87]">
                ••••••••••
              </div>
            )}
          </div>
          {changingPw ? (
            <div className="flex shrink-0 gap-2">
              <GhostBtn onClick={() => setChangingPw(false)}>Cancel</GhostBtn>
              <GreenBtn onClick={savePw}>Update</GreenBtn>
            </div>
          ) : (
            <GhostBtn onClick={() => setChangingPw(true)}>
              Change password
            </GhostBtn>
          )}
        </Row>
      </Card>

      <Card title="Preferences">
        <Row>
          <div>
            <div className="text-[14.5px] font-bold">Currency</div>
            <div className="mt-0.5 text-[13px] text-[#787e87]">
              How balances are displayed.
            </div>
          </div>
          <Segmented
            options={CURRENCIES}
            value={currency}
            onChange={setCurrency}
          />
        </Row>
        <Row>
          <div>
            <div className="text-[14.5px] font-bold">Appearance</div>
            <div className="mt-0.5 text-[13px] text-[#787e87]">
              Choose your theme.
            </div>
          </div>
          <Segmented options={THEMES} value={theme} onChange={setThemePref} />
        </Row>
      </Card>

      <Card title="Notifications">
        {NOTIF_DEFS.map((n) => (
          <Row key={n.key}>
            <div className="flex-1">
              <div className="text-[14.5px] font-bold">{n.title}</div>
              <div className="mt-0.5 text-[13px] text-[#787e87]">{n.desc}</div>
            </div>
            <Toggle on={!!notif[n.key]} onClick={() => toggleNotif(n.key)} />
          </Row>
        ))}
      </Card>

      <div className="rounded-[18px] border border-[#f0dad8] bg-white px-6 shadow-[0_1px_2px_rgba(20,25,30,0.03)]">
        <div className="py-4.5 pt-4.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#c0463f]">
          Danger zone
        </div>
        <div className="flex flex-col items-start justify-between gap-3 border-t border-[#f7e9e7] py-4.5 sm:flex-row sm:items-center">
          <div>
            <div className="text-[14.5px] font-bold">Sign out</div>
            <div className="mt-0.5 text-[13px] text-[#787e87]">
              Sign out of Stax on this device.
            </div>
          </div>
          <form action="/auth/signout" method="post" className="shrink-0">
            <button
              type="submit"
              className="rounded-[11px] bg-[#10141a] px-4.5 py-2.5 text-[13.5px] font-semibold text-white"
            >
              Sign out
            </button>
          </form>
        </div>
        <div className="flex flex-col items-start justify-between gap-3 border-t border-[#f7e9e7] py-4.5 sm:flex-row sm:items-center">
          <div>
            <div className="text-[14.5px] font-bold text-[#b23a33]">
              Delete account
            </div>
            <div className="mt-0.5 text-[13px] text-[#a98682]">
              Permanently erase your account data. This can&apos;t be undone.
            </div>
          </div>
          <button
            onClick={deleteAccount}
            className="shrink-0 rounded-[11px] border border-[#e8c9c5] bg-white px-4.5 py-2.5 text-[13.5px] font-semibold text-[#c0463f] transition hover:bg-[#fbf1f0]"
          >
            Delete account
          </button>
        </div>
      </div>
    </PageShell>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4.5 rounded-[18px] border border-[#ecece4] bg-white px-6 shadow-[0_1px_2px_rgba(20,25,30,0.03)]">
      <div className="py-4.5 pt-4.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#0e9466]">
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 border-t border-[#f2f2ec] py-4.5 sm:flex-row sm:items-center">
      {children}
    </div>
  );
}

function GhostBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-[10px] border border-[#e4e4dc] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#3a4048] transition hover:bg-[#faf9f5]"
    >
      {children}
    </button>
  );
}

function GreenBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-[10px] bg-[#13b07a] px-4 py-2.5 text-[13px] font-bold text-white"
    >
      {children}
    </button>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { key: string; label: string }[];
  value: string;
  onChange: (k: string) => void;
}) {
  return (
    <div className="flex shrink-0 gap-1.25 rounded-[11px] bg-[#f1f1eb] p-1">
      {options.map((o) => {
        const sel = value === o.key;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className="rounded-lg px-3.75 py-1.75 text-[13px] font-semibold transition"
            style={
              sel
                ? {
                    background: "#fff",
                    color: "#1a1d21",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
                  }
                : { background: "transparent", color: "#8a8f98" }
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative h-6.75 w-11.5 shrink-0 rounded-full transition-colors"
      style={{ background: on ? "#13b07a" : "#d7d7cf" }}
      aria-pressed={on}
    >
      <span
        className="absolute left-0.75 top-0.75 h-5.25 w-5.25 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform"
        style={{ transform: on ? "translateX(19px)" : "translateX(0)" }}
      />
    </button>
  );
}

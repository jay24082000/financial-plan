"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { StaxLogo } from "@/components/StaxLogo";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setReady(true);
    });
  }, [supabase]);

  const valid = password.length >= 8 && password === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setSubmitting(false);
    } else {
      setDone(true);
      setTimeout(() => window.location.assign("/dashboard"), 1200);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f6f6f2] px-6 py-10">
      <div className="w-full max-w-103">
        <div className="mb-6.5 flex items-center justify-center gap-2.5">
          <StaxLogo size={32} shadow={false} />
          <span className="text-[19px] font-extrabold tracking-tight">
            Stax
          </span>
        </div>

        <div className="rounded-[20px] border border-[#ecece4] bg-white p-8 shadow-[0_1px_2px_rgba(20,25,30,0.04),0_10px_30px_rgba(20,25,30,0.05)]">
          {!ready ? (
            <p className="text-center text-[14px] text-[#787e87]">Loading…</p>
          ) : done ? (
            <div className="text-center">
              <h1 className="text-[22px] font-extrabold tracking-tight">
                Password updated
              </h1>
              <p className="mt-2 text-[14px] text-[#787e87]">
                Taking you to your dashboard…
              </p>
            </div>
          ) : !hasSession ? (
            <div className="text-center">
              <h1 className="text-[22px] font-extrabold tracking-tight">
                Link expired
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-[#787e87]">
                This reset link is invalid or has expired. Request a new one
                from the sign-in page.
              </p>
              <a
                href="/login"
                className="mt-5 inline-block text-[14px] font-bold text-[#0e9466]"
              >
                ← Back to sign in
              </a>
            </div>
          ) : (
            <>
              <h1 className="text-center text-[24px] font-extrabold tracking-tight">
                Set a new password
              </h1>
              <p className="mb-6 mt-2 text-center text-[14px] leading-relaxed text-[#787e87]">
                Choose a strong password you don&apos;t use elsewhere.
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3.75"
              >
                <div>
                  <label className="mb-1.75 block text-[12.5px] font-semibold text-[#5c636c]">
                    New password
                  </label>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="auth-input"
                  />
                </div>
                <div>
                  <label className="mb-1.75 block text-[12.5px] font-semibold text-[#5c636c]">
                    Confirm password
                  </label>
                  <input
                    type={showPw ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    className="auth-input"
                  />
                </div>
                <label className="flex items-center gap-2 text-[13px] text-[#5c636c]">
                  <input
                    type="checkbox"
                    checked={showPw}
                    onChange={(e) => setShowPw(e.target.checked)}
                  />
                  Show password
                </label>

                {error && (
                  <p className="text-[13px] font-medium text-[#cf4842]">
                    {error}
                  </p>
                )}
                {confirm.length > 0 && password !== confirm && (
                  <p className="text-[13px] font-medium text-[#cf4842]">
                    Passwords don&apos;t match.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!valid || submitting}
                  className="mt-1 flex h-12.5 w-full items-center justify-center rounded-xl bg-[#10141a] text-[15px] font-bold text-white transition hover:bg-[#20272f] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {submitting ? (
                    <span className="h-4.5 w-4.5 animate-spin rounded-full border-[2.5px] border-white/35 border-t-white" />
                  ) : (
                    "Update password"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

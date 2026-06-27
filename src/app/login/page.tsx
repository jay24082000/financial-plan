"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "sent";

function redirectTarget() {
  if (typeof window === "undefined") return "/";
  return new URLSearchParams(window.location.search).get("redirect") ?? "/";
}

function passwordStrength(pw: string) {
  let n = 0;
  if (pw.length >= 8) n++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) n++;
  if (/[0-9]/.test(pw)) n++;
  if (/[^A-Za-z0-9]/.test(pw)) n++;
  const map = [
    { pct: 25, label: "Weak", color: "#cf4842" },
    { pct: 50, label: "Fair", color: "#d29b26" },
    { pct: 75, label: "Good", color: "#3a9d5b" },
    { pct: 100, label: "Strong", color: "#0e9466" },
  ];
  return map[Math.min(n, 4) - 1] || map[0];
}

export default function LoginPage() {
  const supabase = createClient();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const submitDisabled =
    submitting ||
    !emailValid ||
    (isSignup ? !name.trim() || password.length < 8 : password.length < 1);

  const st = passwordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitDisabled) return;
    setSubmitting(true);
    setError(null);

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() } },
      });
      if (error) setError(error.message);
      else if (data.session) window.location.assign(redirectTarget());
      else setMode("sent");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) setError(error.message);
      else window.location.assign(redirectTarget());
    }
    setSubmitting(false);
  };

  const handleGoogle = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTarget())}`,
      },
    });
    if (error) setError(error.message);
  };

  const handleForgot = async () => {
    if (!emailValid) {
      setError("Enter your email first, then tap Forgot password.");
      return;
    }
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) setError(error.message);
    else setMode("sent");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f6f6f2] px-6 py-10">
      <div className="w-full max-w-[412px]">
        <div className="mb-[26px] flex items-center justify-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#13b07a]">
            <div className="h-[13px] w-[13px] -rotate-45 rounded-full border-[2.5px] border-white border-r-transparent" />
          </div>
          <span className="text-[19px] font-extrabold tracking-tight">
            Meridian
          </span>
        </div>

        {mode === "sent" ? (
          <CheckEmail email={email} onBack={() => setMode("signin")} />
        ) : (
          <>
            <div className="rounded-[20px] border border-[#ecece4] bg-white p-8 shadow-[0_1px_2px_rgba(20,25,30,0.04),0_10px_30px_rgba(20,25,30,0.05)]">
              <h1 className="text-center text-[24px] font-extrabold tracking-tight">
                {isSignup ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mb-[26px] mt-2 text-center text-[14px] leading-relaxed text-[#787e87]">
                {isSignup
                  ? "Start planning your financial future in minutes."
                  : "Sign in to pick up where you left off."}
              </p>

              <button
                onClick={handleGoogle}
                className="mer-gbtn flex w-full items-center justify-center gap-3 rounded-xl border border-[#e3e3db] bg-white py-[13px] text-[14.5px] font-semibold text-[#2a3038] transition hover:bg-[#fafaf7]"
              >
                <GoogleIcon /> Continue with Google
              </button>

              <div className="my-5 flex items-center gap-3.5">
                <div className="h-px flex-1 bg-[#e9e9e1]" />
                <span className="text-[12px] font-medium text-[#9aa0a8]">
                  or
                </span>
                <div className="h-px flex-1 bg-[#e9e9e1]" />
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-[15px]"
              >
                {isSignup && (
                  <Field label="Full name">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Carter"
                      className="auth-input"
                    />
                  </Field>
                )}

                <Field label="Email">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="auth-input"
                  />
                </Field>

                <div>
                  <div className="mb-[7px] flex items-baseline justify-between">
                    <label className="text-[12.5px] font-semibold text-[#5c636c]">
                      Password
                    </label>
                    {!isSignup && (
                      <button
                        type="button"
                        onClick={handleForgot}
                        className="text-[12.5px] font-semibold text-[#787e87] transition hover:text-[#0c7a53]"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        isSignup
                          ? "At least 8 characters"
                          : "Enter your password"
                      }
                      className="auth-input !pr-[46px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center p-2 text-[#9aa0a8] transition hover:text-[#3a4048]"
                    >
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                  {isSignup && password.length > 0 && (
                    <div className="mt-2.5 flex items-center gap-2.5">
                      <div className="h-[5px] flex-1 overflow-hidden rounded-[5px] bg-[#e7e7e0]">
                        <div
                          className="h-full rounded-[5px] transition-all"
                          style={{ width: `${st.pct}%`, background: st.color }}
                        />
                      </div>
                      <span
                        className="w-[46px] text-right text-[11.5px] font-semibold"
                        style={{ color: st.color }}
                      >
                        {st.label}
                      </span>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-[13px] font-medium text-[#cf4842]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitDisabled}
                  className="mt-1 flex h-[50px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#10141a] text-[15px] font-bold text-white transition hover:bg-[#20272f] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {submitting ? (
                    <span className="h-[18px] w-[18px] animate-spin rounded-full border-[2.5px] border-white/35 border-t-white" />
                  ) : (
                    <span>{isSignup ? "Create account" : "Sign in"}</span>
                  )}
                </button>

                {isSignup && (
                  <p className="mt-0.5 text-center text-[11.5px] leading-relaxed text-[#9aa0a8]">
                    By creating an account you agree to our{" "}
                    <span className="font-semibold text-[#787e87]">Terms</span>{" "}
                    and{" "}
                    <span className="font-semibold text-[#787e87]">
                      Privacy Policy
                    </span>
                    .
                  </p>
                )}
              </form>
            </div>

            <div className="mt-[22px] text-center text-[14px] text-[#787e87]">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setMode(isSignup ? "signin" : "signup");
                  setError(null);
                }}
                className="font-bold text-[#0e9466] transition hover:text-[#0c7a53]"
              >
                {isSignup ? "Sign in" : "Create one"}
              </button>
            </div>
          </>
        )}
      </div>
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
      <label className="mb-[7px] block text-[12.5px] font-semibold text-[#5c636c]">
        {label}
      </label>
      {children}
    </div>
  );
}

function CheckEmail({ email, onBack }: { email: string; onBack: () => void }) {
  return (
    <div className="rounded-[20px] border border-[#ecece4] bg-white p-9 text-center shadow-[0_1px_2px_rgba(20,25,30,0.04),0_10px_30px_rgba(20,25,30,0.05)]">
      <div className="mx-auto mb-[22px] flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-[#e6f4ee]">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#13b07a"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
          <path d="M3.5 6.5L12 13l8.5-6.5" />
        </svg>
      </div>
      <h1 className="text-[23px] font-extrabold tracking-tight">
        Check your email
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-[#787e87]">
        We sent a confirmation link to
        <br />
        <span className="font-bold text-[#1a1d21]">
          {email.trim() || "your inbox"}
        </span>
      </p>
      <p className="mb-7 mt-2.5 text-[13px] leading-relaxed text-[#9aa0a8]">
        Click the link in that email to activate your account. It may take a
        minute to arrive.
      </p>
      <button
        onClick={onBack}
        className="text-[14px] font-bold text-[#0e9466] transition hover:text-[#0c7a53]"
      >
        ← Back to sign in
      </button>
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A9.7 9.7 0 0112 6c6.4 0 10 7 10 7a17 17 0 01-3.3 4.1M6.3 7.8A17 17 0 002 13s3.6 7 10 7a9.4 9.4 0 004.3-1" />
      <path d="M9.9 10a3 3 0 004.2 4.2" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.2 13.2 17.6 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.2 5.4-4.7 7l7.6 5.9c4.4-4.1 7-10.1 7-17.4z"
      />
      <path
        fill="#FBBC05"
        d="M10.4 28.3c-.5-1.4-.7-2.9-.7-4.3s.3-2.9.7-4.3l-7.8-6.1C.9 16.7 0 20.2 0 24s.9 7.3 2.6 10.4l7.8-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.1 0 11.3-2 15-5.5l-7.6-5.9c-2.1 1.4-4.8 2.3-7.4 2.3-6.4 0-11.8-3.7-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

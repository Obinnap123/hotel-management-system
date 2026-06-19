"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { loginAction } from "./actions";

export function LoginForm() {
  return (
    <form action={loginAction} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-slate-800">Email</span>
        <input
          className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-800">Password</span>
        <input
          className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      <SignInButton />
    </form>
  );
}

function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-hover)] disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

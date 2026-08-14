import { redirect } from "next/navigation";
import { getCurrentActiveSession } from "@/server/auth/session";
import { LoginForm } from "./LoginForm";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

const errorMessages = {
  invalid: "We could not sign you in. Please check your email and password.",
  missing: "Email and password are required.",
  locked: "Too many unsuccessful attempts. Please wait 15 minutes and try again.",
} as const;

const successMessages = {
  "password-changed": "Your password was changed. Sign in again to continue.",
} as const;

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getCurrentActiveSession();

  if (session) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const error = params?.error;
  const message =
    error && error in errorMessages
      ? errorMessages[error as keyof typeof errorMessages]
      : null;
  const success = params?.success;
  const successMessage =
    success && success in successMessages
      ? successMessages[success as keyof typeof successMessages]
      : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-4 py-10">
      <section className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-md)]">
        <div className="mb-6">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)] text-sm font-semibold text-white">
            HMS
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-950">
            Staff login
          </h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Hotel staff access only.
          </p>
        </div>

        {message ? (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {message}
          </p>
        ) : null}

        {successMessage ? (
          <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
            {successMessage}
          </p>
        ) : null}

        <LoginForm />
      </section>
    </main>
  );
}

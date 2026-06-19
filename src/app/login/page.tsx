import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/auth/session";
import { LoginForm } from "./LoginForm";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

const errorMessages = {
  invalid: "We could not sign you in. Please check your email and password.",
  missing: "Email and password are required.",
} as const;

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getCurrentSession();

  if (session) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const error = params?.error;
  const message =
    error && error in errorMessages
      ? errorMessages[error as keyof typeof errorMessages]
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
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {message}
          </p>
        ) : null}

        <LoginForm />
      </section>
    </main>
  );
}

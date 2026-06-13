import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/auth/session";
import { loginAction } from "./actions";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

const errorMessages = {
  invalid: "Invalid staff credentials.",
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
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10">
      <section className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-zinc-950">Staff login</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Hotel staff access only.
          </p>
        </div>

        {message ? (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {message}
          </p>
        ) : null}

        <form action={loginAction} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-zinc-800">Email</span>
            <input
              className="mt-1 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none focus:border-zinc-900"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-800">Password</span>
            <input
              className="mt-1 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none focus:border-zinc-900"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <button
            className="h-11 w-full rounded-md bg-zinc-950 text-sm font-medium text-white transition hover:bg-zinc-800"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}

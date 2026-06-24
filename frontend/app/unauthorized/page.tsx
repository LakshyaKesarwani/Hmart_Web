import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50/30 px-6 py-12 text-zinc-950">
      <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-green-700">
          HMART
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Access denied
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Your account does not have permission to access this HMART area.
        </p>
        <Link
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-700"
          href="/"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}

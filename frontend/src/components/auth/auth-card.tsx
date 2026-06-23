import Link from "next/link";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: {
    label: string;
    href: string;
    text: string;
  };
};

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-950">
      <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            HMART
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{subtitle}</p>
        </div>

        {children}

        {footer ? (
          <p className="mt-6 text-center text-sm text-zinc-600">
            {footer.text}{" "}
            <Link className="font-medium text-zinc-950 underline" href={footer.href}>
              {footer.label}
            </Link>
          </p>
        ) : null}
      </section>
    </main>
  );
}

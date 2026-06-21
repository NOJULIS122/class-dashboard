"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import { useAuth } from "@/app/lib/auth-store";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, ready } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role === "teacher" && pathname !== "/dashboard/attendance") {
      router.replace("/dashboard/attendance");
    }
  }, [pathname, ready, router, session]);

  if (!ready || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading…
      </div>
    );
  }

  if (session.role === "teacher" && pathname !== "/dashboard/attendance") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar session={session} />
      <main className="p-4 sm:p-6 lg:ml-64 lg:p-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

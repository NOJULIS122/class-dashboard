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
      <div className="flex min-h-screen items-center justify-center bg-[#eef9ff] text-[#19407a]">
        Kraunama…
      </div>
    );
  }

  if (session.role === "teacher" && pathname !== "/dashboard/attendance") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#e2f6ff,_transparent_34%),#f7fbff]">
      <Sidebar session={session} />
      <main className="p-4 sm:p-6 lg:ml-64 lg:p-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

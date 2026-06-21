"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Session, useAuth } from "@/app/lib/auth-store";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: "⌂" },
  { href: "/dashboard/students", label: "Students", icon: "◎" },
  { href: "/dashboard/groups", label: "Groups", icon: "◇" },
  { href: "/dashboard/attendance", label: "Attendance", icon: "✓" },
  { href: "/dashboard/payments", label: "Payments", icon: "$" },
  { href: "/dashboard/contracts", label: "Contracts", icon: "▤" },
  { href: "/dashboard/teachers", label: "Teachers", icon: "☆" },
];

export default function Sidebar({ session }: { session: Session }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const visibleNavigation =
    session.role === "teacher"
      ? navigation.filter((item) => item.href === "/dashboard/attendance")
      : navigation;

  function logOut() {
    signOut();
    router.replace("/login");
  }

  return (
    <aside className="border-b border-slate-800 bg-slate-950 text-slate-300 lg:fixed lg:inset-y-0 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-20 items-center justify-between px-6 lg:justify-start">
        <Link href="/" className="text-xl font-bold text-white">
          Class<span className="text-indigo-400">Flow</span>
        </Link>
        <button
          type="button"
          onClick={logOut}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-white lg:hidden"
        >
          Sign out
        </button>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
        {visibleNavigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-slate-900 hover:text-white"
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center text-base">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-4 right-4 hidden rounded-xl border border-slate-800 bg-slate-900 p-4 lg:block">
        <p className="text-sm font-semibold text-white">{session.name}</p>
        <p className="mt-1 truncate text-xs text-slate-400">{session.email}</p>
        <p className="mt-1 text-xs capitalize text-indigo-300">
          {session.role}
        </p>
        <button
          type="button"
          onClick={logOut}
          className="mt-4 w-full rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

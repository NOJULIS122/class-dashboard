"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Session, useAuth } from "@/app/lib/auth-store";

const navigation = [
  { href: "/dashboard", label: "Apžvalga", icon: "⌂" },
  { href: "/dashboard/students", label: "Mokiniai", icon: "◎" },
  { href: "/dashboard/groups", label: "Grupės", icon: "◇" },
  { href: "/dashboard/attendance", label: "Lankomumas", icon: "✓" },
  { href: "/dashboard/payments", label: "Mokėjimai", icon: "€" },
  { href: "/dashboard/contracts", label: "Sutartys", icon: "▤" },
  { href: "/dashboard/teachers", label: "Mokytojai", icon: "☆" },
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
    <aside className="border-b border-[#d9eefb] bg-white text-[#52789c] shadow-[0_12px_35px_rgba(25,64,122,0.08)] lg:fixed lg:inset-y-0 lg:z-20 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex h-20 items-center justify-between px-4 lg:h-28 lg:justify-center lg:px-6">
        <Link href="/" aria-label="Baltas Triušis">
          <Image
            src="/baltas-triusis-logo.jpg"
            alt="Baltas Triušis"
            width={190}
            height={52}
            className="h-auto w-40 lg:w-48"
            priority
          />
        </Link>
        <button
          type="button"
          onClick={logOut}
          className="rounded-xl border border-[#cfe6f5] px-3 py-2 text-xs font-bold text-[#19407a] lg:hidden"
        >
          Atsijungti
        </button>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:min-h-0 lg:flex-1 lg:space-y-2 lg:overflow-x-hidden lg:overflow-y-auto lg:pb-4">
        {visibleNavigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                isActive
                  ? "bg-[#0099ff] text-white shadow-[0_8px_20px_rgba(0,153,255,0.22)]"
                  : "hover:bg-[#eef9ff] hover:text-[#0099ff]"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-base ${
                  isActive ? "bg-white/20" : "bg-[#eef9ff]"
                }`}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 mb-6 mt-2 hidden shrink-0 rounded-2xl border border-[#d9eefb] bg-[#f7fcff] p-4 lg:block">
        <div className="mb-3 h-1.5 w-10 rounded-full bg-[#fbbc34]" />
        <p className="font-bold text-[#19407a]">{session.name}</p>
        <p className="mt-1 truncate text-xs text-[#849aaa]">{session.email}</p>
        <p className="mt-1 text-xs font-bold text-[#0099ff]">
          {session.role === "admin" ? "Administratorius" : "Mokytojas"}
        </p>
        <button
          type="button"
          onClick={logOut}
          className="brand-button-secondary mt-4 w-full text-sm"
        >
          Atsijungti
        </button>
      </div>
    </aside>
  );
}

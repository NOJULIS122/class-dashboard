"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/auth-store";
import { useDashboardData } from "@/app/lib/data-store";

export default function LoginPage() {
  const router = useRouter();
  const { teachers } = useDashboardData();
  const { session, ready, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && session) {
      router.replace(
        session.role === "admin" ? "/dashboard" : "/dashboard/attendance",
      );
    }
  }, [ready, router, session]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      (email === "admin@baltastriusis.lt" ||
        email === "admin@classflow.test") &&
      password === "admin123"
    ) {
      signIn({
        role: "admin",
        name: "Administratorius",
        email: "admin@baltastriusis.lt",
      });
      router.replace("/dashboard");
      return;
    }

    const teacher = teachers.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password,
    );

    if (teacher) {
      signIn({
        role: "teacher",
        name: teacher.name,
        email: teacher.email,
        teacherId: teacher.id,
      });
      router.replace("/dashboard/attendance");
      return;
    }

    setError("Neteisingas el. paštas arba slaptažodis.");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef9ff] p-6">
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#cceeff]" />
      <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#fff0bf]" />
      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-[#d9eefb] bg-white p-8 shadow-[0_24px_60px_rgba(25,64,122,0.12)]">
        <Image
          src="/baltas-triusis-logo.jpg"
          alt="Baltas Triušis"
          width={220}
          height={60}
          className="h-auto w-52"
          priority
        />
        <div className="mt-8 h-1.5 w-14 rounded-full bg-[#fbbc34]" />
        <h1 className="mt-4 text-3xl font-extrabold">Prisijungti</h1>
        <p className="mt-2 text-sm leading-6 text-[#849aaa]">
          Administratorius valdo visą sistemą, o mokytojas žymi savo grupių
          lankomumą.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block text-sm font-bold text-[#19407a]">
            El. paštas
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="form-input"
              placeholder="vardas@pastas.lt"
            />
          </label>
          <label className="block text-sm font-bold text-[#19407a]">
            Slaptažodis
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form-input"
              placeholder="Įveskite slaptažodį"
            />
          </label>
          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <button type="submit" className="brand-button w-full py-3">
            Prisijungti
          </button>
        </form>

        <div className="mt-8 rounded-2xl bg-[#f7fcff] p-4 text-sm text-[#849aaa]">
          <p className="font-bold text-[#19407a]">Administratoriaus paskyra</p>
          <p>admin@baltastriusis.lt / admin123</p>
          <p className="mt-3 font-bold text-[#19407a]">Mokytojo pavyzdys</p>
          <p>anna@baltastriusis.lt / teacher123</p>
        </div>
      </div>
    </main>
  );
}

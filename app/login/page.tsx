"use client";

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

    if (email === "admin@classflow.test" && password === "admin123") {
      signIn({
        role: "admin",
        name: "Administrator",
        email: "admin@classflow.test",
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

    setError("Incorrect email or password.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-xl font-bold text-slate-950">
          Class<span className="text-indigo-600">Flow</span>
        </p>
        <h1 className="mt-8 text-3xl font-bold text-slate-950">Sign in</h1>
        <p className="mt-2 text-sm text-slate-500">
          Administrators manage everything. Teachers only mark attendance.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="form-input"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form-input"
            />
          </label>
          {error && (
            <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500"
          >
            Sign in
          </button>
        </form>

        <div className="mt-8 rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Administrator account</p>
          <p>admin@classflow.test / admin123</p>
          <p className="mt-3 font-semibold text-slate-800">Teacher example</p>
          <p>anna@classflow.test / teacher123</p>
        </div>
      </div>
    </main>
  );
}

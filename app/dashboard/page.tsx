"use client";

import Link from "next/link";
import PageHeader from "@/app/components/page-header";
import { useDashboardData } from "@/app/lib/data-store";

export default function DashboardPage() {
  const { students, teachers, groups, resetData } = useDashboardData();
  const paidStudents = students.filter(
    (student) => student.payments.June === "Paid",
  ).length;
  const signedContracts = students.filter(
    (student) => student.contractStatus === "Signed",
  ).length;
  const stats = [
    { label: "Students", value: students.length, color: "bg-indigo-500" },
    { label: "Teachers", value: teachers.length, color: "bg-sky-500" },
    { label: "Active groups", value: groups.length, color: "bg-violet-500" },
    {
      label: "June payments",
      value: `${paidStudents}/${students.length}`,
      color: "bg-emerald-500",
    },
  ];

  function confirmReset() {
    if (
      window.confirm(
        "Reset all students, groups, teachers, payments, contracts, and attendance to the original sample data?",
      )
    ) {
      resetData();
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Dashboard"
          description="Your class information is saved automatically in this browser."
        />
        <button
          type="button"
          onClick={confirmReset}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Reset sample data
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className={`mb-4 h-2 w-12 rounded-full ${stat.color}`} />
            <p className="text-3xl font-bold text-slate-950">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Class groups</h2>
              <p className="text-sm text-slate-500">
                Current schedule and enrollment
              </p>
            </div>
            <Link
              href="/dashboard/groups"
              className="text-sm font-semibold text-indigo-600"
            >
              Manage groups
            </Link>
          </div>
          <div className="space-y-3">
            {groups.length === 0 && (
              <p className="rounded-xl bg-slate-50 p-5 text-slate-500">
                No groups have been created.
              </p>
            )}
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4"
              >
                <div>
                  <p className="font-semibold text-slate-900">{group.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {group.schedule}
                  </p>
                </div>
                <span className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm">
                  {
                    students.filter(
                      (student) => student.groupId === group.id,
                    ).length
                  }{" "}
                  students
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
          <h2 className="text-lg font-semibold">Needs attention</h2>
          <p className="mt-1 text-sm text-slate-400">
            Items that still need follow-up.
          </p>
          <div className="mt-6 space-y-4">
            <Link
              href="/dashboard/payments"
              className="block rounded-xl bg-slate-900 p-4 hover:bg-slate-800"
            >
              <p className="text-2xl font-bold">
                {students.length - paidStudents}
              </p>
              <p className="text-sm text-slate-400">Unpaid monthly fees</p>
            </Link>
            <Link
              href="/dashboard/contracts"
              className="block rounded-xl bg-slate-900 p-4 hover:bg-slate-800"
            >
              <p className="text-2xl font-bold">
                {students.length - signedContracts}
              </p>
              <p className="text-sm text-slate-400">Unsigned contracts</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

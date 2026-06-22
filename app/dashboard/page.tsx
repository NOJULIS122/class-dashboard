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
    { label: "Mokiniai", value: students.length, icon: "👩‍🎓", color: "#0099ff" },
    { label: "Mokytojai", value: teachers.length, icon: "🧑‍🏫", color: "#fbbc34" },
    { label: "Aktyvios grupės", value: groups.length, icon: "◇", color: "#64b5f6" },
    {
      label: "Birželio mokėjimai",
      value: `${paidStudents}/${students.length}`,
      icon: "€",
      color: "#49b675",
    },
  ];

  function confirmReset() {
    if (
      window.confirm(
        "Ar tikrai atkurti pradinius mokinių, grupių, mokytojų, mokėjimų, sutarčių ir lankomumo duomenis?",
      )
    ) {
      resetData();
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Valdymo skydelis"
          description="Visa būrelių informacija išsaugoma automatiškai šioje naršyklėje."
        />
        <button
          type="button"
          onClick={confirmReset}
          className="brand-button-secondary text-sm"
        >
          Atkurti pradinius duomenis
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="brand-card relative overflow-hidden p-5">
            <div
              className="absolute -right-5 -top-5 h-24 w-24 rounded-full opacity-10"
              style={{ backgroundColor: stat.color }}
            />
            <div
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-extrabold text-white"
              style={{ backgroundColor: stat.color }}
            >
              {stat.icon}
            </div>
            <p className="text-3xl font-extrabold text-[#19407a]">{stat.value}</p>
            <p className="mt-1 text-sm text-[#849aaa]">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="brand-card p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl">Būrelių grupės</h2>
              <p className="text-sm text-[#849aaa]">
                Dabartinis tvarkaraštis ir mokinių skaičius
              </p>
            </div>
            <Link
              href="/dashboard/groups"
              className="text-sm font-bold text-[#0099ff]"
            >
              Tvarkyti grupes
            </Link>
          </div>
          <div className="space-y-3">
            {groups.length === 0 && (
              <p className="rounded-2xl bg-[#eef9ff] p-5 text-[#849aaa]">
                Grupių dar nėra.
              </p>
            )}
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7fcff] p-4"
              >
                <div>
                  <p className="font-bold text-[#19407a]">{group.name}</p>
                  <p className="mt-1 text-sm text-[#849aaa]">{group.schedule}</p>
                </div>
                <span className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-[#52789c] shadow-sm">
                  {
                    students.filter(
                      (student) => student.groupId === group.id,
                    ).length
                  }{" "}
                  mok.
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#0099ff] p-6 text-white shadow-[0_18px_40px_rgba(0,153,255,0.2)]">
          <div className="mb-4 h-1.5 w-12 rounded-full bg-[#fbbc34]" />
          <h2 className="text-xl text-white">Reikia dėmesio</h2>
          <p className="mt-1 text-sm text-white/75">
            Neužbaigti darbai, kuriuos verta patikrinti.
          </p>
          <div className="mt-6 space-y-4">
            <Link
              href="/dashboard/payments"
              className="block rounded-2xl bg-white/14 p-4 transition hover:bg-white/20"
            >
              <p className="text-3xl font-extrabold text-white">
                {students.length - paidStudents}
              </p>
              <p className="text-sm text-white/75">
                Nesumokėti birželio mokėjimai
              </p>
            </Link>
            <Link
              href="/dashboard/contracts"
              className="block rounded-2xl bg-white/14 p-4 transition hover:bg-white/20"
            >
              <p className="text-3xl font-extrabold text-white">
                {students.length - signedContracts}
              </p>
              <p className="text-sm text-white/75">Nepasirašytos sutartys</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import PageHeader from "@/app/components/page-header";
import { useDashboardData } from "@/app/lib/data-store";
import { SCHOOL_MONTHS, studentFullName } from "@/app/lib/mock-data";

export default function PaymentsPage() {
  const { students, groups, setPaymentStatus } = useDashboardData();

  function groupName(groupId: number) {
    return groups.find((group) => group.id === groupId)?.name ?? "Unassigned";
  }

  const totalPaid = students.reduce(
    (total, student) =>
      total +
      Object.values(student.payments).filter((status) => status === "Paid")
        .length,
    0,
  );
  const totalPayments = students.length * SCHOOL_MONTHS.length;

  return (
    <>
      <PageHeader
        title="Monthly payments"
        description="Click a month to switch it between paid and unpaid. The school year runs from September through June."
      />

      <section className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-3xl font-bold text-emerald-800">{totalPaid}</p>
          <p className="mt-1 text-sm font-medium text-emerald-700">
            Monthly payments received
          </p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <p className="text-3xl font-bold text-rose-800">
            {totalPayments - totalPaid}
          </p>
          <p className="mt-1 text-sm font-medium text-rose-700">
            Monthly payments outstanding
          </p>
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="sticky left-0 z-10 min-w-48 bg-slate-50 px-4 py-3 font-semibold">
                  Student
                </th>
                <th className="min-w-36 px-3 py-3 font-semibold">Group</th>
                {SCHOOL_MONTHS.map((month) => (
                  <th
                    key={month}
                    className="min-w-20 px-2 py-3 text-center font-semibold"
                  >
                    {month.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="sticky left-0 z-10 whitespace-nowrap bg-white px-4 py-3 font-semibold">
                    {studentFullName(student)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-500">
                    {groupName(student.groupId)}
                  </td>
                  {SCHOOL_MONTHS.map((month) => {
                    const isPaid = student.payments[month] === "Paid";
                    return (
                      <td key={month} className="px-2 py-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setPaymentStatus(
                              student.id,
                              month,
                              isPaid ? "Unpaid" : "Paid",
                            )
                          }
                          title={`${studentFullName(student)}: ${month} is ${
                            isPaid ? "paid" : "unpaid"
                          }`}
                          className={`h-8 w-8 rounded-lg text-sm font-bold transition ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-rose-50 text-rose-500 hover:bg-rose-100"
                          }`}
                        >
                          {isPaid ? "✓" : "—"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

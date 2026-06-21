"use client";

import { ChangeEvent, useState } from "react";
import PageHeader from "@/app/components/page-header";
import StatusBadge from "@/app/components/status-badge";
import {
  deleteContractPdf,
  getContractPdf,
  saveContractPdf,
} from "@/app/lib/contract-files";
import { useDashboardData } from "@/app/lib/data-store";
import { studentFullName } from "@/app/lib/mock-data";

export default function ContractsPage() {
  const { students, groups, setContractFile, setContractStatus } =
    useDashboardData();
  const [message, setMessage] = useState("");
  const signedCount = students.filter(
    (student) => student.contractStatus === "Signed",
  ).length;
  const progress =
    students.length === 0 ? 0 : (signedCount / students.length) * 100;

  function groupName(groupId: number) {
    return groups.find((group) => group.id === groupId)?.name ?? "Unassigned";
  }

  async function uploadPdf(
    studentId: number,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage("Please choose a PDF file.");
      return;
    }

    try {
      await saveContractPdf(studentId, file);
      setContractFile(studentId, file.name);
      setMessage(`${file.name} was saved.`);
    } catch {
      setMessage("The PDF could not be saved in this browser.");
    }
  }

  async function viewPdf(studentId: number) {
    const file = await getContractPdf(studentId);
    if (!file) {
      setMessage("This PDF is not available in this browser.");
      return;
    }

    const url = URL.createObjectURL(file);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  async function removePdf(studentId: number) {
    if (!window.confirm("Remove this contract PDF and mark it not signed?")) {
      return;
    }
    await deleteContractPdf(studentId);
    setContractFile(studentId);
    setMessage("Contract PDF removed.");
  }

  return (
    <>
      <PageHeader
        title="Contracts"
        description="Upload each signed contract as a PDF and open it whenever you need it."
      />

      {message && (
        <div className="mb-5 flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage("")}>
            ×
          </button>
        </div>
      )}

      <div className="mb-6 rounded-2xl bg-indigo-600 p-6 text-white shadow-sm">
        <p className="text-sm font-medium text-indigo-100">Signed contracts</p>
        <p className="mt-2 text-4xl font-bold">
          {signedCount} of {students.length}
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-indigo-400">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Student</th>
                <th className="px-5 py-4 font-semibold">Group</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">PDF file</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold">
                    {studentFullName(student)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {groupName(student.groupId)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={student.contractStatus} />
                  </td>
                  <td className="max-w-56 truncate px-5 py-4 text-slate-600">
                    {student.contractFileName ?? "No PDF uploaded"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <label className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500">
                      {student.contractFileName ? "Replace" : "Upload PDF"}
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={(event) => uploadPdf(student.id, event)}
                        className="hidden"
                      />
                    </label>
                    {student.contractFileName ? (
                      <>
                        <button
                          type="button"
                          onClick={() => viewPdf(student.id)}
                          className="ml-4 font-semibold text-emerald-600"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => removePdf(student.id)}
                          className="ml-4 font-semibold text-rose-600"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setContractStatus(
                            student.id,
                            student.contractStatus === "Signed"
                              ? "Not signed"
                              : "Signed",
                          )
                        }
                        className="ml-4 font-semibold text-slate-600"
                      >
                        Mark{" "}
                        {student.contractStatus === "Signed"
                          ? "not signed"
                          : "signed"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

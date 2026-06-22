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
    return groups.find((group) => group.id === groupId)?.name ?? "Nepriskirta";
  }

  async function uploadPdf(
    studentId: number,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage("Pasirinkite PDF formato bylą.");
      return;
    }

    try {
      await saveContractPdf(studentId, file);
      setContractFile(studentId, file.name);
      setMessage(`Byla „${file.name}“ išsaugota.`);
    } catch {
      setMessage("PDF bylos nepavyko išsaugoti šioje naršyklėje.");
    }
  }

  async function viewPdf(studentId: number) {
    const file = await getContractPdf(studentId);
    if (!file) {
      setMessage("Šios PDF bylos naršyklėje nėra.");
      return;
    }

    const url = URL.createObjectURL(file);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  async function removePdf(studentId: number) {
    if (
      !window.confirm(
        "Ar pašalinti sutarties PDF bylą ir pažymėti sutartį kaip nepasirašytą?",
      )
    ) {
      return;
    }
    await deleteContractPdf(studentId);
    setContractFile(studentId);
    setMessage("Sutarties PDF byla pašalinta.");
  }

  return (
    <>
      <PageHeader
        title="Sutartys"
        description="Įkelkite pasirašytas sutartis PDF formatu ir bet kada jas peržiūrėkite."
      />

      {message && (
        <div className="mb-5 flex items-center justify-between rounded-2xl bg-[#eef9ff] px-4 py-3 text-sm font-semibold text-[#0078c8]">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage("")}>
            ×
          </button>
        </div>
      )}

      <div className="mb-6 rounded-2xl bg-[#0099ff] p-6 text-white shadow-[0_18px_40px_rgba(0,153,255,0.2)]">
        <p className="text-sm font-bold text-white/75">Pasirašytos sutartys</p>
        <p className="mt-2 text-4xl font-bold">
          {signedCount} iš {students.length}
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="brand-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#eef9ff] text-xs uppercase tracking-wide">
              <tr>
                <th className="px-5 py-4 font-semibold">Mokinys</th>
                <th className="px-5 py-4 font-semibold">Grupė</th>
                <th className="px-5 py-4 font-semibold">Būsena</th>
                <th className="px-5 py-4 font-semibold">PDF byla</th>
                <th className="px-5 py-4 font-semibold">Veiksmai</th>
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
                    {student.contractFileName ?? "PDF neįkeltas"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <label className="cursor-pointer font-bold text-[#0099ff] hover:text-[#0078c8]">
                      {student.contractFileName ? "Pakeisti" : "Įkelti PDF"}
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
                          className="ml-4 font-bold text-emerald-600"
                        >
                          Peržiūrėti
                        </button>
                        <button
                          type="button"
                          onClick={() => removePdf(student.id)}
                          className="ml-4 font-bold text-red-500"
                        >
                          Pašalinti
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
                        className="ml-4 font-bold text-[#52789c]"
                      >
                        Pažymėti:{" "}
                        {student.contractStatus === "Signed"
                          ? "nepasirašyta"
                          : "pasirašyta"}
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

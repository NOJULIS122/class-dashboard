"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/auth-store";
import { useDashboardData } from "@/app/lib/data-store";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function AttendanceRegister() {
  const { session } = useAuth();
  const {
    groups,
    students,
    attendance,
    updateStudent,
    setAttendance,
  } = useDashboardData();
  const availableGroups =
    session?.role === "teacher"
      ? groups.filter((group) => group.teacherId === session.teacherId)
      : groups;
  const [selectedGroupId, setSelectedGroupId] = useState(
    availableGroups[0]?.id ?? 0,
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const activeGroupId = availableGroups.some(
    (group) => group.id === selectedGroupId,
  )
    ? selectedGroupId
    : (availableGroups[0]?.id ?? 0);
  const groupStudents = students.filter(
    (student) => student.groupId === activeGroupId,
  );
  const records = attendance[`${selectedDate}|${activeGroupId}`] ?? {};

  if (availableGroups.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="font-bold text-[#19407a]">Nėra priskirtų grupių</p>
        <p className="mt-2 text-sm text-slate-500">
          Administratorius turi priskirti bent vieną grupę šiam mokytojui.
        </p>
      </div>
    );
  }

  return (
    <div className="brand-card overflow-hidden">
      <div className="grid gap-3 border-b border-[#d9eefb] bg-[#f7fcff] p-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-[#19407a]">
          Grupė
          <select
            value={activeGroupId}
            onChange={(event) => setSelectedGroupId(Number(event.target.value))}
            className="form-input"
          >
            {availableGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-bold text-[#19407a]">
          Data
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="form-input"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-[#eef9ff] text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 font-semibold">Vardas</th>
              <th className="px-4 py-3 font-semibold">Pavardė</th>
              <th className="px-4 py-3 font-semibold">Amžius</th>
              <th className="px-4 py-3 font-semibold">Minecraft el. paštas</th>
              <th className="px-4 py-3 font-semibold">Minecraft slaptažodis</th>
              <th className="px-4 py-3 font-semibold">Pastabos</th>
              <th className="px-4 py-3 text-center font-semibold">Dalyvavo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {groupStudents.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  Šioje grupėje mokinių nėra.
                </td>
              </tr>
            )}
            {groupStudents.map((student) => {
              const isPresent = records[student.id] === "Present";
              return (
                <tr key={student.id} className="hover:bg-[#f7fcff]">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    {student.firstName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                    {student.lastName.slice(0, 3)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{student.age}</td>
                  <td className="min-w-64 px-3 py-2">
                    <input
                      type="email"
                      value={student.minecraftEmail}
                      onChange={(event) =>
                        updateStudent({
                          ...student,
                          minecraftEmail: event.target.value,
                        })
                      }
                      aria-label={`${student.firstName} Minecraft el. paštas`}
                      className="w-full rounded-xl border border-[#cfe6f5] bg-white px-3 py-2 text-sm text-[#52789c] outline-none focus:border-[#0099ff] focus:ring-2 focus:ring-[#0099ff]/10"
                      placeholder="Minecraft el. paštas"
                    />
                  </td>
                  <td className="min-w-48 px-3 py-2">
                    <input
                      type="text"
                      value={student.minecraftPassword}
                      onChange={(event) =>
                        updateStudent({
                          ...student,
                          minecraftPassword: event.target.value,
                        })
                      }
                      aria-label={`${student.firstName} Minecraft slaptažodis`}
                      className="w-full rounded-xl border border-[#cfe6f5] bg-white px-3 py-2 font-mono text-sm text-[#52789c] outline-none focus:border-[#0099ff] focus:ring-2 focus:ring-[#0099ff]/10"
                      placeholder="Slaptažodis"
                    />
                  </td>
                  <td className="min-w-64 px-3 py-2">
                    <input
                      type="text"
                      value={student.notes}
                      onChange={(event) =>
                        updateStudent({
                          ...student,
                          notes: event.target.value,
                        })
                      }
                      aria-label={`${student.firstName} pastabos`}
                      className="w-full rounded-xl border border-[#cfe6f5] bg-white px-3 py-2 text-sm text-[#52789c] outline-none focus:border-[#0099ff] focus:ring-2 focus:ring-[#0099ff]/10"
                      placeholder="Pridėti pastabą"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isPresent}
                      onChange={(event) =>
                        setAttendance(
                          selectedDate,
                          activeGroupId,
                          student.id,
                          event.target.checked ? "Present" : "Absent",
                        )
                      }
                      aria-label={`Pažymėti, kad ${student.firstName} ${student.lastName.slice(
                        0,
                        3,
                      )} dalyvavo`}
                      className="h-6 w-6 accent-[#0099ff]"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#d9eefb] bg-[#f7fcff] px-4 py-3">
        <p className="text-xs font-bold text-[#0099ff]">
          Išsaugoma automatiškai
        </p>
        <span className="text-sm font-semibold text-slate-700">
          {groupStudents.filter((student) => records[student.id] === "Present")
            .length}{" "}
          dalyvavo ·{" "}
          {groupStudents.filter((student) => records[student.id] !== "Present")
            .length}{" "}
          nedalyvavo
        </span>
      </div>
    </div>
  );
}

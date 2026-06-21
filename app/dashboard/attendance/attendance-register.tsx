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
        <p className="font-semibold text-slate-900">No assigned groups</p>
        <p className="mt-2 text-sm text-slate-500">
          An administrator must assign a group to this teacher.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Group
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
        <label className="text-sm font-semibold text-slate-700">
          Date
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
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Last name</th>
              <th className="px-4 py-3 font-semibold">Age</th>
              <th className="px-4 py-3 font-semibold">Minecraft email</th>
              <th className="px-4 py-3 font-semibold">Minecraft password</th>
              <th className="px-4 py-3 font-semibold">Notes</th>
              <th className="px-4 py-3 text-center font-semibold">Present</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {groupStudents.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  This group has no students.
                </td>
              </tr>
            )}
            {groupStudents.map((student) => {
              const isPresent = records[student.id] === "Present";
              return (
                <tr key={student.id} className="hover:bg-slate-50">
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
                      aria-label={`${student.firstName} Minecraft email`}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Minecraft email"
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
                      aria-label={`${student.firstName} Minecraft password`}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Password"
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
                      aria-label={`${student.firstName} notes`}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Add a note"
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
                      aria-label={`Mark ${student.firstName} ${student.lastName.slice(
                        0,
                        3,
                      )} present`}
                      className="h-6 w-6 accent-emerald-600"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-medium text-emerald-700">
          Saved automatically
        </p>
        <span className="text-sm font-semibold text-slate-700">
          {groupStudents.filter((student) => records[student.id] === "Present")
            .length}{" "}
          present ·{" "}
          {groupStudents.filter((student) => records[student.id] !== "Present")
            .length}{" "}
          absent
        </span>
      </div>
    </div>
  );
}

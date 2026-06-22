"use client";

import { FormEvent, useState } from "react";
import Modal from "@/app/components/modal";
import PageHeader from "@/app/components/page-header";
import StatusBadge from "@/app/components/status-badge";
import { useDashboardData } from "@/app/lib/data-store";
import {
  emptyPayments,
  Student,
  studentFullName,
} from "@/app/lib/mock-data";

const emptyForm: Omit<Student, "id"> = {
  firstName: "",
  lastName: "",
  age: 0,
  phoneNumber: "",
  email: "",
  minecraftEmail: "",
  minecraftPassword: "",
  notes: "",
  parentName: "",
  parentEmail: "",
  groupId: 0,
  payments: emptyPayments(),
  contractStatus: "Not signed",
};

export default function StudentsPage() {
  const { students, groups, addStudent, updateStudent, deleteStudent } =
    useDashboardData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(
    new Set(),
  );

  function groupName(groupId: number) {
    return groups.find((group) => group.id === groupId)?.name ?? "Nepriskirta";
  }

  function openNewStudent() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      payments: emptyPayments(),
      groupId: groups[0]?.id ?? 0,
    });
    setIsFormOpen(true);
  }

  function openEditStudent(student: Student) {
    setEditingId(student.id);
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      age: student.age,
      phoneNumber: student.phoneNumber,
      email: student.email,
      minecraftEmail: student.minecraftEmail,
      minecraftPassword: student.minecraftPassword,
      notes: student.notes,
      parentName: student.parentName,
      parentEmail: student.parentEmail,
      groupId: student.groupId,
      payments: student.payments,
      contractStatus: student.contractStatus,
      contractFileName: student.contractFileName,
    });
    setIsFormOpen(true);
  }

  function submitStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId === null) addStudent(form);
    else updateStudent({ ...form, id: editingId });
    setIsFormOpen(false);
  }

  function removeStudent(student: Student) {
    if (window.confirm(`Ar tikrai ištrinti mokinį ${studentFullName(student)}?`)) {
      deleteStudent(student.id);
    }
  }

  function togglePassword(studentId: number) {
    setVisiblePasswords((current) => {
      const next = new Set(current);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Mokiniai"
          description="Tvarkykite mokinių kontaktus, Minecraft paskyras, grupes, mokėjimus ir sutartis."
        />
        <button
          type="button"
          onClick={openNewStudent}
          className="brand-button text-sm"
        >
          + Pridėti mokinį
        </button>
      </div>

      <div className="brand-card overflow-hidden">
        <div className="border-b border-[#d9eefb] bg-[#f7fcff] px-6 py-4 text-sm font-bold text-[#52789c]">
          Mokinių skaičius: {students.length}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#eef9ff] text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-4 font-semibold">Vardas</th>
                <th className="px-4 py-4 font-semibold">Pavardė</th>
                <th className="px-4 py-4 font-semibold">Amžius</th>
                <th className="px-4 py-4 font-semibold">Telefono numeris</th>
                <th className="px-4 py-4 font-semibold">Mokinio el. paštas</th>
                <th className="px-4 py-4 font-semibold">Minecraft el. paštas</th>
                <th className="px-4 py-4 font-semibold">Minecraft slaptažodis</th>
                <th className="px-4 py-4 font-semibold">Grupė</th>
                <th className="px-4 py-4 font-semibold">Mokėjimai</th>
                <th className="px-4 py-4 font-semibold">Sutartis</th>
                <th className="px-4 py-4 font-semibold">Veiksmai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaf3f8]">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-[#f7fcff]">
                  <td className="whitespace-nowrap px-4 py-4 font-semibold">
                    {student.firstName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold">
                    {student.lastName}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{student.age}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {student.phoneNumber || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {student.email || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {student.minecraftEmail || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span className="font-mono text-[#52789c]">
                      {student.minecraftPassword
                        ? visiblePasswords.has(student.id)
                          ? student.minecraftPassword
                          : "••••••••"
                        : "—"}
                    </span>
                    {student.minecraftPassword && (
                      <button
                        type="button"
                        onClick={() => togglePassword(student.id)}
                        className="ml-2 text-xs font-bold text-[#0099ff]"
                      >
                        {visiblePasswords.has(student.id) ? "Slėpti" : "Rodyti"}
                      </button>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {groupName(student.groupId)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">
                    {
                      Object.values(student.payments).filter(
                        (status) => status === "Paid",
                      ).length
                    }
                    /10
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={student.contractStatus} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <button
                      type="button"
                      onClick={() => openEditStudent(student)}
                      className="font-bold text-[#0099ff]"
                    >
                      Redaguoti
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStudent(student)}
                      className="ml-4 font-bold text-red-500"
                    >
                      Ištrinti
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <Modal
          title={editingId === null ? "Pridėti mokinį" : "Redaguoti mokinį"}
          onClose={() => setIsFormOpen(false)}
        >
          <form onSubmit={submitStudent} className="grid gap-4 p-6 sm:grid-cols-2">
            <FormField label="Vardas">
              <input
                required
                value={form.firstName}
                onChange={(event) =>
                  setForm({ ...form, firstName: event.target.value })
                }
                className="form-input"
              />
            </FormField>
            <FormField label="Pavardė">
              <input
                required
                value={form.lastName}
                onChange={(event) =>
                  setForm({ ...form, lastName: event.target.value })
                }
                className="form-input"
              />
            </FormField>
            <FormField label="Amžius">
              <input
                required
                type="number"
                min={1}
                max={100}
                value={form.age || ""}
                onChange={(event) =>
                  setForm({ ...form, age: Number(event.target.value) })
                }
                className="form-input"
              />
            </FormField>
            <FormField label="Telefono numeris">
              <input
                required
                type="tel"
                value={form.phoneNumber}
                onChange={(event) =>
                  setForm({ ...form, phoneNumber: event.target.value })
                }
                className="form-input"
              />
            </FormField>
            <FormField label="Mokinio el. paštas">
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                className="form-input"
              />
            </FormField>
            <FormField label="Minecraft el. paštas">
              <input
                required
                type="email"
                value={form.minecraftEmail}
                onChange={(event) =>
                  setForm({ ...form, minecraftEmail: event.target.value })
                }
                className="form-input"
              />
            </FormField>
            <FormField label="Minecraft slaptažodis">
              <input
                required
                type="text"
                value={form.minecraftPassword}
                onChange={(event) =>
                  setForm({ ...form, minecraftPassword: event.target.value })
                }
                className="form-input"
              />
            </FormField>
            <FormField label="Pastabos">
              <textarea
                value={form.notes}
                onChange={(event) =>
                  setForm({ ...form, notes: event.target.value })
                }
                rows={3}
                className="form-input resize-y"
                placeholder="Mokymosi poreikiai arba svarbios pastabos"
              />
            </FormField>
            <FormField label="Grupė">
              <select
                value={form.groupId}
                onChange={(event) =>
                  setForm({ ...form, groupId: Number(event.target.value) })
                }
                className="form-input"
              >
                <option value={0}>Nepriskirta</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Tėvų vardas">
              <input
                required
                value={form.parentName}
                onChange={(event) =>
                  setForm({ ...form, parentName: event.target.value })
                }
                className="form-input"
              />
            </FormField>
            <FormField label="Tėvų el. paštas">
              <input
                required
                type="email"
                value={form.parentEmail}
                onChange={(event) =>
                  setForm({ ...form, parentEmail: event.target.value })
                }
                className="form-input"
              />
            </FormField>
            <div className="flex justify-end gap-3 pt-3 sm:col-span-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="brand-button-secondary"
              >
                Atšaukti
              </button>
              <button
                type="submit"
                className="brand-button"
              >
                Išsaugoti mokinį
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-bold text-[#19407a]">
      {label}
      {children}
    </label>
  );
}

"use client";

import { FormEvent, useState } from "react";
import Modal from "@/app/components/modal";
import PageHeader from "@/app/components/page-header";
import { useDashboardData } from "@/app/lib/data-store";
import { Teacher } from "@/app/lib/mock-data";

const emptyForm = { name: "", email: "", password: "" };

export default function TeachersPage() {
  const {
    teachers,
    groups,
    addTeacher,
    updateTeacher,
    deleteTeacher,
  } = useDashboardData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openNewTeacher() {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function openEditTeacher(teacher: Teacher) {
    setEditingId(teacher.id);
    setForm({
      name: teacher.name,
      email: teacher.email,
      password: teacher.password,
    });
    setIsFormOpen(true);
  }

  function submitTeacher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId === null) addTeacher(form);
    else updateTeacher({ ...form, id: editingId });
    setIsFormOpen(false);
  }

  function removeTeacher(teacher: Teacher) {
    if (
      window.confirm(
        `Ar tikrai ištrinti mokytoją ${teacher.name}? Jo grupės liks be priskirto mokytojo.`,
      )
    ) {
      deleteTeacher(teacher.id);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Mokytojai"
          description="Pridėkite mokytojus, tvarkykite jų prisijungimus ir matykite priskirtas grupes."
        />
        <button
          type="button"
          onClick={openNewTeacher}
          className="brand-button text-sm"
        >
          + Pridėti mokytoją
        </button>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {teachers.map((teacher) => {
          const assignedGroups = groups.filter(
            (group) => group.teacherId === teacher.id,
          );

          return (
            <article
              key={teacher.id}
              className="brand-card p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef9ff] text-lg font-extrabold text-[#0099ff]">
                {teacher.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <h2 className="mt-4 text-xl font-bold">{teacher.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{teacher.email}</p>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="mb-3 text-xs font-semibold uppercase text-slate-400">
                  Priskirtos grupės
                </p>
                <div className="flex flex-wrap gap-2">
                  {assignedGroups.length === 0 && (
                    <span className="text-sm text-[#849aaa]">Grupių nėra</span>
                  )}
                  {assignedGroups.map((group) => (
                    <span
                      key={group.id}
                      className="rounded-full bg-[#eef9ff] px-3 py-1.5 text-sm font-semibold text-[#52789c]"
                    >
                      {group.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex gap-4">
                <button
                  type="button"
                  onClick={() => openEditTeacher(teacher)}
                  className="text-sm font-bold text-[#0099ff]"
                >
                  Redaguoti
                </button>
                <button
                  type="button"
                  onClick={() => removeTeacher(teacher)}
                  className="text-sm font-bold text-red-500"
                >
                  Ištrinti
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {isFormOpen && (
        <Modal
          title={editingId === null ? "Pridėti mokytoją" : "Redaguoti mokytoją"}
          onClose={() => setIsFormOpen(false)}
        >
          <form onSubmit={submitTeacher} className="space-y-4 p-6">
            <label className="block text-sm font-semibold text-slate-700">
              Mokytojo vardas ir pavardė
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                className="form-input"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              El. paštas
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                className="form-input"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Prisijungimo slaptažodis
              <input
                required
                minLength={6}
                type="text"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                className="form-input"
              />
            </label>
            <div className="flex justify-end gap-3 pt-3">
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
                Išsaugoti mokytoją
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

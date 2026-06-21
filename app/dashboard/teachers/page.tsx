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
        `Delete ${teacher.name}? Their groups will become unassigned.`,
      )
    ) {
      deleteTeacher(teacher.id);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Teachers"
          description="Add teachers and view the groups assigned to them."
        />
        <button
          type="button"
          onClick={openNewTeacher}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          + Add teacher
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
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
                {teacher.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <h2 className="mt-4 text-xl font-bold">{teacher.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{teacher.email}</p>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="mb-3 text-xs font-semibold uppercase text-slate-400">
                  Assigned groups
                </p>
                <div className="flex flex-wrap gap-2">
                  {assignedGroups.length === 0 && (
                    <span className="text-sm text-slate-500">No groups</span>
                  )}
                  {assignedGroups.map((group) => (
                    <span
                      key={group.id}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-sm"
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
                  className="text-sm font-semibold text-indigo-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => removeTeacher(teacher)}
                  className="text-sm font-semibold text-rose-600"
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {isFormOpen && (
        <Modal
          title={editingId === null ? "Add teacher" : "Edit teacher"}
          onClose={() => setIsFormOpen(false)}
        >
          <form onSubmit={submitTeacher} className="space-y-4 p-6">
            <label className="block text-sm font-semibold text-slate-700">
              Teacher name
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
              Email
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
              Login password
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
                className="rounded-lg border border-slate-300 px-4 py-2 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white"
              >
                Save teacher
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

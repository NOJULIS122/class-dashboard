"use client";

import { FormEvent, useState } from "react";
import Modal from "@/app/components/modal";
import PageHeader from "@/app/components/page-header";
import { useDashboardData } from "@/app/lib/data-store";
import { Group } from "@/app/lib/mock-data";

const emptyForm = {
  name: "",
  schedule: "",
  teacherId: null as number | null,
};

export default function GroupsPage() {
  const {
    groups,
    students,
    teachers,
    addGroup,
    updateGroup,
    deleteGroup,
  } = useDashboardData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openNewGroup() {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function openEditGroup(group: Group) {
    setEditingId(group.id);
    setForm({
      name: group.name,
      schedule: group.schedule,
      teacherId: group.teacherId,
    });
    setIsFormOpen(true);
  }

  function submitGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId === null) addGroup(form);
    else updateGroup({ ...form, id: editingId });
    setIsFormOpen(false);
  }

  function removeGroup(group: Group) {
    const count = students.filter(
      (student) => student.groupId === group.id,
    ).length;
    const message =
      count > 0
        ? `Delete ${group.name}? Its ${count} students will become unassigned.`
        : `Delete ${group.name}?`;

    if (window.confirm(message)) deleteGroup(group.id);
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Groups"
          description="Create groups and assign schedules and teachers."
        />
        <button
          type="button"
          onClick={openNewGroup}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          + Add group
        </button>
      </div>

      <section className="grid gap-5 md:grid-cols-2">
        {groups.map((group) => {
          const teacher = teachers.find(
            (item) => item.id === group.teacherId,
          );
          const studentCount = students.filter(
            (student) => student.groupId === group.id,
          ).length;

          return (
            <article
              key={group.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    {group.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">{group.schedule}</p>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                  {studentCount} students
                </span>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <p className="text-xs font-medium uppercase text-slate-400">
                  Teacher
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  {teacher?.name ?? "Not assigned"}
                </p>
              </div>
              <div className="mt-5 flex gap-4">
                <button
                  type="button"
                  onClick={() => openEditGroup(group)}
                  className="text-sm font-semibold text-indigo-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => removeGroup(group)}
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
          title={editingId === null ? "Add group" : "Edit group"}
          onClose={() => setIsFormOpen(false)}
        >
          <form onSubmit={submitGroup} className="space-y-4 p-6">
            <label className="block text-sm font-semibold text-slate-700">
              Group name
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
              Schedule
              <input
                required
                placeholder="Example: Mon & Wed · 16:00"
                value={form.schedule}
                onChange={(event) =>
                  setForm({ ...form, schedule: event.target.value })
                }
                className="form-input"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Teacher
              <select
                value={form.teacherId ?? ""}
                onChange={(event) =>
                  setForm({
                    ...form,
                    teacherId: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
                className="form-input"
              >
                <option value="">Not assigned</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
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
                Save group
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

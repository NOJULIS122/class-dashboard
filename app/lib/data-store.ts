"use client";

import { useSyncExternalStore } from "react";
import {
  AttendanceStatus,
  ContractStatus,
  DashboardData,
  Group,
  initialData,
  PaymentStatus,
  SchoolMonth,
  SCHOOL_MONTHS,
  Student,
  Teacher,
} from "./mock-data";

const STORAGE_KEY = "classflow-dashboard-data";

let data: DashboardData = initialData;
let loaded = false;
const listeners = new Set<() => void>();

function cloneInitialData() {
  return JSON.parse(JSON.stringify(initialData)) as DashboardData;
}

function notify() {
  listeners.forEach((listener) => listener());
}

function save(nextData: DashboardData) {
  data = nextData;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
  notify();
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;

  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    try {
      const saved = JSON.parse(savedData) as Omit<
        DashboardData,
        "students" | "teachers"
      > & {
        students: Array<
          Partial<Omit<Student, "payments">> & {
            id: number;
            name?: string;
            paymentStatus?: PaymentStatus;
            payments?: Student["payments"];
          }
        >;
        teachers: Array<Omit<Teacher, "password"> & { password?: string }>;
      };
      data = {
        ...saved,
        groups: saved.groups.map((group) => ({
          ...group,
          name:
            {
              "English Beginners": "Minecraft pradedantiesiems",
              "English Advanced": "Minecraft pažengusiems",
              "Math Explorers": "Minecraft kūrėjai",
              "Creative Writing": "Minecraft programuotojai",
            }[group.name] ?? group.name,
          schedule:
            {
              "Mon & Wed · 16:00": "Pirmadienį ir trečiadienį · 16:00",
              "Tue & Thu · 18:00": "Antradienį ir ketvirtadienį · 18:00",
              "Saturday · 10:00": "Šeštadienį · 10:00",
              "Friday · 17:00": "Penktadienį · 17:00",
            }[group.schedule] ?? group.schedule,
        })),
        teachers: saved.teachers.map((teacher) => ({
          ...teacher,
          email: teacher.email.replace(
            "@classflow.test",
            "@baltastriusis.lt",
          ),
          password: teacher.password ?? "teacher123",
        })),
        students: saved.students.map((student) => {
          const oldName = student.name?.trim().split(/\s+/) ?? [];
          return {
            ...student,
            firstName: student.firstName ?? oldName[0] ?? "",
            lastName:
              student.lastName ?? oldName.slice(1).join(" ") ?? "",
            age: student.age ?? 0,
            phoneNumber: student.phoneNumber ?? "",
            email: student.email ?? "",
            minecraftEmail: student.minecraftEmail ?? "",
            minecraftPassword: student.minecraftPassword ?? "",
            notes:
              {
                "Prefers building exercises.":
                  "Labiausiai mėgsta statymo užduotis.",
                "Needs help with commands.": "Reikia pagalbos su komandomis.",
                "Works best near the teacher.":
                  "Geriausiai dirba šalia mokytojo.",
              }[student.notes ?? ""] ??
              student.notes ??
              "",
            parentName: student.parentName ?? "",
            parentEmail: student.parentEmail ?? "",
            groupId: student.groupId ?? 0,
            contractStatus: student.contractStatus ?? "Not signed",
            payments:
              student.payments ??
              Object.fromEntries(
                SCHOOL_MONTHS.map((month) => [
                  month,
                  student.paymentStatus ?? "Unpaid",
                ]),
              ),
          };
        }) as Student[],
        attendance: Object.fromEntries(
          Object.entries(saved.attendance ?? {}).map(([key, records]) => [
            key,
            Object.fromEntries(
              Object.entries(records).map(([studentId, status]) => [
                studentId,
                status === "Present" ? "Present" : "Absent",
              ]),
            ),
          ]),
        ),
      };
    } catch {
      data = cloneInitialData();
    }
  } else {
    data = cloneInitialData();
  }

  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  load();
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return data;
}

function getServerSnapshot() {
  return initialData;
}

function nextId(items: { id: number }[]) {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

export function useDashboardData() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return {
    ...snapshot,

    addStudent(student: Omit<Student, "id">) {
      save({
        ...data,
        students: [...data.students, { ...student, id: nextId(data.students) }],
      });
    },

    updateStudent(student: Student) {
      save({
        ...data,
        students: data.students.map((item) =>
          item.id === student.id ? student : item,
        ),
      });
    },

    deleteStudent(studentId: number) {
      const attendance = Object.fromEntries(
        Object.entries(data.attendance).map(([key, records]) => {
          const nextRecords = { ...records };
          delete nextRecords[studentId];
          return [key, nextRecords];
        }),
      );

      save({
        ...data,
        students: data.students.filter((student) => student.id !== studentId),
        attendance,
      });
    },

    addGroup(group: Omit<Group, "id">) {
      save({
        ...data,
        groups: [...data.groups, { ...group, id: nextId(data.groups) }],
      });
    },

    updateGroup(group: Group) {
      save({
        ...data,
        groups: data.groups.map((item) =>
          item.id === group.id ? group : item,
        ),
      });
    },

    deleteGroup(groupId: number) {
      const attendance = Object.fromEntries(
        Object.entries(data.attendance).filter(
          ([key]) => !key.endsWith(`|${groupId}`),
        ),
      );

      save({
        ...data,
        groups: data.groups.filter((group) => group.id !== groupId),
        students: data.students.map((student) =>
          student.groupId === groupId ? { ...student, groupId: 0 } : student,
        ),
        attendance,
      });
    },

    addTeacher(teacher: Omit<Teacher, "id">) {
      save({
        ...data,
        teachers: [
          ...data.teachers,
          { ...teacher, id: nextId(data.teachers) },
        ],
      });
    },

    updateTeacher(teacher: Teacher) {
      save({
        ...data,
        teachers: data.teachers.map((item) =>
          item.id === teacher.id ? teacher : item,
        ),
      });
    },

    deleteTeacher(teacherId: number) {
      save({
        ...data,
        teachers: data.teachers.filter(
          (teacher) => teacher.id !== teacherId,
        ),
        groups: data.groups.map((group) =>
          group.teacherId === teacherId ? { ...group, teacherId: null } : group,
        ),
      });
    },

    setPaymentStatus(
      studentId: number,
      month: SchoolMonth,
      status: PaymentStatus,
    ) {
      save({
        ...data,
        students: data.students.map((student) =>
          student.id === studentId
            ? {
                ...student,
                payments: { ...student.payments, [month]: status },
              }
            : student,
        ),
      });
    },

    setContractStatus(studentId: number, status: ContractStatus) {
      save({
        ...data,
        students: data.students.map((student) =>
          student.id === studentId
            ? { ...student, contractStatus: status }
            : student,
        ),
      });
    },

    setContractFile(studentId: number, fileName?: string) {
      save({
        ...data,
        students: data.students.map((student) =>
          student.id === studentId
            ? {
                ...student,
                contractFileName: fileName,
                contractStatus: fileName ? "Signed" : "Not signed",
              }
            : student,
        ),
      });
    },

    setAttendance(
      date: string,
      groupId: number,
      studentId: number,
      status: AttendanceStatus,
    ) {
      const key = `${date}|${groupId}`;
      save({
        ...data,
        attendance: {
          ...data.attendance,
          [key]: {
            ...data.attendance[key],
            [studentId]: status,
          },
        },
      });
    },

    resetData() {
      save(cloneInitialData());
    },
  };
}

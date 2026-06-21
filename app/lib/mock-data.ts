export const SCHOOL_MONTHS = [
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
] as const;

export type SchoolMonth = (typeof SCHOOL_MONTHS)[number];
export type PaymentStatus = "Paid" | "Unpaid";
export type ContractStatus = "Signed" | "Not signed";
export type AttendanceStatus = "Present" | "Absent";

export type Student = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  phoneNumber: string;
  email: string;
  minecraftEmail: string;
  minecraftPassword: string;
  notes: string;
  parentName: string;
  parentEmail: string;
  groupId: number;
  payments: Record<SchoolMonth, PaymentStatus>;
  contractStatus: ContractStatus;
  contractFileName?: string;
};

export type Teacher = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export type Group = {
  id: number;
  name: string;
  schedule: string;
  teacherId: number | null;
};

export type AttendanceRecords = Record<
  string,
  Record<number, AttendanceStatus>
>;

export type DashboardData = {
  students: Student[];
  teachers: Teacher[];
  groups: Group[];
  attendance: AttendanceRecords;
};

export function emptyPayments(): Record<SchoolMonth, PaymentStatus> {
  return Object.fromEntries(
    SCHOOL_MONTHS.map((month) => [month, "Unpaid"]),
  ) as Record<SchoolMonth, PaymentStatus>;
}

export function studentFullName(student: Student) {
  return `${student.firstName} ${student.lastName}`.trim();
}

function samplePayments(paidThrough: number) {
  return Object.fromEntries(
    SCHOOL_MONTHS.map((month, index) => [
      month,
      index < paidThrough ? "Paid" : "Unpaid",
    ]),
  ) as Record<SchoolMonth, PaymentStatus>;
}

export const initialData: DashboardData = {
  groups: [
    {
      id: 1,
      name: "English Beginners",
      schedule: "Mon & Wed · 16:00",
      teacherId: 1,
    },
    {
      id: 2,
      name: "English Advanced",
      schedule: "Tue & Thu · 18:00",
      teacherId: 1,
    },
    {
      id: 3,
      name: "Math Explorers",
      schedule: "Saturday · 10:00",
      teacherId: 2,
    },
    {
      id: 4,
      name: "Creative Writing",
      schedule: "Friday · 17:00",
      teacherId: 3,
    },
  ],
  students: [
    {
      id: 1,
      firstName: "Emma",
      lastName: "Johnson",
      age: 12,
      phoneNumber: "+1 555 010 1001",
      email: "emma.johnson@example.com",
      minecraftEmail: "emma.minecraft@example.com",
      minecraftPassword: "Creeper!12",
      notes: "Prefers building exercises.",
      parentName: "Sarah Johnson",
      parentEmail: "sarah.johnson@example.com",
      groupId: 1,
      payments: samplePayments(10),
      contractStatus: "Signed",
    },
    {
      id: 2,
      firstName: "Noah",
      lastName: "Williams",
      age: 11,
      phoneNumber: "+1 555 010 1002",
      email: "noah.williams@example.com",
      minecraftEmail: "noah.minecraft@example.com",
      minecraftPassword: "Diamond!11",
      notes: "Needs help with commands.",
      parentName: "Daniel Williams",
      parentEmail: "daniel.williams@example.com",
      groupId: 1,
      payments: samplePayments(8),
      contractStatus: "Signed",
    },
    {
      id: 3,
      firstName: "Olivia",
      lastName: "Brown",
      age: 13,
      phoneNumber: "+1 555 010 1003",
      email: "olivia.brown@example.com",
      minecraftEmail: "olivia.minecraft@example.com",
      minecraftPassword: "Ender!13",
      notes: "",
      parentName: "Emily Brown",
      parentEmail: "emily.brown@example.com",
      groupId: 1,
      payments: samplePayments(9),
      contractStatus: "Not signed",
    },
    {
      id: 4,
      firstName: "Liam",
      lastName: "Davis",
      age: 12,
      phoneNumber: "+1 555 010 1004",
      email: "liam.davis@example.com",
      minecraftEmail: "liam.minecraft@example.com",
      minecraftPassword: "Pickaxe!12",
      notes: "",
      parentName: "Michael Davis",
      parentEmail: "michael.davis@example.com",
      groupId: 2,
      payments: samplePayments(10),
      contractStatus: "Signed",
    },
    {
      id: 5,
      firstName: "Sophia",
      lastName: "Miller",
      age: 14,
      phoneNumber: "+1 555 010 1005",
      email: "sophia.miller@example.com",
      minecraftEmail: "sophia.minecraft@example.com",
      minecraftPassword: "Redstone!14",
      notes: "Works best near the teacher.",
      parentName: "Laura Miller",
      parentEmail: "laura.miller@example.com",
      groupId: 2,
      payments: samplePayments(7),
      contractStatus: "Not signed",
    },
    {
      id: 6,
      firstName: "Lucas",
      lastName: "Wilson",
      age: 10,
      phoneNumber: "+1 555 010 1006",
      email: "lucas.wilson@example.com",
      minecraftEmail: "lucas.minecraft@example.com",
      minecraftPassword: "Steve!10",
      notes: "",
      parentName: "James Wilson",
      parentEmail: "james.wilson@example.com",
      groupId: 3,
      payments: samplePayments(10),
      contractStatus: "Signed",
    },
    {
      id: 7,
      firstName: "Mia",
      lastName: "Moore",
      age: 11,
      phoneNumber: "+1 555 010 1007",
      email: "mia.moore@example.com",
      minecraftEmail: "mia.minecraft@example.com",
      minecraftPassword: "Alex!11",
      notes: "",
      parentName: "Anna Moore",
      parentEmail: "anna.moore@example.com",
      groupId: 3,
      payments: samplePayments(8),
      contractStatus: "Signed",
    },
    {
      id: 8,
      firstName: "Ethan",
      lastName: "Taylor",
      age: 13,
      phoneNumber: "+1 555 010 1008",
      email: "ethan.taylor@example.com",
      minecraftEmail: "ethan.minecraft@example.com",
      minecraftPassword: "Nether!13",
      notes: "",
      parentName: "Robert Taylor",
      parentEmail: "robert.taylor@example.com",
      groupId: 4,
      payments: samplePayments(9),
      contractStatus: "Not signed",
    },
  ],
  teachers: [
    {
      id: 1,
      name: "Anna Smith",
      email: "anna@classflow.test",
      password: "teacher123",
    },
    {
      id: 2,
      name: "Mark Evans",
      email: "mark@classflow.test",
      password: "teacher123",
    },
    {
      id: 3,
      name: "Julia Reed",
      email: "julia@classflow.test",
      password: "teacher123",
    },
  ],
  attendance: {
    "2026-06-21|1": {
      1: "Present",
      2: "Absent",
      3: "Present",
    },
  },
};

import PageHeader from "@/app/components/page-header";
import AttendanceRegister from "./attendance-register";

export default function AttendancePage() {
  return (
    <>
      <PageHeader
        title="Attendance"
        description="Choose a group and date, then mark each student's attendance."
      />
      <AttendanceRegister />
    </>
  );
}

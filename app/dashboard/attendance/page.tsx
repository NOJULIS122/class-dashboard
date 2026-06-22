import PageHeader from "@/app/components/page-header";
import AttendanceRegister from "./attendance-register";

export default function AttendancePage() {
  return (
    <>
      <PageHeader
        title="Lankomumas"
        description="Pasirinkite grupę bei datą ir pažymėkite pamokoje dalyvavusius mokinius."
      />
      <AttendanceRegister />
    </>
  );
}

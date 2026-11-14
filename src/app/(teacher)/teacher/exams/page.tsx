import * as React from "react";
import { TeacherExamsWorkspace } from "@/components/teacher/teacher-exams-workspace";

export default function TeacherExamsPage() {
  return (
    <React.Suspense fallback={null}>
      <TeacherExamsWorkspace />
    </React.Suspense>
  );
}

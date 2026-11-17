import * as React from "react";
import { TeacherExamsWorkspace } from "@/components/teacher/teacher-exams-view";

export default function TeacherExamsPage() {
  return (
    <React.Suspense fallback={null}>
      <TeacherExamsWorkspace />
    </React.Suspense>
  );
}

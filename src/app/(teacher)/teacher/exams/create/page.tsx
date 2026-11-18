import * as React from "react";
import { TeacherCreateExamWorkspace } from "@/components/teacher/teacher-create-exam-view";

export default function TeacherCreateExamPage() {
  return (
    <React.Suspense fallback={null}>
      <TeacherCreateExamWorkspace />
    </React.Suspense>
  );
}

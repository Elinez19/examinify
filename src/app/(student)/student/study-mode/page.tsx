import * as React from "react";
import { StudentStudyWorkspace } from "@/components/student/student-study-workspace";

export default function StudentStudyModePage() {
  return (
    <React.Suspense fallback={null}>
      <StudentStudyWorkspace />
    </React.Suspense>
  );
}

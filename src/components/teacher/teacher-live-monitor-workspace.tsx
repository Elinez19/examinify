"use client";

import * as React from "react";
import { TeacherExamsWorkspace } from "./teacher-exams-workspace";

export function TeacherLiveMonitorWorkspace() {
  return (
    <React.Suspense fallback={null}>
      <TeacherExamsWorkspace />
    </React.Suspense>
  );
}

import * as React from "react";
import { ExamWorkspace } from "@/components/exam/exam-workspace";

async function ExamHallLoader({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  return <ExamWorkspace examId={examId} />;
}

export default function ExamHallPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface-pearl p-6">
          <div className="surface-gloss-card p-8 text-center space-y-2">
            <p className="font-display text-lg font-extrabold text-brand-950">
              Entering Examinify Exam Hall...
            </p>
            <p className="text-xs font-semibold text-ink-secondary">
              Preparing offline CBT workspace
            </p>
          </div>
        </div>
      }
    >
      <ExamHallLoader params={params} />
    </React.Suspense>
  );
}

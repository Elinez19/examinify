import type { ICbtSubject } from "@/types/cbt"

interface SubjectStat {
  subjectId: string
  subjectName: string
  totalQuestions: number
  answeredCount: number
  unansweredCount: number
  flaggedCount: number
}

interface CbtSubjectTabsProps {
  subjects: ICbtSubject[]
  activeSubjectIndex: number
  subjectStats: SubjectStat[]
  onSelectSubject: (index: number) => void
}

export function CbtSubjectTabs({
  subjects,
  activeSubjectIndex,
  subjectStats,
  onSelectSubject,
}: CbtSubjectTabsProps) {
  return (
    <div className="w-full border-b border-border bg-card px-4 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1 hidden sm:inline">
            Subjects:
          </span>

          {subjects.map((sub, idx) => {
            const isActive = idx === activeSubjectIndex
            const stat = subjectStats.find((s) => s.subjectId === sub.id)
            const answered = stat?.answeredCount || 0
            const total = sub.questions.length

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelectSubject(idx)}
                className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs scale-102"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
                }`}
              >
                <span>{sub.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md font-semibold ${
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {answered}/{total}
                </span>
              </button>
            )
          })}
        </div>

        <div className="text-right text-xs text-muted-foreground hidden md:block shrink-0">
          <span className="font-semibold text-foreground">
            {subjects[activeSubjectIndex]?.name}
          </span>{" "}
          Active
        </div>
      </div>
    </div>
  )
}

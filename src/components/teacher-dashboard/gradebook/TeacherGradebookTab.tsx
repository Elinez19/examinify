import {
  Download,
  Search,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTeacherGradebook } from "@/hooks/teacher-dashboard/useTeacherGradebook"
import type { ITeacherAssignedClass } from "@/types/teacher"

interface TeacherGradebookTabProps {
  assignedClasses: ITeacherAssignedClass[]
}

export function TeacherGradebookTab({ assignedClasses }: TeacherGradebookTabProps) {
  const {
    filteredRecords,
    selectedClass,
    setSelectedClass,
    selectedSubject,
    setSelectedSubject,
    searchQuery,
    setSearchQuery,
    updateScore,
    exportCsv,
    stats,
  } = useTeacherGradebook()

  // Find active assigned class
  const activeClassObj = assignedClasses.find((c) => c.className === selectedClass) || assignedClasses[0]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            Gradebook & Continuous Assessment Broadsheet
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Continuous Assessment (CA 40%) + Terminal Exam (60%) with WAEC Standard Grading.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={exportCsv}
          leftIcon={<Download className="size-3.5 text-primary" />}
          className="text-xs font-bold self-start sm:self-auto"
        >
          Export Broadsheet (CSV)
        </Button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
            Class Average
          </span>
          <p className="text-xl font-extrabold text-foreground mt-0.5">
            {stats.average}%
          </p>
          <span className="text-[10px] text-muted-foreground">Weighted composite score</span>
        </div>

        <div className="p-3.5 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
            Pass Rate
          </span>
          <p className="text-xl font-extrabold text-status-success mt-0.5">
            {stats.passRate}%
          </p>
          <span className="text-[10px] text-muted-foreground">Scored 40% & above (Pass)</span>
        </div>

        <div className="p-3.5 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
            Highest Mark
          </span>
          <p className="text-xl font-extrabold text-primary mt-0.5">
            {stats.highest}%
          </p>
          <span className="text-[10px] text-muted-foreground">Top Candidate in Cohort</span>
        </div>

        <div className="p-3.5 rounded-2xl border border-border bg-card shadow-xs">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
            At-Risk Students
          </span>
          <p
            className={`text-xl font-extrabold mt-0.5 ${
              stats.atRiskCount > 0 ? "text-destructive" : "text-status-success"
            }`}
          >
            {stats.atRiskCount}
          </p>
          <span className="text-[10px] text-muted-foreground">Needs Academic Intervention</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl border border-border bg-card shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          {/* Class Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-muted-foreground">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              aria-label="Filter by Class"
              className="h-9 px-3 rounded-xl border border-border bg-muted/30 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {assignedClasses.map((cls) => (
                <option key={cls.id} value={cls.className}>
                  {cls.className} ({cls.studentCount} students)
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-muted-foreground">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              aria-label="Filter by Subject"
              className="h-9 px-3 rounded-xl border border-border bg-muted/30 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {activeClassObj?.subjectsTaught.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate or grade..."
            className="w-full h-9 pl-8 pr-3 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Broadsheet Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-[11px] text-muted-foreground">
                <th className="py-3 px-4 sm:px-6">Candidate Details</th>
                <th className="py-3 px-3 text-center">Assignment (10%)</th>
                <th className="py-3 px-3 text-center">Quiz (10%)</th>
                <th className="py-3 px-3 text-center">Mid-Term (20%)</th>
                <th className="py-3 px-3 text-center bg-primary/5 font-extrabold text-primary">
                  Total CA (40%)
                </th>
                <th className="py-3 px-3 text-center">Terminal CBT (60%)</th>
                <th className="py-3 px-3 text-center font-extrabold text-foreground">
                  Grand Total (100%)
                </th>
                <th className="py-3 px-3 text-center">WAEC Grade</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredRecords.map((r) => {
                return (
                  <tr
                    key={r.studentId}
                    className={`hover:bg-muted/20 transition-colors ${
                      r.isAtRisk ? "bg-destructive/5" : ""
                    }`}
                  >
                    {/* Candidate */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground">
                          {r.studentName}
                        </span>
                        <p className="text-[10px] font-mono text-muted-foreground">
                          {r.registrationNumber}
                        </p>
                      </div>
                    </td>

                    {/* Assignment (10%) */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={r.assignmentScore}
                        onChange={(e) =>
                          updateScore(r.studentId, "assignmentScore", Number(e.target.value))
                        }
                        className="w-14 h-8 rounded-lg border border-border bg-card text-center text-xs font-bold font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary mx-auto"
                      />
                    </td>

                    {/* Quiz (10%) */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={r.quizScore}
                        onChange={(e) =>
                          updateScore(r.studentId, "quizScore", Number(e.target.value))
                        }
                        className="w-14 h-8 rounded-lg border border-border bg-card text-center text-xs font-bold font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary mx-auto"
                      />
                    </td>

                    {/* Mid-Term (20%) */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={r.midTermScore}
                        onChange={(e) =>
                          updateScore(r.studentId, "midTermScore", Number(e.target.value))
                        }
                        className="w-14 h-8 rounded-lg border border-border bg-card text-center text-xs font-bold font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary mx-auto"
                      />
                    </td>

                    {/* Total CA (40%) */}
                    <td className="py-3 px-3 text-center bg-primary/5">
                      <span className="text-xs font-extrabold text-primary font-mono">
                        {r.totalCaScore}
                      </span>
                    </td>

                    {/* Terminal CBT (60%) */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={60}
                        value={r.terminalExamScore}
                        onChange={(e) =>
                          updateScore(r.studentId, "terminalExamScore", Number(e.target.value))
                        }
                        className="w-16 h-8 rounded-lg border border-border bg-card text-center text-xs font-bold font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary mx-auto"
                      />
                    </td>

                    {/* Grand Total (100%) */}
                    <td className="py-3 px-3 text-center">
                      <span className="text-sm font-black text-foreground font-mono">
                        {r.grandTotal}%
                      </span>
                    </td>

                    {/* WAEC Grade */}
                    <td className="py-3 px-3 text-center">
                      <Badge
                        variant={
                          r.gradeLetter === "A1"
                            ? "success"
                            : r.isAtRisk
                            ? "destructive"
                            : "default"
                        }
                        className="text-xs font-extrabold px-2 py-0.5"
                      >
                        {r.gradeLetter}
                      </Badge>
                    </td>

                    {/* Remarks */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {r.isAtRisk && (
                          <AlertTriangle className="size-3.5 text-destructive shrink-0" />
                        )}
                        <span
                          className={`text-xs font-semibold ${
                            r.isAtRisk ? "text-destructive" : "text-muted-foreground"
                          }`}
                        >
                          {r.remarks}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

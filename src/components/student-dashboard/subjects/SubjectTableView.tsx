import {
  Search,
  BookOpen,
  Play,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { SubjectExamNotice } from "./SubjectExamNotice"
import { SubjectPagination } from "./SubjectPagination"
import type { ISubjectItem } from "@/types/student"

interface SubjectTableViewProps {
  subjects: ISubjectItem[]
  scheduledTodaySubjects?: ISubjectItem[]
  categories: string[]
  selectedCategory: string
  onSelectCategory: (cat: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onStartExam: (examId: string) => void
  // Checkbox selection props
  selectedSubjectIds: string[]
  onToggleSelectSubject: (subjectId: string, checked: boolean) => void
  onToggleSelectAll: (checked: boolean) => void
  onClearSelection: () => void
  // Pagination props
  currentPage: number
  pageSize: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function SubjectTableView({
  subjects,
  scheduledTodaySubjects = [],
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onStartExam,
  selectedSubjectIds,
  onToggleSelectSubject,
  onToggleSelectAll,
  onClearSelection,
  currentPage,
  pageSize,
  totalPages,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: SubjectTableViewProps) {
  const isAllSelected =
    subjects.length > 0 && subjects.every((s) => selectedSubjectIds.includes(s.id))
  const someSelected =
    subjects.some((s) => selectedSubjectIds.includes(s.id))
  const isIndeterminate = someSelected && !isAllSelected

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Enrolled Subjects & Examination Table
            </h1>
            <Badge variant="default" className="text-xs font-bold">
              {totalCount} Subjects
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            View all enrolled subjects, continuous assessment grades, and take scheduled CBT exams.
          </p>
        </div>

        {/* Quick Scheduled Count Badge */}
        {scheduledTodaySubjects.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto rounded-xl bg-primary/10 border border-primary/20 px-3.5 py-2">
            <Sparkles className="size-4 text-primary" />
            <span className="text-xs font-bold text-primary">
              {scheduledTodaySubjects.length} CBT Exams Scheduled Today
            </span>
          </div>
        )}
      </div>

      {/* Prominent Notice Banner if any subjects are scheduled today */}
      <SubjectExamNotice
        scheduledSubjects={scheduledTodaySubjects}
        onStartExam={onStartExam}
      />

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Instant Search Bar */}
        <div className="relative min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search subjects by name or code..."
            className="w-full h-9 rounded-xl border border-border bg-card pl-9 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
          />
        </div>
      </div>

      {/* Subjects Table Container */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header: Checkbox + Subject & Code + Progress + Grade + Schedule + Action */}
            <thead className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <tr>
                {/* Column 0: Checkbox header */}
                <th scope="col" className="py-3.5 pl-5 pr-2 w-10">
                  <div className="flex items-center">
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onCheckedChange={(val) => onToggleSelectAll(!!val)}
                      aria-label="Select all subjects on page"
                    />
                  </div>
                </th>
                <th scope="col" className="py-3.5 pl-2 pr-3">Subject & Code</th>
                <th scope="col" className="px-3 py-3.5">Syllabus Progress</th>
                <th scope="col" className="px-3 py-3.5">Assessment Grade</th>
                <th scope="col" className="px-3 py-3.5">Exam Schedule</th>
                <th scope="col" className="py-3.5 pl-3 pr-5 text-right">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-border">
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <BookOpen className="size-8 text-muted-foreground mx-auto stroke-1" />
                    <p className="mt-2 text-sm font-semibold text-foreground">No subjects found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Try clearing search filters to see all enrolled subjects.
                    </p>
                  </td>
                </tr>
              ) : (
                subjects.map((subject, idx) => {
                  const isScheduledToday = subject.examSchedule?.isScheduledToday
                  const isUpcoming = subject.examSchedule?.status === "upcoming"
                  const hasExamId = Boolean(subject.examSchedule?.examId)
                  const isSelected = selectedSubjectIds.includes(subject.id)

                  return (
                    <tr
                      key={subject.id}
                      className={cn(
                        "group transition-colors",
                        isSelected
                          ? "bg-primary/[0.07] hover:bg-primary/[0.10]"
                          : isScheduledToday
                          ? "bg-primary/[0.03] hover:bg-primary/[0.06]"
                          : idx % 2 === 0
                          ? "bg-card hover:bg-muted/30"
                          : "bg-muted/15 hover:bg-muted/40"
                      )}
                    >
                      {/* Column 0: Checkbox */}
                      <td className="py-3.5 pl-5 pr-2 w-10">
                        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(val) =>
                              onToggleSelectSubject(subject.id, !!val)
                            }
                            aria-label={`Select ${subject.name}`}
                          />
                        </div>
                      </td>

                      {/* Column 1: Subject Name & Code */}
                      <td className="py-3.5 pl-2 pr-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {subject.name}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {subject.code}
                          </span>
                        </div>
                      </td>

                      {/* Column 2: Syllabus Progress */}
                      <td className="px-3 py-3.5 whitespace-nowrap min-w-36">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground font-medium">Coverage</span>
                            <span className="font-bold text-foreground">{subject.syllabusProgress}%</span>
                          </div>
                          <Progress value={subject.syllabusProgress} className="h-1.5" />
                        </div>
                      </td>

                      {/* Column 3: Assessment Grade */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={
                              subject.currentGradeLetter.startsWith("A")
                                ? "success"
                                : "default"
                            }
                            className="text-[11px] font-bold px-2 py-0.5"
                          >
                            {subject.currentGradeLetter}
                          </Badge>
                          <span className="font-semibold text-muted-foreground text-xs">
                            ({subject.currentGradePercentage}%)
                          </span>
                        </div>
                      </td>

                      {/* Column 4: CBT Exam Schedule & Status */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        {isScheduledToday ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1.5 font-bold text-primary">
                              <span className="size-2 rounded-full bg-status-success animate-ping" />
                              <span>Scheduled Today</span>
                            </span>
                            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                              <Clock className="size-3 text-primary" />
                              {subject.examSchedule.scheduledTime}
                            </span>
                          </div>
                        ) : isUpcoming ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground">
                              <Calendar className="size-3.5 text-muted-foreground" />
                              <span>{subject.examSchedule.scheduledDate}</span>
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {subject.examSchedule.scheduledTime}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="size-3 text-muted-foreground/60" />
                            <span>No exam today</span>
                          </span>
                        )}
                      </td>

                      {/* Column 5: Action Button */}
                      <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                        {isScheduledToday && hasExamId ? (
                          <Button
                            variant="primary"
                            size="sm"
                            sheen
                            onClick={() => onStartExam(subject.examSchedule.examId!)}
                            className="text-xs font-bold shadow-xs hover:shadow-primary/20"
                            leftIcon={<Play className="size-3.5 fill-current" />}
                          >
                            Take CBT Exam
                          </Button>
                        ) : isUpcoming ? (
                          <Badge variant="outline" className="text-[11px] text-muted-foreground font-medium py-1">
                            Scheduled ({subject.examSchedule.scheduledDate.split(",")[0]})
                          </Badge>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">
                            Coursework Active
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Integrated Pagination Controls */}
        <SubjectPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          pageSize={pageSize}
          selectedCount={selectedSubjectIds.length}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          onClearSelection={onClearSelection}
        />
      </div>
    </div>
  )
}

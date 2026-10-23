import * as React from "react"
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { IClassStudentRosterItem, ITeacherAssignedClass } from "@/types/teacher"
import { MOCK_ALL_SECONDARY_STUDENTS } from "@/services/teacher-dashboard/mockTeacherData"

interface TeacherStudentsTabProps {
  students?: IClassStudentRosterItem[]
  assignedClasses: ITeacherAssignedClass[]
  onOpenStudentDrawer?: (student: IClassStudentRosterItem) => void
}

type SortField = "fullName" | "registrationNumber" | "assignedClass" | "attendanceRate" | "totalScore"
type SortOrder = "asc" | "desc"

export function TeacherStudentsTab({
  students = MOCK_ALL_SECONDARY_STUDENTS,
  assignedClasses,
  onOpenStudentDrawer,
}: TeacherStudentsTabProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedClass, setSelectedClass] = React.useState<string>("all")
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all")
  const [selectedGender, setSelectedGender] = React.useState<string>("all")

  // Sorting States
  const [sortField, setSortField] = React.useState<SortField>("fullName")
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("asc")

  // Pagination States
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  // Toggle or change sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  // Filtered and Sorted dataset
  const filteredAndSortedStudents = React.useMemo(() => {
    let result = [...students]

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.registrationNumber.toLowerCase().includes(q) ||
          s.parentEmail.toLowerCase().includes(q)
      )
    }

    // Class filter
    if (selectedClass !== "all") {
      result = result.filter((s) => s.assignedClass === selectedClass)
    }

    // Status filter
    if (selectedStatus !== "all") {
      result = result.filter((s) => s.performanceStatus === selectedStatus)
    }

    // Gender filter
    if (selectedGender !== "all") {
      result = result.filter((s) => s.gender === selectedGender)
    }

    // Sort
    result.sort((a, b) => {
      const valA: string | number = a[sortField] ?? ""
      const valB: string | number = b[sortField] ?? ""

      if (typeof valA === "string") {
        const comp = (valA as string).localeCompare(valB as string)
        return sortOrder === "asc" ? comp : -comp
      } else {
        const comp = (valA as number) - (valB as number)
        return sortOrder === "asc" ? comp : -comp
      }
    })

    return result
  }, [students, searchQuery, selectedClass, selectedStatus, selectedGender, sortField, sortOrder])

  // Pagination calculations (auto-clamped to valid range)
  const totalItems = filteredAndSortedStudents.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safeCurrentPage - 1) * pageSize
  const paginatedStudents = filteredAndSortedStudents.slice(startIndex, startIndex + pageSize)

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="size-3 text-muted-foreground/60 ml-1 inline-block" />
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="size-3 text-primary ml-1 inline-block" />
    ) : (
      <ArrowDown className="size-3 text-primary ml-1 inline-block" />
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Students Roster
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Filter, sort, and inspect enrolled pupils across your assigned teaching classes.
          </p>
        </div>

        <Badge variant="pill" className="text-xs font-bold gap-1.5 self-start sm:self-auto px-3.5 py-1.5">
          <Users className="size-3.5 text-primary" />
          <span>{totalItems} Students Enrolled</span>
        </Badge>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or reg no..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 h-10 text-xs rounded-xl bg-background"
            />
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full h-10 px-3 text-xs font-semibold rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              <option value="all">All Classes</option>
              {assignedClasses.map((cls) => (
                <option key={cls.id} value={cls.className}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full h-10 px-3 text-xs font-semibold rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Excelling">Excelling</option>
              <option value="Good Standing">Good Standing</option>
              <option value="Needs Attention">Needs Attention</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedGender}
              onChange={(e) => {
                setSelectedGender(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full h-10 px-3 text-xs font-semibold rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              <option value="all">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
        </div>

        {/* Active Filters Clear Button if any filter active */}
        {(searchQuery || selectedClass !== "all" || selectedStatus !== "all" || selectedGender !== "all") && (
          <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
            <span>
              Showing {filteredAndSortedStudents.length} of {students.length} matching students
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setSelectedClass("all")
                setSelectedStatus("all")
                setSelectedGender("all")
                setCurrentPage(1)
              }}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Paginated, Filterable, Sortable Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-[11px] text-muted-foreground select-none">
                <th
                  onClick={() => handleSort("registrationNumber")}
                  className="py-3.5 px-4 sm:px-6 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center">
                    <span>Reg Number</span>
                    {renderSortIndicator("registrationNumber")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("fullName")}
                  className="py-3.5 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center">
                    <span>Student Name</span>
                    {renderSortIndicator("fullName")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("assignedClass")}
                  className="py-3.5 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center">
                    <span>Class</span>
                    {renderSortIndicator("assignedClass")}
                  </div>
                </th>
                <th className="py-3.5 px-4">Gender</th>
                <th
                  onClick={() => handleSort("attendanceRate")}
                  className="py-3.5 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center">
                    <span>Attendance</span>
                    {renderSortIndicator("attendanceRate")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("totalScore")}
                  className="py-3.5 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center">
                    <span>Score / Grade</span>
                    {renderSortIndicator("totalScore")}
                  </div>
                </th>
                <th className="py-3.5 px-4">Performance</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Users className="size-8 text-muted-foreground/40" />
                      <span className="font-semibold text-sm">No students found matching your criteria.</span>
                      <span className="text-xs">Try adjusting your search query or active filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-[11px] font-semibold text-muted-foreground">
                      {student.registrationNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground text-xs group-hover:text-primary transition-colors">
                        {student.fullName}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {student.parentEmail}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="text-[11px] font-medium text-foreground">
                        {student.assignedClass || "SS 1 Explorers"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-medium">
                      {student.gender}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <span
                          className={
                            student.attendanceRate >= 90
                              ? "text-status-success"
                              : student.attendanceRate >= 80
                              ? "text-status-warning"
                              : "text-destructive"
                          }
                        >
                          {student.attendanceRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-foreground">{student.totalScore}</span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          ({student.currentGrade})
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          student.performanceStatus === "Excelling"
                            ? "success"
                            : student.performanceStatus === "Good Standing"
                            ? "primary"
                            : "destructive"
                        }
                        className="text-[10px] font-bold uppercase tracking-wider"
                      >
                        {student.performanceStatus}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {onOpenStudentDrawer && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onOpenStudentDrawer(student)}
                          className="h-8 px-2.5 text-xs font-semibold text-muted-foreground hover:text-primary"
                          leftIcon={<Eye className="size-3.5" />}
                        >
                          View
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-t border-border bg-muted/20 text-xs text-muted-foreground">
          {/* Page Sizing & Item Summary */}
          <div className="flex items-center gap-3">
            <span>
              Showing{" "}
              <strong className="text-foreground">
                {totalItems === 0 ? 0 : startIndex + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-foreground">
                {Math.min(startIndex + pageSize, totalItems)}
              </strong>{" "}
              of <strong className="text-foreground">{totalItems}</strong> students
            </span>

            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-[11px]">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="h-7 px-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
          </div>

          {/* Numbered Pagination Buttons */}
          <div className="flex items-center gap-1 self-center sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 p-0"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                type="button"
                variant={currentPage === pageNum ? "primary" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className="h-8 w-8 p-0 text-xs font-bold"
              >
                {pageNum}
              </Button>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 p-0"
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

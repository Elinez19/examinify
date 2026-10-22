import { useSubjectList } from "@/hooks/student-dashboard/useSubjectList"
import { SubjectTableView } from "./SubjectTableView"

interface SubjectListViewProps {
  onStartExam?: (examId: string) => void
}

export function SubjectListView({ onStartExam }: SubjectListViewProps) {
  const {
    subjects,
    scheduledTodaySubjects,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedSubjectIds,
    toggleSelectSubject,
    toggleSelectAll,
    clearSelection,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalCount,
  } = useSubjectList()

  const handleStartExam = (examId: string) => {
    if (onStartExam) {
      onStartExam(examId)
    } else {
      window.location.hash = `cbt/${examId}`
    }
  }

  return (
    <SubjectTableView
      subjects={subjects}
      scheduledTodaySubjects={scheduledTodaySubjects}
      categories={categories}
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onStartExam={handleStartExam}
      selectedSubjectIds={selectedSubjectIds}
      onToggleSelectSubject={toggleSelectSubject}
      onToggleSelectAll={toggleSelectAll}
      onClearSelection={clearSelection}
      currentPage={currentPage}
      pageSize={pageSize}
      totalPages={totalPages}
      totalCount={totalCount}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    />
  )
}

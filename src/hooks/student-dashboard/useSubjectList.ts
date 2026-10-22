import * as React from "react"
import type { ISubjectItem } from "@/types/student"
import { MOCK_SUBJECTS } from "@/services/student-dashboard/mockStudentData"

export function useSubjectList() {
  const [subjects, setSubjects] = React.useState<ISubjectItem[]>(MOCK_SUBJECTS)
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [activeSubjectId, setActiveSubjectId] = React.useState<string | null>(null)
  const [selectedSubjectIds, setSelectedSubjectIds] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(5)

  const categories = React.useMemo(() => {
    const list: string[] = ["All", "Core", "STEM", "Humanities", "Vocational"]
    return list
  }, [])

  const scheduledTodaySubjects = React.useMemo(() => {
    return subjects.filter((s) => s.examSchedule?.isScheduledToday)
  }, [subjects])

  const handleCategoryChange = React.useCallback((cat: string) => {
    setSelectedCategory(cat)
    setCurrentPage(1)
  }, [])

  const handleSearchChange = React.useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  const handlePageSizeChange = React.useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }, [])

  const filteredSubjects = React.useMemo(() => {
    return subjects.filter((subject) => {
      const matchesCategory =
        selectedCategory === "All" || subject.category === selectedCategory
      const matchesSearch =
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [subjects, selectedCategory, searchQuery])

  const totalCount = filteredSubjects.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const paginatedSubjects = React.useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize
    return filteredSubjects.slice(startIndex, startIndex + pageSize)
  }, [filteredSubjects, safeCurrentPage, pageSize])

  const activeSubject = React.useMemo(() => {
    if (!activeSubjectId) return null
    return subjects.find((s) => s.id === activeSubjectId) || null
  }, [subjects, activeSubjectId])

  const toggleSelectSubject = React.useCallback(
    (subjectId: string, checked?: boolean) => {
      setSelectedSubjectIds((prev) => {
        const isSelected = prev.includes(subjectId)
        const nextChecked = checked !== undefined ? checked : !isSelected
        if (nextChecked) {
          return isSelected ? prev : [...prev, subjectId]
        }
        return prev.filter((id) => id !== subjectId)
      })
    },
    []
  )

  const toggleSelectAll = React.useCallback(
    (checked: boolean) => {
      if (checked) {
        const pageIds = paginatedSubjects.map((s) => s.id)
        setSelectedSubjectIds((prev) => {
          const merged = new Set([...prev, ...pageIds])
          return Array.from(merged)
        })
      } else {
        const pageIds = new Set(paginatedSubjects.map((s) => s.id))
        setSelectedSubjectIds((prev) => prev.filter((id) => !pageIds.has(id)))
      }
    },
    [paginatedSubjects]
  )

  const clearSelection = React.useCallback(() => {
    setSelectedSubjectIds([])
  }, [])

  const toggleTopicCompletion = React.useCallback(
    (subjectId: string, topicId: string) => {
      setSubjects((prev) =>
        prev.map((sub) => {
          if (sub.id !== subjectId) return sub
          const updatedTopics = sub.topics.map((top) => {
            if (top.id !== topicId) return top
            return { ...top, isCompleted: !top.isCompleted }
          })
          const completedCount = updatedTopics.filter((t) => t.isCompleted).length
          const totalCount = updatedTopics.length
          const progress = Math.round((completedCount / (totalCount || 1)) * 100)

          return {
            ...sub,
            topics: updatedTopics,
            completedTopicsCount: completedCount,
            syllabusProgress: progress,
          }
        })
      )
    },
    []
  )

  return {
    subjects: paginatedSubjects,
    allFilteredSubjects: filteredSubjects,
    allSubjects: subjects,
    categories,
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    searchQuery,
    setSearchQuery: handleSearchChange,
    activeSubjectId,
    setActiveSubjectId,
    activeSubject,
    scheduledTodaySubjects,
    toggleTopicCompletion,
    // Selection state
    selectedSubjectIds,
    toggleSelectSubject,
    toggleSelectAll,
    clearSelection,
    // Pagination state
    currentPage: safeCurrentPage,
    setCurrentPage,
    pageSize,
    setPageSize: handlePageSizeChange,
    totalPages,
    totalCount,
  }
}

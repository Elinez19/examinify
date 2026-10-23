import * as React from "react"
import {
  MOCK_QUESTION_BANK,
  type IQuestionBankItem,
} from "@/services/teacher-dashboard/questionBankData"

interface UseQuestionBankOptions {
  initialCourse?: string
  availableQuestions?: IQuestionBankItem[]
  maxSelectable?: number
}

export function useQuestionBank({
  initialCourse,
  availableQuestions = MOCK_QUESTION_BANK,
  maxSelectable = 50,
}: UseQuestionBankOptions = {}) {
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [selectedCourse, setSelectedCourse] = React.useState<string>(() => {
    if (initialCourse && initialCourse.trim()) {
      const match = availableQuestions.some(
        (q) => q.course.toLowerCase() === initialCourse.toLowerCase()
      )
      if (match) return initialCourse
    }
    return "all"
  })
  const [selectedType, setSelectedType] = React.useState<string>("all")
  const [fromDate, setFromDate] = React.useState<string>("")
  const [toDate, setToDate] = React.useState<string>("")
  const [onlyWithImages, setOnlyWithImages] = React.useState<boolean>(false)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  // Distinct courses for the select dropdown
  const courses = React.useMemo(() => {
    const set = new Set<string>()
    availableQuestions.forEach((q) => {
      if (q.course) set.add(q.course)
    })
    return Array.from(set).sort()
  }, [availableQuestions])

  // Filtering engine
  const filteredQuestions = React.useMemo(() => {
    return availableQuestions.filter((item) => {
      // 1. Search text filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const promptMatch = item.prompt.toLowerCase().includes(query)
        const courseMatch = item.course.toLowerCase().includes(query)
        const examMatch = item.examTitle.toLowerCase().includes(query)
        const optionsMatch = item.options?.some((o) => o.text.toLowerCase().includes(query))
        if (!promptMatch && !courseMatch && !examMatch && !optionsMatch) {
          return false
        }
      }

      // 2. Course filter
      if (selectedCourse !== "all" && item.course.toLowerCase() !== selectedCourse.toLowerCase()) {
        return false
      }

      // 3. Question type filter
      if (selectedType !== "all" && item.type !== selectedType) {
        return false
      }

      // 4. Date range filter
      if (fromDate && item.publishedAt < fromDate) {
        return false
      }
      if (toDate && item.publishedAt > toDate) {
        return false
      }

      // 5. Only questions with images
      if (onlyWithImages && !item.imageUrl) {
        return false
      }

      return true
    })
  }, [
    availableQuestions,
    searchQuery,
    selectedCourse,
    selectedType,
    fromDate,
    toDate,
    onlyWithImages,
  ])

  // Toggle individual question selection
  const toggleQuestion = React.useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          if (next.size < maxSelectable) {
            next.add(id)
          }
        }
        return next
      })
    },
    [maxSelectable]
  )

  // Toggle select all visible
  const isAllSelected =
    filteredQuestions.length > 0 &&
    filteredQuestions.every((item) => selectedIds.has(item.id))

  const isIndeterminate =
    !isAllSelected && filteredQuestions.some((item) => selectedIds.has(item.id))

  const toggleSelectAll = React.useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (isAllSelected) {
        // Deselect all visible
        filteredQuestions.forEach((item) => next.delete(item.id))
      } else {
        // Select all visible up to maxSelectable
        for (const item of filteredQuestions) {
          if (next.size >= maxSelectable) break
          next.add(item.id)
        }
      }
      return next
    })
  }, [filteredQuestions, isAllSelected, maxSelectable])

  // Reset filters
  const resetFilters = React.useCallback(() => {
    setSearchQuery("")
    setSelectedCourse("all")
    setSelectedType("all")
    setFromDate("")
    setToDate("")
    setOnlyWithImages(false)
  }, [])

  // Clear selections
  const clearSelection = React.useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  // Selected questions array
  const selectedQuestions = React.useMemo(() => {
    return availableQuestions.filter((item) => selectedIds.has(item.id))
  }, [availableQuestions, selectedIds])

  return {
    searchQuery,
    setSearchQuery,
    selectedCourse,
    setSelectedCourse,
    selectedType,
    setSelectedType,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    onlyWithImages,
    setOnlyWithImages,
    courses,
    filteredQuestions,
    selectedIds,
    selectedQuestions,
    selectedCount: selectedIds.size,
    maxSelectable,
    isAllSelected,
    isIndeterminate,
    expandedId,
    setExpandedId,
    toggleQuestion,
    toggleSelectAll,
    resetFilters,
    clearSelection,
  }
}

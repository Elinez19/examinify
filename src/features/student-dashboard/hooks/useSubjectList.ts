import * as React from "react"
import type { ISubjectItem } from "../types/student"
import { MOCK_SUBJECTS } from "../services/mockStudentData"

export function useSubjectList() {
  const [subjects, setSubjects] = React.useState<ISubjectItem[]>(MOCK_SUBJECTS)
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [activeSubjectId, setActiveSubjectId] = React.useState<string | null>(null)

  const categories = React.useMemo(() => {
    const list: string[] = ["All", "Core", "STEM", "Humanities"]
    return list
  }, [])

  const filteredSubjects = React.useMemo(() => {
    return subjects.filter((subject) => {
      const matchesCategory =
        selectedCategory === "All" || subject.category === selectedCategory
      const matchesSearch =
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [subjects, selectedCategory, searchQuery])

  const activeSubject = React.useMemo(() => {
    if (!activeSubjectId) return null
    return subjects.find((s) => s.id === activeSubjectId) || null
  }, [subjects, activeSubjectId])

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
    subjects: filteredSubjects,
    allSubjects: subjects,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    activeSubjectId,
    setActiveSubjectId,
    activeSubject,
    toggleTopicCompletion,
  }
}

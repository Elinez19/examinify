import * as React from "react"
import type { IGradebookRecord } from "@/types/teacher"
import { MOCK_SS1_GRADEBOOK } from "@/services/teacher-dashboard/mockTeacherData"
import { computeWaecGrade } from "@/services/teacher-dashboard/teacher.service"

export function useTeacherGradebook() {
  const [records, setRecords] = React.useState<IGradebookRecord[]>(MOCK_SS1_GRADEBOOK)
  const [selectedClass, setSelectedClass] = React.useState<string>("SS 1 Explorers")
  const [selectedSubject, setSelectedSubject] = React.useState<string>("Mathematics")
  const [searchQuery, setSearchQuery] = React.useState<string>("")

  // Filter records by search
  const filteredRecords = React.useMemo(() => {
    if (!searchQuery.trim()) return records
    const q = searchQuery.toLowerCase()
    return records.filter(
      (r) =>
        r.studentName.toLowerCase().includes(q) ||
        r.registrationNumber.toLowerCase().includes(q) ||
        r.gradeLetter.toLowerCase().includes(q)
    )
  }, [records, searchQuery])

  // Update a single score field
  const updateScore = React.useCallback(
    (
      studentId: string,
      field: "assignmentScore" | "quizScore" | "midTermScore" | "terminalExamScore",
      rawVal: number
    ) => {
      setRecords((prev) =>
        prev.map((r) => {
          if (r.studentId !== studentId) return r

          // Max constraints
          let clamped = Math.max(0, rawVal || 0)
          if (field === "assignmentScore" || field === "quizScore") {
            clamped = Math.min(10, clamped)
          } else if (field === "midTermScore") {
            clamped = Math.min(20, clamped)
          } else if (field === "terminalExamScore") {
            clamped = Math.min(60, clamped)
          }

          const updatedRecord = { ...r, [field]: clamped }

          // Recompute CA (Assignment + Quiz + MidTerm = max 40)
          const totalCa =
            updatedRecord.assignmentScore +
            updatedRecord.quizScore +
            updatedRecord.midTermScore

          // Recompute Grand Total (CA 40 + Terminal 60 = max 100)
          const grandTotal = totalCa + updatedRecord.terminalExamScore

          // Recompute WAEC letter and remarks
          const { gradeLetter, remarks, isAtRisk } = computeWaecGrade(grandTotal)

          return {
            ...updatedRecord,
            totalCaScore: totalCa,
            grandTotal,
            gradeLetter,
            remarks,
            isAtRisk,
          }
        })
      )
    },
    []
  )

  // CSV Export
  const exportCsv = React.useCallback(() => {
    const headers = [
      "Registration Number",
      "Student Name",
      "Assignment (10%)",
      "Quiz (10%)",
      "Mid-Term (20%)",
      "Total CA (40%)",
      "Terminal Exam (60%)",
      "Grand Total (100%)",
      "WAEC Grade",
      "Remarks",
    ]

    const rows = records.map((r) => [
      `"${r.registrationNumber}"`,
      `"${r.studentName}"`,
      r.assignmentScore,
      r.quizScore,
      r.midTermScore,
      r.totalCaScore,
      r.terminalExamScore,
      r.grandTotal,
      r.gradeLetter,
      `"${r.remarks}"`,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `Examinify_Broadsheet_${selectedClass.replace(/\s+/g, "_")}_${selectedSubject}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [records, selectedClass, selectedSubject])

  // Summary statistics
  const stats = React.useMemo(() => {
    const total = records.length
    if (total === 0) return { average: 0, highest: 0, passRate: 0, atRiskCount: 0 }

    const sum = records.reduce((acc, r) => acc + r.grandTotal, 0)
    const highest = Math.max(...records.map((r) => r.grandTotal))
    const passed = records.filter((r) => r.grandTotal >= 40).length
    const atRiskCount = records.filter((r) => r.isAtRisk).length

    return {
      average: Math.round((sum / total) * 10) / 10,
      highest,
      passRate: Math.round((passed / total) * 100),
      atRiskCount,
    }
  }, [records])

  return {
    records,
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
  }
}

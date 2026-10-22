import * as React from "react"
import type { IStudentProfile } from "../types/student"
import { MOCK_STUDENT_PROFILE } from "../services/mockStudentData"

export function useStudentProfile() {
  const [profile, setProfile] = React.useState<IStudentProfile>(MOCK_STUDENT_PROFILE)
  const [isEditing, setIsEditing] = React.useState(false)
  const [saveSuccess, setSaveSuccess] = React.useState(false)

  const updateProfileField = React.useCallback(
    <K extends keyof IStudentProfile>(key: K, value: IStudentProfile[K]) => {
      setProfile((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const updateGuardianField = React.useCallback(
    (field: keyof IStudentProfile["guardian"], value: string) => {
      setProfile((prev) => ({
        ...prev,
        guardian: {
          ...prev.guardian,
          [field]: value,
        },
      }))
    },
    []
  )

  const handleSaveProfile = React.useCallback(() => {
    setIsEditing(false)
    setSaveSuccess(true)
    const timer = setTimeout(() => setSaveSuccess(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return {
    profile,
    isEditing,
    setIsEditing,
    saveSuccess,
    updateProfileField,
    updateGuardianField,
    handleSaveProfile,
  }
}

export type UserRole = "student" | "teacher" | "examiner" | "school_admin"

export type AuthMode = "signin" | "signup" | "forgot-password" | "reset-success"

export interface SignInFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface SignUpFormData {
  fullName: string
  email: string
  role: UserRole
  institutionName?: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

export interface ForgotPasswordFormData {
  email: string
}

export interface AuthErrors {
  [key: string]: string | undefined
}

export interface GoogleAuthUser {
  id: string
  email: string
  name: string
  picture?: string
  role: UserRole
}

export interface DemoAccount {
  role: UserRole
  label: string
  name: string
  email: string
  password: string
  description: string
  badge: string
}


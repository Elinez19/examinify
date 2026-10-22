import * as React from "react"
import type {
  AuthMode,
  SignInFormData,
  SignUpFormData,
  ForgotPasswordFormData,
  AuthErrors,
  UserRole,
  DemoAccount,
} from "../types/auth"

interface UseAuthFlowOptions {
  initialMode?: AuthMode
  onSuccess?: (user: { email: string; name?: string; role?: UserRole }) => void
}

export function useAuthFlow({
  initialMode = "signin",
  onSuccess,
}: UseAuthFlowOptions = {}) {
  const [mode, setMode] = React.useState<AuthMode>(initialMode)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [feedbackMessage, setFeedbackMessage] = React.useState<{
    type: "success" | "error" | "info"
    text: string
  } | null>(null)

  // Password visibility state
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  // Resend countdown for reset password
  const [resendCooldown, setResendCooldown] = React.useState(0)

  // Sign In Form State
  const [signInData, setSignInData] = React.useState<SignInFormData>({
    email: "",
    password: "",
    rememberMe: true,
  })

  // Sign Up Form State
  const [signUpData, setSignUpData] = React.useState<SignUpFormData>({
    fullName: "",
    email: "",
    role: "student",
    institutionName: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  // Forgot Password Form State
  const [forgotPasswordData, setForgotPasswordData] =
    React.useState<ForgotPasswordFormData>({
      email: "",
    })

  // Errors state
  const [errors, setErrors] = React.useState<AuthErrors>({})

  // Clear errors when mode changes
  const switchMode = React.useCallback((newMode: AuthMode) => {
    setMode(newMode)
    setErrors({})
    setFeedbackMessage(null)
  }, [])

  // Email validator
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  }

  // Update SignIn form
  const updateSignInField = <K extends keyof SignInFormData>(
    field: K,
    value: SignInFormData[K]
  ) => {
    setSignInData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Update SignUp form
  const updateSignUpField = <K extends keyof SignUpFormData>(
    field: K,
    value: SignUpFormData[K]
  ) => {
    setSignUpData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Update Forgot Password form
  const updateForgotPasswordEmail = (email: string) => {
    setForgotPasswordData({ email })
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }))
    }
  }

  // Google OAuth flow handler
  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true)
    setFeedbackMessage(null)
    setErrors({})

    try {
      // Simulate OAuth redirect or popup handshake delay
      await new Promise((resolve) => setTimeout(resolve, 1200))
      
      const mockGoogleUser = {
        email: "student@school.edu.ng",
        name: "Amina Adeleke",
        role: "student" as UserRole,
      }

      setFeedbackMessage({
        type: "success",
        text: `Connected with Google as Student (${mockGoogleUser.email}). Redirecting to dashboard...`,
      })

      if (onSuccess) {
        onSuccess(mockGoogleUser)
      }
    } catch {
      setFeedbackMessage({
        type: "error",
        text: "Google OAuth handshake timed out. Please try again.",
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  // Sign In submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackMessage(null)

    const newErrors: AuthErrors = {}
    if (!signInData.email.trim()) {
      newErrors.email = "Email address is required."
    } else if (!isValidEmail(signInData.email)) {
      newErrors.email = "Please enter a valid academic or personal email."
    }

    if (!signInData.password) {
      newErrors.password = "Password is required."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 150))
      setFeedbackMessage({
        type: "success",
        text: "Sign in successful! Preparing candidate workstation...",
      })

      if (onSuccess) {
        onSuccess({
          email: signInData.email,
        })
      }
    } catch {
      setFeedbackMessage({
        type: "error",
        text: "Invalid email or password. Please verify your credentials.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Sign Up submit
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackMessage(null)

    const newErrors: AuthErrors = {}
    if (!signUpData.fullName.trim()) {
      newErrors.fullName = "Full legal name is required for exam identification."
    }

    if (!signUpData.email.trim()) {
      newErrors.email = "Email address is required."
    } else if (!isValidEmail(signUpData.email)) {
      newErrors.email = "Please enter a valid email address."
    }

    if (!signUpData.password) {
      newErrors.password = "Password is required."
    } else if (signUpData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long."
    }

    if (!signUpData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required."
    } else if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match."
    }

    if (!signUpData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Examination Terms & Code of Conduct."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setFeedbackMessage({
        type: "success",
        text: "Student account successfully created! Directing to candidate dashboard...",
      })

      if (onSuccess) {
        onSuccess({
          email: signUpData.email,
          name: signUpData.fullName,
          role: "student",
        })
      }
    } catch {
      setFeedbackMessage({
        type: "error",
        text: "Registration failed. Please check your details and try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Forgot Password submit
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackMessage(null)

    const newErrors: AuthErrors = {}
    if (!forgotPasswordData.email.trim()) {
      newErrors.email = "Please enter your registered email address."
    } else if (!isValidEmail(forgotPasswordData.email)) {
      newErrors.email = "Please enter a valid email address."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setMode("reset-success")
      setResendCooldown(45)
    } catch {
      setFeedbackMessage({
        type: "error",
        text: "Unable to process password reset request. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Resend reset email countdown timer
  React.useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleResendResetEmail = async () => {
    if (resendCooldown > 0) return
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      setResendCooldown(45)
      setFeedbackMessage({
        type: "success",
        text: `A new reset link was sent to ${forgotPasswordData.email}.`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 1-Click Demo Login
  const handleDemoLogin = (account: DemoAccount) => {
    setSignInData({
      email: account.email,
      password: account.password,
      rememberMe: true,
    })
    setErrors({})
    setFeedbackMessage({
      type: "success",
      text: `Authenticating as Demo ${account.label} (${account.name}). Directing to workstation...`,
    })

    if (onSuccess) {
      onSuccess({
        email: account.email,
        name: account.name,
        role: account.role,
      })
    }
  }

  // Pre-fill demo credentials into inputs
  const handleFillDemoCredentials = (account: DemoAccount) => {
    setSignInData({
      email: account.email,
      password: account.password,
      rememberMe: true,
    })
    setErrors({})
    setFeedbackMessage({
      type: "info",
      text: `Loaded demo credentials for ${account.name} (${account.label}). Click "Sign in" to continue.`,
    })
  }

  return {
    mode,
    switchMode,
    isSubmitting,
    isGoogleLoading,
    feedbackMessage,
    errors,
    showPassword,
    toggleShowPassword: () => setShowPassword((p) => !p),
    showConfirmPassword,
    toggleShowConfirmPassword: () => setShowConfirmPassword((p) => !p),
    resendCooldown,
    signInData,
    updateSignInField,
    handleSignInSubmit,
    handleDemoLogin,
    handleFillDemoCredentials,
    signUpData,
    updateSignUpField,
    handleSignUpSubmit,
    forgotPasswordData,
    updateForgotPasswordEmail,
    handleForgotPasswordSubmit,
    handleResendResetEmail,
    handleGoogleAuth,
  }
}

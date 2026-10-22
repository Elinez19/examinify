import * as React from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"

interface PasswordInputFieldProps {
  id: string
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  required?: boolean
  showStrengthMeter?: boolean
  showToggle?: boolean
  autoComplete?: string
  disabled?: boolean
}

export function PasswordInputField({
  id,
  label = "Password",
  value,
  onChange,
  placeholder = "••••••••",
  error,
  required = false,
  showStrengthMeter = false,
  autoComplete = "current-password",
  disabled = false,
}: PasswordInputFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  // Calculate password strength for registration
  const strength = React.useMemo(() => {
    if (!value) return 0
    let score = 0
    if (value.length >= 8) score += 1
    if (/[A-Z]/.test(value)) score += 1
    if (/[0-9]/.test(value)) score += 1
    if (/[^A-Za-z0-9]/.test(value)) score += 1
    return score // 0 to 4
  }, [value])

  const strengthMeta = React.useMemo(() => {
    switch (strength) {
      case 1:
        return { label: "Weak", color: "bg-destructive text-destructive" }
      case 2:
        return { label: "Fair", color: "bg-status-warning text-status-warning" }
      case 3:
        return { label: "Good", color: "bg-status-info text-status-info" }
      case 4:
        return { label: "Strong", color: "bg-status-success text-status-success" }
      default:
        return { label: "Too short", color: "bg-muted text-muted-foreground" }
    }
  }, [strength])

  return (
    <FormItem error={!!error}>
      <FormLabel htmlFor={id} required={required} error={!!error}>
        {label}
      </FormLabel>
      <FormControl error={!!error}>
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          error={!!error}
          disabled={disabled}
          autoComplete={autoComplete}
          leftIcon={<Lock className="size-4 text-muted-foreground" />}
          rightAction={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          }
        />
      </FormControl>

      {/* Optional Password Strength Indicator */}
      {showStrengthMeter && value.length > 0 && (
        <div className="mt-1 flex flex-col gap-1.5 animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  step <= strength
                    ? strengthMeta.color.split(" ")[0]
                    : "bg-muted"
                )}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Strength:</span>
            <span className={cn("font-semibold", strengthMeta.color.split(" ")[1])}>
              {strengthMeta.label}
            </span>
          </div>
        </div>
      )}

      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  )
}

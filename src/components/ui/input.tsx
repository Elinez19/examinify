import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

export interface InputProps extends InputPrimitive.Props {
  error?: boolean
  leftIcon?: React.ReactNode
  rightAction?: React.ReactNode
}

export function Input({
  className,
  type,
  error,
  leftIcon,
  rightAction,
  ...props
}: InputProps) {
  if (leftIcon || rightAction) {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <InputPrimitive
          type={type}
          data-slot="input"
          data-error={error ? "true" : undefined}
          className={cn(
            "flex h-11 w-full rounded-xl border border-input bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-xs transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-10",
            rightAction && "pr-10",
            error && "border-destructive text-destructive focus-visible:ring-destructive focus-visible:border-destructive",
            className
          )}
          {...props}
        />
        {rightAction && (
          <div className="absolute right-2.5 flex items-center justify-center">
            {rightAction}
          </div>
        )}
      </div>
    )
  }

  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-error={error ? "true" : undefined}
      className={cn(
        "flex h-11 w-full rounded-xl border border-input bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-xs transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive text-destructive focus-visible:ring-destructive focus-visible:border-destructive",
        className
      )}
      {...props}
    />
  )
}

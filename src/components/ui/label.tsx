import * as React from "react"
import { cn } from "@/lib/utils"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        data-slot="label"
        className={cn(
          "text-sm font-semibold leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1 select-none",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {required && (
          <span className="text-destructive font-bold text-xs" title="Required field">
            *
          </span>
        )}
      </label>
    )
  }
)
Label.displayName = "Label"

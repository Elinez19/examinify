import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: boolean
}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="form-item"
        data-error={error ? "true" : undefined}
        className={cn("flex flex-col gap-1.5 w-full", className)}
        {...props}
      />
    )
  }
)
FormItem.displayName = "FormItem"

export interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  error?: boolean
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <Label
        ref={ref}
        data-slot="form-label"
        className={cn(error && "text-destructive", className)}
        {...props}
      />
    )
  }
)
FormLabel.displayName = "FormLabel"

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: boolean
}

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="form-control"
        className={cn("relative w-full", className)}
        {...props}
      />
    )
  }
)
FormControl.displayName = "FormControl"

export type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      data-slot="form-description"
      className={cn("text-xs text-muted-foreground leading-normal", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

export interface FormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ className, children, ...props }, ref) => {
  if (!children) return null

  return (
    <p
      ref={ref}
      data-slot="form-message"
      role="alert"
      className={cn(
        "text-xs font-medium text-destructive animate-in fade-in duration-150 flex items-center gap-1",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

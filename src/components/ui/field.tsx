import { Field as FieldPrimitive } from "@base-ui/react/field"
import { cn } from "@/lib/utils"

export function FieldRoot({
  className,
  ...props
}: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root
      data-slot="field-root"
      className={cn("flex flex-col gap-1.5 w-full", className)}
      {...props}
    />
  )
}

export function FieldLabel({
  className,
  ...props
}: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        "text-sm font-semibold leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none",
        className
      )}
      {...props}
    />
  )
}

export function FieldDescription({
  className,
  ...props
}: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn("text-xs text-muted-foreground leading-normal", className)}
      {...props}
    />
  )
}

export function FieldError({
  className,
  ...props
}: FieldPrimitive.Error.Props) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      className={cn("text-xs font-medium text-destructive animate-in fade-in duration-150 flex items-center gap-1", className)}
      {...props}
    />
  )
}

export function FieldControl({
  className,
  ...props
}: FieldPrimitive.Control.Props) {
  return (
    <FieldPrimitive.Control
      data-slot="field-control"
      className={cn("relative w-full", className)}
      {...props}
    />
  )
}

export {
  FieldRoot as Field,
}

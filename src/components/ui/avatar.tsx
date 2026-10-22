import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "xl"
}

const sizeClasses = {
  sm: "size-8 text-xs",
  default: "size-10 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-xl font-bold",
}

export function Avatar({
  className,
  size = "default",
  ...props
}: AvatarProps) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full border border-border bg-muted",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void
}

export function AvatarImage({
  className,
  src,
  alt = "",
  onError,
  ...props
}: AvatarImageProps) {
  const [hasError, setHasError] = React.useState(false)

  if (hasError || !src) {
    return null
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={(e) => {
        setHasError(true)
        if (onError) onError(e)
      }}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function AvatarFallback({
  className,
  children,
  ...props
}: AvatarFallbackProps) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "flex h-full w-full items-center justify-center font-semibold text-muted-foreground select-none uppercase",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

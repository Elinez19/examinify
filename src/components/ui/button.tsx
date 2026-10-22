import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 active:translate-y-px active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/25",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/25",
        outline:
          "border border-border bg-card text-foreground hover:bg-muted hover:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-muted hover:text-foreground",
        destructive:
          "bg-destructive text-primary-foreground hover:bg-destructive/90 shadow-sm shadow-destructive/25",
        neutral:
          "bg-brand-navy text-brand-navy-foreground hover:bg-brand-navy/90 border border-brand-navy/80",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5 rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-10 px-4 text-sm gap-2 rounded-xl [&_svg:not([class*='size-'])]:size-4",
        lg: "h-12 px-6 text-base gap-2.5 rounded-xl [&_svg:not([class*='size-'])]:size-5",
        xl: "h-14 px-8 text-base font-semibold gap-3 rounded-2xl [&_svg:not([class*='size-'])]:size-5",
        icon: "size-10 rounded-xl p-0 [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-8 rounded-lg p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12 rounded-xl p-0 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  sheen?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

function Button({
  className,
  variant = "default",
  size = "default",
  sheen = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size }),
        sheen && "fancy-button-sheen",
        className
      )}
      {...props}
    >
      {leftIcon && (
        <span className="relative z-10 inline-flex shrink-0 items-center justify-center">
          {leftIcon}
        </span>
      )}
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
      {rightIcon && (
        <span className="relative z-10 inline-flex shrink-0 items-center justify-center">
          {rightIcon}
        </span>
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }

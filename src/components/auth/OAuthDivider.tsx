import { Separator } from "@/components/ui/separator"

interface OAuthDividerProps {
  label?: string
}

export function OAuthDivider({ label = "Or continue with email" }: OAuthDividerProps) {
  return (
    <div className="relative my-5 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full" />
      </div>
      <span className="relative z-10 bg-card px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground select-none">
        {label}
      </span>
    </div>
  )
}

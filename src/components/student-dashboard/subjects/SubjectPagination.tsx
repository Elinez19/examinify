import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckSquare,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SubjectPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  selectedCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onClearSelection: () => void
}

export function SubjectPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  selectedCount,
  onPageChange,
  onPageSizeChange,
  onClearSelection,
}: SubjectPaginationProps) {
  if (totalItems === 0) return null

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  // Generate page numbers to display (sliding window around current page)
  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      let start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisible - 1)

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
      }

      for (let i = start; i <= end; i++) pages.push(i)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()
  const pageSizeOptions = [5, 10, 15]

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3.5 border-t border-border bg-card/60">
      {/* Left: Summary Info and Selected Count */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {selectedCount > 0 ? (
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-[11px] font-semibold gap-1 px-2.5 py-0.5">
              <CheckSquare className="size-3" />
              <span>{selectedCount} selected</span>
            </Badge>
            <button
              type="button"
              onClick={onClearSelection}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
            >
              <X className="size-3" />
              <span>Clear</span>
            </button>
          </div>
        ) : (
          <span>
            Showing <strong className="font-bold text-foreground">{startItem}</strong> to{" "}
            <strong className="font-bold text-foreground">{endItem}</strong> of{" "}
            <strong className="font-bold text-foreground">{totalItems}</strong> subjects
          </span>
        )}

        {/* Rows per page selector */}
        <div className="hidden lg:flex items-center gap-1.5 ml-3 pl-3 border-l border-border">
          <span className="text-[11px] text-muted-foreground">Rows per page:</span>
          <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/30">
            {pageSizeOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onPageSizeChange(opt)}
                className={cn(
                  "px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer",
                  pageSize === opt
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Page Navigation Controls */}
      <div className="flex items-center gap-1.5 self-center sm:self-auto">
        {/* First Page */}
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="First page"
          className="size-7"
        >
          <ChevronsLeft className="size-3.5" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="size-7"
        >
          <ChevronLeft className="size-3.5" />
        </Button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p) => {
            const isActive = p === currentPage
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={cn(
                  "size-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                    : "border border-border bg-card text-foreground hover:bg-muted"
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Page ${p}`}
              >
                {p}
              </button>
            )
          })}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="size-7"
        >
          <ChevronRight className="size-3.5" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Last page"
          className="size-7"
        >
          <ChevronsRight className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

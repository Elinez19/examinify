import * as React from "react"
import { X, Sparkles, AlertCircle, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BulkQuestionImporterModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (rawText: string) => { success: boolean; count: number; errors: string[] }
}

const SAMPLE_BULK_TEXT = `1. What is the value of x if 3x - 7 = 14?
A) 5
B) 7
C) 9
D) 12
Answer: B
Explanation: 3x = 14 + 7 = 21, therefore x = 7.

2. What is the SI unit of electric resistance?
A) Volt
B) Ampere
C) Ohm
D) Watt
Answer: C

3. Simplify: (2a^2) * (3a^3)
A) 5a^5
B) 6a^5
C) 6a^6
D) 5a^6
Answer: B`

export function BulkQuestionImporterModal({
  isOpen,
  onClose,
  onImport,
}: BulkQuestionImporterModalProps) {
  const [text, setText] = React.useState("")
  const [feedback, setFeedback] = React.useState<{
    success?: boolean
    count?: number
    errors?: string[]
  } | null>(null)

  if (!isOpen) return null

  const handlePasteSample = () => {
    setText(SAMPLE_BULK_TEXT)
    setFeedback(null)
  }

  const handleRunImport = () => {
    const res = onImport(text)
    if (res.success) {
      setText("")
      setFeedback(null)
      onClose()
    } else {
      setFeedback(res)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border p-6 space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-foreground">
                Smart Bulk Question Importer
              </h2>
              <p className="text-xs text-muted-foreground">
                Paste questions directly from Word, Google Docs, or PDF past papers.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Format Guidance */}
        <div className="rounded-xl border border-border bg-muted/30 p-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground">Expected Format Guide:</span>
            <button
              type="button"
              onClick={handlePasteSample}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Insert Sample Questions
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Start questions with <code className="text-foreground">1.</code>, options with{" "}
            <code className="text-foreground">A)</code> to <code className="text-foreground">D)</code>,
            and designated answer with <code className="text-foreground">Answer: B</code>.
          </p>
        </div>

        {/* Textarea */}
        <div className="space-y-1.5">
          <textarea
            rows={10}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if (feedback) setFeedback(null)
            }}
            placeholder={`1. Question prompt goes here...\nA) Option A\nB) Option B\nC) Option C\nD) Option D\nAnswer: B`}
            className="w-full rounded-xl border border-border bg-card p-3.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none"
          />
        </div>

        {/* Error Feedback */}
        {feedback && !feedback.success && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 flex items-start gap-2 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Could not parse questions:</span>
              <ul className="list-disc list-inside text-[11px]">
                {feedback.errors?.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs font-semibold"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            sheen
            disabled={!text.trim()}
            onClick={handleRunImport}
            leftIcon={<UploadCloud className="size-4" />}
            className="text-xs font-bold"
          >
            Parse & Import Questions
          </Button>
        </div>
      </div>
    </div>
  )
}

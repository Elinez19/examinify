import * as React from "react"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export interface ExamSettingsStepProps {
  // Results & Visibility
  autoPublishResults: boolean
  onChangeAutoPublishResults: (val: boolean) => void
  showStudentFeedback: boolean
  onChangeShowStudentFeedback: (val: boolean) => void
  showCorrectAnswers: boolean
  onChangeShowCorrectAnswers: (val: boolean) => void

  // Remark Requests
  allowRemarkRequests: boolean
  onChangeAllowRemarkRequests: (val: boolean) => void
  remarkRequestWindowDays: number
  onChangeRemarkRequestWindowDays: (val: number) => void

  // Exam Integrity
  maxTabSwitches: number
  onChangeMaxTabSwitches: (val: number) => void
  allowBackwardNavigation: boolean
  onChangeAllowBackwardNavigation: (val: boolean) => void
  randomizeOptions: boolean
  onChangeRandomizeOptions: (val: boolean) => void

  // Live Monitoring
  enableLiveMonitoring: boolean
  onChangeEnableLiveMonitoring: (val: boolean) => void

  // Question Bank
  enableQuestionBank: boolean
  onChangeEnableQuestionBank: (val: boolean) => void

  // Navigation
  onPrevious: () => void
  onNext: () => void
}

export function ExamSettingsStep({
  autoPublishResults,
  onChangeAutoPublishResults,
  showStudentFeedback,
  onChangeShowStudentFeedback,
  showCorrectAnswers,
  onChangeShowCorrectAnswers,
  allowRemarkRequests,
  onChangeAllowRemarkRequests,
  remarkRequestWindowDays,
  onChangeRemarkRequestWindowDays,
  maxTabSwitches,
  onChangeMaxTabSwitches,
  allowBackwardNavigation,
  onChangeAllowBackwardNavigation,
  randomizeOptions,
  onChangeRandomizeOptions,
  enableLiveMonitoring,
  onChangeEnableLiveMonitoring,
  enableQuestionBank,
  onChangeEnableQuestionBank,
  onPrevious,
  onNext,
}: ExamSettingsStepProps) {
  return (
    <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
      {/* Title & Description Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Exam Settings</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Configure how the exam behaves for students and how results are handled.
        </p>
      </div>

      {/* SECTION 1: RESULTS & VISIBILITY */}
      <div className="space-y-4 pt-2">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          RESULTS &amp; VISIBILITY
        </h3>

        <div className="space-y-4">
          {/* Auto-Publish Results */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5 max-w-xl">
              <span className="text-xs sm:text-sm font-semibold text-foreground block">
                Auto-Publish Results
              </span>
              <p className="text-xs text-muted-foreground">
                Automatically approve results as soon as AI grading is complete.
              </p>
            </div>
            <Switch
              checked={autoPublishResults}
              onCheckedChange={onChangeAutoPublishResults}
              aria-label="Auto-Publish Results"
            />
          </div>

          {/* Show Student Feedback */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5 max-w-xl">
              <span className="text-xs sm:text-sm font-semibold text-foreground block">
                Show Student Feedback
              </span>
              <p className="text-xs text-muted-foreground">
                Allow students to see AI-generated feedback on their answers.
              </p>
            </div>
            <Switch
              checked={showStudentFeedback}
              onCheckedChange={onChangeShowStudentFeedback}
              aria-label="Show Student Feedback"
            />
          </div>

          {/* Show Correct Answers */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5 max-w-xl">
              <span className="text-xs sm:text-sm font-semibold text-foreground block">
                Show Correct Answers
              </span>
              <p className="text-xs text-muted-foreground">
                Students can see the model answers after completion.
              </p>
            </div>
            <Switch
              checked={showCorrectAnswers}
              onCheckedChange={onChangeShowCorrectAnswers}
              aria-label="Show Correct Answers"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border my-6" />

      {/* SECTION 2: REMARK REQUESTS */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          REMARK REQUESTS
        </h3>

        <div className="space-y-4">
          {/* Allow Remark Requests */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5 max-w-xl">
              <span className="text-xs sm:text-sm font-semibold text-foreground block">
                Allow Remark Requests
              </span>
              <p className="text-xs text-muted-foreground">
                Students can ask you to re-mark specific questions once results are published.
              </p>
            </div>
            <Switch
              checked={allowRemarkRequests}
              onCheckedChange={onChangeAllowRemarkRequests}
              aria-label="Allow Remark Requests"
            />
          </div>

          {/* Request Window (Days) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5 max-w-md">
              <span className="text-xs sm:text-sm font-semibold text-foreground block">
                Request Window (Days)
              </span>
              <p className="text-xs text-muted-foreground">
                How long after results are published students can request a remark (1–5 days).
              </p>
            </div>
            <div className="w-full sm:w-64">
              <Input
                type="number"
                min={1}
                max={5}
                value={remarkRequestWindowDays || ""}
                onChange={(e) =>
                  onChangeRemarkRequestWindowDays(
                    Math.max(1, Math.min(5, Number(e.target.value) || 1))
                  )
                }
                className="h-10 text-xs sm:text-sm font-semibold rounded-xl bg-background border-border text-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border my-6" />

      {/* SECTION 3: EXAM INTEGRITY */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          EXAM INTEGRITY
        </h3>

        <div className="space-y-4">
          {/* Max Tab Switches */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5 max-w-md">
              <span className="text-xs sm:text-sm font-semibold text-foreground block">
                Max Tab Switches
              </span>
              <p className="text-xs text-muted-foreground">
                Number of times a student can switch tabs before auto-submission.
              </p>
            </div>
            <div className="w-full sm:w-64">
              <Input
                type="number"
                min={1}
                max={20}
                value={maxTabSwitches || ""}
                onChange={(e) =>
                  onChangeMaxTabSwitches(
                    Math.max(1, Math.min(20, Number(e.target.value) || 1))
                  )
                }
                className="h-10 text-xs sm:text-sm font-semibold rounded-xl bg-background border-border text-foreground"
              />
            </div>
          </div>

          {/* Allow Backward Navigation */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5 max-w-xl">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-semibold text-foreground block">
                  Allow Backward Navigation
                </span>
                <span
                  title="Let students navigate between questions they have already visited."
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-help inline-flex items-center"
                >
                  <Info className="size-3.5" />
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Let students return to questions they have already moved past.
              </p>
            </div>
            <Switch
              checked={allowBackwardNavigation}
              onCheckedChange={onChangeAllowBackwardNavigation}
              aria-label="Allow Backward Navigation"
            />
          </div>

          {/* Randomize Options */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5 max-w-xl">
              <span className="text-xs sm:text-sm font-semibold text-foreground block">
                Randomize Options
              </span>
              <p className="text-xs text-muted-foreground">
                Shuffle MCQ options for each student.
              </p>
            </div>
            <Switch
              checked={randomizeOptions}
              onCheckedChange={onChangeRandomizeOptions}
              aria-label="Randomize Options"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border my-6" />

      {/* SECTION 4: LIVE MONITORING */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          LIVE MONITORING
        </h3>

        <div className="space-y-4">
          {/* Enable Live Exam Monitoring */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5 max-w-xl">
              <span className="text-xs sm:text-sm font-semibold text-foreground block">
                Enable Live Exam Monitoring
              </span>
              <p className="text-xs text-muted-foreground">
                Students' cameras and screens will be shared during the exam. You can monitor students in real-time from the exam dashboard.
              </p>
            </div>
            <Switch
              checked={enableLiveMonitoring}
              onCheckedChange={onChangeEnableLiveMonitoring}
              aria-label="Enable Live Exam Monitoring"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border my-6" />

      {/* SECTION 5: QUESTION BANK */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          QUESTION BANK
        </h3>

        <div className="space-y-4">
          {/* Enable Question Bank */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5 max-w-xl">
              <span className="text-xs sm:text-sm font-semibold text-foreground block">
                Enable Question Bank
              </span>
              <p className="text-xs text-muted-foreground">
                Treat this exam's questions as a pool and serve each student a different random selection from it.
              </p>
            </div>
            <Switch
              checked={enableQuestionBank}
              onCheckedChange={onChangeEnableQuestionBank}
              aria-label="Enable Question Bank"
            />
          </div>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 mt-6">
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={onPrevious}
          className="text-xs font-bold px-7 h-10 rounded-xl cursor-pointer"
        >
          Previous
        </Button>

        <Button
          type="button"
          variant="primary"
          size="default"
          onClick={onNext}
          className="text-xs font-bold px-8 h-10 rounded-xl shadow-xs cursor-pointer"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

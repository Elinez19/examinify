import { ShieldCheck } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-md py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-5">
          {/* Brand Info (2 cols) */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <ShieldCheck className="size-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Examinify
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              One platform for all your school term and promotional exams. Deliver CBT-based readiness
              assessments that simulate real exam conditions, benchmark performance, and reveal learning
              gaps early.
            </p>

            {/* Live Status Indicator */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-muted border border-border px-3 py-1.5 text-xs text-foreground">
              <span className="size-2 rounded-full bg-status-success animate-pulse" />
              <span className="font-semibold">All Exam Services Active</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Ready for School Testing</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              CBT Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href="#simulator-section" className="hover:text-primary transition-colors">
                  Interactive Practice
                </a>
              </li>
              <li>
                <a href="#features-grid" className="hover:text-primary transition-colors">
                  High Quality Content
                </a>
              </li>
              <li>
                <a href="#features-grid" className="hover:text-primary transition-colors">
                  Personalized Learning
                </a>
              </li>
              <li>
                <a href="#features-grid" className="hover:text-primary transition-colors">
                  Detailed Analytics
                </a>
              </li>
              <li>
                <a href="#features-grid" className="hover:text-primary transition-colors">
                  Auto-Save & Reliability
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Solutions
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href="#info-section" className="hover:text-primary transition-colors">
                  For School Principals
                </a>
              </li>
              <li>
                <a href="#info-section" className="hover:text-primary transition-colors">
                  For Teachers & Educators
                </a>
              </li>
              <li>
                <a href="#info-section" className="hover:text-primary transition-colors">
                  For Students & Learners
                </a>
              </li>
              <li>
                <a href="#compliance-section" className="hover:text-primary transition-colors">
                  All Term & Promotional Exams
                </a>
              </li>
              <li>
                <a href="#cta-section" className="hover:text-primary transition-colors">
                  School Transition Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Trust & Support
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href="#compliance-section" className="hover:text-primary transition-colors">
                  Student Data Privacy
                </a>
              </li>
              <li>
                <a href="#compliance-section" className="hover:text-primary transition-colors">
                  Fair Testing Assurance
                </a>
              </li>
              <li>
                <a href="#cta-section" className="hover:text-primary transition-colors">
                  Educator Training & Setup
                </a>
              </li>
              <li>
                <a href="#cta-section" className="hover:text-primary transition-colors">
                  Dedicated Exam Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Examinify Assessment Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            One platform for all your school term exams and promotional exams. Go paperless.
          </p>
        </div>
      </div>
    </footer>
  )
}

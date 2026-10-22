import { Search, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SubjectCard } from "./SubjectCard"
import { SubjectTopicsView } from "./SubjectTopicsView"
import { useSubjectList } from "../../hooks/useSubjectList"

export function SubjectListView() {
  const {
    subjects,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    activeSubject,
    setActiveSubjectId,
    toggleTopicCompletion,
  } = useSubjectList()

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>Enrolled Subjects & Syllabus</span>
            <Badge variant="default" className="text-xs">
              {subjects.length} Subjects
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor syllabus coverage milestones, letter grades, and curriculum chapters
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects or teachers..."
            className="w-full h-9 rounded-xl border border-border bg-card pl-9 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
          />
        </div>
      </div>

      {/* Active Syllabus Detail Drawer / Panel */}
      {activeSubject && (
        <SubjectTopicsView
          subject={activeSubject}
          onClose={() => setActiveSubjectId(null)}
          onToggleTopic={(topicId) => toggleTopicCompletion(activeSubject.id, topicId)}
        />
      )}

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-2">
          <BookOpen className="size-10 text-muted-foreground mx-auto stroke-1" />
          <h4 className="text-base font-bold text-foreground">No subjects found</h4>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search query or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onSelectSubject={(id) => setActiveSubjectId(id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpenCheck,
  Calculator,
  Check,
  Clock,
  MapPin,
  Plus,
  Search,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";
import { OffsetRing } from "@/components/brand/offset-ring";
import { ToolPattern } from "@/components/brand/exam-pattern";
import {
  WhatsNewCard,
  WhatsNewVisual,
} from "@/components/landing/composites/whats-new-grid";
import { SectionSlab } from "@/components/landing/ui/section-slab";
import { AnimatedText } from "@/components/motion/animated-text";
import { Reveal, ScaleSlab, Stagger, StaggerItem } from "@/components/motion/reveal";
import {
  landingContent,
  type WhatsNewItem,
} from "@/content/landing";
import { useBlogCatalog } from "@/hooks/landing/use-blog-catalog";
import { useSocialShare } from "@/hooks/landing/use-social-share";
import { motionTokens } from "@/lib/motion";
import { tokens } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/**
 * Section 1 (Blog / Updates Page): "The Good Stuff" Hero Slab
 * Features the repeating ToolPattern watermark + the signature sweeping S-curve ribbon
 * across the Cobalt Slab with centered high-contrast typography.
 */
export function GoodStuffHeroSection() {
  const { hero } = landingContent.blogPage;

  return (
    <div id="top" className="px-3 sm:px-5 lg:px-7 pt-3 pb-2">
      <ScaleSlab className="surface-slab-blue relative mx-auto max-w-slab overflow-hidden rounded-slab">
        <ToolPattern tone="on-blue" />

        {/* Large Sweeping Sculptural Ribbon Curve (1:1 Reference Hero Backdrop) */}
        <svg
          viewBox="0 0 1400 420"
          fill="none"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
          aria-hidden="true"
        >
          <path
            d="M-80 260 C 180 430, 460 440, 660 220 C 850 10, 1080 -30, 1480 280"
            stroke={tokens.colors.surface.porcelain}
            strokeWidth="44"
            strokeOpacity="0.075"
            strokeLinecap="round"
          />
        </svg>

        {/* Protective Contrast Halo so Typography Remains 100% Crisp */}
        <div
          className="contrast-halo-blue pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
        />

        {/* Centered Hero Headline & Subtitle */}
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8 py-20 sm:py-28 lg:py-32 text-center">
          <AnimatedText
            as="h1"
            text={hero.headline}
            highlightWords={hero.highlightWords}
            highlightClassName="text-accent-sky"
            className="text-5xl sm:text-7xl lg:text-[82px] font-extrabold leading-[0.96] tracking-tight text-ink-on-blue drop-shadow-sm"
          />

          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-xl text-base sm:text-xl font-medium leading-relaxed text-ink-on-blue-muted">
              {hero.subtitle}
            </p>
          </Reveal>
        </div>
      </ScaleSlab>
    </div>
  );
}

/**
 * Section 2 (Blog / Updates Page): Categorized "The Good Stuff" Catalog Slab
 * Includes the 4-Tab Segmented Pill Switcher ("All" | "Offers" | "Product Update" | "Artisans"),
 * the 3-Column Article Cards Grid linking directly to each Blog Detail Page, and the "Load More" Pill Button.
 */
export function GoodStuffCatalogSection() {
  const { blogPage } = landingContent;
  const {
    activeCategoryId,
    setActiveCategoryId,
    showAll,
    setShowAll,
    visibleItems,
  } = useBlogCatalog({ items: blogPage.items });

  return (
    <SectionSlab
      id="the-good-stuff"
      tone="blue"
      innerClassName="py-12 sm:py-16 lg:py-20"
    >
      {/* Top 4-Tab Segmented Pill Bar ("All" | "Offers" | "Product Update" | "Artisans") */}
      <Reveal className="flex justify-center">
        <div
          role="tablist"
          aria-label="Article Categories"
          className="surface-slab-ink mx-auto grid w-full max-w-4xl grid-cols-2 sm:grid-cols-4 items-center gap-1.5 rounded-3xl sm:rounded-pill border-2 border-brand-700/75 p-1.5 sm:p-2 shadow-gloss-float"
        >
          {blogPage.categories.map((category) => {
            const isActive = category.id === activeCategoryId;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                id={`blog-tab-${category.id}`}
                aria-selected={isActive}
                aria-controls="blog-catalog-panel"
                onClick={() => {
                  setActiveCategoryId(category.id);
                  setShowAll(false);
                }}
                className={cn(
                  "relative isolate rounded-pill px-5 py-3 sm:px-7 sm:py-3.5 font-display text-sm sm:text-base font-extrabold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-sky",
                  isActive
                    ? "text-ink-on-blue"
                    : "text-ink-on-blue-muted hover:text-ink-on-blue"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="good-stuff-active-category-pill"
                    transition={motionTokens.spring.snappy}
                    className="cta-surface-primary absolute inset-0 -z-10 rounded-pill"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{category.label}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* 3-Column Article Cards Grid */}
      <div
        id="blog-catalog-panel"
        role="tabpanel"
        aria-labelledby={`blog-tab-${activeCategoryId}`}
        className="mt-12"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategoryId}-${showAll ? "all" : "initial"}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
              duration: motionTokens.duration.fast,
              ease: motionTokens.ease.outExpo,
            }}
            className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
          >
            {visibleItems.map((item) => (
              <WhatsNewCard
                key={item.id}
                item={item}
                ctaLabel={blogPage.cardCta}
                ctaHref={`/blog/${item.slug}`}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Centered "Load More" Pill Button (1:1 Reference Match) */}
      <Reveal delay={0.18} className="mt-12 text-center">
        <motion.button
          type="button"
          onClick={() => {
            if (activeCategoryId !== "all") {
              setActiveCategoryId("all");
              setShowAll(true);
            } else {
              setShowAll((prev) => !prev);
            }
          }}
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={motionTokens.spring.snappy}
          className="surface-slab-ink inline-flex items-center justify-center rounded-pill border-2 border-brand-400/40 px-9 py-3.5 font-display text-sm sm:text-base font-extrabold text-ink-on-blue shadow-gloss-float transition-colors hover:border-accent-sky cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-sky"
        >
          {activeCategoryId === "all" && showAll
            ? blogPage.showLessCta
            : blogPage.loadMoreCta}
        </motion.button>
      </Reveal>
    </SectionSlab>
  );
}

/**
 * Large Featured Hero Stage for the Blog Detail Page
 * Renders the dual-angled desktop dashboard showcase for "The All-New Offline CBT Engine"
 * or a hero-scaled stage for other article visual types. Zero hardcoded design tokens.
 */
function BlogDetailHeroStage({
  type,
}: {
  type: WhatsNewItem["visualType"];
}) {
  if (type === "dashboards") {
    return (
      <div className="relative flex h-76 sm:h-96 lg:h-[410px] w-full items-end justify-center gap-4 sm:gap-6 overflow-hidden rounded-card border-2 border-brand-400/40 bg-brand-950 px-4 sm:px-8 pt-8 shadow-gloss-float select-none">
        {/* Ambient Radial Cobalt Glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-75"
          style={{ background: tokens.gradients.slabBlue }}
          aria-hidden="true"
        />

        {/* Sweeping Golden & Electric Sky Light Streaks Across Stage */}
        <svg
          viewBox="0 0 800 420"
          fill="none"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M-60 280 C 180 210, 420 180, 860 90"
            stroke={tokens.colors.accent.gold}
            strokeWidth="2.5"
            strokeOpacity="0.65"
          />
          <path
            d="M-40 310 C 220 230, 460 200, 860 115"
            stroke={tokens.colors.accent.sky}
            strokeWidth="2"
            strokeOpacity="0.5"
          />
          <path
            d="M-20 340 C 260 250, 500 220, 860 140"
            stroke={tokens.colors.accent.gold}
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
        </svg>

        {/* Left Tilted Dashboard Panel (Live Invigilation & LAN Seat Monitor) */}
        <div className="relative z-10 hidden md:block h-72 lg:h-[325px] w-72 lg:w-88 -mr-14 -rotate-4 translate-y-6 rounded-t-3xl border-2 border-brand-200 bg-surface-porcelain p-3.5 text-brand-950 shadow-gloss-float">
          {/* Desktop Window Chrome */}
          <div className="flex items-center justify-between border-b border-surface-frost pb-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-400" />
              <span className="h-2 w-2 rounded-full bg-accent-gold" />
              <span className="h-2 w-2 rounded-full bg-accent-success" />
            </div>
            <span className="rounded-pill bg-surface-mist px-2.5 py-0.5 font-mono text-[9px] font-bold text-brand-950">
              cbt.yourschool.edu/invigilate
            </span>
          </div>

          <div className="cta-surface-primary mt-3 rounded-2xl p-3 text-left">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-pill bg-brand-950/40 px-2 py-0.5 font-display text-[8px] font-extrabold uppercase tracking-wider text-accent-gold">
                2nd CA Window
              </span>
              <span className="font-display text-[9px] font-bold text-accent-sky">
                45m Timer
              </span>
            </div>
            <p className="mt-1 font-display text-xs lg:text-sm font-extrabold leading-tight text-ink-on-blue">
              1st Term CBT Exams &amp; CA Active
            </p>
            <p className="mt-0.5 text-[9px] font-medium text-ink-on-blue-muted">
              Auto-saved answers &amp; instant broadsheets
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-left">
            <div className="rounded-xl border border-brand-100 bg-surface-pearl p-2.5">
              <div className="flex h-10 items-center justify-center rounded-lg bg-brand-600 text-ink-on-blue">
                <Calculator className="h-5 w-5 text-accent-gold" />
              </div>
              <p className="mt-1.5 truncate font-display text-[10px] font-extrabold text-brand-950">
                Mathematics CA
              </p>
              <p className="font-display text-[9px] font-bold text-brand-600">
                ★ 40 Qs · 45m
              </p>
            </div>
            <div className="rounded-xl border border-brand-100 bg-surface-pearl p-2.5">
              <div className="flex h-10 items-center justify-center rounded-lg bg-brand-800 text-ink-on-blue">
                <Zap className="h-5 w-5 text-accent-sky" />
              </div>
              <p className="mt-1.5 truncate font-display text-[10px] font-extrabold text-brand-950">
                Basic Science
              </p>
              <p className="font-display text-[9px] font-bold text-brand-600">
                ★ 30 Qs · 35m
              </p>
            </div>
          </div>
        </div>

        {/* Right / Main Flagship Dashboard Panel (Exam Officer Control & Broadsheet Hub) */}
        <div className="relative z-20 h-68 sm:h-80 lg:h-[345px] w-full max-w-[460px] md:rotate-2 translate-y-3 overflow-hidden rounded-t-3xl border-2 border-brand-200 bg-surface-porcelain text-brand-950 shadow-gloss-float">
          {/* Desktop Window Chrome */}
          <div className="flex items-center justify-between border-b border-surface-frost bg-surface-mist px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent-gold" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent-success" />
            </div>
            <span className="rounded-pill border border-brand-200 bg-surface-porcelain px-3 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold text-brand-950">
              https://cbt.yourschool.edu/dashboard
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-pill bg-brand-950 px-2 py-0.5 font-display text-[8px] font-extrabold text-accent-sky">
              Auto-Sync
            </span>
          </div>

          {/* Cobalt Exam Officer Hub Header */}
          <div className="surface-slab-blue mx-3 mt-3 rounded-2xl px-4 py-3 text-left">
            <div className="flex items-center justify-between text-ink-on-blue">
              <div>
                <p className="font-display text-xs sm:text-sm font-extrabold text-ink-on-blue">
                  Exam Officer Hub · 1st Term
                </p>
                <p className="text-[9px] sm:text-[10px] font-bold text-accent-gold">
                  ★ Primary &amp; Secondary · 42 Seats Synced
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="grid h-7 w-7 place-items-center rounded-pill bg-brand-950/40">
                  <Search className="h-3.5 w-3.5" />
                </span>
                <span className="grid h-7 w-7 place-items-center rounded-pill bg-brand-950/40">
                  <Share2 className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Filter Pills + Live Session & Broadsheet Rows */}
          <div className="p-3 sm:p-4 text-left">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="rounded-pill bg-brand-600 px-3 py-1 font-display text-[9px] sm:text-[10px] font-extrabold text-ink-on-blue">
                1st CA
              </span>
              <span className="rounded-pill bg-surface-mist px-2.5 py-1 font-display text-[9px] sm:text-[10px] font-bold text-ink-secondary">
                2nd CA
              </span>
              <span className="rounded-pill bg-surface-mist px-2.5 py-1 font-display text-[9px] sm:text-[10px] font-bold text-ink-secondary">
                Term Exam
              </span>
              <span className="ml-auto font-display text-[9px] sm:text-[10px] font-extrabold text-accent-success">
                ● Power-Cut Safe
              </span>
            </div>

            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Session Card 1 */}
              <div className="flex items-center justify-between gap-2 rounded-xl border border-brand-100 bg-surface-pearl p-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-700 text-accent-gold">
                    <BookOpenCheck className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-[10px] sm:text-[11px] font-extrabold text-brand-950">
                      JSS 2 Maths 2nd CA
                    </p>
                    <p className="truncate text-[8px] text-ink-muted">
                      Shuffled + Auto-graded
                    </p>
                    <p className="mt-0.5 font-display text-[9px] sm:text-[10px] font-extrabold text-brand-600">
                      42/42 Done
                    </p>
                  </div>
                </div>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-pill border border-brand-200 bg-surface-porcelain text-brand-600">
                  <Plus className="h-3.5 w-3.5" />
                </span>
              </div>

              {/* Session Card 2 */}
              <div className="flex items-center justify-between gap-2 rounded-xl border border-brand-100 bg-surface-pearl p-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-900 text-accent-sky">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-[10px] sm:text-[11px] font-extrabold text-brand-950">
                      Primary 5 English
                    </p>
                    <p className="truncate text-[8px] text-ink-muted">
                      Comprehension + Objective
                    </p>
                    <p className="mt-0.5 font-display text-[9px] sm:text-[10px] font-extrabold text-brand-600">
                      Broadsheet Ready
                    </p>
                  </div>
                </div>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-pill border border-brand-200 bg-surface-porcelain text-brand-600">
                  <Plus className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border-2 border-brand-400/40 bg-brand-950 shadow-gloss-float [&>div]:h-72 sm:[&>div]:h-88 lg:[&>div]:h-96 [&>div]:rounded-none [&>div]:border-0">
      <WhatsNewVisual type={type} />
    </div>
  );
}

/**
 * Section 1 (Blog Detail Page): Hero Slab
 * Features the article title, lead description, Category + Read Time dark pill badges,
 * and the large framed hero visual stage at the bottom of the Cobalt Slab.
 */
export function BlogDetailHeroSection({ article }: { article: WhatsNewItem }) {
  return (
    <div id="top" className="px-3 sm:px-5 lg:px-7 pt-3 pb-2">
      <ScaleSlab className="surface-slab-blue relative mx-auto max-w-slab overflow-hidden rounded-slab">
        <ToolPattern tone="on-blue" />

        {/* Protective Contrast Halo so Typography Remains 100% Crisp */}
        <div
          className="contrast-halo-blue pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8 pt-14 sm:pt-20 lg:pt-24 pb-10 sm:pb-14 text-center">
          {/* Article Headline */}
          <AnimatedText
            as="h1"
            text={article.title}
            highlightWords={article.highlightWords}
            highlightClassName="text-accent-sky"
            className="mx-auto max-w-3xl text-4xl sm:text-6xl lg:text-[68px] font-extrabold leading-[1.02] tracking-tight text-ink-on-blue drop-shadow-sm"
          />

          {/* Lead Subtitle */}
          <Reveal delay={0.14}>
            <p className="mx-auto mt-5 max-w-xl text-base sm:text-xl font-medium leading-relaxed text-ink-on-blue-muted">
              {article.description}
            </p>
          </Reveal>

          {/* Category + Read Time Dark Pill Badges Row (1:1 Reference Match) */}
          <Reveal
            delay={0.22}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-pill border border-brand-700 bg-brand-950/95 px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold text-ink-on-blue shadow-gloss-float">
              <Sparkles
                className="h-3.5 w-3.5 text-accent-gold"
                aria-hidden="true"
              />
              <span>{article.category}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-pill border border-brand-700 bg-brand-950/95 px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold text-ink-on-blue shadow-gloss-float">
              <Clock
                className="h-3.5 w-3.5 text-accent-sky"
                aria-hidden="true"
              />
              <span>{article.readTime}</span>
            </span>
          </Reveal>

          {/* Large Featured Hero Visual Stage Framed Inside Bottom of Slab */}
          <Reveal delay={0.3} className="mx-auto mt-10 sm:mt-12 max-w-3xl">
            <BlogDetailHeroStage type={article.visualType} />
          </Reveal>
        </div>
      </ScaleSlab>
    </div>
  );
}

/**
 * Section 2 (Blog Detail Page): Article Body & Social Share Bar
 * Renders structured paragraphs, dash-prefixed bullet lists ("— ..."), and the
 * bottom "Share" row with interactive OffsetRing social buttons.
 */
export function BlogDetailArticleSection({
  article,
}: {
  article: WhatsNewItem;
}) {
  const { detail } = landingContent.blogPage;
  const { copiedSocial, handleShare } = useSocialShare(2200);

  return (
    <SectionSlab
      id="article-content"
      tone="pearl"
      innerClassName="py-12 sm:py-16 lg:py-20"
    >
      <article className="mx-auto max-w-2xl lg:max-w-3xl text-left">
        <div className="space-y-6 sm:space-y-7">
          {article.bodyBlocks.map((block, index) => {
            if (block.type === "paragraph") {
              return (
                <Reveal key={index} delay={Math.min(index * 0.04, 0.24)}>
                  <p className="text-base sm:text-lg font-medium leading-relaxed text-ink-primary">
                    {block.text}
                  </p>
                </Reveal>
              );
            }

            return (
              <Reveal key={index} delay={Math.min(index * 0.04, 0.24)}>
                <div className="space-y-3.5">
                  <p className="text-base sm:text-lg font-medium leading-relaxed text-ink-primary">
                    {block.leadIn}
                  </p>
                  <ul className="space-y-2.5 pl-1">
                    {block.items.map((bullet, bulletIdx) => (
                      <li
                        key={bulletIdx}
                        className="flex items-start gap-2.5 text-base sm:text-lg font-medium leading-relaxed text-ink-secondary"
                      >
                        <span
                          className="font-display font-extrabold text-brand-600 select-none"
                          aria-hidden="true"
                        >
                          —
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom Share Row with OffsetRing Social Buttons (1:1 Reference Match) */}
        <Reveal
          delay={0.2}
          className="mt-12 sm:mt-16 flex flex-wrap items-center gap-4 pt-2"
        >
          <span className="font-display text-base sm:text-lg font-extrabold text-brand-950">
            {detail.shareLabel}
          </span>

          <div className="flex items-center gap-3.5">
            {detail.socials.map((label) => (
              <OffsetRing
                key={label}
                size="sm"
                faceTone="ink"
                interactive
                onClick={() => handleShare(label)}
                ariaLabel={`Share article on ${label}`}
              >
                <span className="font-display text-xs sm:text-sm font-extrabold">
                  {label}
                </span>
              </OffsetRing>
            ))}
          </div>

          <AnimatePresence>
            {copiedSocial && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={motionTokens.spring.snappy}
                className="inline-flex items-center gap-1.5 rounded-pill border border-brand-200 bg-brand-50 px-3.5 py-1 font-display text-xs font-extrabold text-brand-700"
              >
                <Check className="h-3.5 w-3.5 text-accent-success" />
                <span>Link copied for {copiedSocial}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Reveal>
      </article>
    </SectionSlab>
  );
}

/**
 * Section 3 (Blog Detail Page): "More News" Cobalt Slab
 * Features a left-aligned "More News" display heading and related article cards
 * in a 3-column grid (1:1 Reference Match).
 */
export function MoreNewsSection({
  items,
}: {
  items: readonly WhatsNewItem[];
}) {
  const { blogPage } = landingContent;

  return (
    <SectionSlab
      id="more-news"
      tone="blue"
      innerClassName="py-12 sm:py-16 lg:py-20"
    >
      {/* Left-Aligned "More News" Header */}
      <div className="text-left">
        <AnimatedText
          as="h2"
          text={blogPage.detail.moreNewsHeadline}
          highlightWords={blogPage.detail.moreNewsHighlightWords}
          highlightClassName="text-accent-sky"
          className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold leading-tight tracking-tight text-ink-on-blue"
        />
      </div>

      {/* 3-Column Grid (Displays the 2 Related News Cards in Columns 1 & 2, 1:1 with Reference) */}
      <Stagger className="mt-10 sm:mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <StaggerItem key={item.id}>
            <WhatsNewCard
              item={item}
              ctaLabel={blogPage.cardCta}
              ctaHref={`/blog/${item.slug}`}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </SectionSlab>
  );
}

"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader, SectionSlab } from "@/components/landing/ui/section-slab";
import { Reveal } from "@/components/motion/reveal";
import { landingContent } from "@/content/landing";
import { tokens } from "@/lib/tokens";
import { cn } from "@/lib/utils";

function AbujaSignpost({
  label,
  direction = "right",
  poleHeightClass = "h-56",
  secondLabel,
}: {
  label: string;
  direction?: "left" | "right";
  poleHeightClass?: string;
  secondLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center select-none">
      {/* Top Sign Plate */}
      <div
        className={cn(
          "cta-surface-primary relative flex items-center justify-center px-9 py-4 font-display text-2xl sm:text-3xl font-extrabold text-ink-on-blue shadow-gloss-float",
          direction === "right"
            ? "rounded-l-2xl rounded-r-[32px]"
            : "rounded-r-2xl rounded-l-[32px]"
        )}
      >
        <span className="absolute top-1.5 h-1.5 w-1.5 rounded-full bg-surface-porcelain" />
        <span>{label}</span>
        <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-surface-porcelain" />
      </div>

      {/* Optional Stacked Second Sign Plate (like Ikeja / Gbagada in Eatly ref) */}
      {secondLabel && (
        <>
          <div className="h-3 w-3.5 bg-brand-200" />
          <div className="surface-slab-ink relative flex items-center justify-center rounded-l-[32px] rounded-r-2xl border-2 border-surface-porcelain px-8 py-3.5 font-display text-xl sm:text-2xl font-extrabold text-ink-on-blue shadow-gloss-card">
            <span className="absolute top-1.5 h-1.5 w-1.5 rounded-full bg-surface-porcelain" />
            <span>{secondLabel}</span>
            <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-surface-porcelain" />
          </div>
        </>
      )}

      {/* Glossy Pole */}
      <div
        className={cn(
          "w-3.5 bg-gradient-to-r from-brand-200 via-surface-porcelain to-brand-200",
          poleHeightClass
        )}
      />
    </div>
  );
}

/**
 * Custom 3D-Styled Examinify Cobalt & Gold School Shuttle Bus SVG
 */
function SchoolShuttleSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 175"
      fill="none"
      className={cn("h-32 w-40 sm:h-40 sm:w-48 drop-shadow-xl", className)}
      aria-hidden="true"
    >
      {/* Roof CBT Signal Beacon */}
      <rect
        x="96"
        y="44"
        width="30"
        height="12"
        rx="6"
        fill={tokens.colors.accent.gold}
        stroke={tokens.colors.surface.porcelain}
        strokeWidth="2.5"
      />
      {/* Main School Shuttle Body */}
      <path
        d="M24 72 C24 60 34 54 46 54 H164 C178 54 188 64 192 78 L198 106 C200 116 192 126 182 126 H34 C24 126 18 118 20 108 Z"
        fill={tokens.colors.brand[600]}
        stroke={tokens.colors.surface.porcelain}
        strokeWidth="3.5"
      />
      {/* Gold Accent Stripe */}
      <rect
        x="24"
        y="102"
        width="170"
        height="10"
        rx="5"
        fill={tokens.colors.accent.gold}
      />
      {/* Passenger Windows */}
      <rect
        x="38"
        y="66"
        width="32"
        height="26"
        rx="6"
        fill={tokens.colors.brand[950]}
        stroke={tokens.colors.surface.porcelain}
        strokeWidth="2"
      />
      <rect
        x="78"
        y="66"
        width="32"
        height="26"
        rx="6"
        fill={tokens.colors.brand[950]}
        stroke={tokens.colors.surface.porcelain}
        strokeWidth="2"
      />
      <rect
        x="118"
        y="66"
        width="32"
        height="26"
        rx="6"
        fill={tokens.colors.brand[950]}
        stroke={tokens.colors.surface.porcelain}
        strokeWidth="2"
      />
      {/* Front Windshield */}
      <path
        d="M158 66 H178 L184 92 H158 Z"
        fill={tokens.colors.accent.sky}
        stroke={tokens.colors.surface.porcelain}
        strokeWidth="2"
      />
      {/* Headlight */}
      <circle cx="192" cy="112" r="5" fill={tokens.colors.accent.gold} />
      {/* Wheels */}
      <circle cx="62" cy="134" r="20" fill={tokens.colors.brand[950]} />
      <circle cx="62" cy="134" r="9" fill={tokens.colors.brand[200]} />
      <circle cx="158" cy="134" r="20" fill={tokens.colors.brand[950]} />
      <circle cx="158" cy="134" r="9" fill={tokens.colors.brand[200]} />
    </svg>
  );
}

export function RoadJourneySection() {
  const { roadJourney } = landingContent;
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionSlab
      id="artisans"
      tone="pearl"
      innerClassName="px-0 sm:px-0 lg:px-0 pb-0 sm:pb-0 max-w-none"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeader
          tone="on-light"
          headline={roadJourney.headline}
          highlightWords={["Nigeria's", "Top-Rated"]}
          subtitle={roadJourney.subtitle}
        />
      </div>

      {/* Abuja Street Signposts + Dispatch Scooters + Dashed Road Strip */}
      <div className="relative mt-14 pt-6">
        <div className="mx-auto flex max-w-6xl items-end justify-between px-6 sm:px-16">
          <Reveal delay={0.05}>
            <AbujaSignpost
              label="Lagos"
              direction="right"
              poleHeightClass="h-64 sm:h-80"
            />
          </Reveal>

          <Reveal delay={0.15}>
            <AbujaSignpost
              label="Abuja"
              direction="right"
              poleHeightClass="h-44 sm:h-56"
            />
          </Reveal>

          <Reveal delay={0.25}>
            <AbujaSignpost
              label="Port Harcourt"
              secondLabel="Ibadan"
              direction="right"
              poleHeightClass="h-28 sm:h-36"
            />
          </Reveal>
        </div>

        {/* Animated School Shuttles Along Coverage Road */}
        <div className=" pointer-events-none relative mx-auto -mb-10 flex max-w-6xl items-end justify-between px-8 sm:px-24 z-20">
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { x: [0, 36, 0], y: [0, -4, 0] }
            }
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <SchoolShuttleSvg />
          </motion.div>

          <div className="flex items-end -space-x-10">
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : { x: [0, -28, 0], y: [0, -5, 0] }
              }
              transition={{
                duration: 4.5,
                delay: 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SchoolShuttleSvg />
            </motion.div>
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : { x: [0, 22, 0], y: [0, -4, 0] }
              }
              transition={{
                duration: 4.2,
                delay: 0.9,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="hidden sm:block"
            >
              <SchoolShuttleSvg />
            </motion.div>
          </div>
        </div>

        {/* Full-Width Dashed Road Strip */}
        <div className="road-strip-surface relative h-24 w-full flex items-center">
          <div className="w-full border-t-4 border-dashed border-accent-gold" />
        </div>
      </div>
    </SectionSlab>
  );
}


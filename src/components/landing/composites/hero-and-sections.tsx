"use client";

import * as React from "react";
import {
  BookOpen,
  FileText,
  ListChecks,
  PenLine,
  Shapes,
  Sigma,
  TextCursorInput,
} from "lucide-react";
import Image from "next/image";
import { ToolPattern } from "@/components/brand/exam-pattern";
import {
  ArtisanMarqueeCard,
  RoadDispatchStrip,
} from "@/components/landing/composites/exam-marquee-card";
import { ServiceCard } from "@/components/landing/composites/assessment-card";
import { FaqAccordion } from "@/components/landing/ui/accordion";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { SectionHeader, SectionSlab } from "@/components/landing/ui/section-slab";
import { AnimatedText } from "@/components/motion/animated-text";
import { Marquee } from "@/components/motion/marquee";
import { Reveal, ScaleSlab, Stagger, StaggerItem } from "@/components/motion/reveal";
import {
  type FaqItemData,
  landingContent,
  type QuestionTypeItem,
} from "@/content/landing";

/**
 * Section 1: Hero Slab ("Broken Pipe or AC? Fixed in Minutes.")
 * Uses custom 3D glossy background (`hero-bg.jpg`) framed around the perimeter with a
 * dedicated high-contrast center halo so typography and CTAs are never buried.
 */
export function HeroSection() {
  const { hero } = landingContent;

  return (
    <div id="top" className="px-3 sm:px-5 lg:px-7 pt-3 pb-4">
      <ScaleSlab className="surface-slab-blue relative mx-auto max-w-slab overflow-hidden rounded-slab">
        {/* Custom 3D Glossy Porcelain & Cobalt Background Image */}
        <div className="pointer-events-none absolute inset-0 select-none opacity-65">
          <Image
            src="/images/landing/hero-bg.jpg"
            alt=""
            fill
            priority
            sizes="1400px"
            className="object-cover object-center"
          />
        </div>

        {/* High-Contrast Protective Halo so Text is Never Buried in Background */}
        <div
          className="contrast-halo-blue pointer-events-none absolute inset-0"
          aria-hidden="true"
        />

        <ToolPattern tone="on-blue" />

        {/* Center Hero Copy & Strictly 2 Consistent CTA Buttons */}
        <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8 pt-14 sm:pt-20 pb-8 text-center">
          <Reveal>
            <PillBadge tone="porcelain" icon="dot">
              {hero.eyebrow}
            </PillBadge>
          </Reveal>

          <div className="mt-7 space-y-1">
            <AnimatedText
              as="h1"
              text={hero.headlineLine1}
              className="text-5xl sm:text-7xl lg:text-[84px] font-extrabold leading-[0.95] text-ink-on-blue drop-shadow-sm"
            />
            <AnimatedText
              as="h2"
              text={hero.headlineLine2}
              delay={0.14}
              highlightWords={["Minutes."]}
              highlightClassName="text-accent-sky"
              underlineLastWord
              className="text-5xl sm:text-7xl lg:text-[84px] font-extrabold leading-[0.95] text-ink-on-blue drop-shadow-sm"
            />
          </div>

          <Reveal delay={0.25}>
            <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-2xl font-semibold leading-relaxed text-ink-on-blue">
              {hero.subtitle}
            </p>
          </Reveal>

          {/* Strictly 2 Consistent CTA Buttons */}
          <Reveal
            id="download"
            delay={0.32}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <CtaButton
              variant="secondary"
              size="lg"
              leadingIcon="sparkle"
              trailingArrow
              href="/login"
            >
              {hero.primaryCta}
            </CtaButton>
            <CtaButton
              variant="primary"
              size="lg"
              leadingIcon="play"
              href="#app-showcase"
            >
              {hero.secondaryCta}
            </CtaButton>
          </Reveal>
        </div>

        {/* Infinite Tilted Artisan Cards Marquee Overlapping the Road Strip */}
        <div className="relative z-20 mt-4 -mb-14">
          <Marquee durationSeconds={38}>
            {hero.marqueeCards.map((item) => (
              <ArtisanMarqueeCard key={item.id} item={item} />
            ))}
          </Marquee>
        </div>

        {/* Bottom Dispatch Road Strip */}
        <RoadDispatchStrip />
      </ScaleSlab>
    </div>
  );
}

/**
 * Section 3: Services Grid ("Every Home & Office Fix Covered")
 */
export function ServicesGridSection() {
  const { services } = landingContent;

  return (
    <SectionSlab id="services" tone="pearl">
      <SectionHeader
        tone="on-light"
        eyebrow={
          <PillBadge tone="porcelain" icon="shield">
            {services.eyebrow}
          </PillBadge>
        }
        headline={services.headline}
        highlightWords={["Everything", "Stronger", "Exams"]}
        subtitle={services.subtitle}
      />

      <Stagger className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
        {services.items.map((item) => (
          <StaggerItem key={item.id}>
            <ServiceCard item={item} />
          </StaggerItem>
        ))}
      </Stagger>
    </SectionSlab>
  );
}

function QuestionTypeIcon({
  type,
}: {
  type: QuestionTypeItem["iconType"];
}) {
  switch (type) {
    case "list-checks":
      return <ListChecks className="h-5 w-5 text-accent-gold" aria-hidden="true" />;
    case "text-cursor":
      return <TextCursorInput className="h-5 w-5 text-accent-sky" aria-hidden="true" />;
    case "file-text":
      return <FileText className="h-5 w-5 text-accent-gold" aria-hidden="true" />;
    case "pen-line":
      return <PenLine className="h-5 w-5 text-accent-sky" aria-hidden="true" />;
    case "sigma":
      return <Sigma className="h-5 w-5 text-accent-gold" aria-hidden="true" />;
    case "book-open":
      return <BookOpen className="h-5 w-5 text-accent-sky" aria-hidden="true" />;
    case "shapes":
      return <Shapes className="h-5 w-5 text-accent-gold" aria-hidden="true" />;
  }
}

/**
 * Section 3B: "Every Question Format, Ready Immediately" (7 Supported Formats Showcase)
 */
export function QuestionTypesSection() {
  const { questionTypes } = landingContent;

  return (
    <SectionSlab id="question-types" tone="blue">
      <SectionHeader
        tone="on-blue"
        eyebrow={
          <PillBadge tone="porcelain" icon="dot">
            {questionTypes.eyebrow}
          </PillBadge>
        }
        headline={questionTypes.headline}
        highlightWords={questionTypes.highlightWords}
        subtitle={questionTypes.subtitle}
      />

      <div className="mt-14 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left Featured 3D Glossy Showcase Card */}
        <Reveal className="lg:col-span-5">
          <div className="rounded-card border-2 border-brand-400/40 bg-brand-950/85 p-5 sm:p-6 shadow-gloss-float">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border-2 border-brand-400/30 bg-surface-mist">
              <Image
                src={questionTypes.showcaseImage}
                alt="All seven exam question formats supported on Examinify"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg font-extrabold text-ink-on-blue">
                  7 Formats · One Exam Engine
                </p>
                <p className="text-xs sm:text-sm font-medium text-ink-on-blue-muted">
                  Auto-generated from lesson notes or authored manually.
                </p>
              </div>
              <CtaButton
                variant="secondary"
                size="md"
                trailingArrow
                href={questionTypes.ctaHref}
              >
                {questionTypes.ctaLabel}
              </CtaButton>
            </div>
          </div>
        </Reveal>

        {/* Right 7-Format Cards Grid */}
        <Stagger className="lg:col-span-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {questionTypes.items.map((qt, idx) => (
            <StaggerItem
              key={qt.id}
              className={idx === questionTypes.items.length - 1 ? "sm:col-span-2" : undefined}
            >
              <div className="flex h-full items-start gap-4 rounded-3xl border-2 border-brand-400/35 bg-brand-900/70 p-5 text-left shadow-gloss-float transition-colors hover:border-accent-sky/70">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-brand-500/60 bg-brand-950 shadow-sm">
                  <QuestionTypeIcon type={qt.iconType} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-extrabold text-ink-on-blue">
                      {qt.title}
                    </h3>
                    <span className="rounded-pill bg-brand-950/90 border border-brand-600 px-2.5 py-0.5 font-display text-[11px] font-bold text-accent-sky">
                      {qt.badge}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-medium leading-relaxed text-ink-on-blue-muted">
                    {qt.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </SectionSlab>
  );
}

/**
 * Section 9: FAQ Accordion ("Got Questions ?")
 */
export interface FaqSectionProps {
  headline?: string;
  subtitle?: string;
  moreCta?: string;
  moreHref?: string;
  items?: readonly FaqItemData[];
}

export function FaqSection({
  headline,
  subtitle,
  moreCta,
  moreHref = "/faqs",
  items,
}: FaqSectionProps = {}) {
  const { faqs } = landingContent;

  return (
    <SectionSlab id="faqs" tone="pearl">
      <SectionHeader
        tone="on-light"
        headline={headline ?? faqs.headline}
        highlightWords={["Questions"]}
        subtitle={subtitle ?? faqs.subtitle}
      />

      <div className="mt-12">
        <FaqAccordion items={items ?? faqs.items} />
      </div>

      <Reveal delay={0.2} className="mt-12 text-center">
        <CtaButton variant="secondary" size="lg" href={moreHref}>
          {moreCta ?? faqs.moreCta}
        </CtaButton>
      </Reveal>
    </SectionSlab>
  );
}


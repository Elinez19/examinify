import * as React from "react";
import { AbujaCoverageMap } from "@/components/landing/composites/nigeria-coverage-map";
import { HowItWorksSection } from "@/components/landing/composites/school-page-sections";
import {
  FaqSection,
  HeroSection,
  QuestionTypesSection,
  ServicesGridSection,
} from "@/components/landing/composites/hero-and-sections";
import {
  LandingFooter,
  LandingNavbar,
  Preloader,
} from "@/components/landing/composites/navigation";
import {
  DashboardShowcaseSection,
  FannedDashboardsShowcase,
} from "@/components/landing/composites/dashboard-showcase";
import { RoadJourneySection } from "@/components/landing/composites/road-journey";
import { TestimonialCarouselSection } from "@/components/landing/composites/testimonial-carousel";
import {
  AudienceGridSection,
  WhatsNewSection,
} from "@/components/landing/composites/whats-new-grid";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-pearl text-ink-primary overflow-x-hidden">
      {/* Entrance Loading Animation (Wordmark + Scribble Underline + Curtain Wipe) */}
      <Preloader />

      {/* Floating Cobalt Slab Navbar */}
      <LandingNavbar />

      {/* Main Landing Page Sections */}
      <main className="flex-1 space-y-2 sm:space-y-4">
        {/* 1. Hero Slab + Infinite Tilted Artisan Cards Marquee on Road Strip */}
        <HeroSection />

        {/* 2. "Offline CBT For Every School" Dashboard Showcase + 4 Floating Notification Banners */}
        <DashboardShowcaseSection />

        {/* 3. "Everything Your School Needs for Stronger Exams" 6 Core Capability Cards */}
        <ServicesGridSection />

        {/* 4. "Every Question Format, Ready Immediately" 7 Question Types Showcase */}
        <QuestionTypesSection />

        {/* 5. "How Examinify Works" 5-Step Exam Workflow + /login CTA */}
        <HowItWorksSection />

        {/* 5. "Trusted Across Abuja and Nigeria" Dotted Map + OffsetRing Bubbles */}
        <AbujaCoverageMap />

        {/* 5. "Discover Abuja's Top-Rated Artisans" Street Signposts + Dispatch Scooters */}
        <RoadJourneySection />

        {/* 6. "What Abuja Is Saying" Tilted Testimonials Carousel */}
        <TestimonialCarouselSection />

        {/* 7. "Everything You Need To Assess Offline" Cobalt Slab + 3 Fanned Dashboards */}
        <FannedDashboardsShowcase />

        {/* 8. "Got Questions ?" Big Glossy FAQ Accordion */}
        <FaqSection />

        {/* 9. "What's New on Skilled4U" 3-Column Feature Slab */}
        <WhatsNewSection />

        {/* 10. "Join Skilled4U Your Way." 3-Column Character Cards */}
        <AudienceGridSection />
      </main>

      {/* Rounded Cobalt Slab Footer + Giant Outlined Wordmark */}
      <LandingFooter />
    </div>
  );
}

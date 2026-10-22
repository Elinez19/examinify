import { Navbar } from "@/components/navigation/Navbar"
import { Footer } from "@/components/navigation/Footer"
import { HeroSection } from "@/components/hero/HeroSection"
import { InfoSection } from "@/components/info/InfoSection"
import { HomeFeaturesSection } from "@/components/home-features/HomeFeaturesSection"
import { CtaSection } from "@/components/cta/CtaSection"
import { useScrollTo } from "@/hooks/scroll/useScrollTo"

interface HomePageProps {
  onNavigateAuth?: (mode: "signin" | "signup") => void
  onNavigateDashboard?: () => void
}

export function HomePage({ onNavigateAuth, onNavigateDashboard }: HomePageProps = {}) {
  const { scrollTo } = useScrollTo()

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Sticky Top Glossy Navbar */}
      <Navbar
        onScrollToSection={scrollTo}
        onNavigateAuth={onNavigateAuth}
        onNavigateDashboard={onNavigateDashboard}
      />

      {/* Main Landing Sections */}
      <main className="flex-1">
        <HeroSection
          onExploreCbt={() => scrollTo("simulator-section")}
          onBookDemo={() => scrollTo("cta-section")}
          onTryDemoAccount={onNavigateDashboard}
        />

        <InfoSection
          onCtaClick={() => scrollTo("cta-section")}
        />

        <HomeFeaturesSection />

        <CtaSection />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}

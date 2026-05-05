/**
 * Cribro Parking — Landing Page
 * Design: "Aerial Calm" — Skandynawski minimalizm z estetyką lotniczą
 * Colors: Warm white base (#FAFAF8), deep graphite text, calm blue accent, amber CTA
 * Typography: Satoshi (display) + Inter (body)
 */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import USPSection from "@/components/USPSection";
import HowItWorks from "@/components/HowItWorks";
import AirportsSection from "@/components/AirportsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <USPSection />
        <HowItWorks />
        <AirportsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

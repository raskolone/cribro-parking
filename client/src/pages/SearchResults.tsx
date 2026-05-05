/**
 * Search Results Page — Mockup
 * Shows available parking lots after search
 * Design: Clean list with boarding-pass-style cards
 */

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Clock, Bus, Shield, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Mock data for parking lots
const mockParkings = [
  {
    id: 1,
    name: "SkyPark Pyrzowice",
    distance: "1.2 km",
    transferTime: "5",
    price: 29,
    rating: 4.8,
    reviews: 342,
    features: ["transfer", "cctv", "fenced"],
    available: true,
  },
  {
    id: 2,
    name: "AeroParking KTW",
    distance: "2.5 km",
    transferTime: "8",
    price: 24,
    rating: 4.6,
    reviews: 218,
    features: ["transfer", "cctv"],
    available: true,
  },
  {
    id: 3,
    name: "Parking Lotnisko Katowice",
    distance: "0.8 km",
    transferTime: "3",
    price: 35,
    rating: 4.9,
    reviews: 567,
    features: ["transfer", "cctv", "fenced", "covered"],
    available: true,
  },
  {
    id: 4,
    name: "EcoPark Pyrzowice",
    distance: "3.1 km",
    transferTime: "10",
    price: 19,
    rating: 4.3,
    reviews: 89,
    features: ["transfer", "cctv"],
    available: false,
  },
];

export default function SearchResults() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container">
          {/* Search Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
              {language === "pl"
                ? "Dostępne parkingi — Katowice-Pyrzowice (KTW)"
                : "Available parking — Katowice-Pyrzowice (KTW)"}
            </h1>
            <p className="text-muted-foreground">
              {language === "pl"
                ? "12 maja 2026 — 19 maja 2026 · 7 dób"
                : "May 12, 2026 — May 19, 2026 · 7 days"}
            </p>
          </motion.div>

          {/* Results */}
          <div className="space-y-4">
            {mockParkings.map((parking, index) => (
              <motion.div
                key={parking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl border border-border/50 p-6 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 ${
                  !parking.available ? "opacity-60" : ""
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Parking Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-bold text-lg text-foreground">
                        {parking.name}
                      </h3>
                      {parking.available && (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          {t("parking.available")}
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {parking.distance} {t("parking.distance")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bus className="w-3.5 h-3.5" />
                        {parking.transferTime} {t("parking.transferTime")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" />
                        24/7
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{parking.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({parking.reviews} {language === "pl" ? "opinii" : "reviews"})
                      </span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center gap-6 lg:flex-col lg:items-end">
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">{t("parking.from")}</span>
                      <div className="font-display font-bold text-2xl text-foreground">
                        {parking.price} <span className="text-sm font-medium text-muted-foreground">{t("parking.perDay")}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toast("Funkcja rezerwacji wkrótce dostępna / Booking feature coming soon")}
                      disabled={!parking.available}
                      className="px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {language === "pl" ? "Rezerwuj" : "Book"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

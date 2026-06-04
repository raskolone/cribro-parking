/**
 * Search Results Page — Connected to Supabase
 * Shows available parking lots based on selected airport
 */

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase, ParkingLot } from "@/lib/supabase";
import { MapPin, Clock, Bus, Shield, Star, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function SearchResults() {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();
  const [parkings, setParkings] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);

  // Get search params from URL
  const params = new URLSearchParams(window.location.search);
  const airportCode = params.get("airport") || "KTW";
  const arrivalDate = params.get("arrival") || "";
  const departureDate = params.get("departure") || "";

  // Calculate days
  const days = arrivalDate && departureDate
    ? Math.max(1, Math.ceil((new Date(departureDate).getTime() - new Date(arrivalDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 7;

  useEffect(() => {
    fetchParkings();
  }, [airportCode]);

  const fetchParkings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("parking_lots")
      .select("*")
      .eq("airport_code", airportCode)
      .eq("is_active", true)
      .order("price_per_day", { ascending: true });

    if (error) {
      console.error("Error fetching parkings:", error);
    } else {
      setParkings(data || []);
    }
    setLoading(false);
  };

  const airportName = "Katowice-Pyrzowice (KTW)";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === "pl" ? "pl-PL" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const featureLabels: Record<string, { pl: string; en: string }> = {
    transfer: { pl: "Transfer", en: "Shuttle" },
    cctv: { pl: "Monitoring", en: "CCTV" },
    fenced: { pl: "Ogrodzony", en: "Fenced" },
    lit: { pl: "Oświetlony", en: "Well-lit" },
    covered: { pl: "Zadaszony", en: "Covered" },
    valet: { pl: "Valet", en: "Valet" },
  };

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
                ? `Dostępne parkingi — ${airportName}`
                : `Available parking — ${airportName}`}
            </h1>
            {arrivalDate && departureDate && (
              <p className="text-muted-foreground">
                {formatDate(arrivalDate)} — {formatDate(departureDate)} · {days} {language === "pl" ? (days === 1 ? "doba" : "dób") : (days === 1 ? "day" : "days")}
              </p>
            )}
          </motion.div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Results */}
          {!loading && (
            <div className="space-y-4">
              {parkings.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">
                    {language === "pl"
                      ? "Brak dostępnych parkingów dla wybranego lotniska."
                      : "No parking lots available for the selected airport."}
                  </p>
                </div>
              ) : (
                parkings.map((parking, index) => (
                  <motion.div
                    key={parking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={`bg-white rounded-xl border border-border/50 p-6 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 ${
                      parking.available_spots <= 0 ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Parking Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display font-bold text-lg text-foreground">
                            {parking.name}
                          </h3>
                          {parking.available_spots > 0 && (
                            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                              {t("parking.available")} ({parking.available_spots})
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-3">
                          {language === "pl" ? parking.description_pl : parking.description_en}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {parking.distance_km} km {t("parking.distance")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bus className="w-3.5 h-3.5" />
                            {parking.transfer_time_min} {t("parking.transferTime")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5" />
                            24/7
                          </span>
                        </div>

                        {/* Feature badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {parking.features.map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-1 bg-secondary text-xs font-medium text-secondary-foreground rounded-md"
                            >
                              {featureLabels[feature]?.[language] || feature}
                            </span>
                          ))}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium">{parking.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({parking.reviews_count} {language === "pl" ? "opinii" : "reviews"})
                          </span>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center gap-6 lg:flex-col lg:items-end lg:min-w-[160px]">
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground block">{t("parking.from")}</span>
                          <div className="font-display font-bold text-2xl text-foreground">
                            {parking.price_per_day} <span className="text-sm font-medium text-muted-foreground">{t("parking.perDay")}</span>
                          </div>
                          {days > 1 && (
                            <span className="text-xs text-muted-foreground">
                              {language === "pl" ? "Razem:" : "Total:"}{" "}
                              <span className="font-semibold text-foreground">
                                {(Number(parking.price_per_day) * days).toFixed(0)} zł
                              </span>
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => navigate(`/book/${parking.id}?arrival=${arrivalDate}&departure=${departureDate}`)}
                          disabled={parking.available_spots <= 0}
                          className="px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {language === "pl" ? "Rezerwuj" : "Book"}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

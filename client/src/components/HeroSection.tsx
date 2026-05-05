import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Calendar, Search, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function HeroSection() {
  const { t } = useLanguage();
  const [airport, setAirport] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!airport) {
      toast("Wybierz lotnisko / Select an airport");
      return;
    }
    navigate("/search");
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-16">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/hero-airport-parking-9wp7HUbGPAapChCAiW5XZ2.webp"
          alt="Airport parking aerial view"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/95" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-primary font-medium text-sm tracking-wide uppercase mb-4"
          >
            {t("hero.tagline")}
          </motion.p>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-6"
          >
            {t("hero.title")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* Search Form - Boarding Pass Style */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-border/50 p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              {/* Airport Select */}
              <div className="md:col-span-4 lg:col-span-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {t("search.airport")}
                </label>
                <select
                  value={airport}
                  onChange={(e) => setAirport(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-border bg-secondary/50 text-foreground font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="">{t("search.selectAirport")}</option>
                  <option value="ktw">{t("search.katowice")}</option>
                  <option value="krk">{t("search.krakow")}</option>
                </select>
              </div>

              {/* Arrival Date */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {t("search.arrival")}
                </label>
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-border bg-secondary/50 text-foreground font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Departure Date */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {t("search.departure")}
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-border bg-secondary/50 text-foreground font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Submit */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-12 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  <Search className="w-4 h-4" />
                  {t("search.submit")}
                </button>
              </div>
            </div>

            {/* Free cancellation badge */}
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs text-muted-foreground">
                {t("search.freeCancel")}
              </span>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

// Design: Premium dark-navy hero, two-column layout
// Left: headline + search form on dark background
// Right: premium parking/airport photo with floating trust badges
// Typography: Sora display bold + Inter body

import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Calendar, Search, CheckCircle2, Shield, Star, Clock } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/parknfly-hero-visual-j3Y2fDdw3Dw54pVaD2Lxah.webp";

export default function HeroSection() {
  const { t, language } = useLanguage();
  const [airport, setAirport] = useState("ktw");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("airport", airport.toUpperCase());
    if (arrivalDate) params.set("arrival", arrivalDate);
    if (departureDate) params.set("departure", departureDate);
    navigate(`/search?${params.toString()}`);
  };

  const trustBadges = [
    { icon: Shield, label: language === "pl" ? "Gwarancja miejsca" : "Guaranteed spot" },
    { icon: Star, label: language === "pl" ? "Najniższe ceny" : "Lowest prices" },
    { icon: Clock, label: language === "pl" ? "Darmowy transfer" : "Free shuttle" },
  ];

  return (
    <section className="relative min-h-screen flex items-stretch pt-16 overflow-hidden bg-[#0f1e30]">

      {/* ── LEFT COLUMN ── */}
      <div className="relative z-10 flex flex-col justify-center w-full lg:w-[55%] px-6 md:px-12 lg:px-16 py-20">

        {/* Subtle background texture on left */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1e30] via-[#1a2e4a] to-[#0f1e30] opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08)_0%,transparent_60%)]" />

        <div className="relative z-10 max-w-xl">
          {/* Tagline pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-medium tracking-widest uppercase">
              {t("hero.tagline")}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl lg:text-[3.25rem] text-white leading-[1.1] mb-5"
          >
            {t("hero.title")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-slate-300 text-lg mb-10 leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearch}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 md:p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Airport Select */}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  {t("search.airport")}
                </label>
                <select
                  value={airport}
                  onChange={(e) => setAirport(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-white/10 bg-white/8 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all appearance-none cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <option value="ktw" style={{ background: "#1a2e4a", color: "white" }}>
                    {t("search.katowice")}
                  </option>
                </select>
              </div>

              {/* Arrival Date */}
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {t("search.arrival")}
                </label>
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-white/10 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", colorScheme: "dark" }}
                />
              </div>

              {/* Departure Date */}
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {t("search.departure")}
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-white/10 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", colorScheme: "dark" }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-13 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Search className="w-4 h-4" />
              {t("search.submit")}
            </button>

            {/* Free cancellation */}
            <div className="mt-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span className="text-xs text-slate-400">{t("search.freeCancel")}</span>
            </div>
          </motion.form>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-3 mt-6"
          >
            {trustBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3 py-1.5"
              >
                <Icon className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-slate-300 font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT COLUMN — Premium visual ── */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[48%] z-0">
        {/* Gradient fade from left (blends with dark left col) */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0f1e30] to-transparent z-10" />

        <img
          src={HERO_IMAGE}
          alt="Premium airport parking"
          className="w-full h-full object-cover object-center"
        />

        {/* Subtle dark overlay to keep image premium but not too bright */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1e30]/60 via-transparent to-[#0f1e30]/20" />

        {/* Floating stat card — bottom left of image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="absolute bottom-12 left-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 z-20"
        >
          <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
            {language === "pl" ? "Dostępne parkingi" : "Available parkings"}
          </p>
          <p className="text-white font-display font-bold text-2xl">2+</p>
          <p className="text-blue-300 text-xs mt-0.5">Katowice-Pyrzowice</p>
        </motion.div>
      </div>

    </section>
  );
}

import { useLanguage } from "@/contexts/LanguageContext";
import { Plane, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Plane className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Cribro<span className="text-primary"> Parking</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#how" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.howItWorks")}
          </a>
          <a href="#airports" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.airports")}
          </a>
          <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.about")}
          </a>
          <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.contact")}
          </a>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
            <button
              onClick={() => setLanguage("pl")}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                language === "pl"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              PL
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                language === "en"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>

          <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:opacity-90 transition-opacity">
            {t("nav.login")}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-border"
          >
            <div className="container py-4 flex flex-col gap-3">
              <a href="#how" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
                {t("nav.howItWorks")}
              </a>
              <a href="#airports" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
                {t("nav.airports")}
              </a>
              <a href="#about" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
                {t("nav.about")}
              </a>
              <a href="#contact" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
                {t("nav.contact")}
              </a>
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => setLanguage("pl")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                    language === "pl" ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}
                >
                  PL
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                    language === "en" ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

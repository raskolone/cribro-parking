import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Plane, Menu, X, User, LogOut, CalendarDays, BarChart3 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, role, signOut } = useAuth();
  const [, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate("/");
  };

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
          <a href="/#how" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.howItWorks")}
          </a>
          <a href="/#airports" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.airports")}
          </a>
          <a href="/#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("nav.about")}
          </a>
          <a href="/#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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

          {/* Auth Button / User Menu */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                  {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-border shadow-lg shadow-black/5 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-border/50">
                      <p className="text-sm font-medium truncate">{user.user_metadata?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
              <button
                onClick={() => { navigate("/dashboard"); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                {language === "pl" ? "Panel użytkownika" : "Dashboard"}
              </button>
              <button
                onClick={() => { navigate("/my-reservations"); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                {language === "pl" ? "Moje rezerwacje" : "My reservations"}
              </button>
              {(role === "owner" || role === "admin") && (
                <button
                  onClick={() => { navigate("/owner"); setUserMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  {language === "pl" ? "Panel właściciela" : "Owner panel"}
                </button>
              )}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {language === "pl" ? "Wyloguj się" : "Log out"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:opacity-90 transition-opacity"
            >
              {t("nav.login")}
            </button>
          )}
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
              <a href="/#how" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
                {t("nav.howItWorks")}
              </a>
              <a href="/#airports" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
                {t("nav.airports")}
              </a>
              <a href="/#about" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
                {t("nav.about")}
              </a>
              <a href="/#contact" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
                {t("nav.contact")}
              </a>

              {user ? (
                <>
                  <button
                    onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}
                    className="text-sm font-medium py-2 text-left flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {language === "pl" ? "Panel użytkownika" : "Dashboard"}
                  </button>
                  <button
                    onClick={() => { navigate("/my-reservations"); setMobileOpen(false); }}
                    className="text-sm font-medium py-2 text-left flex items-center gap-2"
                  >
                    <CalendarDays className="w-4 h-4" />
                    {language === "pl" ? "Moje rezerwacje" : "My reservations"}
                  </button>
                  {(role === "owner" || role === "admin") && (
                    <button
                      onClick={() => { navigate("/owner"); setMobileOpen(false); }}
                      className="text-sm font-medium py-2 text-left flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      {language === "pl" ? "Panel właściciela" : "Owner panel"}
                    </button>
                  )}
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="text-sm font-medium py-2 text-left text-red-600 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {language === "pl" ? "Wyloguj się" : "Log out"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { navigate("/auth"); setMobileOpen(false); }}
                  className="text-sm font-medium py-2 text-primary"
                >
                  {t("nav.login")}
                </button>
              )}

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

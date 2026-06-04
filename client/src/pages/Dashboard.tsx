/**
 * User Dashboard — Main panel after login
 * Shows overview of reservations, quick actions, and account info
 */

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, Reservation } from "@/lib/supabase";
import { useLocation } from "wouter";
import {
  CalendarDays,
  Car,
  MapPin,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Settings,
  CreditCard,
  Bell,
  Loader2,
  ArrowRight,
  Plane,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Dashboard() {
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      fetchReservations();
    }
  }, [user, authLoading]);

  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reservations")
      .select(`*, parking_lot:parking_lots(*)`)
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching reservations:", error);
    } else {
      setReservations(data || []);
    }
    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === "pl" ? "pl-PL" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const activeReservations = reservations.filter((r) => r.status === "confirmed");
  const pastReservations = reservations.filter((r) => r.status === "completed" || r.status === "cancelled");

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-6xl">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-1">
              {language === "pl" ? "Witaj" : "Welcome"},{" "}
              {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}!
            </h1>
            <p className="text-muted-foreground">
              {language === "pl"
                ? "Zarządzaj swoimi rezerwacjami i kontem"
                : "Manage your reservations and account"}
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white rounded-xl border border-border/50 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeReservations.length}</p>
                  <p className="text-xs text-muted-foreground">
                    {language === "pl" ? "Aktywne rezerwacje" : "Active reservations"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border/50 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{reservations.length}</p>
                  <p className="text-xs text-muted-foreground">
                    {language === "pl" ? "Wszystkie rezerwacje" : "Total reservations"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border/50 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {reservations.reduce((sum, r) => sum + Number(r.total_price), 0).toFixed(0)} zł
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === "pl" ? "Łączne wydatki" : "Total spent"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content — Reservations */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* New Reservation CTA */}
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-5 flex items-center gap-4 hover:from-primary/10 hover:to-primary/15 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-foreground">
                    {language === "pl" ? "Nowa rezerwacja" : "New reservation"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === "pl"
                      ? "Zarezerwuj parking przy lotnisku Katowice-Pyrzowice (KTW)"
                      : "Book parking at Katowice-Pyrzowice Airport (KTW)"}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Active Reservations */}
              <div>
                <h2 className="font-display font-bold text-lg mb-4">
                  {language === "pl" ? "Nadchodzące rezerwacje" : "Upcoming reservations"}
                </h2>

                {activeReservations.length === 0 ? (
                  <div className="bg-white rounded-xl border border-border/50 p-8 text-center">
                    <Plane className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {language === "pl"
                        ? "Nie masz nadchodzących rezerwacji"
                        : "No upcoming reservations"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeReservations.map((reservation) => {
                      const parkingLot = (reservation as any).parking_lot;
                      return (
                        <div
                          key={reservation.id}
                          className="bg-white rounded-xl border border-border/50 p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{parkingLot?.name || "Parking"}</h3>
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {language === "pl" ? "Potwierdzona" : "Confirmed"}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <CalendarDays className="w-3.5 h-3.5" />
                                  {formatDate(reservation.arrival_date)} — {formatDate(reservation.departure_date)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Car className="w-3.5 h-3.5" />
                                  <span className="uppercase">{reservation.car_plate}</span>
                                </span>
                                {parkingLot && (
                                  <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {parkingLot.airport_code}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{Number(reservation.total_price).toFixed(0)} zł</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* View All Link */}
              {reservations.length > 0 && (
                <button
                  onClick={() => navigate("/my-reservations")}
                  className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                >
                  {language === "pl" ? "Zobacz wszystkie rezerwacje" : "View all reservations"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>

            {/* Sidebar — Account & Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Account Card */}
              <div className="bg-white rounded-xl border border-border/50 p-5">
                <div className="flex items-center gap-3 mb-4">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {user?.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => toast(language === "pl" ? "Wkrótce dostępne" : "Coming soon")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    {language === "pl" ? "Ustawienia konta" : "Account settings"}
                  </button>
                  <button
                    onClick={() => toast(language === "pl" ? "Wkrótce dostępne" : "Coming soon")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    {language === "pl" ? "Powiadomienia" : "Notifications"}
                  </button>
                  <button
                    onClick={() => toast(language === "pl" ? "Wkrótce dostępne" : "Coming soon")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    {language === "pl" ? "Metody płatności" : "Payment methods"}
                  </button>
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-white rounded-xl border border-border/50 p-5">
                <h3 className="font-semibold text-sm mb-3">
                  {language === "pl" ? "Potrzebujesz pomocy?" : "Need help?"}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {language === "pl"
                    ? "Skontaktuj się z nami w razie pytań dotyczących rezerwacji."
                    : "Contact us if you have any questions about your reservation."}
                </p>
                <button
                  onClick={() => toast(language === "pl" ? "Wkrótce dostępne" : "Coming soon")}
                  className="w-full h-10 border border-border rounded-lg text-sm font-medium hover:bg-secondary/50 transition-colors"
                >
                  {language === "pl" ? "Kontakt z obsługą" : "Contact support"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

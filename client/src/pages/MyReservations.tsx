/**
 * My Reservations Page — Shows user's booking history
 */

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, Reservation } from "@/lib/supabase";
import { useLocation } from "wouter";
import { Calendar, Car, MapPin, CheckCircle2, XCircle, Clock, Loader2, Copy, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function MyReservations() {
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
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reservations:", error);
    } else {
      setReservations(data || []);
    }
    setLoading(false);
  };

  const cancelReservation = async (id: string) => {
    const { error } = await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) {
      toast.error(language === "pl" ? "Błąd anulowania" : "Cancellation error");
    } else {
      toast.success(language === "pl" ? "Rezerwacja anulowana" : "Reservation cancelled");
      fetchReservations();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === "pl" ? "pl-PL" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusConfig: Record<string, { label: { pl: string; en: string }; color: string; icon: any }> = {
    confirmed: {
      label: { pl: "Potwierdzona", en: "Confirmed" },
      color: "bg-green-50 text-green-700",
      icon: CheckCircle2,
    },
    pending: {
      label: { pl: "Oczekująca", en: "Pending" },
      color: "bg-amber-50 text-amber-700",
      icon: Clock,
    },
    cancelled: {
      label: { pl: "Anulowana", en: "Cancelled" },
      color: "bg-red-50 text-red-700",
      icon: XCircle,
    },
    completed: {
      label: { pl: "Zakończona", en: "Completed" },
      color: "bg-blue-50 text-blue-700",
      icon: CheckCircle2,
    },
  };

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
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
              {language === "pl" ? "Moje rezerwacje" : "My reservations"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {language === "pl"
                ? "Historia Twoich rezerwacji parkingowych"
                : "Your parking reservation history"}
            </p>
          </motion.div>

          {reservations.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-border/50">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                {language === "pl"
                  ? "Nie masz jeszcze żadnych rezerwacji"
                  : "You don't have any reservations yet"}
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-all"
              >
                {language === "pl" ? "Zarezerwuj parking" : "Book a parking"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation, index) => {
                const status = statusConfig[reservation.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                const parkingLot = (reservation as any).parking_lot;

                return (
                  <motion.div
                    key={reservation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl border border-border/50 p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display font-bold text-lg">
                            {parkingLot?.name || "Parking"}
                          </h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label[language]}
                          </span>
                        </div>

                        {/* Confirmation code */}
                        {(reservation as any).confirmation_code && reservation.status !== "cancelled" && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-muted-foreground">{language === "pl" ? "Kod:" : "Code:"}</span>
                            <span className="font-mono font-bold text-sm text-primary">{(reservation as any).confirmation_code}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText((reservation as any).confirmation_code);
                                toast.success(language === "pl" ? "Kod skopiowany!" : "Code copied!");
                              }}
                              className="p-1 rounded hover:bg-secondary transition-colors"
                            >
                              <Copy className="w-3 h-3 text-muted-foreground" />
                            </button>
                          </div>
                        )}

                        <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(reservation.arrival_date)} — {formatDate(reservation.departure_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Car className="w-3.5 h-3.5" />
                            <span className="uppercase">{reservation.car_plate}</span>
                          </div>
                          {parkingLot && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{parkingLot.airport_code} · {parkingLot.distance_km} km</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="font-display font-bold text-xl">{Number(reservation.total_price).toFixed(0)} zł</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {reservation.status === "confirmed" && (
                            <>
                              <button
                                onClick={() => navigate(`/confirmation/${reservation.id}`)}
                                className="px-3 py-2 text-xs font-medium text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {language === "pl" ? "Szczegóły" : "Details"}
                              </button>
                              <button
                                onClick={() => cancelReservation(reservation.id)}
                                className="px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                {language === "pl" ? "Anuluj" : "Cancel"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

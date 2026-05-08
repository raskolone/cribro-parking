/**
 * Confirmation Page — Shows reservation confirmation with unique code
 * Displayed after successful booking at /confirmation/:id
 */

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useParams, useLocation } from "wouter";
import {
  CheckCircle2,
  Copy,
  Calendar,
  MapPin,
  Car,
  Phone,
  User,
  Plane,
  Mail,
  Bell,
  Download,
  ArrowRight,
  Loader2,
  QrCode,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ReservationDetails {
  id: string;
  confirmation_code: string;
  full_name: string;
  phone: string;
  car_plate: string;
  flight_number: string | null;
  arrival_date: string;
  departure_date: string;
  total_price: number;
  status: string;
  email_notification_sent: boolean;
  owner_notified: boolean;
  created_at: string;
  parking_lot: {
    name: string;
    airport_code: string;
    distance_km: number;
    transfer_time_min: number;
  };
}

export default function Confirmation() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const reservationId = params.id;

  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reservationId) {
      fetchReservation();
    }
  }, [reservationId]);

  const fetchReservation = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reservations")
      .select("*, parking_lot:parking_lots(name, airport_code, distance_km, transfer_time_min)")
      .eq("id", reservationId)
      .single();

    if (error || !data) {
      toast.error(language === "pl" ? "Nie znaleziono rezerwacji" : "Reservation not found");
      navigate("/dashboard");
    } else {
      setReservation(data as any);
    }
    setLoading(false);
  };

  const copyCode = () => {
    if (reservation?.confirmation_code) {
      navigator.clipboard.writeText(reservation.confirmation_code);
      toast.success(language === "pl" ? "Kod skopiowany!" : "Code copied!");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === "pl" ? "pl-PL" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const days = reservation
    ? Math.max(1, Math.ceil((new Date(reservation.departure_date).getTime() - new Date(reservation.arrival_date).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!reservation) return null;

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-2xl">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
              {language === "pl" ? "Rezerwacja potwierdzona!" : "Reservation confirmed!"}
            </h1>
            <p className="text-muted-foreground">
              {language === "pl"
                ? "Twoje miejsce parkingowe jest zarezerwowane. Pokaż kod potwierdzenia na parkingu."
                : "Your parking spot is reserved. Show the confirmation code at the parking lot."}
            </p>
          </motion.div>

          {/* Confirmation Code Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border-2 border-primary/20 shadow-lg shadow-primary/5 p-8 mb-6"
          >
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {language === "pl" ? "Kod potwierdzenia" : "Confirmation code"}
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono font-bold text-4xl md:text-5xl tracking-widest text-primary">
                  {reservation.confirmation_code}
                </span>
                <button
                  onClick={copyCode}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title={language === "pl" ? "Kopiuj kod" : "Copy code"}
                >
                  <Copy className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {language === "pl"
                  ? "Pokaż ten kod przy wjeździe na parking"
                  : "Show this code at the parking entrance"}
              </p>
            </div>

            {/* QR Code placeholder */}
            <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-center">
              <div className="w-32 h-32 bg-secondary rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center">
                  <QrCode className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                  <span className="text-[10px] text-muted-foreground">QR Code</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reservation Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-border/50 p-6 mb-6"
          >
            <h2 className="font-display font-bold text-lg mb-4">
              {language === "pl" ? "Szczegóły rezerwacji" : "Reservation details"}
            </h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3 py-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{reservation.parking_lot?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {reservation.parking_lot?.airport_code} · {reservation.parking_lot?.distance_km} km · {reservation.parking_lot?.transfer_time_min} min transfer
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {formatDate(reservation.arrival_date)} — {formatDate(reservation.departure_date)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {days} {language === "pl" ? (days === 1 ? "doba" : "dób") : (days === 1 ? "day" : "days")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <User className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{reservation.full_name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Phone className="w-3 h-3" /> {reservation.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <Car className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium font-mono uppercase">{reservation.car_plate}</p>
                  {reservation.flight_number && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Plane className="w-3 h-3" /> {reservation.flight_number}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex justify-between items-center">
                <span className="font-medium">{language === "pl" ? "Do zapłaty" : "Total"}</span>
                <span className="font-display font-bold text-2xl text-primary">
                  {Number(reservation.total_price).toFixed(0)} zł
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === "pl" ? "Płatność przy odbiorze pojazdu" : "Payment upon vehicle pickup"}
              </p>
            </div>
          </motion.div>

          {/* Notification Status (Placeholder) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-border/50 p-6 mb-6"
          >
            <h3 className="font-semibold text-sm mb-4">
              {language === "pl" ? "Powiadomienia" : "Notifications"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {language === "pl" ? "Email z potwierdzeniem" : "Confirmation email"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === "pl"
                      ? "Oczekuje na wysłanie (system w przygotowaniu)"
                      : "Pending delivery (system in preparation)"}
                  </p>
                </div>
                <span className="px-2 py-1 text-[10px] font-medium bg-amber-50 text-amber-700 rounded-full">
                  {language === "pl" ? "Wkrótce" : "Soon"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {language === "pl" ? "Powiadomienie do parkingu" : "Parking lot notification"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === "pl"
                      ? "Właściciel parkingu zostanie powiadomiony o Twojej rezerwacji"
                      : "Parking lot owner will be notified about your reservation"}
                  </p>
                </div>
                <span className="px-2 py-1 text-[10px] font-medium bg-amber-50 text-amber-700 rounded-full">
                  {language === "pl" ? "Wkrótce" : "Soon"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={() => navigate("/my-reservations")}
              className="flex-1 h-12 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {language === "pl" ? "Moje rezerwacje" : "My reservations"}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 h-12 border border-border rounded-lg text-sm font-medium hover:bg-secondary/50 transition-all"
            >
              {language === "pl" ? "Wróć na stronę główną" : "Back to homepage"}
            </button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

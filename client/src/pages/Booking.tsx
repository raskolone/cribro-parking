/**
 * Booking Page — Full reservation workflow
 * Step 1: Parking details + dates
 * Step 2: Customer info form
 * Step 3: Summary + confirm
 * After confirm → redirect to /confirmation/:id
 */

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, ParkingLot } from "@/lib/supabase";
import { useLocation, useParams } from "wouter";
import { MapPin, Bus, Shield, Star, Calendar, User, Phone, Car, Plane, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Booking() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const parkingId = params.id;

  const searchParams = new URLSearchParams(window.location.search);
  const arrivalDate = searchParams.get("arrival") || "";
  const departureDate = searchParams.get("departure") || "";

  const [parking, setParking] = useState<ParkingLot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Form state
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [phone, setPhone] = useState("");
  const [carPlate, setCarPlate] = useState("");
  const [flightNumber, setFlightNumber] = useState("");

  // Calculate days
  const days = arrivalDate && departureDate
    ? Math.max(1, Math.ceil((new Date(departureDate).getTime() - new Date(arrivalDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  useEffect(() => {
    fetchParking();
  }, [parkingId]);

  const fetchParking = async () => {
    if (!parkingId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("parking_lots")
      .select("*")
      .eq("id", parkingId)
      .single();

    if (error || !data) {
      toast.error(language === "pl" ? "Nie znaleziono parkingu" : "Parking not found");
      navigate("/");
    } else {
      setParking(data);
    }
    setLoading(false);
  };

  const totalPrice = parking ? Number(parking.price_per_day) * days : 0;

  const handleSubmit = async () => {
    if (!user) {
      toast.error(language === "pl" ? "Musisz być zalogowany, aby dokonać rezerwacji" : "You must be logged in to make a reservation");
      navigate("/auth");
      return;
    }

    if (!fullName.trim() || !phone.trim() || !carPlate.trim()) {
      toast.error(language === "pl" ? "Wypełnij wszystkie wymagane pola" : "Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase.from("reservations").insert({
      user_id: user.id,
      parking_lot_id: parkingId,
      arrival_date: arrivalDate,
      departure_date: departureDate,
      full_name: fullName,
      phone,
      car_plate: carPlate.toUpperCase(),
      flight_number: flightNumber || null,
      total_price: totalPrice,
      status: "confirmed",
    }).select().single();

    if (error) {
      toast.error(language === "pl" ? "Błąd rezerwacji: " + error.message : "Booking error: " + error.message);
    } else if (data) {
      // Create placeholder notification log entries
      await supabase.from("notifications_log").insert([
        {
          reservation_id: data.id,
          recipient_email: user.email || "",
          recipient_type: "client",
          notification_type: "booking_confirmation",
          status: "pending",
        },
        {
          reservation_id: data.id,
          recipient_email: "owner@parking.pl", // placeholder
          recipient_type: "owner",
          notification_type: "booking_confirmation",
          status: "pending",
        },
      ]);

      toast.success(language === "pl" ? "Rezerwacja potwierdzona!" : "Reservation confirmed!");
      navigate(`/confirmation/${data.id}`);
    }

    setSubmitting(false);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(language === "pl" ? "pl-PL" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!parking) return null;

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl">
          {/* Back button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === "pl" ? "Wróć do wyników" : "Back to results"}
          </button>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
            <span className="ml-3 text-sm text-muted-foreground">
              {step === 1 && (language === "pl" ? "Szczegóły parkingu" : "Parking details")}
              {step === 2 && (language === "pl" ? "Dane klienta" : "Customer info")}
              {step === 3 && (language === "pl" ? "Podsumowanie" : "Summary")}
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Parking Details */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl border border-border/50 p-6"
                >
                  <h2 className="font-display font-bold text-xl mb-4">
                    {parking.name}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {language === "pl" ? parking.description_pl : parking.description_en}
                  </p>

                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{parking.distance_km} km</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Bus className="w-4 h-4 text-primary" />
                      <span>{parking.transfer_time_min} min transfer</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{parking.rating} ({parking.reviews_count})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {parking.features.map((f) => (
                      <span key={f} className="px-3 py-1 bg-secondary text-xs font-medium rounded-md">
                        {f}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm"
                  >
                    {language === "pl" ? "Dalej — Podaj dane" : "Next — Enter details"}
                  </button>
                </motion.div>
              )}

              {/* Step 2: Customer Form */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl border border-border/50 p-6"
                >
                  <h2 className="font-display font-bold text-xl mb-6">
                    {language === "pl" ? "Dane rezerwacji" : "Reservation details"}
                  </h2>

                  {!user && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-amber-800">
                        {language === "pl"
                          ? "Zaloguj się, aby dokonać rezerwacji i mieć dostęp do historii."
                          : "Log in to make a reservation and access your history."}
                        {" "}
                        <a href="/auth" className="font-medium underline">
                          {language === "pl" ? "Zaloguj się" : "Log in"}
                        </a>
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        {language === "pl" ? "Imię i nazwisko *" : "Full name *"}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={language === "pl" ? "Jan Kowalski" : "John Doe"}
                          required
                          className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-secondary/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        {language === "pl" ? "Numer telefonu *" : "Phone number *"}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+48 123 456 789"
                          required
                          className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-secondary/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        {language === "pl" ? "Numer rejestracyjny *" : "License plate *"}
                      </label>
                      <div className="relative">
                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={carPlate}
                          onChange={(e) => setCarPlate(e.target.value)}
                          placeholder="SK 12345"
                          required
                          className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-secondary/30 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        {language === "pl" ? "Numer lotu (opcjonalnie)" : "Flight number (optional)"}
                      </label>
                      <div className="relative">
                        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={flightNumber}
                          onChange={(e) => setFlightNumber(e.target.value)}
                          placeholder="W6 1234"
                          className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-secondary/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="h-12 px-6 border border-border rounded-lg text-sm font-medium hover:bg-secondary/50 transition-all"
                    >
                      {language === "pl" ? "Wstecz" : "Back"}
                    </button>
                    <button
                      onClick={() => {
                        if (!fullName.trim() || !phone.trim() || !carPlate.trim()) {
                          toast.error(language === "pl" ? "Wypełnij wymagane pola" : "Fill required fields");
                          return;
                        }
                        setStep(3);
                      }}
                      className="flex-1 h-12 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm"
                    >
                      {language === "pl" ? "Dalej — Podsumowanie" : "Next — Summary"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Summary */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl border border-border/50 p-6"
                >
                  <h2 className="font-display font-bold text-xl mb-6">
                    {language === "pl" ? "Podsumowanie rezerwacji" : "Reservation summary"}
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">{language === "pl" ? "Parking" : "Parking"}</span>
                      <span className="font-medium">{parking.name}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">{language === "pl" ? "Przyjazd" : "Arrival"}</span>
                      <span className="font-medium">{formatDate(arrivalDate)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">{language === "pl" ? "Wyjazd" : "Departure"}</span>
                      <span className="font-medium">{formatDate(departureDate)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">{language === "pl" ? "Liczba dób" : "Number of days"}</span>
                      <span className="font-medium">{days}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">{language === "pl" ? "Imię i nazwisko" : "Full name"}</span>
                      <span className="font-medium">{fullName}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">{language === "pl" ? "Telefon" : "Phone"}</span>
                      <span className="font-medium">{phone}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border/50">
                      <span className="text-muted-foreground">{language === "pl" ? "Rejestracja" : "License plate"}</span>
                      <span className="font-medium uppercase">{carPlate}</span>
                    </div>
                    {flightNumber && (
                      <div className="flex justify-between py-3 border-b border-border/50">
                        <span className="text-muted-foreground">{language === "pl" ? "Numer lotu" : "Flight number"}</span>
                        <span className="font-medium">{flightNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{language === "pl" ? "Do zapłaty" : "Total"}</span>
                      <span className="font-display font-bold text-2xl text-primary">{totalPrice.toFixed(0)} zł</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === "pl" ? "Płatność przy odbiorze pojazdu" : "Payment upon vehicle pickup"}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="h-12 px-6 border border-border rounded-lg text-sm font-medium hover:bg-secondary/50 transition-all"
                    >
                      {language === "pl" ? "Wstecz" : "Back"}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !user}
                      className="flex-1 h-12 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {language === "pl" ? "Potwierdź rezerwację" : "Confirm reservation"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar — Price Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-border/50 p-6 sticky top-28">
                <h3 className="font-display font-bold text-lg mb-4">{parking.name}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(arrivalDate)} — {formatDate(departureDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{parking.distance_km} km · {parking.transfer_time_min} min</span>
                  </div>
                </div>
                <div className="border-t border-border/50 mt-4 pt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{parking.price_per_day} zł × {days} {language === "pl" ? "dób" : "days"}</span>
                    <span className="font-medium">{totalPrice.toFixed(0)} zł</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-border/50">
                    <span>{language === "pl" ? "Razem" : "Total"}</span>
                    <span className="text-primary">{totalPrice.toFixed(0)} zł</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

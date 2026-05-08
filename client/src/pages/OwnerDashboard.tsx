/**
 * Owner Dashboard — B2B Panel for Parking Lot Owners
 * Shows incoming reservations, client data, and basic stats.
 * Access: /owner (protected — requires owner or admin role)
 */

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import {
  CalendarDays,
  Car,
  Phone,
  User,
  Plane,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  LogOut,
  ChevronDown,
  Search,
  Filter,
  Loader2,
  ShieldAlert,
  Ticket,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface OwnerReservation {
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
  created_at: string;
  parking_lot: {
    id: string;
    name: string;
    airport_code: string;
  };
}

export default function OwnerDashboard() {
  const { language } = useLanguage();
  const { user, role, signOut, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [reservations, setReservations] = useState<OwnerReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user && !authLoading) {
      // Allow access for owners and admins; clients see access denied
      if (role === "owner" || role === "admin") {
        fetchReservations();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading, role]);

  const fetchReservations = async () => {
    setLoading(true);

    let query = supabase
      .from("reservations")
      .select(`*, parking_lot:parking_lots(id, name, airport_code)`)
      .order("arrival_date", { ascending: true });

    // If owner (not admin), filter by assigned parking lots
    if (role === "owner") {
      const { data: assignments } = await supabase
        .from("parking_lot_owners")
        .select("parking_lot_id")
        .eq("user_id", user!.id);

      if (assignments && assignments.length > 0) {
        const lotIds = assignments.map((a) => a.parking_lot_id);
        query = query.in("parking_lot_id", lotIds);
      } else {
        // Owner with no assigned lots — show empty
        setReservations([]);
        setLoading(false);
        return;
      }
    }
    // Admin sees all reservations

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching reservations:", error);
      toast.error(language === "pl" ? "Błąd ładowania rezerwacji" : "Error loading reservations");
    } else {
      setReservations(data || []);
    }
    setLoading(false);
  };

  const handleStatusChange = async (reservationId: string, newStatus: string) => {
    const { error } = await supabase
      .from("reservations")
      .update({ status: newStatus })
      .eq("id", reservationId);

    if (error) {
      toast.error(language === "pl" ? "Błąd aktualizacji" : "Update error");
    } else {
      toast.success(language === "pl" ? "Status zaktualizowany" : "Status updated");
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

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === "pl" ? "pl-PL" : "en-US", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const today = new Date().toISOString().split("T")[0];
  const upcomingReservations = reservations.filter((r) => r.arrival_date >= today && r.status !== "cancelled");
  const pastReservations = reservations.filter((r) => r.departure_date < today || r.status === "cancelled");

  const filteredReservations = filter === "upcoming" ? upcomingReservations : filter === "past" ? pastReservations : reservations;

  const searchFiltered = searchQuery
    ? filteredReservations.filter(
        (r) =>
          r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.car_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.phone.includes(searchQuery) ||
          (r.confirmation_code && r.confirmation_code.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filteredReservations;

  // Stats
  const totalRevenue = reservations.reduce((sum, r) => sum + Number(r.total_price), 0);
  const confirmedCount = reservations.filter((r) => r.status === "confirmed").length;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Access denied for non-owner/admin users
  if (role !== "owner" && role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="font-display font-bold text-xl mb-2">
            {language === "pl" ? "Brak dostępu" : "Access Denied"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === "pl"
              ? "Ten panel jest dostępny tylko dla właścicieli parkingów. Jeśli jesteś właścicielem parkingu, skontaktuj się z administratorem w celu przyznania dostępu."
              : "This panel is only available for parking lot owners. If you are a parking lot owner, contact the administrator to grant access."}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-all"
          >
            {language === "pl" ? "Wróć do panelu klienta" : "Back to client dashboard"}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Owner Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Plane className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-foreground">
                  Cribro<span className="text-primary"> Parking</span>
                </span>
                <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-700 rounded-full">
                  {role === "admin"
                    ? (language === "pl" ? "Admin" : "Admin")
                    : (language === "pl" ? "Panel Właściciela" : "Owner Panel")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.user_metadata?.full_name || user?.email}
              </span>
              <button
                onClick={async () => { await signOut(); navigate("/"); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "pl" ? "Wyloguj" : "Log out"}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            {language === "pl" ? "Panel zarządzania" : "Management Panel"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "pl"
              ? "Przeglądaj nadchodzące rezerwacje i zarządzaj swoimi parkingami"
              : "View upcoming reservations and manage your parking lots"}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingReservations.length}</p>
                <p className="text-xs text-muted-foreground">
                  {language === "pl" ? "Nadchodzące" : "Upcoming"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{confirmedCount}</p>
                <p className="text-xs text-muted-foreground">
                  {language === "pl" ? "Potwierdzone" : "Confirmed"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reservations.length}</p>
                <p className="text-xs text-muted-foreground">
                  {language === "pl" ? "Łącznie rezerwacji" : "Total bookings"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalRevenue.toFixed(0)} zł</p>
                <p className="text-xs text-muted-foreground">
                  {language === "pl" ? "Przychód" : "Revenue"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6"
        >
          <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-slate-100">
            {/* Filter tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setFilter("upcoming")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  filter === "upcoming"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {language === "pl" ? "Nadchodzące" : "Upcoming"} ({upcomingReservations.length})
              </button>
              <button
                onClick={() => setFilter("past")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  filter === "past"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {language === "pl" ? "Przeszłe" : "Past"} ({pastReservations.length})
              </button>
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  filter === "all"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {language === "pl" ? "Wszystkie" : "All"} ({reservations.length})
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "pl" ? "Szukaj (imię, rejestracja, tel., kod)" : "Search (name, plate, phone, code)"}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Reservations Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : searchFiltered.length === 0 ? (
              <div className="p-12 text-center">
                <CalendarDays className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {language === "pl" ? "Brak rezerwacji do wyświetlenia" : "No reservations to display"}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                      {language === "pl" ? "Kod" : "Code"}
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                      {language === "pl" ? "Klient" : "Client"}
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                      {language === "pl" ? "Pojazd" : "Vehicle"}
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                      {language === "pl" ? "Okres" : "Period"}
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                      {language === "pl" ? "Parking" : "Parking"}
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                      {language === "pl" ? "Kwota" : "Amount"}
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                      {language === "pl" ? "Akcje" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchFiltered.map((reservation) => (
                    <tr key={reservation.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/5 text-primary font-mono text-xs font-bold rounded">
                          <Ticket className="w-3 h-3" />
                          {reservation.confirmation_code || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-sm font-medium text-foreground">{reservation.full_name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            {reservation.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-sm font-mono font-medium uppercase">{reservation.car_plate}</p>
                          {reservation.flight_number && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Plane className="w-3 h-3" />
                              {reservation.flight_number}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-sm">
                          <p className="text-foreground">{formatShortDate(reservation.arrival_date)} — {formatShortDate(reservation.departure_date)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {Math.ceil((new Date(reservation.departure_date).getTime() - new Date(reservation.arrival_date).getTime()) / (1000 * 60 * 60 * 24))}{" "}
                            {language === "pl" ? "dni" : "days"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-sm">
                          <p className="text-foreground">{reservation.parking_lot?.name}</p>
                          <p className="text-xs text-muted-foreground">{reservation.parking_lot?.airport_code}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold">{Number(reservation.total_price).toFixed(0)} zł</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={reservation.status} language={language} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1">
                          {reservation.status === "pending" && (
                            <button
                              onClick={() => handleStatusChange(reservation.id, "confirmed")}
                              className="px-2.5 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                            >
                              {language === "pl" ? "Potwierdź" : "Confirm"}
                            </button>
                          )}
                          {(reservation.status === "pending" || reservation.status === "confirmed") && (
                            <button
                              onClick={() => handleStatusChange(reservation.id, "cancelled")}
                              className="px-2.5 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
                            >
                              {language === "pl" ? "Anuluj" : "Cancel"}
                            </button>
                          )}
                          {reservation.status === "confirmed" && (
                            <button
                              onClick={() => handleStatusChange(reservation.id, "completed")}
                              className="px-2.5 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              {language === "pl" ? "Zakończ" : "Complete"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-5"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                {language === "pl" ? "System ról aktywny" : "Role system active"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "pl"
                  ? "Panel filtruje rezerwacje na podstawie przypisanych parkingów. Administratorzy widzą wszystkie rezerwacje. Aby przypisać parkingi do właściciela, użyj tabeli parking_lot_owners w Supabase."
                  : "Panel filters reservations based on assigned parking lots. Admins see all reservations. To assign parking lots to an owner, use the parking_lot_owners table in Supabase."}
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function StatusBadge({ status, language }: { status: string; language: string }) {
  const config: Record<string, { bg: string; text: string; label_pl: string; label_en: string; icon: typeof CheckCircle2 }> = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", label_pl: "Oczekuje", label_en: "Pending", icon: Clock },
    confirmed: { bg: "bg-green-50", text: "text-green-700", label_pl: "Potwierdzona", label_en: "Confirmed", icon: CheckCircle2 },
    cancelled: { bg: "bg-red-50", text: "text-red-700", label_pl: "Anulowana", label_en: "Cancelled", icon: XCircle },
    completed: { bg: "bg-blue-50", text: "text-blue-700", label_pl: "Zakończona", label_en: "Completed", icon: CheckCircle2 },
  };

  const c = config[status] || config.pending;
  const Icon = c.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />
      {language === "pl" ? c.label_pl : c.label_en}
    </span>
  );
}

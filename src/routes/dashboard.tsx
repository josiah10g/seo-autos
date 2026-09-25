import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  Car,
  ShoppingBag,
  ExternalLink,
  RefreshCw,
  XCircle,
  CheckCircle2,
  Clock4,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { db, type BookingRecord, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

interface SessionUser {
  email: string;
  fullName: string;
  role: "admin" | "customer";
}

const LOCAL_SESSION_KEY = "seo_autos_active_user";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Orders & Bookings | SEO Autos Investment Limited" },
      { name: "description", content: "View and track your vehicle inspection orders and requests." },
    ],
  }),
  component: CustomerDashboardPage,
});

function CustomerDashboardPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_SESSION_KEY);
      if (stored) {
        try {
          const user = JSON.parse(stored);
          setCurrentUser(user);
          loadCustomerBookings(user.email);
          return;
        } catch {
          // ignore
        }
      }
      setIsLoading(false);
    }
  }, []);

  const loadCustomerBookings = async (userEmail?: string) => {
    setIsLoading(true);
    try {
      const data = await db.getCustomerBookings(userEmail);
      setBookings(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load your orders.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (id: string) => {
    if (confirm("Are you sure you want to cancel this inspection request?")) {
      try {
        await db.updateBookingStatus(id, "cancelled");
        toast.success("Inspection booking cancelled.");
        if (currentUser) {
          loadCustomerBookings(currentUser.email);
        }
      } catch {
        toast.error("Failed to cancel request.");
      }
    }
  };

  if (!currentUser && !isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 py-16">
        <div className="max-w-md w-full text-center space-y-5 rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight uppercase text-foreground">
            Customer Dashboard
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Please log in or create an account to view and manage your vehicle inspection orders and bookings.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow transition hover:bg-primary/90"
            >
              Browse Inventory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Banner */}
      <section className="border-b border-border/80 bg-brand-ink py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary border border-primary/30">
                  Customer Portal
                </span>
                {!isSupabaseConfigured && (
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30">
                    Demo Storage
                  </span>
                )}
              </div>
              <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wider text-white sm:text-4xl">
                My Orders & Bookings
              </h1>
              <p className="mt-1 text-sm text-zinc-300">
                Welcome, <strong className="text-white">{currentUser?.fullName}</strong>. Track your in-person vehicle inspections and car purchase requests.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => currentUser && loadCustomerBookings(currentUser.email)}
                className="gap-2 rounded-full border-zinc-700 bg-zinc-900/60 text-xs font-bold uppercase tracking-wider text-zinc-200 hover:bg-zinc-800 hover:text-white"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow transition hover:bg-primary/90"
              >
                <Car className="h-3.5 w-3.5" />
                Browse Vehicles
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <Clock4 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-white">{pendingCount}</div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                    Awaiting Yard Review
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-white">{confirmedCount}</div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                    Confirmed Appointments
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-white">{completedCount}</div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                    Completed Visits
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Orders List */}
      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <div>
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
              Inspection Orders ({bookings.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Direct physical inspection and purchase appointments at our Lagos car yard.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted-foreground font-medium">Loading your orders...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Car className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-wide text-foreground">
              No orders yet
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
              You haven't requested any vehicle inspections yet. Browse our Honda and Acura collection to book a visit.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow transition hover:bg-primary/90"
              >
                Browse Available Cars
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => {
              const statusBadge =
                booking.status === "confirmed"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : booking.status === "completed"
                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  : booking.status === "cancelled"
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20";

              const whatsappUrl = `https://wa.me/2348086833676?text=${encodeURIComponent(
                `Hello SEO Autos! Inquiring about my inspection request #${booking.id.slice(0, 8)} for ${booking.vehicle_name}.`
              )}`;

              return (
                <div
                  key={booking.id}
                  className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="space-y-4">
                    {/* Header: Vehicle Name & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Order #{booking.id.slice(0, 8)}
                        </span>
                        <h3 className="font-display text-lg font-bold uppercase text-foreground leading-snug">
                          {booking.vehicle_name}
                        </h3>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBadge}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* Inspection schedule details */}
                    <div className="rounded-lg bg-muted/40 p-3 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <Calendar className="h-4 w-4 text-primary shrink-0" />
                        <span>Date: <strong className="font-semibold">{booking.preferred_date}</strong></span>
                      </div>
                      {booking.preferred_time && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4 text-primary shrink-0" />
                          <span>Window: {booking.preferred_time}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4 text-primary shrink-0" />
                        <span>Contact: {booking.customer_phone}</span>
                      </div>
                      {booking.notes && (
                        <div className="flex items-start gap-2 pt-1 border-t border-border/60 text-muted-foreground">
                          <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span className="italic leading-relaxed">"{booking.notes}"</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Chat on WhatsApp
                    </a>

                    {booking.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(booking.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-destructive transition"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

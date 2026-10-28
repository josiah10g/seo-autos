import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Car,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  Calendar,
  Phone,
  Mail,
  FileText,
  Upload,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Eye,
  Lock,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  AlertTriangle,
  ImagePlus,
  X,
  ChevronLeft,
  ChevronRight,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  db,
  supabase,
  type VehicleListing,
  type BookingRecord,
  type UserProfile,
  isSupabaseConfigured,
} from "@/lib/supabase";
import { toast } from "sonner";

interface SessionUser {
  email: string;
  fullName: string;
  role: "admin" | "customer";
}

const LOCAL_SESSION_KEY = "seo_autos_active_user";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<"vehicles" | "bookings" | "admins" | "users">("vehicles");
  const [vehicles, setVehicles] = useState<VehicleListing[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [newAdminEmailInput, setNewAdminEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [vehiclesPage, setVehiclesPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Vehicle Modal state
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleListing | null>(null);

  // Confirmation Card States (Replacing window notifications/confirms)
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleListing | null>(null);
  const [adminToRemove, setAdminToRemove] = useState<string | null>(null);
  const [userToRemove, setUserToRemove] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formCategory, setFormCategory] = useState<"Sedan" | "SUV" | "All">("Sedan");
  const [formTagline, setFormTagline] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formBadge, setFormBadge] = useState("Fresh Import");
  const [formCondition, setFormCondition] = useState<"Foreign Used (Tokunbo)" | "Clean Condition">(
    "Foreign Used (Tokunbo)"
  );
  const [formPriceStatus, setFormPriceStatus] = useState<"Available on Request" | "Call for Best Price">(
    "Available on Request"
  );
  const [formSpecs, setFormSpecs] = useState("");
  const [formImages, setFormImages] = useState<{ src: string; alt: string; label: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadAdminEmails = () => {
    const list = db.getAdminEmails();
    setAdminEmails(list);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [vData, bData, uData] = await Promise.all([
        db.getVehicles(),
        db.getBookings(),
        db.getUsers(),
      ]);
      setVehicles(vData);
      setBookings(bData);
      setUsersList(uData);
      loadAdminEmails();
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmailInput) return;
    const res = db.addAdminEmail(newAdminEmailInput);
    if (res.success) {
      toast.success(res.message);
      setNewAdminEmailInput("");
      loadAdminEmails();
    } else {
      toast.error(res.message);
    }
  };

  const confirmRemoveAdmin = (targetEmail: string) => {
    setAdminToRemove(targetEmail);
  };

  const handleExecuteRemoveAdmin = () => {
    if (!adminToRemove) return;
    const target = adminToRemove;
    const res = db.removeAdminEmail(target);
    if (res.success) {
      toast.success(res.message);
      loadAdminEmails();
    } else {
      toast.error(res.message);
    }
    setAdminToRemove(null);
  };

  const confirmRemoveUser = (user: UserProfile) => {
    setUserToRemove(user);
  };

  const handleExecuteRemoveUser = async () => {
    if (!userToRemove) return;
    try {
      const res = await db.removeUser(userToRemove.id || userToRemove.email);
      if (res.success) {
        toast.success(res.message);
        loadData();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to remove user.");
    } finally {
      setUserToRemove(null);
    }
  };

  useEffect(() => {
    const syncUser = async () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(LOCAL_SESSION_KEY);
        if (stored) {
          try {
            const user: SessionUser = JSON.parse(stored);
            let userRole = user.role;

            if (db.isEmailAdmin(user.email)) {
              userRole = "admin";
              user.role = "admin";
              localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
            } else if (supabase && userRole !== "admin") {
              try {
                const { data: profile } = await supabase
                  .from("profiles")
                  .select("role")
                  .eq("email", user.email)
                  .single();
                if (profile?.role === "admin") {
                  userRole = "admin";
                  user.role = "admin";
                  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
                }
              } catch {
                // ignore
              }
            }

            setCurrentUser(user);
            setAuthChecked(true);
            if (userRole === "admin") {
              loadData();
            } else {
              setIsLoading(false);
            }
            return;
          } catch {
            // ignore
          }
        }
        setCurrentUser(null);
        setAuthChecked(true);
        setIsLoading(false);
      }
    };

    syncUser();

    window.addEventListener("auth:changed", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("auth:changed", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const openNewVehicleModal = () => {
    setEditingVehicle(null);
    setFormName("");
    setFormYear(new Date().getFullYear().toString());
    setFormCategory("Sedan");
    setFormTagline("");
    setFormDescription("");
    setFormBadge("Fresh Import");
    setFormCondition("Foreign Used (Tokunbo)");
    setFormPriceStatus("Available on Request");
    setFormSpecs("");
    setFormImages([]);
    setVehicleModalOpen(true);
  };

  const openEditVehicleModal = (v: VehicleListing) => {
    setEditingVehicle(v);
    setFormName(v.name);
    setFormYear(v.year);
    setFormCategory(v.category);
    setFormTagline(v.tagline);
    setFormDescription(v.description);
    setFormBadge(v.badge);
    setFormCondition(v.condition);
    setFormPriceStatus(v.priceStatus);
    setFormSpecs(v.specs.join("\n"));
    setFormImages(v.images || []);
    setVehicleModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);

    const files = Array.from(e.target.files);
    for (const file of files) {
      const res = await db.uploadImage(file);
      if (res.url) {
        setFormImages((prev) => [
          ...prev,
          {
            src: res.url!,
            alt: `${formName || "Vehicle"} photo`,
            label: `Photo ${prev.length + 1}`,
          },
        ]);
      }
    }
    setIsUploading(false);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formYear) {
      toast.error("Please provide both model name and year.");
      return;
    }

    if (formImages.length === 0) {
      toast.error("Please upload at least one vehicle photo before saving.");
      return;
    }

    setIsSaving(true);
    const specsArray = formSpecs
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const id =
      editingVehicle?.id ||
      `${formName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;

    const vehicleToSave: VehicleListing = {
      id,
      name: formName,
      year: formYear,
      category: formCategory,
      tagline: formTagline || "Inspected and ready for Lagos handover",
      description: formDescription || "Foreign used Honda/Acura vehicle in sound mechanical order.",
      badge: formBadge,
      condition: formCondition,
      priceStatus: formPriceStatus,
      transmission: "Automatic",
      fuel: "Petrol",
      specs: specsArray.length > 0 ? specsArray : ["Sound engine and transmission", "Customs duty cleared"],
      images: formImages,
      isAvailable: true,
    };

    try {
      const res = await db.saveVehicle(vehicleToSave);
      if (res.success) {
        toast.success(editingVehicle ? "Vehicle updated successfully!" : "Vehicle added to inventory!");
      } else {
        toast.error("Failed to save vehicle. Check connection.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save vehicle.");
    } finally {
      setIsSaving(false);
      setVehicleModalOpen(false);
      loadData();
    }
  };

  const promptDeleteVehicle = (vehicle: VehicleListing) => {
    setVehicleToDelete(vehicle);
  };

  const handleExecuteDeleteVehicle = async () => {
    if (!vehicleToDelete) return;
    setIsDeleting(true);
    try {
      const res = await db.deleteVehicle(vehicleToDelete.id);
      if (res.success) {
        toast.success(`"${vehicleToDelete.name}" removed from inventory.`);
      } else {
        toast.error("Failed to delete vehicle.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error deleting vehicle.");
    } finally {
      setIsDeleting(false);
      setVehicleToDelete(null);
      loadData();
    }
  };

  const handleBookingStatusChange = async (id: string, status: BookingRecord["status"]) => {
    try {
      await db.updateBookingStatus(id, status);
      toast.success(`Booking status updated to ${status}`);
    } catch (err: any) {
      toast.error("Failed to update status.");
    }
    loadData();
  };

  if (authChecked && (!currentUser || currentUser.role !== "admin")) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-background px-4 py-16">
        <div className="max-w-md w-full text-center space-y-5 rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight uppercase text-foreground">
            Admin Access Restricted
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentUser
              ? `You are signed in as ${currentUser.fullName} (Customer). Only verified administrators can access the vehicle inventory manager and booking portal.`
              : "You must be logged in with an administrator account to access the vehicle management dashboard."}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow transition hover:bg-primary/90"
            >
              Back to Home
            </Link>
            {currentUser && (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-border bg-muted/60 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground shadow transition hover:bg-muted"
              >
                Customer Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Header Banner */}
      <section className="border-b border-border/80 bg-brand-ink py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" /> Staff Access
                </span>
                {!isSupabaseConfigured && (
                  <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-semibold text-amber-300 border border-amber-500/30">
                    Local Demo Mode
                  </span>
                )}
              </div>
              <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl">
                SEO Autos Yard Dashboard
              </h1>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                Live inventory administration, customer yard booking requests, and vehicle photos.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={openNewVehicleModal}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Vehicle
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex gap-3 border-b border-white/10 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("vehicles")}
              className={`flex items-center gap-2 pb-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "vehicles"
                  ? "border-b-2 border-primary text-primary"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Car className="h-4 w-4" />
              Vehicles Inventory ({vehicles.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-2 pb-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "bookings"
                  ? "border-b-2 border-primary text-primary"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Inspection Requests ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("admins")}
              className={`flex items-center gap-2 pb-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "admins"
                  ? "border-b-2 border-primary text-primary"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Access ({adminEmails.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 pb-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "users"
                  ? "border-b-2 border-primary text-primary"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" />
              User Directory ({usersList.length})
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {activeTab === "vehicles" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase tracking-wide">
                Current Yard Stock
              </h2>
              <span className="text-xs text-muted-foreground">
                Showing {vehicles.length > 0 ? (vehiclesPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
                {Math.min(vehiclesPage * ITEMS_PER_PAGE, vehicles.length)} of {vehicles.length} vehicle(s)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vehicles
                .slice((vehiclesPage - 1) * ITEMS_PER_PAGE, vehiclesPage * ITEMS_PER_PAGE)
                .map((v) => {
                const mainImg = v.images?.[0]?.src || "/favicon.png";
                return (
                  <div
                    key={v.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] w-full bg-muted overflow-hidden">
                      <img
                        src={mainImg}
                        alt={v.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <span className="rounded-md bg-brand-ink/90 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                          {v.badge}
                        </span>
                        <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-secondary-foreground">
                          {v.category}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white">
                        {v.images?.length || 0} photo(s)
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {v.year}
                      </span>
                      <h3 className="font-display text-xl font-bold uppercase text-foreground">
                        {v.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {v.tagline}
                      </p>

                      <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Condition:</span>
                          <span className="font-semibold text-foreground">{v.condition}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Price Tag:</span>
                          <span className="font-semibold text-foreground">{v.priceStatus}</span>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-end gap-2 border-t border-border/80 pt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditVehicleModal(v)}
                          className="h-8 gap-1 text-xs cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => promptDeleteVehicle(v)}
                          className="h-8 gap-1 text-xs cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vehicles Pagination */}
            {vehicles.length > ITEMS_PER_PAGE && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
                <span className="text-xs text-muted-foreground">
                  Page {vehiclesPage} of {Math.ceil(vehicles.length / ITEMS_PER_PAGE)}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={vehiclesPage <= 1}
                    onClick={() => setVehiclesPage((p) => Math.max(1, p - 1))}
                    className="h-8 gap-1 text-xs cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={vehiclesPage >= Math.ceil(vehicles.length / ITEMS_PER_PAGE)}
                    onClick={() => setVehiclesPage((p) => p + 1)}
                    className="h-8 gap-1 text-xs cursor-pointer"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase tracking-wide">
                Customer Yard Visit &amp; Purchase Requests
              </h2>
              <span className="text-xs text-muted-foreground">
                Total: {bookings.length}
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 opacity-30" />
                <p className="mt-3 text-sm font-medium">No inspection requests yet.</p>
                <p className="text-xs">Customer bookings from the vehicle showcase will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings
                  .slice((bookingsPage - 1) * ITEMS_PER_PAGE, bookingsPage * ITEMS_PER_PAGE)
                  .map((b) => {
                    const whatsappMsg = encodeURIComponent(
                      `Hello ${b.customer_name}, this is SEO Autos regarding your inspection request for the ${b.vehicle_name} on ${b.preferred_date}.`
                    );
                    return (
                      <div
                        key={b.id}
                        className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                                b.status === "completed"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : b.status === "confirmed"
                                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                  : b.status === "cancelled"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              {b.status}
                            </span>
                            <span className="text-sm font-bold text-foreground">
                              {b.vehicle_name}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              👤 {b.customer_name}
                            </span>
                            <span>📞 {b.customer_phone}</span>
                            {b.customer_email && <span>✉️ {b.customer_email}</span>}
                            <span>📅 {b.preferred_date} ({b.preferred_time || "Flexible"})</span>
                          </div>

                          {b.notes && (
                            <p className="mt-1 rounded bg-muted/40 p-2 text-xs italic text-muted-foreground">
                              "{b.notes}"
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                          <select
                            value={b.status}
                            onChange={(e) =>
                              handleBookingStatusChange(b.id, e.target.value as BookingRecord["status"])
                            }
                            className="rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <a
                            href={`https://wa.me/${b.customer_phone.replace(/[^0-9]/g, "")}?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#20bd5a]"
                          >
                            <Phone className="h-3.5 w-3.5" /> WhatsApp
                          </a>
                        </div>
                      </div>
                    );
                  })}

                {/* Bookings Pagination */}
                {bookings.length > ITEMS_PER_PAGE && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
                    <span className="text-xs text-muted-foreground">
                      Showing {(bookingsPage - 1) * ITEMS_PER_PAGE + 1}-
                      {Math.min(bookingsPage * ITEMS_PER_PAGE, bookings.length)} of {bookings.length} requests
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={bookingsPage <= 1}
                        onClick={() => setBookingsPage((p) => Math.max(1, p - 1))}
                        className="h-8 gap-1 text-xs cursor-pointer"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" /> Previous
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={bookingsPage >= Math.ceil(bookings.length / ITEMS_PER_PAGE)}
                        onClick={() => setBookingsPage((p) => p + 1)}
                        className="h-8 gap-1 text-xs cursor-pointer"
                      >
                        Next <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Administrators & Access Management */}
        {activeTab === "admins" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold uppercase tracking-wide">
                Administrator Access &amp; Permissions
              </h2>
              <p className="text-xs text-muted-foreground">
                Appoint any specific email address to grant full yard administration privileges, or remove access anytime.
              </p>
            </div>

            {/* Appoint New Admin Form */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-primary" /> Appoint New Administrator
              </h3>
              <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter email address (e.g. manager@seoautos.com)"
                  value={newAdminEmailInput}
                  onChange={(e) => setNewAdminEmailInput(e.target.value)}
                  className="flex-1 rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Button
                  type="submit"
                  className="gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  Appoint Admin
                </Button>
              </form>
            </div>

            {/* Current Admins List */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="border-b border-border/80 bg-muted/40 px-5 py-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Currently Appointed Administrators ({adminEmails.length})
                </h3>
              </div>

              <div className="divide-y divide-border/60">
                {adminEmails.map((admEmail) => {
                  const isCurrent = currentUser?.email.toLowerCase() === admEmail.toLowerCase();
                  return (
                    <div
                      key={admEmail}
                      className="flex items-center justify-between px-5 py-4 transition hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase border border-primary/20">
                          {admEmail.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                            <span>{admEmail}</span>
                            {isCurrent && (
                              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-400 border border-emerald-500/30">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Full Admin Portal, Inventory &amp; Booking Management Access
                          </div>
                        </div>
                      </div>

                      <div>
                        {isCurrent ? (
                          <span className="text-xs font-medium text-muted-foreground italic pr-2">
                            Active Session
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => confirmRemoveAdmin(admEmail)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                          >
                            <UserMinus className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Total Users Directory & Role Management */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wide">
                  Registered Website Users &amp; Roles
                </h2>
                <p className="text-xs text-muted-foreground">
                  View all customers and staff registered on SEO Autos, check roles, and manage site access.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                  Total Users: {usersList.length}
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                  Admins: {usersList.filter((u) => u.role === "admin" || db.isEmailAdmin(u.email)).length}
                </span>
                <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
                  Customers: {usersList.filter((u) => u.role !== "admin" && !db.isEmailAdmin(u.email)).length}
                </span>
              </div>
            </div>

            {/* Users Directory Table Card */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="border-b border-border/80 bg-muted/40 px-5 py-3 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Users Directory ({usersList.length})
                </h3>
                <span className="text-xs text-muted-foreground">
                  Showing {usersList.length > 0 ? (usersPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
                  {Math.min(usersPage * ITEMS_PER_PAGE, usersList.length)} of {usersList.length}
                </span>
              </div>

              {usersList.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Users className="mx-auto h-10 w-10 opacity-30" />
                  <p className="mt-2 text-sm font-medium">No registered users found.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {usersList
                    .slice((usersPage - 1) * ITEMS_PER_PAGE, usersPage * ITEMS_PER_PAGE)
                    .map((usr) => {
                      const isAdm = usr.role === "admin" || db.isEmailAdmin(usr.email);
                      const isCurrent = currentUser?.email.toLowerCase() === usr.email.toLowerCase();

                      return (
                        <div
                          key={usr.id || usr.email}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 transition hover:bg-muted/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm uppercase border border-primary/20 shrink-0">
                              {(usr.full_name || usr.email).charAt(0)}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-sm text-foreground">
                                  {usr.full_name || "Anonymous User"}
                                </span>
                                {isCurrent && (
                                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-400 border border-emerald-500/30">
                                    You
                                  </span>
                                )}
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border ${
                                    isAdm
                                      ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                                      : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                  }`}
                                >
                                  {isAdm ? "Administrator" : "Customer"}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5 text-xs text-muted-foreground">
                                <span>✉️ {usr.email}</span>
                                {usr.phone && <span>📞 {usr.phone}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {isCurrent ? (
                              <span className="text-xs font-medium text-muted-foreground italic pr-2">
                                Active Session
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => confirmRemoveUser(usr)}
                                className="h-8 gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                              >
                                <UserX className="h-3.5 w-3.5" />
                                Remove User
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Users Pagination */}
              {usersList.length > ITEMS_PER_PAGE && (
                <div className="border-t border-border/80 bg-muted/20 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Page {usersPage} of {Math.ceil(usersList.length / ITEMS_PER_PAGE)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={usersPage <= 1}
                      onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                      className="h-8 gap-1 text-xs cursor-pointer"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={usersPage >= Math.ceil(usersList.length / ITEMS_PER_PAGE)}
                      onClick={() => setUsersPage((p) => p + 1)}
                      className="h-8 gap-1 text-xs cursor-pointer"
                    >
                      Next <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Vehicle Form Modal */}
      <Dialog open={vehicleModalOpen} onOpenChange={setVehicleModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl uppercase tracking-wide">
              {editingVehicle ? "Edit Vehicle" : "Add Vehicle to Inventory"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure vehicle specifications, upload gallery photos, and set display tags.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveVehicle} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Model &amp; Trim *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Honda Accord EX-L Sedan"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Year *
                </label>
                <input
                  type="text"
                  required
                  placeholder="2016 / 2017"
                  value={formYear}
                  onChange={(e) => setFormYear(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="All">All / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Badge Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Special Arrival"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Condition
                </label>
                <select
                  value={formCondition}
                  onChange={(e) => setFormCondition(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Foreign Used (Tokunbo)">Foreign Used (Tokunbo)</option>
                  <option value="Clean Condition">Clean Condition</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Headline Tagline
              </label>
              <input
                type="text"
                placeholder="e.g. Sleek Champagne Gold, Clean Interior & Smooth Powertrain"
                value={formTagline}
                onChange={(e) => setFormTagline(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Detailed Description
              </label>
              <textarea
                rows={3}
                placeholder="Full vehicle story, customs inspection status, mechanical health notes..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Key Highlights / Specifications (One per line)
              </label>
              <textarea
                rows={3}
                placeholder="Original i-VTEC Engine&#10;Factory Chilled AC&#10;Customs Duty Paid"
                value={formSpecs}
                onChange={(e) => setFormSpecs(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground font-mono text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Vehicle Photos Section with Hover Upload & X Delete */}
            <div className="space-y-2 pt-1 border-t border-border/80">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Vehicle Photos {formImages.length > 0 && `(${formImages.length})`}
                  </label>
                  <p className="text-[11px] text-muted-foreground">
                    Upload real, clear photos of the vehicle (front, side, rear, interior).
                  </p>
                </div>
              </div>

              {/* Photo preview cards with clear 'X' delete buttons */}
              {formImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  {formImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-video overflow-hidden rounded-xl border border-border bg-muted shadow-sm transition hover:border-primary/50"
                    >
                      <img src={img.src} alt={img.alt} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      
                      {/* Interactive X Delete Button */}
                      <button
                        type="button"
                        title="Delete photo"
                        onClick={() => setFormImages(formImages.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-red-600 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <span className="absolute bottom-2 left-2 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                        Photo {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Cool Hover Add Photo Button Under Vehicle Photos */}
              <label
                className={`group relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/90 bg-muted/20 px-6 py-6 text-center transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-md cursor-pointer ${
                  isUploading ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
                  {isUploading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                    {isUploading ? "Uploading photos..." : formImages.length === 0 ? "Upload Vehicle Photos" : "Add More Vehicle Photos"}
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Click to select JPG, PNG, or WEBP photos from your device
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVehicleModalOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold cursor-pointer"
              >
                {isSaving ? "Saving..." : editingVehicle ? "Update Vehicle" : "Publish to Yard"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Website Interactive UI Card for Deleting a Product (Replacing window confirm/notification) */}
      <Dialog open={Boolean(vehicleToDelete)} onOpenChange={(open) => !open && setVehicleToDelete(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border text-card-foreground p-6 shadow-2xl rounded-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <DialogHeader className="text-center pt-2">
            <DialogTitle className="font-display text-xl uppercase tracking-wider text-foreground">
              Delete Vehicle from Yard?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Are you sure you want to delete <strong className="text-foreground">{vehicleToDelete?.name} ({vehicleToDelete?.year})</strong>? This action cannot be undone and customers will no longer see this listing.
            </DialogDescription>
          </DialogHeader>

          {vehicleToDelete && (
            <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 text-xs space-y-1 mt-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-semibold text-foreground">{vehicleToDelete.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price Status:</span>
                <span className="font-semibold text-foreground">{vehicleToDelete.priceStatus}</span>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setVehicleToDelete(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleExecuteDeleteVehicle}
              className="font-bold uppercase tracking-wider text-xs gap-1.5 cursor-pointer shadow-md"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Yes, Delete Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Website Interactive UI Card for Removing Admin (Replacing window confirm/notification) */}
      <Dialog open={Boolean(adminToRemove)} onOpenChange={(open) => !open && setAdminToRemove(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border text-card-foreground p-6 shadow-2xl rounded-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <UserMinus className="h-7 w-7" />
          </div>

          <DialogHeader className="text-center pt-2">
            <DialogTitle className="font-display text-xl uppercase tracking-wider text-foreground">
              Revoke Administrator Access?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Are you sure you want to remove administrator privileges for <strong className="text-foreground">{adminToRemove}</strong>? They will lose access to the inventory and booking dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAdminToRemove(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleExecuteRemoveAdmin}
              className="font-bold uppercase tracking-wider text-xs cursor-pointer shadow-md"
            >
              Revoke Access
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Website Interactive UI Card for Deleting a User */}
      <Dialog open={Boolean(userToRemove)} onOpenChange={(open) => !open && setUserToRemove(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border text-card-foreground p-6 shadow-2xl rounded-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            <UserX className="h-7 w-7" />
          </div>

          <DialogHeader className="text-center pt-2">
            <DialogTitle className="font-display text-xl uppercase tracking-wider text-foreground">
              Remove User Account?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Are you sure you want to remove <strong className="text-foreground">{userToRemove?.full_name || userToRemove?.email}</strong> from the website?
              They will no longer be able to log in or access customer features.
            </DialogDescription>
          </DialogHeader>

          {userToRemove && (
            <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 text-xs space-y-1 mt-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-semibold text-foreground">{userToRemove.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-semibold text-foreground uppercase">{userToRemove.role}</span>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setUserToRemove(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleExecuteRemoveUser}
              className="font-bold uppercase tracking-wider text-xs cursor-pointer shadow-md"
            >
              Remove User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

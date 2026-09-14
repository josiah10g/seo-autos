import { createFileRoute } from "@tanstack/react-router";
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
  type VehicleListing,
  type BookingRecord,
  isSupabaseConfigured,
} from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal | SEO Autos Investment Limited" },
      { name: "description", content: "SEO Autos vehicle management & customer booking portal." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [activeTab, setActiveTab] = useState<"vehicles" | "bookings">("vehicles");
  const [vehicles, setVehicles] = useState<VehicleListing[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Vehicle Modal state
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleListing | null>(null);

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

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [vData, bData] = await Promise.all([db.getVehicles(), db.getBookings()]);
      setVehicles(vData);
      setBookings(bData);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
    setFormSpecs("Original i-VTEC Engine\nDual AC\nClean Interior\nCustoms Duty Paid");
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
            label: prev.length === 0 ? "Front View" : prev.length === 1 ? "Side View" : "Angle View",
          },
        ]);
      }
    }
    setIsUploading(false);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formYear) return;

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
      specs: specsArray.length > 0 ? specsArray : ["Tested engine and transmission", "Sound suspension"],
      images:
        formImages.length > 0
          ? formImages
          : [
              {
                src: "/favicon.png",
                alt: formName,
                label: "Main View",
              },
            ],
      isAvailable: true,
    };

    await db.saveVehicle(vehicleToSave);
    setIsSaving(false);
    setVehicleModalOpen(false);
    loadData();
  };

  const handleDeleteVehicle = async (id: string) => {
    if (confirm("Are you sure you want to remove this vehicle from inventory?")) {
      await db.deleteVehicle(id);
      loadData();
    }
  };

  const handleBookingStatusChange = async (id: string, status: BookingRecord["status"]) => {
    await db.updateBookingStatus(id, status);
    loadData();
  };

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
                variant="outline"
                size="sm"
                onClick={loadData}
                className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
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
                Showing {vehicles.length} vehicle(s)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => {
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
                          onClick={() => handleDeleteVehicle(v.id)}
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
                {bookings.map((b) => {
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
                        {/* Status switcher */}
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
              </div>
            )}
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

            {/* Image Gallery Manager */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Vehicle Photos ({formImages.length})
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer">
                  <Upload className="h-3.5 w-3.5" />
                  {isUploading ? "Uploading..." : "Upload Photos"}
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

              {formImages.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                  No photos uploaded yet. Click Upload Photos to add front, side, and rear pictures.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {formImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-video overflow-hidden rounded-md border border-border bg-muted"
                    >
                      <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 transition group-hover:opacity-100 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormImages(formImages.filter((_, i) => i !== idx))}
                          className="rounded bg-destructive p-1 text-white hover:bg-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 text-[9px] text-white rounded">
                        {img.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
    </div>
  );
}

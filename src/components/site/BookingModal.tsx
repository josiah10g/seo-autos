import { useState, useId } from "react";
import {
  Calendar,
  Clock,
  Phone,
  User,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { db, type VehicleListing } from "@/lib/supabase";
import { toast } from "sonner";

interface BookingModalProps {
  vehicle: VehicleListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ vehicle, isOpen, onClose }: BookingModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("Morning (10am - 1pm)");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const dateId = useId();
  const timeId = useId();
  const notesId = useId();

  // Auto-fill logged-in customer details
  useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("seo_autos_active_user");
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user.fullName && !fullName) setFullName(user.fullName);
          if (user.email && !email) setEmail(user.email);
        } catch {
          // ignore
        }
      }
    }
  });

  if (!vehicle) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName || !phone || !date) {
      setErrorMsg("Please provide your full name, phone number, and inspection date.");
      toast.error("Please provide your full name, phone number, and date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await db.createBooking({
        vehicle_id: vehicle.id,
        vehicle_name: `${vehicle.year} ${vehicle.name}`,
        customer_name: fullName,
        customer_phone: phone,
        customer_email: email || undefined,
        preferred_date: date,
        preferred_time: time,
        notes: notes || undefined,
        status: "pending",
      });

      if (res.success) {
        setIsSuccess(true);
        toast.success("Inspection booking received successfully!");
      } else {
        setErrorMsg("Could not record booking. Please try again or reach out on WhatsApp.");
        toast.error("Could not record booking. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMsg("");
    setFullName("");
    setPhone("");
    setEmail("");
    setDate("");
    setNotes("");
    onClose();
  };

  const whatsappText = encodeURIComponent(
    `Hello SEO Autos! I have scheduled an inspection for the ${vehicle.year} ${vehicle.name}. Name: ${fullName}, Date: ${date} (${time}).`
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleResetAndClose()}>
      <DialogContent className="border-border bg-card p-6 text-card-foreground shadow-2xl sm:max-w-lg">
        {isSuccess ? (
          <div className="space-y-5 py-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle className="font-display text-2xl tracking-wide text-foreground">
                Inspection Request Received!
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Thank you, <strong className="text-foreground">{fullName}</strong>. Our team at SEO Autos has registered your visit for the{" "}
                <span className="font-semibold text-primary">{vehicle.year} {vehicle.name}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border border-border/70 bg-muted/30 p-4 text-left text-sm space-y-1.5">
              <p className="flex justify-between text-muted-foreground">
                <span>Selected Date:</span>
                <strong className="text-foreground">{date}</strong>
              </p>
              <p className="flex justify-between text-muted-foreground">
                <span>Preferred Window:</span>
                <strong className="text-foreground">{time}</strong>
              </p>
              <p className="flex justify-between text-muted-foreground">
                <span>Contact Phone:</span>
                <strong className="text-foreground">{phone}</strong>
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href={`https://wa.me/2348028292837?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#20bd5a]"
              >
                <MessageSquare className="h-4 w-4" />
                Notify Team Instantly on WhatsApp
              </a>

              <Button variant="outline" onClick={handleResetAndClose} className="w-full">
                Close & Return to Yard
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <DialogHeader className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Calendar className="h-3.5 w-3.5" /> Book Inspection / Purchase
              </div>
              <DialogTitle className="font-display text-2xl tracking-wide text-foreground">
                {vehicle.year} {vehicle.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Schedule a physical visit or test-drive at our Lagos yard. No advance payment required.
              </DialogDescription>
            </DialogHeader>

            {errorMsg && (
              <div className="mt-4 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-left">
              <div>
                <label htmlFor={nameId} className="block text-xs font-medium text-foreground mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id={nameId}
                    type="text"
                    required
                    placeholder="e.g. Chief Babatunde Adeyemi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={phoneId} className="block text-xs font-medium text-foreground mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      id={phoneId}
                      type="tel"
                      required
                      placeholder="080 1234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={emailId} className="block text-xs font-medium text-foreground mb-1">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      id={emailId}
                      type="email"
                      placeholder="your.name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={dateId} className="block text-xs font-medium text-foreground mb-1">
                    Preferred Visit Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      id={dateId}
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={timeId} className="block text-xs font-medium text-foreground mb-1">
                    Time Window
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <select
                      id={timeId}
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Morning (10am - 1pm)">Morning (10am - 1pm)</option>
                      <option value="Afternoon (1pm - 4pm)">Afternoon (1pm - 4pm)</option>
                      <option value="Late Afternoon (4pm - 6pm)">Late Afternoon (4pm - 6pm)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor={notesId} className="block text-xs font-medium text-foreground mb-1">
                  Specific Requests / Trade-in inquiries
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <textarea
                    id={notesId}
                    rows={2}
                    placeholder="E.g. I would like to bring a mechanic for scanning, or trade in my 2012 Honda Civic."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="mt-5 flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetAndClose}
                  className="w-1/3"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                >
                  {isSubmitting ? "Submitting..." : "Confirm Booking"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

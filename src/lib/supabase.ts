import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import accordFront from "@/assets/car-accord-front.jpg";
import accordRear from "@/assets/car-accord-rear.jpg";
import crvFront from "@/assets/car-crv-front.jpg";
import crvRear from "@/assets/car-crv-rear.jpg";
import crvSide from "@/assets/car-crv-side.jpg";

export interface VehicleListing {
  id: string;
  name: string;
  year: string;
  tagline: string;
  category: "Sedan" | "SUV" | "All";
  priceStatus: "Available on Request" | "Call for Best Price";
  condition: "Foreign Used (Tokunbo)" | "Clean Condition";
  transmission: "Automatic";
  fuel: "Petrol";
  badge: string;
  specs: string[];
  images: {
    src: string;
    alt: string;
    label: string;
  }[];
  description: string;
  isAvailable?: boolean;
}

export interface BookingRecord {
  id: string;
  vehicle_id?: string | null;
  vehicle_name: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  preferred_date: string;
  preferred_time?: string | null;
  notes?: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  role: "admin" | "customer";
}

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project") &&
    !supabaseAnonKey.includes("your-anon")
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Built-in seed vehicles for offline / fallback
export const SEED_VEHICLES: VehicleListing[] = [
  {
    id: "honda-accord-2016",
    name: "Honda Accord EX-L Sedan",
    year: "2016 / 2017",
    tagline: "Sleek Champagne Gold, Clean Interior & Smooth Powertrain",
    category: "Sedan",
    priceStatus: "Available on Request",
    condition: "Foreign Used (Tokunbo)",
    transmission: "Automatic",
    fuel: "Petrol",
    badge: "Special Arrival",
    specs: [
      "Original V6 / i-VTEC Engine",
      "Factory Chilled Dual AC",
      "Factory Alloy Wheels & Crisp Lights",
      "Lagos Handover Ready",
    ],
    images: [
      {
        src: accordFront,
        alt: "Honda Accord front view in golden champagne finish",
        label: "Front Fascia",
      },
      {
        src: accordRear,
        alt: "Honda Accord rear profile and clean trunk view",
        label: "Rear Profile",
      },
    ],
    description:
      "A pristine Honda Accord foreign used specimen. Complete with factory alloy rims, sound engine, untampered suspension, and prompt AC cooling. Ready for inspection at SEO Autos yard.",
    isAvailable: true,
  },
  {
    id: "honda-crv-2015",
    name: "Honda CR-V Touring AWD",
    year: "2014 / 2015",
    tagline: "Solid White SUV, Rugged Handling, Spacious Cabin",
    category: "SUV",
    priceStatus: "Call for Best Price",
    condition: "Foreign Used (Tokunbo)",
    transmission: "Automatic",
    fuel: "Petrol",
    badge: "Best Seller",
    specs: [
      "i-VTEC High Efficiency Engine",
      "Dual-Zone Climate Control",
      "Reverse Camera & Factory Touchscreen",
      "Complete Customs Duty Paid",
    ],
    images: [
      {
        src: crvFront,
        alt: "Honda CR-V front angle exterior",
        label: "Front View",
      },
      {
        src: crvSide,
        alt: "Honda CR-V clean side profile and alloy rims",
        label: "Side Profile",
      },
      {
        src: crvRear,
        alt: "Honda CR-V tailgate and clean dual lamps",
        label: "Rear Profile",
      },
    ],
    description:
      "A family and executive favorite Honda CR-V in excellent running order. High ground clearance, solid Tokunbo chassis, pristine interior upholstery, and tested gearbox.",
    isAvailable: true,
  },
];

// Local memory storage for offline demo
const LOCAL_STORAGE_KEY_VEHICLES = "seo_autos_local_vehicles";
const LOCAL_STORAGE_KEY_BOOKINGS = "seo_autos_local_bookings";

function getLocalVehicles(): VehicleListing[] {
  if (typeof window === "undefined") return SEED_VEHICLES;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY_VEHICLES);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY_VEHICLES, JSON.stringify(SEED_VEHICLES));
    return SEED_VEHICLES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return SEED_VEHICLES;
  }
}

function saveLocalVehicles(vehicles: VehicleListing[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY_VEHICLES, JSON.stringify(vehicles));
}

function getLocalBookings(): BookingRecord[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKINGS);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveLocalBookings(bookings: BookingRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
}

// ---------------------------------------------------------------------------
// DATA API (Gracefully switches between real Supabase and Local Demo fallback)
// ---------------------------------------------------------------------------

export const db = {
  // Fetch vehicles
  async getVehicles(): Promise<VehicleListing[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("vehicles")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((row: any) => ({
            id: row.id,
            name: row.name,
            year: row.year,
            tagline: row.tagline,
            category: row.category,
            priceStatus: row.price_status,
            condition: row.condition,
            transmission: row.transmission,
            fuel: row.fuel,
            badge: row.badge,
            specs: Array.isArray(row.specs) ? row.specs : [],
            images: Array.isArray(row.images) ? row.images : [],
            description: row.description,
            isAvailable: row.is_available ?? true,
          }));
        }
      } catch (err) {
        console.warn("Falling back to local vehicles:", err);
      }
    }
    return getLocalVehicles();
  },

  // Save/Update vehicle
  async saveVehicle(vehicle: VehicleListing): Promise<{ success: boolean; error?: string }> {
    if (supabase) {
      try {
        const { error } = await supabase.from("vehicles").upsert({
          id: vehicle.id,
          name: vehicle.name,
          year: vehicle.year,
          tagline: vehicle.tagline,
          category: vehicle.category,
          price_status: vehicle.priceStatus,
          condition: vehicle.condition,
          transmission: vehicle.transmission,
          fuel: vehicle.fuel,
          badge: vehicle.badge,
          specs: vehicle.specs,
          images: vehicle.images,
          description: vehicle.description,
          is_available: vehicle.isAvailable ?? true,
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
        return { success: true };
      } catch (err: any) {
        console.error("Supabase upsert vehicle error:", err);
      }
    }

    // Local fallback
    const list = getLocalVehicles();
    const idx = list.findIndex((v) => v.id === vehicle.id);
    if (idx >= 0) {
      list[idx] = vehicle;
    } else {
      list.unshift(vehicle);
    }
    saveLocalVehicles(list);
    return { success: true };
  },

  // Delete vehicle
  async deleteVehicle(id: string): Promise<{ success: boolean; error?: string }> {
    if (supabase) {
      try {
        const { error } = await supabase.from("vehicles").delete().eq("id", id);
        if (error) throw error;
        return { success: true };
      } catch (err: any) {
        console.error("Supabase delete vehicle error:", err);
      }
    }

    const list = getLocalVehicles().filter((v) => v.id !== id);
    saveLocalVehicles(list);
    return { success: true };
  },

  // Bookings
  async getBookings(): Promise<BookingRecord[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn("Supabase fetch bookings error:", err);
      }
    }
    return getLocalBookings();
  },

  async getCustomerBookings(email?: string, phone?: string): Promise<BookingRecord[]> {
    if (supabase && (email || phone)) {
      try {
        let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });
        if (email) {
          query = query.eq("customer_email", email);
        } else if (phone) {
          query = query.eq("customer_phone", phone);
        }
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (err) {
        console.warn("Supabase fetch customer bookings error:", err);
      }
    }
    const all = getLocalBookings();
    if (!email && !phone) return all;
    return all.filter(
      (b) =>
        (email && b.customer_email?.toLowerCase() === email.toLowerCase()) ||
        (phone && b.customer_phone === phone)
    );
  },

  async createBooking(booking: Omit<BookingRecord, "id" | "created_at">): Promise<{ success: boolean; id?: string }> {
    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `bkg_${Date.now()}`;
    const newRecord: BookingRecord = {
      ...booking,
      id,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const { error } = await supabase.from("bookings").insert({
          id,
          vehicle_id: booking.vehicle_id || null,
          vehicle_name: booking.vehicle_name,
          customer_name: booking.customer_name,
          customer_phone: booking.customer_phone,
          customer_email: booking.customer_email || null,
          preferred_date: booking.preferred_date,
          preferred_time: booking.preferred_time || null,
          notes: booking.notes || null,
          status: booking.status || "pending",
        });
        if (!error) return { success: true, id };
      } catch (err) {
        console.error("Supabase create booking error:", err);
      }
    }

    const bookings = getLocalBookings();
    bookings.unshift(newRecord);
    saveLocalBookings(bookings);
    return { success: true, id };
  },

  async updateBookingStatus(id: string, status: BookingRecord["status"]): Promise<{ success: boolean }> {
    if (supabase) {
      try {
        const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
        if (!error) return { success: true };
      } catch (err) {
        console.error("Supabase update booking error:", err);
      }
    }

    const bookings = getLocalBookings();
    const target = bookings.find((b) => b.id === id);
    if (target) {
      target.status = status;
      saveLocalBookings(bookings);
    }
    return { success: true };
  },

  // Upload image to vehicle-images bucket
  async uploadImage(file: File): Promise<{ url: string | null; error?: string }> {
    if (supabase) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("vehicle-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("vehicle-images").getPublicUrl(filePath);
        return { url: data.publicUrl };
      } catch (err: any) {
        console.error("Storage upload failed:", err);
        return { url: null, error: err.message };
      }
    }

    // Local data URL fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ url: reader.result as string });
      reader.onerror = () => resolve({ url: null, error: "Failed to read file locally" });
      reader.readAsDataURL(file);
    });
  },
};

// ---------------------------------------------------------------------------
// AUTH API
// ---------------------------------------------------------------------------

export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as UserProfile;
}

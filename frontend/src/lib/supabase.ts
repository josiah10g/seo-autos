import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import accordFront from "@/assets/car-accord-front.jpg";
import accordRear from "@/assets/car-accord-rear.jpg";
import crvFront from "@/assets/car-crv-front.jpg";
import crvRear from "@/assets/car-crv-rear.jpg";
import crvSide from "@/assets/car-crv-side.jpg";

// VehicleListing is kept as an alias for backward compatibility with imports
export type VehicleListing = EngineListing;

export interface EngineListing {
  id: string;
  name: string;
  year: string;
  tagline: string;
  category: "Sedan" | "SUV" | "All";
  priceStatus: "Available on Request" | "Call for Best Price";
  price?: number;
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
  vehicle_name?: string;
  engine_id?: string | null;
  engine_name?: string;
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
const supabaseUrl = (import.meta.env["VITE_SUPABASE_URL"] as string) || "";
const supabaseAnonKey = (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string) || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project") &&
    !supabaseAnonKey.includes("your-anon")
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Built-in seed engines for offline / fallback
export const SEED_ENGINES: EngineListing[] = [
  {
    id: "honda-high-grade-gearbox-fwd",
    name: "Honda HIGH GRADE gearbox — FWD",
    year: "Accord / Civic / CR-V",
    tagline: "Tested Smooth Shift Tokunbo Automatic Front-Wheel-Drive Gearbox",
    category: "Sedan",
    priceStatus: "Available on Request",
    price: 287500,
    condition: "Foreign Used (Tokunbo)",
    transmission: "Automatic",
    fuel: "Petrol",
    badge: "Fast Mover",
    specs: [
      "Precision-Tested Solenoids & Valve Body",
      "Torque Converter Included & Flushed",
      "Direct Bolt-on for 4-Cylinder FWD Honda Models",
      "Tested Gear Engagement with Handover Warranty",
    ],
    images: [
      {
        src: "/media_1792581112397.jpg",
        alt: "Honda HIGH GRADE gearbox assembly",
        label: "Gearbox Unit",
      },
    ],
    description:
      "Original foreign-used (Tokunbo) Honda high-grade front-wheel drive (FWD) automatic transmission. Factory-tested pressure, zero slip, intact electrical sensors and clean fluid casing.",
    isAvailable: true,
  },
  {
    id: "acura-3-7l-vtec-v6",
    name: "Acura 3.7L VTEC V6 Complete Engine",
    year: "MDX / TL / RL",
    tagline: "Factory Original 3.7L VTEC High-Output Powertrain (Direct Import)",
    category: "SUV",
    priceStatus: "Available on Request",
    price: 1850000,
    condition: "Foreign Used (Tokunbo)",
    transmission: "Automatic",
    fuel: "Petrol",
    badge: "Special Arrival",
    specs: [
      "Original Acura 3.7L VTEC Top Cover & Intake",
      "Tested Compression & Untampered Blocks",
      "Complete Sensors, Injectors & Wiring Loom",
      "Lagos Yard Handover Ready with Warranty",
    ],
    images: [
      {
        src: "/media_1792581171606.jpg",
        alt: "Acura 3.7 VTEC V6 complete engine top view",
        label: "Engine Assembly",
      },
      {
        src: "/media_1792581155667.jpg",
        alt: "Acura V6 block and transmission casing assembly",
        label: "Side & Transmission Mount",
      },
    ],
    description:
      "Original foreign-used (Tokunbo) Acura 3.7-Liter VTEC V6 complete engine. Compression-tested, perfectly preserved internals, untampered cylinder heads, intact wiring loom and complete fuel rail. Ideal replacement for Acura MDX, TL, and RL.",
    isAvailable: true,
  },
  {
    id: "honda-vtec-i-vtec-powertrain",
    name: "Honda VTEC 2.4L / 3.5L Complete Engine",
    year: "Accord / CR-V / Pilot",
    tagline: "Genuine Honda Motor Co. Tested VTEC Engine Block",
    category: "Sedan",
    priceStatus: "Call for Best Price",
    condition: "Foreign Used (Tokunbo)",
    transmission: "Automatic",
    fuel: "Petrol",
    badge: "Best Seller",
    specs: [
      "Authentic Honda Motor Co. VTEC Valve Cover",
      "Low Mileage Tokunbo Direct Import",
      "Clean Distributor, Plug Wires & Air Intake",
      "Includes Installation & Mechanic Advisory",
    ],
    images: [
      {
        src: "/media_1792581130955.jpg",
        alt: "Honda VTEC valve cover and intake assembly",
        label: "VTEC Engine Bay",
      },
      {
        src: "/media_1792581112397.jpg",
        alt: "Honda engine block and transmission unit",
        label: "Block & Transaxle",
      },
    ],
    description:
      "A pristine Honda VTEC Tokunbo engine unit imported directly from trusted foreign yards. Complete with original Honda valve cover, intact intake manifold, clean spark leads and full assembly. Available with installation support.",
    isAvailable: true,
  },
  {
    id: "honda-acura-crankshafts-pistons",
    name: "Honda & Acura High-Grade Crankshafts & Core Internals",
    year: "All Compatible Models",
    tagline: "Matched Factory Crankshafts, Connecting Rods & Piston Sets",
    category: "All",
    priceStatus: "Available on Request",
    condition: "Clean Condition",
    transmission: "Automatic",
    fuel: "Petrol",
    badge: "Direct Stock",
    specs: [
      "Precision Balanced Factory Crankshafts",
      "Heavy-Duty Connecting Rods & Piston Rings",
      "Micrometer-Inspected Journal Surfaces",
      "Standard Factory Sizing (STD Ready)",
    ],
    images: [
      {
        src: "/media_1792581140227.jpg",
        alt: "Rack of factory crankshafts, connecting rods and engine internals",
        label: "Crankshafts & Internals",
      },
    ],
    description:
      "Fully inspected, micrometer-verified Honda and Acura crankshafts and internal rebuild components. Wrapped and rust-inhibited for guaranteed long life and smooth engine rebuilds.",
    isAvailable: true,
  },
];

export const SEED_VEHICLES = SEED_ENGINES;

// Local memory storage for offline demo
const LOCAL_STORAGE_KEY_VEHICLES = "seo_autos_local_engines_v2";
const LOCAL_STORAGE_KEY_BOOKINGS = "seo_autos_local_bookings";
const LOCAL_STORAGE_KEY_USERS = "seo_autos_registered_users";

const DEFAULT_SEED_USERS: UserProfile[] = [
  {
    id: "usr_admin_1",
    email: "admin@seoautos.com",
    full_name: "Operations Admin",
    phone: "+234 813 894 6058",
    role: "admin",
  },
  {
    id: "usr_admin_2",
    email: "seoautos@gmail.com",
    full_name: "Executive Management",
    phone: "+234 802 829 2837",
    role: "admin",
  },
  {
    id: "usr_cust_1",
    email: "babatunde.ade@gmail.com",
    full_name: "Babatunde Adeyemi",
    phone: "+234 803 234 5678",
    role: "customer",
  },
  {
    id: "usr_cust_2",
    email: "chioma.okeke@yahoo.com",
    full_name: "Chioma Okeke",
    phone: "+234 805 987 6543",
    role: "customer",
  },
  {
    id: "usr_cust_3",
    email: "emeka.nnamdi@gmail.com",
    full_name: "Emeka Nnamdi",
    phone: "+234 814 112 2334",
    role: "customer",
  },
  {
    id: "usr_cust_4",
    email: "folake.balogun@outlook.com",
    full_name: "Folake Balogun",
    phone: "+234 809 556 7788",
    role: "customer",
  },
  {
    id: "usr_cust_5",
    email: "ibrahim.musa@gmail.com",
    full_name: "Ibrahim Musa",
    phone: "+234 802 334 9900",
    role: "customer",
  },
];

function getLocalUsers(): UserProfile[] {
  if (typeof window === "undefined") return DEFAULT_SEED_USERS;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY_USERS);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(DEFAULT_SEED_USERS));
    return DEFAULT_SEED_USERS;
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SEED_USERS;
  } catch {
    return DEFAULT_SEED_USERS;
  }
}

function saveLocalUsers(users: UserProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(users));
}

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

  // Aliases for engine nomenclature
  async getEngines(): Promise<EngineListing[]> {
    return this.getVehicles();
  },
  async saveEngine(engine: EngineListing): Promise<{ success: boolean; error?: string }> {
    return this.saveVehicle(engine);
  },
  async deleteEngine(id: string): Promise<{ success: boolean; error?: string }> {
    return this.deleteVehicle(id);
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
          return data.map((row: any) => ({
            ...row,
            engine_name: row.engine_name || row.vehicle_name,
            engine_id: row.engine_id || row.vehicle_id,
          }));
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
          vehicle_id: booking.engine_id || booking.vehicle_id || null,
          vehicle_name: booking.engine_name || booking.vehicle_name || "Engine Model",
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

  async deleteBooking(id: string): Promise<{ success: boolean; message: string }> {
    if (supabase) {
      try {
        const { error } = await supabase.from("bookings").delete().eq("id", id);
        if (!error) {
          const bookings = getLocalBookings().filter((b) => b.id !== id);
          saveLocalBookings(bookings);
          return { success: true, message: "Request deleted successfully." };
        }
      } catch (err) {
        console.warn("Supabase delete booking error (fallback to local):", err);
      }
    }

    const bookings = getLocalBookings().filter((b) => b.id !== id);
    saveLocalBookings(bookings);
    return { success: true, message: "Request deleted successfully." };
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

  // Admin emails list management (appoint or remove any email as admin)
  getAdminEmails(): string[] {
    const DEFAULT_ADMINS = [
      "seoautos@gmail.com",
      "admin@seoautos.com",
    ];
    if (typeof window === "undefined") return DEFAULT_ADMINS;
    const stored = localStorage.getItem("seo_autos_admin_emails");
    if (!stored) {
      localStorage.setItem("seo_autos_admin_emails", JSON.stringify(DEFAULT_ADMINS));
      return DEFAULT_ADMINS;
    }
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.map((e: string) => e.toLowerCase());
      }
      return DEFAULT_ADMINS;
    } catch {
      return DEFAULT_ADMINS;
    }
  },

  addAdminEmail(email: string): { success: boolean; message: string } {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      return { success: false, message: "Please provide a valid email address." };
    }
    const list = this.getAdminEmails();
    if (list.includes(clean)) {
      return { success: false, message: "This email already has Admin privileges." };
    }
    const updated = [...list, clean];
    if (typeof window !== "undefined") {
      localStorage.setItem("seo_autos_admin_emails", JSON.stringify(updated));
      window.dispatchEvent(new Event("auth:changed"));
      window.dispatchEvent(new Event("storage"));
    }
    // Also update role in local users directory if present
    const users = getLocalUsers();
    const existing = users.find((u) => u.email.toLowerCase() === clean);
    if (existing) {
      existing.role = "admin";
      saveLocalUsers(users);
    }
    return { success: true, message: `${clean} is now an appointed Admin!` };
  },

  removeAdminEmail(email: string): { success: boolean; message: string } {
    const clean = email.trim().toLowerCase();
    const list = this.getAdminEmails();
    if (list.length <= 1) {
      return { success: false, message: "You must retain at least one appointed administrator." };
    }
    const updated = list.filter((e) => e !== clean);
    if (typeof window !== "undefined") {
      localStorage.setItem("seo_autos_admin_emails", JSON.stringify(updated));
      window.dispatchEvent(new Event("auth:changed"));
      window.dispatchEvent(new Event("storage"));
    }
    // Update role in local users directory if present
    const users = getLocalUsers();
    const existing = users.find((u) => u.email.toLowerCase() === clean);
    if (existing) {
      existing.role = "customer";
      saveLocalUsers(users);
    }
    return { success: true, message: `${clean} has been removed from Administrators.` };
  },

  isEmailAdmin(email: string): boolean {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    const list = this.getAdminEmails();
    return list.includes(clean);
  },

  // -------------------------------------------------------------------------
  // USER MANAGEMENT API (Total Users, Role Directory & Deletion)
  // -------------------------------------------------------------------------
  async getUsers(): Promise<UserProfile[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, full_name, phone, role")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data as UserProfile[];
        }
      } catch (err) {
        console.warn("Supabase fetch users fallback to local:", err);
      }
    }
    return getLocalUsers();
  },

  async removeUser(userIdOrEmail: string): Promise<{ success: boolean; message: string }> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("profiles")
          .delete()
          .or(`id.eq.${userIdOrEmail},email.eq.${userIdOrEmail}`);

        if (!error) {
          // Sync with local memory as well
          const localList = getLocalUsers().filter(
            (u) => u.id !== userIdOrEmail && u.email.toLowerCase() !== userIdOrEmail.toLowerCase()
          );
          saveLocalUsers(localList);
          return { success: true, message: "User account deleted successfully." };
        }
      } catch (err: any) {
        console.warn("Supabase user deletion error, proceeding with local sync:", err);
      }
    }

    const currentList = getLocalUsers();
    const target = currentList.find(
      (u) => u.id === userIdOrEmail || u.email.toLowerCase() === userIdOrEmail.toLowerCase()
    );

    if (!target) {
      return { success: false, message: "User not found." };
    }

    const updated = currentList.filter(
      (u) => u.id !== userIdOrEmail && u.email.toLowerCase() !== userIdOrEmail.toLowerCase()
    );
    saveLocalUsers(updated);

    // If target was in admin list, sync admin emails
    this.removeAdminEmail(target.email);

    return { success: true, message: `User "${target.full_name || target.email}" removed from website.` };
  },

  registerLocalUser(user: { email: string; fullName: string; phone?: string; role: "admin" | "customer" }) {
    const list = getLocalUsers();
    const existingIdx = list.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    const userProfile: UserProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      email: user.email,
      full_name: user.fullName,
      phone: user.phone || null,
      role: user.role,
    };

    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...userProfile };
    } else {
      list.unshift(userProfile);
    }
    saveLocalUsers(list);

    if (user.role === "admin") {
      this.addAdminEmail(user.email);
    }
  },

  async createUser(user: { email: string; fullName: string; phone?: string; role: "admin" | "customer" }): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    const cleanEmail = user.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { success: false, message: "Valid email address is required." };
    }

    const currentUsers = getLocalUsers();
    if (currentUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: `A user with email ${cleanEmail} already exists.` };
    }

    const newProfile: UserProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      email: cleanEmail,
      full_name: user.fullName.trim() || cleanEmail.split("@")[0],
      phone: user.phone?.trim() || null,
      role: user.role,
    };

    if (supabase) {
      try {
        await supabase.from("profiles").insert({
          id: newProfile.id,
          email: newProfile.email,
          full_name: newProfile.full_name,
          phone: newProfile.phone,
          role: newProfile.role,
        });
      } catch (err) {
        console.warn("Supabase insert user error (fallback to local):", err);
      }
    }

    currentUsers.unshift(newProfile);
    saveLocalUsers(currentUsers);

    if (user.role === "admin") {
      this.addAdminEmail(cleanEmail);
    }

    return { success: true, message: `User "${newProfile.full_name}" added successfully.`, user: newProfile };
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

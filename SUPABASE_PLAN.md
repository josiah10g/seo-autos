# SEO Autos – Supabase & Admin Dashboard Execution Guide

This document preserves our complete roadmap and preparation so we can jump straight into building tomorrow.

---

## 📌 Target Architecture & Capabilities

### 1. Database & Migrations (Idempotent & Additive)
- **Zero data loss migrations**: All SQL scripts will use `CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, and safe policy replacement (`DROP POLICY IF EXISTS ...; CREATE POLICY ...`).
- **Works both locally and on Vercel**: Uses standard `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` via `.env.local` locally and Vercel Environment Variables in production.
- **Tables**:
  - `profiles`: role-based access (`'admin'` vs `'customer'`).
  - `vehicles`: vehicle inventory with multi-image gallery support.
  - `bookings`: customer in-person visit/purchase requests.
- **Storage**:
  - `vehicle-images` public bucket for car photos (front, rear, side, interior).

---

### 2. Admin Dashboard (`/admin`)
- **Protected route** accessible only by users with `profiles.role === 'admin'`.
- **Vehicle Manager**:
  - Add new vehicle with multi-image file uploader directly into Supabase Storage.
  - Edit pricing, specs, tags, and condition.
  - Delete or mark vehicle as Sold/Inactive.
- **Bookings / Orders Manager**:
  - Review customer inspection/purchase requests.
  - Track status (`pending`, `confirmed`, `completed`).
  - Direct WhatsApp / Phone quick-action contact buttons.

---

### 3. Customer Experience
- **Authentication**: Seamless modal sign in / sign up.
- **Live Inventory**: Real-time showcase of vehicles loaded directly from Supabase with smooth fallbacks.
- **In-Person Booking / Purchase Flow**:
  - Customer selects vehicle -> clicks "Book In-Person Visit / Purchase".
  - Enters date/time, phone, and notes.
  - Admin receives request in the dashboard; customer receives confirmation + optional WhatsApp prefill.

---

## 🚀 Plan for Tomorrow (Step-by-Step)

1. **Step 1**: Create `supabase-schema.sql` (safe, re-runnable script) and `.env.example` / `.env`.
2. **Step 2**: Install `@supabase/supabase-js` and implement `src/lib/supabase.ts` client & types.
3. **Step 3**: Update `AuthModals.tsx` with real Supabase Auth (Admin vs Customer sessions).
4. **Step 4**: Build `src/routes/admin.tsx` (Vehicle CRUD + Image Storage Uploader + Bookings list).
5. **Step 5**: Build `BookingModal.tsx` and connect dynamic inventory in `VehicleShowcase.tsx`.
6. **Step 6**: Run `cmd.exe /c "npm run build"` to verify TanStack Router generation and test the complete workflow.

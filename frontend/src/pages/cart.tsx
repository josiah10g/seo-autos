import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Trash2, ArrowLeft, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  type CartItem,
  getStoredCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
  formatNaira,
  DEFAULT_DEMO_CART,
} from "@/lib/cart";

const WHATSAPP_PHONE = "2348086833676";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(getStoredCart());
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Sync cart from events and localStorage
  useEffect(() => {
    const syncCart = () => {
      setItems(getStoredCart());
    };

    // Auto-fill customer details from session if logged in
    const storedUser = localStorage.getItem("seo_autos_active_user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.fullName) setCustomerName(u.fullName);
        if (u.phone) setCustomerPhone(u.phone);
      } catch {
        // ignore
      }
    }

    window.addEventListener("cart:changed", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("cart:changed", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const totalAmount = getCartTotal(items);

  const handleQuantityChange = (id: string, value: string) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 1) {
      updateCartQuantity(id, 1);
    } else {
      updateCartQuantity(id, parsed);
    }
  };

  const handleContinueWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is currently empty.");
      return;
    }

    if (!customerName.trim()) {
      toast.error("Please enter your name to continue on WhatsApp.");
      return;
    }

    if (!customerPhone.trim()) {
      toast.error("Please enter your phone number to continue.");
      return;
    }

    const itemsSummary = items
      .map(
        (item) =>
          `• ${item.name} (Qty: ${item.quantity}) - ${formatNaira(item.price * item.quantity)}`
      )
      .join("\n");

    const message = `Hello SEO Autos Investment Limited! 👋\n\nI would like to place an order from your website:\n\n*Ordered Items:*\n${itemsSummary}\n\n*Total Order Value:* ${formatNaira(
      totalAmount
    )}\n\n*Customer Details:*\n• Name: ${customerName.trim()}\n• Phone: ${customerPhone.trim()}\n\nPlease confirm availability and delivery / payment arrangements. Thank you!`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    toast.success("Redirecting to WhatsApp agent...");
  };

  const handleRestoreDemoItem = () => {
    localStorage.setItem("seo_autos_cart", JSON.stringify(DEFAULT_DEMO_CART));
    setItems(DEFAULT_DEMO_CART);
    window.dispatchEvent(new CustomEvent("cart:changed", { detail: DEFAULT_DEMO_CART }));
    toast.success("Added Honda HIGH GRADE gearbox to cart!");
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="transition hover:text-foreground">
            Home
          </Link>
          <span className="text-muted-foreground/60">›</span>
          <span className="font-medium text-foreground">Cart</span>
        </nav>

        {/* Page Title */}
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Your cart
        </h1>

        {/* Main WhatsApp Checkout Card */}
        <div className="mt-8 rounded-2xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
          {/* Card Header with WhatsApp Icon */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <MessageCircle className="h-6 w-6 fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Engines &amp; gearboxes
              </h2>
              <p className="text-sm font-medium text-muted-foreground">
                Handled by an agent on WhatsApp
              </p>
            </div>
          </div>

          {/* Big-ticket notice text */}
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            This is a big-ticket item, so an agent handles it rather than a checkout form.
            You can ask questions and see what you're getting before any money changes hands.
          </p>

          {/* Cart Items List */}
          <div className="mt-6 space-y-4">
            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">Your cart is currently empty.</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleRestoreDemoItem}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/20 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Honda Gearbox (₦287,500)
                  </button>
                  <Link
                    to="/#inventory"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted transition"
                  >
                    Browse Engines
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/20 p-4 transition-colors hover:border-border sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base leading-snug">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm font-medium">
                      {formatNaira(item.price)} each
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center gap-4 shrink-0 justify-end">
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      aria-label="Quantity"
                      className="h-9 w-16 rounded-lg border border-border bg-background px-2.5 text-center text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400 transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total Section */}
          <div className="mt-8 border-t border-border/80 pt-6">
            <div className="flex items-center justify-between text-foreground">
              <span className="font-bold text-base sm:text-lg">
                Engines &amp; gearboxes total
              </span>
              <span className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
                {formatNaira(totalAmount)}
              </span>
            </div>
          </div>

          {/* Customer Input Fields & WhatsApp Submission Form */}
          <form onSubmit={handleContinueWhatsApp} className="mt-6 space-y-4">
            <div>
              <label htmlFor="customerName" className="sr-only">
                Your name
              </label>
              <input
                id="customerName"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="sr-only">
                Phone number
              </label>
              <input
                id="customerPhone"
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>

            {/* WhatsApp Big CTA Button */}
            <button
              type="submit"
              disabled={items.length === 0}
              className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 px-6 font-bold text-base shadow-sm transition-all hover:shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <MessageCircle className="h-5 w-5 fill-current" />
              <span>Continue on WhatsApp</span>
            </button>

            {/* Delivery & Payment note */}
            <p className="pt-1 text-center text-xs text-muted-foreground font-medium">
              Delivery and payment are arranged with the agent.
            </p>
          </form>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue browsing engines &amp; gearboxes
          </Link>
        </div>
      </div>
    </div>
  );
}


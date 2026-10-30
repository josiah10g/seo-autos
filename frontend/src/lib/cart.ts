export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  image?: string;
}

const CART_STORAGE_KEY = "seo_autos_cart";

export const DEFAULT_DEMO_CART: CartItem[] = [
  {
    id: "honda-high-grade-gearbox-fwd",
    name: "Honda HIGH GRADE gearbox — FWD",
    price: 287500,
    quantity: 1,
    category: "Gearbox",
    image: "/media_1792581112397.jpg",
  },
];

export function formatNaira(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG");
}

export function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return DEFAULT_DEMO_CART;
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) {
    // Initialize with default demo item so the user immediately sees the requested UI
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_CART));
    return DEFAULT_DEMO_CART;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:changed", { detail: items }));
}

export function addToCart(item: { id: string; name: string; price: number; category?: string; image?: string }, quantity = 1): void {
  const current = getStoredCart();
  const existing = current.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    current.push({ ...item, quantity: Math.max(1, quantity) });
  }
  saveCart(current);
}

export function updateCartQuantity(id: string, quantity: number): void {
  const current = getStoredCart();
  if (quantity <= 0) {
    removeFromCart(id);
    return;
  }
  const target = current.find((i) => i.id === id);
  if (target) {
    target.quantity = quantity;
    saveCart(current);
  }
}

export function removeFromCart(id: string): void {
  const current = getStoredCart();
  const filtered = current.filter((i) => i.id !== id);
  saveCart(filtered);
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
}


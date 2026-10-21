import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const LOCAL_SESSION_KEY = "seo_autos_active_user";
const LAST_ACTIVITY_KEY = "seo_autos_last_activity";
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const performLogout = async () => {
      // Check if user is logged in
      const session = localStorage.getItem(LOCAL_SESSION_KEY);
      if (!session) return;

      try {
        if (supabase) {
          await supabase.auth.signOut();
        }
      } catch {
        // ignore
      }

      localStorage.removeItem(LOCAL_SESSION_KEY);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      window.dispatchEvent(new Event("auth:changed"));
      window.dispatchEvent(new Event("storage"));

      toast.info("You were logged out due to 5 minutes of inactivity.", {
        duration: 5000,
      });

      // Redirect if on protected dashboard/admin routes
      if (
        window.location.pathname.startsWith("/admin") ||
        window.location.pathname.startsWith("/dashboard")
      ) {
        navigate({ to: "/" });
      }
    };

    const recordActivity = () => {
      if (localStorage.getItem(LOCAL_SESSION_KEY)) {
        localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
      }
    };

    const checkInactivity = () => {
      const session = localStorage.getItem(LOCAL_SESSION_KEY);
      if (!session) return;

      const lastActivityStr = localStorage.getItem(LAST_ACTIVITY_KEY);
      if (!lastActivityStr) {
        // Initialize timer if not present
        recordActivity();
        return;
      }

      const lastActivity = parseInt(lastActivityStr, 10);
      const elapsed = Date.now() - lastActivity;

      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        performLogout();
      }
    };

    // Initialize activity timestamp when mounted / logged in
    recordActivity();

    // User activity events to reset inactivity timer
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ];

    // Throttle activity writing to localStorage to prevent excessive disk/storage writes
    let throttleTimeout: number | null = null;
    const handleUserActivity = () => {
      if (!throttleTimeout) {
        recordActivity();
        throttleTimeout = window.setTimeout(() => {
          throttleTimeout = null;
        }, 1000); // at most once every second
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Check periodically every 5 seconds
    const intervalId = window.setInterval(checkInactivity, 5000);

    // Sync across browser tabs via storage events
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_SESSION_KEY && !e.newValue) {
        // Another tab logged out
        window.dispatchEvent(new Event("auth:changed"));
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      window.clearInterval(intervalId);
      window.removeEventListener("storage", handleStorage);
      if (throttleTimeout) {
        window.clearTimeout(throttleTimeout);
      }
    };
  }, [navigate]);
}

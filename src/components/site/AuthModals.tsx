import { useState, useEffect, useId } from "react";
import { Lock, Mail, User, AlertCircle, Eye, EyeOff, LogOut, ShieldCheck, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface SessionUser {
  email: string;
  fullName: string;
  role: "admin" | "customer";
}

const LOCAL_SESSION_KEY = "seo_autos_active_user";

export function AuthModals() {
  const [openModal, setOpenModal] = useState<"login" | "signup" | null>(null);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "info" | "error" | "success";
    text: string;
  } | null>(null);

  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const phoneId = useId();
  const nameId = useId();

  useEffect(() => {
    // Check local session or Supabase session
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_SESSION_KEY);
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const role = session.user.user_metadata?.role === "admin" ? "admin" : "customer";
          const userObj: SessionUser = {
            email: session.user.email || "",
            fullName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            role,
          };
          setCurrentUser(userObj);
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userObj));
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const role = session.user.user_metadata?.role === "admin" ? "admin" : "customer";
          const userObj: SessionUser = {
            email: session.user.email || "",
            fullName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            role,
          };
          setCurrentUser(userObj);
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userObj));
        } else {
          setCurrentUser(null);
          localStorage.removeItem(LOCAL_SESSION_KEY);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!email || !password) {
      setStatusMessage({
        type: "error",
        text: "Please enter your email and password.",
      });
      return;
    }

    setIsLoading(true);

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        const role = data.user.user_metadata?.role === "admin" ? "admin" : "customer";
        const sessionUser: SessionUser = {
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || email.split("@")[0],
          role,
        };
        setCurrentUser(sessionUser);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionUser));
        closeModal();
        return;
      } catch (err: any) {
        setStatusMessage({
          type: "error",
          text: err.message || "Failed to sign in. Please verify credentials.",
        });
        setIsLoading(false);
        return;
      }
    }

    // Demo local mock login
    const isAdmin = email.toLowerCase().includes("admin");
    const demoUser: SessionUser = {
      email,
      fullName: fullName || email.split("@")[0],
      role: isAdmin ? "admin" : "customer",
    };
    setCurrentUser(demoUser);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(demoUser));
    setIsLoading(false);
    closeModal();
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setStatusMessage({
        type: "error",
        text: "Please fill out all fields including your phone number.",
      });
      return;
    }

    if (password.length < 6) {
      setStatusMessage({
        type: "error",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatusMessage({
        type: "error",
        text: "Passwords do not match. Please retype carefully.",
      });
      return;
    }

    setIsLoading(true);

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              role: email.toLowerCase().includes("admin") ? "admin" : "customer",
            },
          },
        });
        if (error) throw error;

        if (data.session?.user) {
          const userObj: SessionUser = {
            email: data.session.user.email || email,
            fullName,
            role: email.toLowerCase().includes("admin") ? "admin" : "customer",
          };
          setCurrentUser(userObj);
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userObj));
          closeModal();
        } else {
          setStatusMessage({
            type: "success",
            text: "Account registered! Please check your email to confirm your account.",
          });
        }
        setIsLoading(false);
        return;
      } catch (err: any) {
        setStatusMessage({
          type: "error",
          text: err.message || "Failed to register account.",
        });
        setIsLoading(false);
        return;
      }
    }

    // Demo local mock signup
    const demoUser: SessionUser = {
      email,
      fullName,
      role: email.toLowerCase().includes("admin") ? "admin" : "customer",
    };
    setCurrentUser(demoUser);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(demoUser));
    setIsLoading(false);
    closeModal();
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_SESSION_KEY);
  };

  const closeModal = () => {
    setOpenModal(null);
    setStatusMessage(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhone("");
    setFullName("");
    setIsLoading(false);
  };

  return (
    <>
      {currentUser ? (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block text-xs font-bold text-foreground leading-none">
              {currentUser.fullName}
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {currentUser.role === "admin" ? "Yard Admin" : "Customer"}
            </span>
          </div>

          {currentUser.role === "admin" && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Dashboard
            </Link>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setStatusMessage(null);
              setOpenModal("login");
            }}
            className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground cursor-pointer"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusMessage(null);
              setOpenModal("signup");
            }}
            className="rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm transition-transform hover:scale-105 hover:bg-primary/90 cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      )}

      {/* Login Dialog */}
      <Dialog open={openModal === "login"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lock className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center font-display text-2xl uppercase tracking-wide">
              Sign In to SEO Autos
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              {isSupabaseConfigured
                ? "Sign in with your email or admin credentials."
                : "Demo Mode: Enter any email. Use an email with 'admin' (e.g. admin@seoautos.com) to test the Admin Dashboard."}
            </DialogDescription>
          </DialogHeader>

          {statusMessage && (
            <div
              className={`rounded-lg p-3 text-xs leading-relaxed flex items-start gap-2 ${
                statusMessage.type === "error"
                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                  : statusMessage.type === "success"
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-secondary/20 text-secondary-foreground border border-secondary/40"
              }`}
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
            <div>
              <label htmlFor={emailId} className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email address
              </label>
              <div className="relative mt-1.5">
                <input
                  id={emailId}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@seoautos.com"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label htmlFor={passwordId} className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id={passwordId}
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-10 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full py-2.5 text-xs font-bold uppercase tracking-wider mt-2 cursor-pointer"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-xs text-muted-foreground pt-1">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setStatusMessage(null);
                  setOpenModal("signup");
                }}
                className="font-bold text-primary hover:underline cursor-pointer"
              >
                Create one
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sign Up Dialog */}
      <Dialog open={openModal === "signup"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
              <User className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center font-display text-2xl uppercase tracking-wide">
              Create an Account
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              Register your details to schedule vehicle inspections and receive personalized inventory updates.
            </DialogDescription>
          </DialogHeader>

          {statusMessage && (
            <div
              className={`rounded-lg p-3 text-xs leading-relaxed flex items-start gap-2 ${
                statusMessage.type === "error"
                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                  : statusMessage.type === "success"
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-secondary/20 text-secondary-foreground border border-secondary/40"
              }`}
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSignupSubmit} className="space-y-3.5 pt-1">
            <div>
              <label htmlFor={nameId} className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Full Name
              </label>
              <div className="relative mt-1">
                <input
                  id={nameId}
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Babatunde Adeyemi"
                  className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label htmlFor={phoneId} className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Phone Number
              </label>
              <div className="relative mt-1">
                <input
                  id={phoneId}
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 803 123 4567"
                  className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label htmlFor={emailId + "-signup"} className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email address
              </label>
              <div className="relative mt-1">
                <input
                  id={emailId + "-signup"}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label htmlFor={passwordId + "-signup"} className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id={passwordId + "-signup"}
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-10 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor={confirmPasswordId} className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  id={confirmPasswordId}
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full rounded-lg border bg-background py-2 pl-9 pr-10 text-sm text-foreground outline-none focus:ring-1 ${
                    confirmPassword && password !== confirmPassword
                      ? "border-destructive focus:border-destructive focus:ring-destructive"
                      : "border-input focus:border-primary focus:ring-primary"
                  }`}
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-[11px] text-destructive">Passwords do not match.</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full py-2.5 text-xs font-bold uppercase tracking-wider mt-2 cursor-pointer"
            >
              {isLoading ? "Creating account..." : "Register Account"}
            </Button>

            <div className="text-center text-xs text-muted-foreground pt-1">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setStatusMessage(null);
                  setOpenModal("login");
                }}
                className="font-bold text-primary hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

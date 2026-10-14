import { useState, useEffect, useId, useRef } from "react";
import { Lock, Mail, User, AlertCircle, Eye, EyeOff, LogOut, ShieldCheck, Phone, Settings, ShoppingBag, ChevronDown, Camera } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured, db } from "@/lib/supabase";
import { toast } from "sonner";

export interface SessionUser {
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: "admin" | "customer";
}

const LOCAL_SESSION_KEY = "seo_autos_active_user";

export function AuthModals() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openModal, setOpenModal] = useState<"login" | "signup" | "profile" | null>(null);
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

  // Manage Profile edit form state (matches user requirements: name, surname, phone, email, password)
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileSurname, setProfileSurname] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileNewPassword, setProfileNewPassword] = useState("");
  const [showProfilePassword, setShowProfilePassword] = useState(false);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string>("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const phoneId = useId();
  const nameId = useId();
  const profileFirstNameId = useId();
  const profileSurnameId = useId();
  const profilePhoneId = useId();
  const profileEmailId = useId();
  const profilePasswordId = useId();

  const redirectUser = (role: "admin" | "customer") => {
    window.dispatchEvent(new Event("auth:changed"));
    window.dispatchEvent(new Event("storage"));
    if (role === "admin") {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setIsUserMenuOpen(false);
    if (isUserMenuOpen) {
      window.addEventListener("click", handleClickOutside);
      return () => window.removeEventListener("click", handleClickOutside);
    }
  }, [isUserMenuOpen]);

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
      const fetchSupabaseUser = async (user: any) => {
        if (!user) {
          setCurrentUser(null);
          localStorage.removeItem(LOCAL_SESSION_KEY);
          return;
        }

        let role: "admin" | "customer" =
          db.isEmailAdmin(user.email || "") || user.user_metadata?.role === "admin"
            ? "admin"
            : "customer";

        // Query the profiles table in case updated in Supabase directly
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, full_name, phone")
            .eq("id", user.id)
            .single();

          if (profile?.role === "admin") {
            role = "admin";
          }
        } catch {
          // ignore profile table error
        }

        const userObj: SessionUser = {
          email: user.email || "",
          fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          phone: user.user_metadata?.phone,
          avatarUrl: user.user_metadata?.avatar_url,
          role,
        };
        setCurrentUser(userObj);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userObj));
        window.dispatchEvent(new Event("auth:changed"));
      };

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchSupabaseUser(session.user);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          fetchSupabaseUser(session.user);
        } else {
          setCurrentUser(null);
          localStorage.removeItem(LOCAL_SESSION_KEY);
          window.dispatchEvent(new Event("auth:changed"));
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
      const err = "Please enter your email and password.";
      setStatusMessage({ type: "error", text: err });
      toast.error(err);
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

        let role: "admin" | "customer" =
          db.isEmailAdmin(data.user.email || email) || data.user.user_metadata?.role === "admin"
            ? "admin"
            : "customer";

        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          if (profile?.role === "admin") {
            role = "admin";
          }
        } catch {
          // ignore
        }

        const sessionUser: SessionUser = {
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || email.split("@")[0],
          role,
        };
        setCurrentUser(sessionUser);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionUser));
        window.dispatchEvent(new Event("auth:changed"));
        toast.success(`Welcome back, ${sessionUser.fullName}!`);
        closeModal();
        redirectUser(role);
        return;
      } catch (err: any) {
        const errText = err.message || "Failed to sign in. Please verify credentials.";
        setStatusMessage({ type: "error", text: errText });
        toast.error(errText);
        setIsLoading(false);
        return;
      }
    }

    // Demo local mock login
    const isAdmin = db.isEmailAdmin(email);
    const demoUser: SessionUser = {
      email,
      fullName: fullName || email.split("@")[0],
      role: isAdmin ? "admin" : "customer",
    };
    setCurrentUser(demoUser);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(demoUser));
    toast.success(`Signed in as ${demoUser.fullName} (${demoUser.role.toUpperCase()})`);
    setIsLoading(false);
    closeModal();
    redirectUser(demoUser.role);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      const err = "Please fill out all fields including your phone number.";
      setStatusMessage({ type: "error", text: err });
      toast.error(err);
      return;
    }

    if (password.length < 6) {
      const err = "Password must be at least 6 characters long.";
      setStatusMessage({ type: "error", text: err });
      toast.error(err);
      return;
    }

    if (password !== confirmPassword) {
      const err = "Passwords do not match. Please retype carefully.";
      setStatusMessage({ type: "error", text: err });
      toast.error(err);
      return;
    }

    setIsLoading(true);

    if (supabase) {
      const isAppointedAdmin = db.isEmailAdmin(email);
      const signupRole = isAppointedAdmin ? "admin" : "customer";
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              role: signupRole,
            },
          },
        });
        if (error) throw error;

        // If session exists immediately, log them in
        if (data.session?.user) {
          const userObj: SessionUser = {
            email: data.session.user.email || email,
            fullName,
            role: signupRole,
          };
          setCurrentUser(userObj);
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userObj));
          toast.success(`Account created! Welcome, ${fullName}.`);
          closeModal();
          redirectUser(userObj.role);
        } else {
          // If Supabase project has email confirm enabled, auto sign in or notify cleanly
          try {
            const loginAttempt = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (loginAttempt.data.session?.user) {
              const userObj: SessionUser = {
                email,
                fullName,
                role: signupRole,
              };
              setCurrentUser(userObj);
              localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userObj));
              toast.success(`Welcome to SEO Autos, ${fullName}!`);
              closeModal();
              redirectUser(userObj.role);
              return;
            }
          } catch {
            // If email confirmation is required by Supabase auth settings
          }

          // Allow customer immediate access in browser session
          const userObj: SessionUser = {
            email,
            fullName,
            role: signupRole,
          };
          setCurrentUser(userObj);
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userObj));
          toast.success(`Welcome to SEO Autos, ${fullName}!`);
          closeModal();
          redirectUser(userObj.role);
        }
        setIsLoading(false);
        return;
      } catch (err: any) {
        const errText = err.message || "Failed to register account.";
        setStatusMessage({ type: "error", text: errText });
        toast.error(errText);
        setIsLoading(false);
        return;
      }
    }

    // Demo local mock signup
    const isAppointedAdmin = db.isEmailAdmin(email);
    const demoUser: SessionUser = {
      email,
      fullName,
      role: isAppointedAdmin ? "admin" : "customer",
    };
    setCurrentUser(demoUser);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(demoUser));
    toast.success(`Account created! Welcome, ${fullName}.`);
    setIsLoading(false);
    closeModal();
    redirectUser(demoUser.role);
  };

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Check if Supabase storage is configured
    try {
      const res = await db.uploadImage(file);
      if (res.url) {
        setProfileAvatarUrl(res.url);
        toast.success("Profile photo uploaded!");
        return;
      }
    } catch {
      // Fallback to local base64 data URL
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileAvatarUrl(reader.result);
        toast.success("Profile photo selected!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSavingProfile(true);

    const first = profileFirstName.trim();
    const last = profileSurname.trim();
    const updatedDisplayName = [first, last].filter(Boolean).join(" ") || currentUser.fullName;
    const updatedPhone = profilePhone.trim() || currentUser.phone || "";
    const updatedEmail = profileEmail.trim() || currentUser.email;

    if (supabase) {
      try {
        const updatePayload: {
          email?: string;
          password?: string;
          data?: Record<string, any>;
        } = {
          data: {
            first_name: first,
            last_name: last,
            full_name: updatedDisplayName,
            phone: updatedPhone,
            avatar_url: profileAvatarUrl,
          },
        };

        if (profileNewPassword && profileNewPassword.length >= 6) {
          updatePayload.password = profileNewPassword;
        }

        if (updatedEmail !== currentUser.email) {
          updatePayload.email = updatedEmail;
        }

        const { error } = await supabase.auth.updateUser(updatePayload);
        if (error) throw error;

        // Also update profiles table if configured
        try {
          await supabase
            .from("profiles")
            .update({
              full_name: updatedDisplayName,
              phone: updatedPhone,
            })
            .eq("email", currentUser.email);
        } catch {
          // table update fallback
        }

        const updatedUser: SessionUser = {
          ...currentUser,
          fullName: updatedDisplayName,
          phone: updatedPhone,
          email: updatedEmail,
          avatarUrl: profileAvatarUrl,
        };

        setCurrentUser(updatedUser);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("auth:changed"));
        window.dispatchEvent(new Event("storage"));

        toast.success(
          updatedEmail !== currentUser.email
            ? "Account updated! Check both emails to verify the email change."
            : "Account details updated successfully!"
        );
        closeModal();
      } catch (err: any) {
        toast.error(err.message || "Failed to update account.");
      } finally {
        setIsSavingProfile(false);
      }
      return;
    }

    // Demo / Local session update
    const updatedUser: SessionUser = {
      ...currentUser,
      fullName: updatedDisplayName,
      phone: updatedPhone,
      email: updatedEmail,
      avatarUrl: profileAvatarUrl,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("auth:changed"));
    window.dispatchEvent(new Event("storage"));
    toast.success("Account details saved successfully!");
    setIsSavingProfile(false);
    closeModal();
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_SESSION_KEY);
    window.dispatchEvent(new Event("auth:changed"));
    window.dispatchEvent(new Event("storage"));
    toast.info("You have signed out.");
    navigate({ to: "/" });
  };

  const openProfileModal = () => {
    if (currentUser) {
      const parts = (currentUser.fullName || "").trim().split(/\s+/);
      const first = parts[0] || "";
      const last = parts.slice(1).join(" ") || "";
      setProfileFirstName(first);
      setProfileSurname(last);
      setProfilePhone(currentUser.phone || "");
      setProfileEmail(currentUser.email);
      setProfileAvatarUrl(currentUser.avatarUrl || "");
      setProfileNewPassword("");
      setShowProfilePassword(false);
    }
    setOpenModal("profile");
  };

  const closeModal = () => {
    setOpenModal(null);
    setStatusMessage(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhone("");
    setFullName("");
    setProfileNewPassword("");
    setShowProfilePassword(false);
    setIsLoading(false);
    setIsSavingProfile(false);
  };

  return (
    <>
      {currentUser ? (
        <div className="relative">
          {/* User Button: Compact circular avatar on mobile, full pill on desktop */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsUserMenuOpen(!isUserMenuOpen);
            }}
            aria-label="User account menu"
            className="group flex items-center rounded-full border border-border/70 bg-card/80 p-0.5 sm:py-1 sm:pl-3 sm:pr-1.5 shadow-sm transition hover:border-border hover:bg-card cursor-pointer"
          >
            {/* Left separator line - desktop only */}
            <div className="hidden sm:block h-6 w-[2px] bg-border/60 -ml-1 rounded-full mr-3" />
            
            {/* Name + Role - desktop only */}
            <div className="hidden sm:flex flex-col text-left leading-tight mr-3">
              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors max-w-[120px] truncate">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                {currentUser.role === "admin" ? "ADMIN" : "CUSTOMER"}
              </span>
            </div>

            {/* Circular avatar badge (visible on all screens; standalone tap target on mobile) */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-muted/60 text-foreground font-bold text-xs uppercase shadow-sm group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary transition overflow-hidden">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="h-full w-full object-cover" />
              ) : (
                currentUser.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("") || (currentUser.role === "admin" ? "AD" : "CU")
              )}
            </div>
          </button>

          {/* User Dropdown Menu (Dark theme matching reference screenshot) */}
          {isUserMenuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-2.5 w-60 rounded-xl border border-zinc-800 bg-[#0e0f11] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-zinc-200"
            >
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 px-3 py-3">
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-sm text-white truncate">
                    {currentUser.role === "admin" ? "Admin" : currentUser.fullName}
                  </div>
                  <div className="text-xs text-zinc-400 truncate">
                    {currentUser.email}
                  </div>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 font-bold text-xs uppercase border border-zinc-700 overflow-hidden">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="h-full w-full object-cover" />
                  ) : (
                    currentUser.role === "admin"
                      ? "AD"
                      : currentUser.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("") || "CU"
                  )}
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2 space-y-0.5">
                {currentUser.role === "admin" ? (
                  <Link
                    to="/admin"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition"
                  >
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>ADMIN DASHBOARD</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition"
                  >
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    <span>CUSTOMER DASHBOARD</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    openProfileModal();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-emerald-400" />
                  <span>ACCOUNT SETTINGS</span>
                </button>
              </div>

              {/* Logout Option */}
              <div className="border-t border-zinc-800/80 pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 hover:text-red-400 transition cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>SIGN OUT</span>
                </button>
              </div>
            </div>
          )}
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

      {/* Profile Edit Dialog (Exactly styled to user's screenshot) */}
      <Dialog open={openModal === "profile"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="w-[92vw] max-w-lg sm:max-w-md md:max-w-lg bg-[#0e0f11] border-zinc-800 text-zinc-100 p-6 sm:p-7 shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl uppercase tracking-wider text-white">
              Account Settings
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Update your name, surname, phone number, email, and password.
            </DialogDescription>
          </DialogHeader>

          {currentUser && (
            <form onSubmit={handleSaveProfile} className="space-y-5 pt-1">
              {/* Avatar + Choose Photo */}
              <div className="flex items-center gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-xl font-bold uppercase text-zinc-100 overflow-hidden shadow-inner">
                  {profileAvatarUrl ? (
                    <img
                      src={profileAvatarUrl}
                      alt={profileFirstName || currentUser.fullName || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>
                      {profileFirstName?.charAt(0) || currentUser.fullName.charAt(0) || "U"}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs text-zinc-400">
                    Upload a square PNG or JPG
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleProfilePhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-200 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
                    >
                      <Camera className="h-4 w-4" />
                      <span>CHOOSE PHOTO</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* First Name & Surname Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label
                    htmlFor={profileFirstNameId}
                    className="block text-xs font-bold text-zinc-200 uppercase tracking-wider"
                  >
                    First Name
                  </label>
                  <input
                    id={profileFirstNameId}
                    type="text"
                    required
                    value={profileFirstName}
                    onChange={(e) => setProfileFirstName(e.target.value)}
                    placeholder="e.g. Josiah"
                    className="w-full rounded-lg border border-zinc-800 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor={profileSurnameId}
                    className="block text-xs font-bold text-zinc-200 uppercase tracking-wider"
                  >
                    Surname
                  </label>
                  <input
                    id={profileSurnameId}
                    type="text"
                    value={profileSurname}
                    onChange={(e) => setProfileSurname(e.target.value)}
                    placeholder="e.g. Adeyemi"
                    className="w-full rounded-lg border border-zinc-800 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                  />
                </div>
              </div>

              {/* Phone Number (numbers only) */}
              <div className="space-y-1.5">
                <label
                  htmlFor={profilePhoneId}
                  className="block text-xs font-bold text-zinc-200 uppercase tracking-wider"
                >
                  Phone Number
                </label>
                <input
                  id={profilePhoneId}
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 08138946058"
                  className="w-full rounded-lg border border-zinc-800 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={profileEmailId}
                    className="block text-xs font-bold text-zinc-200 uppercase tracking-wider"
                  >
                    Email Address
                  </label>
                  <span className="text-[10px] text-zinc-400">Confirmation link sent if changed</span>
                </div>
                <input
                  id={profileEmailId}
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-zinc-800 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                />
              </div>

              {/* CHANGE PASSWORD (OPTIONAL) */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wide text-zinc-200">
                    CHANGE PASSWORD (OPTIONAL)
                  </div>
                  <div className="text-xs text-zinc-400">
                    Leave blank if you do not want to change your password
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor={profilePasswordId}
                    className="block text-xs font-bold text-zinc-300 uppercase tracking-wider"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id={profilePasswordId}
                      type={showProfilePassword ? "text" : "password"}
                      minLength={6}
                      value={profileNewPassword}
                      onChange={(e) => setProfileNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full rounded-lg border border-zinc-800 bg-black/60 py-2.5 pl-3.5 pr-10 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowProfilePassword(!showProfilePassword)}
                      className="absolute right-3 top-2.5 text-zinc-400 hover:text-white cursor-pointer"
                    >
                      {showProfilePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="rounded-lg bg-zinc-100 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-900 hover:bg-white shadow transition cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

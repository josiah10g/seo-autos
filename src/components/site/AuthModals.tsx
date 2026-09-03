import { useState, useId } from "react";
import { Lock, Mail, User, AlertCircle, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AuthModals() {
  const [openModal, setOpenModal] = useState<"login" | "signup" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "info" | "error" | "success";
    text: string;
  } | null>(null);

  const emailId = useId();
  const passwordId = useId();
  const nameId = useId();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!email || !password) {
      setStatusMessage({
        type: "error",
        text: "Please enter your email and password.",
      });
      return;
    }

    setStatusMessage({
      type: "info",
      text: "Admin Dashboard authentication check will be connected once you're ready for admin setup.",
    });
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!fullName || !email || !password) {
      setStatusMessage({
        type: "error",
        text: "Please fill out all fields to register.",
      });
      return;
    }

    setStatusMessage({
      type: "info",
      text: "Customer account registration will be enabled once database integration is connected.",
    });
  };

  const handleGoogleAuth = (mode: "login" | "signup") => {
    setStatusMessage({
      type: "info",
      text: `Sign in with Google (${mode === "login" ? "Login" : "Sign Up"}) is ready to link to your Google OAuth client ID.`,
    });
  };

  const closeModal = () => {
    setOpenModal(null);
    setStatusMessage(null);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return (
    <>
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
              Sign in with Google or your credentials to access your account.
            </DialogDescription>
          </DialogHeader>

          {statusMessage && (
            <div
              className={`rounded-lg p-3 text-xs leading-relaxed flex items-start gap-2 ${
                statusMessage.type === "error"
                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                  : "bg-secondary/20 text-secondary-foreground border border-secondary/40"
              }`}
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Sign In with Google Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleGoogleAuth("login")}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-muted cursor-pointer"
            >
              <GoogleIcon />
              <span>Sign in with Google</span>
            </button>
          </div>

          <div className="relative my-2 flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="absolute bg-background px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              or continue with email
            </span>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor={emailId} className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email address
              </label>
              <div className="relative mt-1.5">
                <input
                  id={emailId}
                  type="email"
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

            <Button type="submit" className="w-full rounded-full py-2.5 text-xs font-bold uppercase tracking-wider mt-2">
              Sign In
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
              Sign up with Google or complete the form to get vehicle updates and priority booking.
            </DialogDescription>
          </DialogHeader>

          {statusMessage && (
            <div
              className={`rounded-lg p-3 text-xs leading-relaxed flex items-start gap-2 ${
                statusMessage.type === "error"
                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                  : "bg-secondary/20 text-secondary-foreground border border-secondary/40"
              }`}
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Sign Up with Google Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleGoogleAuth("signup")}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-muted cursor-pointer"
            >
              <GoogleIcon />
              <span>Sign up with Google</span>
            </button>
          </div>

          <div className="relative my-2 flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="absolute bg-background px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              or register with email
            </span>
          </div>

          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label htmlFor={nameId} className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Full Name
              </label>
              <div className="relative mt-1.5">
                <input
                  id={nameId}
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label htmlFor={emailId + "-signup"} className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email address
              </label>
              <div className="relative mt-1.5">
                <input
                  id={emailId + "-signup"}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label htmlFor={passwordId + "-signup"} className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Create Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id={passwordId + "-signup"}
                  type={showPassword ? "text" : "password"}
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

            <Button type="submit" className="w-full rounded-full py-2.5 text-xs font-bold uppercase tracking-wider mt-2">
              Register Account
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

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.43 7.35 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27a7.17 7.17 0 0 1 0-4.54V6.58H1.26a11.996 11.996 0 0 0 0 10.84l4.02-3.15Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.29 2.57 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
      />
    </svg>
  );
}

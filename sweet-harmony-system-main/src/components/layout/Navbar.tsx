import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Candy,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  User,
} from "lucide-react";

/* 🔐 JWT helper */
const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export function Navbar() {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const isAdmin = user?.role === "admin";

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Candy className="h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-12" />
            <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground">
            Sweet<span className="text-primary">Shop</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="hidden sm:inline">Shop</span>
                </Button>
              </Link>

              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" className="gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.email?.split("@")[0]}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

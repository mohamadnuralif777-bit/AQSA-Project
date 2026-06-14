import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { LogOut, BookOpen, LayoutDashboard, Shield, Info } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const onLogout = async () => { await logout(); navigate("/"); };

  const isActive = (p) => location.pathname.startsWith(p);

  return (
    <nav data-testid="navbar" className="sticky top-0 z-50 glass border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link to="/" data-testid="navbar-logo" className="flex items-center gap-3">
          <Logo size={44} />
          <div className="leading-tight">
            <div className="font-heading text-lg text-emerald-900">AQSA Study Community</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Al-Qur'an &amp; Sunnah</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2 text-sm">
          <Link to="/about" data-testid="nav-about" className={`px-4 py-2 rounded-full transition-colors ${isActive("/about") ? "bg-emerald-800 text-white" : "text-stone-700 hover:bg-sand-100"}`}>
            <Info className="inline h-4 w-4 mr-1.5" /> Tentang
          </Link>
          <Link to="/library" data-testid="nav-library" className={`px-4 py-2 rounded-full transition-colors ${isActive("/library") ? "bg-emerald-800 text-white" : "text-stone-700 hover:bg-sand-100"}`}>
            <BookOpen className="inline h-4 w-4 mr-1.5" /> Perpustakaan
          </Link>
          {user && user.role !== undefined && (
            <Link to="/dashboard" data-testid="nav-dashboard" className={`px-4 py-2 rounded-full transition-colors ${isActive("/dashboard") ? "bg-emerald-800 text-white" : "text-stone-700 hover:bg-sand-100"}`}>
              <LayoutDashboard className="inline h-4 w-4 mr-1.5" /> Dashboard
            </Link>
          )}
          {user && user.role === "admin" && (
            <Link to="/admin" data-testid="nav-admin" className={`px-4 py-2 rounded-full transition-colors ${isActive("/admin") ? "bg-emerald-800 text-white" : "text-stone-700 hover:bg-sand-100"}`}>
              <Shield className="inline h-4 w-4 mr-1.5" /> Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user && user.email ? (
            <>
              <div className="hidden sm:block text-right mr-1">
                <div className="text-sm font-medium text-stone-900" data-testid="navbar-user-name">{user.name}</div>
                <div className="text-xs text-stone-500">{user.role === "admin" ? "Administrator" : "Santri"}</div>
              </div>
              <Button data-testid="logout-button" onClick={onLogout} variant="ghost" size="sm" className="rounded-full">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button data-testid="navbar-login" variant="ghost" className="rounded-full">Masuk</Button></Link>
              <Link to="/register"><Button data-testid="navbar-register" className="rounded-full bg-emerald-800 hover:bg-emerald-900 text-white">Daftar</Button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

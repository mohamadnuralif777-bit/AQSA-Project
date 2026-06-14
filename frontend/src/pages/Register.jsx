import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await register(name, email, password);
    setSubmitting(false);
    if (ok) navigate("/library", { replace: true });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-sand-50">
      <div className="hidden lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900" />
        <div className="absolute inset-0 geo-pattern opacity-25" />
        <div className="relative h-full p-16 flex flex-col justify-between text-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gold text-emerald-900 grid place-items-center font-arabic text-lg">ا</div>
            <span className="font-heading text-lg">Iqro' Interaktif</span>
          </Link>
          <div>
            <div className="font-arabic text-6xl text-gold mb-6 leading-tight">طَلَبُ الْعِلْم</div>
            <h2 className="font-heading text-4xl leading-tight max-w-md">"Menuntut ilmu adalah kewajiban bagi setiap muslim."</h2>
            <p className="text-emerald-100/80 mt-3 text-sm">HR. Ibnu Majah</p>
          </div>
          <p className="text-emerald-100/70 text-sm">© {new Date().getFullYear()} Iqro' Interaktif</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-16">
        <form data-testid="register-form" onSubmit={onSubmit} className="w-full max-w-md space-y-6">
          <div>
            <h1 className="font-heading text-4xl text-stone-900">Buat akun baru</h1>
            <p className="text-stone-600 mt-2">Mulai perjalanan belajarmu hari ini.</p>
          </div>
          {error && <div data-testid="register-error" className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="name">Nama lengkap</Label>
            <Input data-testid="register-name-input" id="name" required value={name} onChange={e => setName(e.target.value)} placeholder="Nama kamu" className="rounded-2xl h-12 bg-white border-sand-200" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input data-testid="register-email-input" id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="kamu@email.com" className="rounded-2xl h-12 bg-white border-sand-200" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password (min. 6 karakter)</Label>
            <Input data-testid="register-password-input" id="password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="rounded-2xl h-12 bg-white border-sand-200" />
          </div>
          <Button data-testid="register-submit-button" type="submit" disabled={submitting} className="w-full h-12 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white">
            {submitting ? "Memproses..." : "Daftar"}
          </Button>
          <p className="text-center text-stone-600 text-sm">
            Sudah punya akun? <Link to="/login" data-testid="register-to-login" className="text-emerald-800 font-medium hover:underline">Masuk di sini</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

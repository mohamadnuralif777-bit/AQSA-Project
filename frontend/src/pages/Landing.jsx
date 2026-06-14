import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import { BookOpen, MessageSquare, BarChart3, Sparkles, ArrowRight, GraduationCap, HeartHandshake, BookMarked } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Landing() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />

      {/* HERO BENTO */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 lg:pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main hero card */}
          <div data-testid="hero-card" className="lg:col-span-8 relative overflow-hidden rounded-3xl p-10 lg:p-14 bg-gradient-to-br from-emerald-800 to-emerald-900 text-white">
            <div className="absolute inset-0 geo-pattern opacity-25" />
            <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-gold/30 blur-3xl" />
            <div className="relative">
              <div className="font-arabic text-4xl text-gold mb-4">بِسْمِ اللهِ</div>
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-100/80 mb-3">AQSA Study Community • Sejak 2024</p>
              <h1 className="font-heading text-5xl lg:text-7xl leading-[1.05] mb-6">
                Belajar Al-Qur'an &amp; <span className="italic text-gold">Sunnah</span> bersama generasi muda.
              </h1>
              <p className="text-emerald-50/90 text-lg max-w-2xl leading-relaxed mb-8">
                Komunitas pembelajaran online &amp; offline yang membentuk generasi berilmu, berakhlak mulia, dan aktif berdakwah — lewat program MABAR, DIKLAT, dan BUKU.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link to={user ? "/library" : "/register"}>
                  <Button data-testid="hero-cta-primary" size="lg" className="rounded-full bg-gold text-emerald-900 hover:bg-gold-light px-7 h-12 text-base font-bold">
                    Mulai Belajar <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button data-testid="hero-cta-secondary" size="lg" variant="outline" className="rounded-full border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white px-7 h-12 text-base">
                    Tentang Komunitas
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Logo + Stat card */}
          <div className="lg:col-span-4 grid gap-6">
            <div className="rounded-3xl p-8 bg-white border border-sand-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col items-center text-center">
              <Logo size={120} />
              <div className="font-heading text-lg text-emerald-900 mt-4">AQSA Study Community</div>
              <p className="text-xs text-stone-500 uppercase tracking-[0.18em] mt-1">Al-Qur'an and Sunnah</p>
            </div>
            <div className="rounded-3xl p-8 bg-terracotta text-white relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
              <Sparkles className="h-7 w-7 mb-3" />
              <div className="font-heading text-2xl leading-tight">Yosowilangun, Lumajang.</div>
              <p className="text-white/85 text-sm mt-2">Sekretariat fisik &amp; kelas online.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-2">Program Unggulan</p>
            <h2 className="font-heading text-4xl text-stone-900">Tiga pilar kegiatan AQSA</h2>
          </div>
          <Link to="/about" className="text-emerald-800 hover:underline text-sm">Lihat detail program →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { code: "MABAR", icon: BookOpen, title: "Mari Belajar Al-Qur'an", text: "Program rutin pengajaran membaca Al-Qur'an oleh Divisi KBM sesuai kurikulum dan jadwal yang disepakati." },
            { code: "DIKLAT", icon: GraduationCap, title: "Pendidikan Akhlak Terpadu", text: "Program bulanan: kajian akhlak berbasis kisah Al-Qur'an, Hadis, dan sumber inspiratif lainnya." },
            { code: "BUKU", icon: HeartHandshake, title: "Bina Ukhuwah & Kolaborasi", text: "Program tahunan kolaborasi antar komunitas untuk mempererat ukhuwah dan saling menginspirasi." },
          ].map((f, i) => (
            <div key={i} data-testid={`feature-card-${i}`} className="rounded-3xl bg-white border border-sand-200 p-8 hover:-translate-y-1 transition-transform shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-800 grid place-items-center mb-4"><f.icon className="h-5 w-5" /></div>
              <div className="text-xs uppercase tracking-[0.18em] text-terracotta font-bold mb-1">{f.code}</div>
              <div className="font-heading text-xl text-stone-900 mb-2">{f.title}</div>
              <p className="text-stone-600 leading-relaxed text-sm">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES (Iqro digital) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-2">Fitur Website</p>
        <h2 className="font-heading text-4xl text-stone-900 mb-8">Iqro' Digital Interaktif</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BookMarked, title: "Materi Interaktif", text: "30+ halaman per jilid dengan navigasi cepat, pencarian, dan mode gelap." },
            { icon: BarChart3, title: "Progress Tersimpan", text: "Lacak kemajuanmu otomatis di setiap jilid Iqro' 1–6." },
            { icon: MessageSquare, title: "Diskusi Antar Santri", text: "Saling berbagi pertanyaan dan jawaban di kolom diskusi tiap jilid." },
          ].map((f, i) => (
            <div key={i} className="rounded-3xl bg-sand-100 p-7">
              <f.icon className="h-6 w-6 text-emerald-800 mb-3" />
              <div className="font-heading text-lg text-stone-900 mb-1">{f.title}</div>
              <p className="text-stone-600 text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-sand-200 py-10 text-center text-stone-500 text-sm">
        <div className="font-arabic text-2xl text-emerald-800 mb-2">جَزَاكُمُ اللهُ خَيْرًا</div>
        AQSA Study Community &middot; Yosowilangun, Lumajang &middot; © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { BookOpen, MessageSquare, BarChart3, Sparkles, ArrowRight } from "lucide-react";
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
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-100/80 mb-3">Buku Iqro' Digital • Interaktif</p>
              <h1 className="font-heading text-5xl lg:text-7xl leading-[1.05] font-medium mb-6">
                Belajar membaca <span className="italic text-gold">Al-Qur'an</span> dengan cara modern.
              </h1>
              <p className="text-emerald-50/90 text-lg max-w-2xl leading-relaxed mb-8">
                Materi Iqro' jilid 1 sampai 6 dalam format interaktif: pencarian cepat, mode malam, bookmark, dan latihan kuis di setiap halaman.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link to={user ? "/library" : "/register"}>
                  <Button data-testid="hero-cta-primary" size="lg" className="rounded-full bg-gold text-emerald-900 hover:bg-gold-light px-7 h-12 text-base font-medium">
                    Mulai Belajar <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/library">
                  <Button data-testid="hero-cta-secondary" size="lg" variant="outline" className="rounded-full border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white px-7 h-12 text-base">
                    Lihat Perpustakaan
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stat card */}
          <div className="lg:col-span-4 grid gap-6">
            <div className="rounded-3xl p-8 bg-white border border-sand-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-3">Materi Tersedia</div>
              <div className="font-heading text-6xl text-emerald-900 leading-none">6 <span className="text-2xl text-stone-500">Jilid</span></div>
              <p className="text-stone-600 mt-3 text-sm leading-relaxed">Iqro' 5 & 6 sudah tersedia interaktif. Jilid 1–4 segera hadir.</p>
            </div>
            <div className="rounded-3xl p-8 bg-terracotta text-white relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
              <Sparkles className="h-7 w-7 mb-3" />
              <div className="font-heading text-2xl leading-tight">Belajar tanpa batas, dimana saja.</div>
              <p className="text-white/85 text-sm mt-2">Progres tersimpan otomatis di akunmu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, title: "Materi Interaktif", text: "30+ halaman per jilid dengan navigasi cepat, pencarian, dan mode gelap." },
            { icon: BarChart3, title: "Progress Tersimpan", text: "Lacak kemajuanmu secara otomatis di setiap jilid." },
            { icon: MessageSquare, title: "Diskusi & Komentar", text: "Saling berbagi pertanyaan dan jawaban antar santri." },
          ].map((f, i) => (
            <div key={i} data-testid={`feature-card-${i}`} className="rounded-3xl bg-white border border-sand-200 p-8 hover:-translate-y-1 transition-transform shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-800 grid place-items-center mb-5">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="font-heading text-xl text-stone-900 mb-2">{f.title}</div>
              <p className="text-stone-600 leading-relaxed text-sm">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-sand-200 py-10 text-center text-stone-500 text-sm">
        <div className="font-arabic text-2xl text-emerald-800 mb-2">وَاللهُ أَعْلَمُ</div>
        Iqro' Interaktif &middot; KH. As'ad Humam &middot; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

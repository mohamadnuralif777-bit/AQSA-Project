import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { Users, Target, Eye, Heart, BookOpen, GraduationCap, HandshakeIcon, MapPin, Calendar } from "lucide-react";

const STRUCTURE = [
  { role: "Ketua", name: "Mohamad Nur Alif" },
  { role: "Wakil Ketua", name: "Ahmad Zakaria" },
  { role: "Sekretaris", name: "Lailatul Maghfiroh" },
  { role: "Bendahara", name: "Shofia Nur Fadhilah" },
];

const DIVISIONS = [
  { name: "Divisi KBM", desc: "Kegiatan Belajar Mengajar", members: ["Mohamad Nur Alif", "Muhamad Lukiyan Rasyad", "Nazwa Rahma", "Kholilah Maysuroh"] },
  { name: "Divisi Pengembangan Program", desc: "Inovasi dan kurikulum", members: [] },
  { name: "Divisi Humas & Komunikasi", desc: "Hubungan publik", members: ["Izma Robiatul Adawiyah"] },
];

const PROGRAMS = [
  { code: "MABAR", title: "Mari Belajar Al-Qur'an", icon: BookOpen, desc: "Program rutin oleh Divisi KBM. Pengajar memberikan edukasi membaca Al-Qur'an kepada santri sesuai kurikulum dan jadwal yang disepakati." },
  { code: "DIKLAT", title: "Pendidikan Akhlak Terpadu", icon: GraduationCap, desc: "Program bulanan dari Divisi KBM. Santri mendapat pendidikan akhlak berbasis kisah Al-Qur'an, Hadis, dan sumber inspiratif lainnya dengan pendekatan interaktif." },
  { code: "BUKU", title: "Bina Ukhuwah & Kolaborasi Qur'ani", icon: HandshakeIcon, desc: "Program tahunan yang melibatkan semua anggota komunitas. Kami mengundang komunitas lain untuk berkolaborasi dan saling menginspirasi." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-3">Profil Komunitas</p>
            <h1 className="font-heading text-5xl lg:text-6xl text-emerald-900 leading-[1.05] mb-5">
              AQSA <span className="italic text-terracotta">Study Community</span>
            </h1>
            <p className="text-stone-700 text-lg leading-relaxed max-w-2xl mb-6">
              <strong>Al-Qur'an and Sunnah Study Community</strong> — komunitas yang lahir dari kepedulian terhadap generasi muda muslim agar lebih dekat dan mencintai Al-Qur'an.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-stone-600">
              <div className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-emerald-800" /> Berdiri 12 Juni 2024</div>
              <div className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-800" /> Yosowilangun, Lumajang</div>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="rounded-3xl bg-emerald-50 p-10 border border-emerald-100">
              <Logo size={220} />
            </div>
          </div>
        </div>
      </section>

      {/* Latar belakang */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-12">
        <div className="rounded-3xl bg-white border border-sand-200 p-8 lg:p-12">
          <div className="font-arabic text-4xl text-emerald-900 mb-4">اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</div>
          <p className="text-stone-600 italic mb-4">"Bacalah dengan menyebut nama Tuhanmu yang menciptakan." (QS. Al-'Alaq: 1)</p>
          <h2 className="font-heading text-3xl text-stone-900 mb-3">Latar Belakang</h2>
          <p className="text-stone-700 leading-relaxed">
            AQSA Study Community lahir dari sebuah kegelisahan: banyaknya pemuda muslim yang masih kesulitan membaca Al-Qur'an, padahal Al-Qur'an adalah pedoman hidup manusia. Komunitas ini resmi dibentuk pada 12 Juni 2024 oleh Founder dan Co-Founder, lalu mengalami restrukturisasi pada 13 April 2025 dengan penambahan divisi dan anggota.
          </p>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-12 grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-emerald-800 text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 geo-pattern opacity-15" />
          <div className="relative">
            <Eye className="h-6 w-6 text-gold mb-3" />
            <h3 className="font-heading text-2xl mb-3">Visi</h3>
            <p className="text-emerald-50 leading-relaxed">
              Menjadi komunitas pembelajaran Al-Qur'an dan Sunnah yang dinamis dan inklusif — online maupun offline — yang membentuk generasi muda berilmu, berakhlak mulia, dan aktif berdakwah di era digital maupun dunia nyata.
            </p>
          </div>
        </div>
        <div className="rounded-3xl bg-white border border-sand-200 p-8">
          <Target className="h-6 w-6 text-terracotta mb-3" />
          <h3 className="font-heading text-2xl text-stone-900 mb-3">Misi</h3>
          <ul className="space-y-2 text-stone-700 text-sm leading-relaxed">
            <li>• Membangun semangat pemuda untuk mempelajari Al-Qur'an dan Sunnah.</li>
            <li>• Menyediakan ruang belajar yang fleksibel — online & offline.</li>
            <li>• Menyelenggarakan kajian rutin, interaktif, dan diskusi terbuka.</li>
            <li>• Memanfaatkan media sosial sebagai sarana dakwah dan edukasi.</li>
            <li>• Membangun komunitas yang mendukung pertumbuhan spiritual, intelektual, dan sosial.</li>
            <li>• Berkolaborasi dengan berbagai pihak untuk memperluas manfaat dakwah.</li>
          </ul>
        </div>
      </section>

      {/* Program */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-12">
        <h2 className="font-heading text-4xl text-stone-900 mb-2">Program Unggulan</h2>
        <p className="text-stone-600 mb-8">Tiga program inti AQSA Study Community.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PROGRAMS.map((p, i) => (
            <div key={i} data-testid={`program-${p.code}`} className="rounded-3xl bg-white border border-sand-200 p-7 hover:-translate-y-1 transition-transform shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-800 grid place-items-center mb-4"><p.icon className="h-5 w-5" /></div>
              <div className="text-xs uppercase tracking-[0.18em] text-terracotta font-medium mb-2">{p.code}</div>
              <h4 className="font-heading text-xl text-stone-900 mb-2">{p.title}</h4>
              <p className="text-stone-600 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Struktur */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-12">
        <h2 className="font-heading text-4xl text-stone-900 mb-2">Struktur Organisasi</h2>
        <p className="text-stone-600 mb-8">Pengurus inti dan divisi.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STRUCTURE.map((s, i) => (
            <div key={i} className="rounded-3xl bg-white border border-sand-200 p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-emerald-800 text-white grid place-items-center mx-auto mb-3 font-heading text-xl">
                {s.name.split(' ').map(w => w.charAt(0)).slice(0, 2).join('')}
              </div>
              <div className="text-xs uppercase tracking-wider text-stone-500 mb-1">{s.role}</div>
              <div className="font-medium text-stone-900">{s.name}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {DIVISIONS.map((d, i) => (
            <div key={i} className="rounded-3xl bg-sand-100 p-6">
              <Users className="h-5 w-5 text-emerald-800 mb-3" />
              <h4 className="font-heading text-lg text-stone-900">{d.name}</h4>
              <p className="text-xs text-stone-500 mb-3">{d.desc}</p>
              {d.members.length > 0 ? (
                <ul className="text-sm text-stone-700 space-y-1">{d.members.map((m, j) => <li key={j}>• {m}</li>)}</ul>
              ) : <p className="text-xs italic text-stone-400">Anggota belum terdaftar</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Nilai */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-12">
        <div className="rounded-3xl bg-terracotta text-white p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <Heart className="h-7 w-7 mb-4" />
          <h2 className="font-heading text-3xl mb-5">Nilai yang Kami Junjung</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {["Berilmu", "Berakhlak Mulia", "Aktif Berdakwah", "Ukhuwah Islamiyah", "Inklusif & Dinamis", "Relevan di Era Modern", "Transparansi", "Manajemen yang Baik", "Spiritual & Sosial"].map((v, i) => (
              <div key={i} className="bg-white/15 backdrop-blur rounded-2xl px-4 py-3">✦ {v}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontak */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="rounded-3xl bg-white border border-sand-200 p-8 lg:p-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-heading text-3xl text-stone-900 mb-2">Hubungi Kami</h3>
            <p className="text-stone-600 mb-5">Sekretariat AQSA Study Community.</p>
            <div className="space-y-3 text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-800 flex-shrink-0 mt-0.5" />
                <span>JL Krajan No. 52, Desa Yosowilangun Lor, Kec. Yosowilangun, Kab. Lumajang, Jawa Timur.</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-6 text-center">
            <div className="font-arabic text-3xl text-emerald-900 mb-2">جَزَاكُمُ اللهُ خَيْرًا</div>
            <p className="text-emerald-800 text-sm">Semoga Allah membalas kebaikan Anda.</p>
            <p className="text-xs text-stone-500 mt-3">Dokumen disusun 15 April 2025 / 16 Syawal 1446 H</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-sand-200 py-8 text-center text-stone-500 text-sm">
        © {new Date().getFullYear()} AQSA Study Community
      </footer>
    </div>
  );
}

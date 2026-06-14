import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, TrendingUp, Award, BookMarked } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    (async () => {
      const [m, p] = await Promise.all([api.get("/materials"), api.get("/progress")]);
      setMaterials(m.data);
      setProgress(p.data);
    })().catch(() => {});
  }, []);

  const progressMap = Object.fromEntries(progress.map(p => [p.material_id, p]));
  const totalCount = materials.length || 1;
  const totalPercent = materials.length > 0 ? Math.round(progress.reduce((a, p) => a + p.percent, 0) / totalCount) : 0;
  const completed = progress.filter(p => p.percent >= 100).length;
  const inProgress = progress.filter(p => p.percent > 0 && p.percent < 100).length;

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-2">Dashboard</p>
          <h1 className="font-heading text-4xl lg:text-5xl text-stone-900">Assalamu'alaikum, {user?.name}</h1>
          <p className="text-stone-600 mt-2">Berikut ringkasan progres belajarmu.</p>
        </div>

        {/* Stats bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div data-testid="stat-overall" className="rounded-3xl p-8 bg-emerald-800 text-white relative overflow-hidden">
            <div className="absolute inset-0 geo-pattern opacity-15" />
            <div className="relative">
              <TrendingUp className="h-6 w-6 mb-3 text-gold" />
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-100 mb-2">Progres Keseluruhan</div>
              <div className="font-heading text-6xl leading-none mb-3">{totalPercent}<span className="text-2xl">%</span></div>
              <Progress value={totalPercent} className="h-2 bg-white/20" />
            </div>
          </div>
          <div className="rounded-3xl p-8 bg-white border border-sand-200">
            <Award className="h-6 w-6 mb-3 text-terracotta" />
            <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">Materi Selesai</div>
            <div className="font-heading text-6xl text-stone-900 leading-none">{completed}<span className="text-2xl text-stone-400">/{materials.length || 0}</span></div>
          </div>
          <div className="rounded-3xl p-8 bg-white border border-sand-200">
            <BookMarked className="h-6 w-6 mb-3 text-emerald-800" />
            <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">Sedang Dipelajari</div>
            <div className="font-heading text-6xl text-stone-900 leading-none">{inProgress}</div>
          </div>
        </div>

        {/* Materials list */}
        <h2 className="font-heading text-2xl text-stone-900 mb-5">Materi & Progres</h2>
        <div className="space-y-3">
          {materials.map(m => {
            const p = progressMap[m.id];
            return (
              <div key={m.id} data-testid={`dashboard-material-${m.category || "iqro"}-${m.volume}`} className="rounded-3xl bg-white border border-sand-200 p-5 flex flex-wrap items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl grid place-items-center font-heading text-lg flex-shrink-0 ${m.is_locked ? "bg-stone-200 text-stone-500" : ((m.category || "iqro") === "tajwid" ? "bg-terracotta text-white" : "bg-emerald-800 text-white")}`}>{m.volume}</div>
                <div className="flex-1 min-w-[180px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-stone-900">{m.title}</span>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${(m.category || "iqro") === "tajwid" ? "bg-terracotta/15 text-terracotta" : "bg-emerald-50 text-emerald-800"}`}>
                      {(m.category || "iqro") === "tajwid" ? "Tajwid" : "Iqro'"}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500">{m.is_locked ? "Belum tersedia" : (p ? `${p.percent}% selesai` : "Belum dimulai")}</div>
                </div>
                <div className="w-full md:w-48"><Progress value={p?.percent || 0} className="h-2" /></div>
                {!m.is_locked && (
                  <Link to={`/viewer/${m.id}`}>
                    <Button data-testid={`dashboard-open-${m.volume}`} size="sm" variant="outline" className="rounded-full border-sand-200">
                      <BookOpen className="h-4 w-4 mr-2" /> {p && p.percent > 0 ? "Lanjutkan" : "Buka"}
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

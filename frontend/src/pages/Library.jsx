import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lock, BookOpen, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Library() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/materials");
        setMaterials(data);
        if (user && user.email) {
          try {
            const { data: pd } = await api.get("/progress");
            const map = {};
            pd.forEach(p => { map[p.material_id] = p; });
            setProgress(map);
          } catch (_) {}
        }
      } finally { setLoading(false); }
    })();
  }, [user]);

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-2">Perpustakaan</p>
            <h1 className="font-heading text-4xl lg:text-5xl text-stone-900">Pilih Jilid Iqro'</h1>
            <p className="text-stone-600 mt-2 max-w-xl">Klik kartu untuk membuka materi interaktif. Progres belajarmu akan otomatis tersimpan.</p>
          </div>
        </div>

        {loading ? (
          <div className="h-48 grid place-items-center"><div className="h-10 w-10 rounded-full border-4 border-emerald-800 border-t-transparent animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((m) => {
              const p = progress[m.id];
              const isLocked = m.is_locked;
              return (
                <div key={m.id} data-testid={`iqro-${m.volume}-card`} className={`rounded-3xl p-8 border transition-all ${isLocked ? "bg-sand-100 border-dashed border-stone-300 opacity-80" : "bg-white border-sand-200 hover:-translate-y-1 hover:shadow-lg shadow-[0_8px_30px_rgba(0,0,0,0.04)]"}`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className={`h-14 w-14 rounded-2xl grid place-items-center font-heading text-2xl ${isLocked ? "bg-stone-200 text-stone-500" : "bg-emerald-800 text-white"}`}>
                      {m.volume}
                    </div>
                    {isLocked ? (
                      <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-500 bg-stone-200 px-3 py-1.5 rounded-full">
                        <Lock className="h-3 w-3" /> Segera
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full">
                        <Sparkles className="h-3 w-3" /> Tersedia
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-2xl text-stone-900 mb-2">{m.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed mb-5 min-h-[44px]">{m.description}</p>
                  {p && p.percent > 0 && (
                    <div className="mb-5">
                      <div className="flex justify-between text-xs text-stone-500 mb-1.5"><span>Progres</span><span>{p.percent}%</span></div>
                      <Progress value={p.percent} className="h-2" />
                    </div>
                  )}
                  {isLocked ? (
                    <Button data-testid={`iqro-${m.volume}-locked-button`} disabled className="w-full rounded-2xl bg-stone-200 text-stone-500">
                      <Lock className="h-4 w-4 mr-2" /> Belum Tersedia
                    </Button>
                  ) : (
                    <Link to={`/viewer/${m.id}`}>
                      <Button data-testid={`iqro-${m.volume}-open-button`} className="w-full rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white">
                        <BookOpen className="h-4 w-4 mr-2" /> {p && p.percent > 0 ? "Lanjut Belajar" : "Mulai Belajar"}
                      </Button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

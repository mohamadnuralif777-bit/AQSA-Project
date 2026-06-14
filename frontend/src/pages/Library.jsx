import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lock, BookOpen, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const CATEGORIES = [
  { key: "iqro", label: "Iqro'", subtitle: "Belajar membaca Al-Qur'an jilid 1–6" },
  { key: "tajwid", label: "Belajar Tajwid", subtitle: "Kaidah membaca Al-Qur'an dengan benar" },
];

export default function Library() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("iqro");

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

  const renderGrid = (catKey) => {
    const items = materials.filter(m => (m.category || "iqro") === catKey);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((m) => {
          const p = progress[m.id];
          const isLocked = m.is_locked;
          return (
            <div key={m.id} data-testid={`${catKey}-${m.volume}-card`} className={`rounded-3xl p-8 border transition-all ${isLocked ? "bg-sand-100 border-dashed border-stone-300 opacity-80" : "bg-white border-sand-200 hover:-translate-y-1 hover:shadow-lg shadow-[0_8px_30px_rgba(0,0,0,0.04)]"}`}>
              <div className="flex items-start justify-between mb-6">
                <div className={`h-14 w-14 rounded-2xl grid place-items-center font-heading text-2xl ${isLocked ? "bg-stone-200 text-stone-500" : (catKey === "tajwid" ? "bg-terracotta text-white" : "bg-emerald-800 text-white")}`}>
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
                <Button data-testid={`${catKey}-${m.volume}-locked-button`} disabled className="w-full rounded-2xl bg-stone-200 text-stone-500">
                  <Lock className="h-4 w-4 mr-2" /> Belum Tersedia
                </Button>
              ) : (
                <Link to={`/viewer/${m.id}`}>
                  <Button data-testid={`${catKey}-${m.volume}-open-button`} className="w-full rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white">
                    <BookOpen className="h-4 w-4 mr-2" /> {p && p.percent > 0 ? "Lanjut Belajar" : "Mulai Belajar"}
                  </Button>
                </Link>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="col-span-full text-center py-16 text-stone-500">Belum ada materi di kategori ini.</div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-2">Perpustakaan</p>
          <h1 className="font-heading text-4xl lg:text-5xl text-stone-900">Pilih Kategori Belajar</h1>
          <p className="text-stone-600 mt-2 max-w-xl">Klik kartu untuk membuka materi interaktif. Progres belajarmu akan otomatis tersimpan.</p>
        </div>

        {loading ? (
          <div className="h-48 grid place-items-center"><div className="h-10 w-10 rounded-full border-4 border-emerald-800 border-t-transparent animate-spin" /></div>
        ) : (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList data-testid="library-tabs" className="bg-sand-100 rounded-full p-1 mb-8">
              {CATEGORIES.map(c => (
                <TabsTrigger key={c.key} data-testid={`library-tab-${c.key}`} value={c.key} className="rounded-full data-[state=active]:bg-emerald-800 data-[state=active]:text-white px-6">
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {CATEGORIES.map(c => (
              <TabsContent key={c.key} value={c.key}>
                <p className="text-stone-600 text-sm mb-6">{c.subtitle}</p>
                {renderGrid(c.key)}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}

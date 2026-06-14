import { useEffect, useState } from "react";
import api, { formatApiErrorDetail } from "@/api/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, Users, BookOpen, BarChart3, Pencil, Trash2 } from "lucide-react";

export default function Admin() {
  const [tab, setTab] = useState("materials");
  const [materials, setMaterials] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ users: 0, materials: 0, available: 0, comments: 0 });

  // Upload form
  const [volume, setVolume] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState(null);

  const loadAll = async () => {
    const [m, u, s] = await Promise.all([
      api.get("/materials"),
      api.get("/admin/users"),
      api.get("/admin/stats"),
    ]);
    setMaterials(m.data);
    setUsers(u.data);
    setStats(s.data);
  };

  useEffect(() => { loadAll().catch(() => {}); }, []);

  const onFileChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setHtmlContent(text);
    if (!title) setTitle(f.name.replace(/\.html?$/i, ""));
  };

  const resetForm = () => {
    setVolume(1); setTitle(""); setDescription(""); setHtmlContent(""); setIsLocked(false); setEditId(null); setMsg("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!htmlContent && !editId) {
      setMsg("Silakan unggah file HTML terlebih dahulu.");
      return;
    }
    setSubmitting(true);
    setMsg("");
    try {
      if (editId) {
        const payload = { title, description, is_locked: isLocked };
        if (htmlContent) payload.html_content = htmlContent;
        await api.put(`/materials/${editId}`, payload);
        setMsg("Materi berhasil diperbarui.");
      } else {
        await api.post("/materials", { volume: Number(volume), title, description, html_content: htmlContent, is_locked: isLocked });
        setMsg("Materi berhasil disimpan.");
      }
      resetForm();
      await loadAll();
    } catch (e) {
      setMsg(formatApiErrorDetail(e.response?.data?.detail) || e.message);
    } finally { setSubmitting(false); }
  };

  const onEdit = async (m) => {
    setEditId(m.id);
    setVolume(m.volume);
    setTitle(m.title);
    setDescription(m.description || "");
    setIsLocked(m.is_locked);
    setHtmlContent("");
    setMsg(`Mengedit "${m.title}". Unggah file HTML baru untuk mengganti, atau biarkan kosong.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (m) => {
    if (!window.confirm(`Hapus materi "${m.title}"?`)) return;
    try { await api.delete(`/materials/${m.id}`); await loadAll(); }
    catch (e) { alert(formatApiErrorDetail(e.response?.data?.detail) || e.message); }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-2">Panel Admin</p>
          <h1 className="font-heading text-4xl lg:text-5xl text-stone-900">Kelola Konten</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Pengguna", value: stats.users, icon: Users, color: "bg-emerald-800 text-white" },
            { label: "Total Materi", value: stats.materials, icon: BookOpen, color: "bg-white border border-sand-200" },
            { label: "Tersedia", value: stats.available, icon: BarChart3, color: "bg-white border border-sand-200" },
            { label: "Komentar", value: stats.comments, icon: BarChart3, color: "bg-terracotta text-white" },
          ].map((s, i) => (
            <div key={i} data-testid={`admin-stat-${i}`} className={`rounded-3xl p-6 ${s.color}`}>
              <s.icon className="h-5 w-5 mb-3 opacity-80" />
              <div className="text-xs uppercase tracking-wider opacity-80 mb-1">{s.label}</div>
              <div className="font-heading text-4xl">{s.value}</div>
            </div>
          ))}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-sand-100 rounded-full p-1">
            <TabsTrigger data-testid="admin-tab-materials" value="materials" className="rounded-full data-[state=active]:bg-emerald-800 data-[state=active]:text-white">Materi</TabsTrigger>
            <TabsTrigger data-testid="admin-tab-users" value="users" className="rounded-full data-[state=active]:bg-emerald-800 data-[state=active]:text-white">Pengguna</TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="mt-6 space-y-6">
            <form onSubmit={onSubmit} className="rounded-3xl bg-white border border-sand-200 p-6 lg:p-8 space-y-5" data-testid="admin-material-form">
              <h3 className="font-heading text-2xl text-stone-900">{editId ? "Edit Materi" : "Tambah / Ganti Materi"}</h3>
              {msg && <div className="text-sm px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-100">{msg}</div>}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Jilid (1-6)</Label>
                  <Input data-testid="admin-volume-input" type="number" min={1} max={20} value={volume} onChange={e => setVolume(e.target.value)} disabled={!!editId} className="rounded-2xl bg-white border-sand-200 h-11" />
                </div>
                <div className="md:col-span-2">
                  <Label>Judul</Label>
                  <Input data-testid="admin-title-input" value={title} onChange={e => setTitle(e.target.value)} required className="rounded-2xl bg-white border-sand-200 h-11" />
                </div>
              </div>
              <div>
                <Label>Deskripsi singkat</Label>
                <Textarea data-testid="admin-description-input" value={description} onChange={e => setDescription(e.target.value)} className="rounded-2xl bg-white border-sand-200 min-h-[72px]" />
              </div>
              <div>
                <Label>File HTML interaktif</Label>
                <input data-testid="admin-html-file-input" type="file" accept=".html,.htm,text/html" onChange={onFileChange} className="block w-full text-sm text-stone-600 mt-1 file:mr-4 file:py-2.5 file:px-4 file:rounded-2xl file:border-0 file:bg-emerald-800 file:text-white file:font-medium hover:file:bg-emerald-900" />
                {htmlContent && <p className="text-xs text-emerald-700 mt-2">✓ File HTML siap diunggah ({Math.round(htmlContent.length / 1024)} KB)</p>}
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-sand-50 border border-sand-200 p-4">
                <div>
                  <Label htmlFor="locked" className="cursor-pointer">Tandai sebagai "Belum Tersedia"</Label>
                  <p className="text-xs text-stone-500">User tidak bisa membuka materi ini.</p>
                </div>
                <Switch data-testid="admin-locked-switch" id="locked" checked={isLocked} onCheckedChange={setIsLocked} />
              </div>
              <div className="flex gap-3">
                <Button data-testid="admin-submit-button" type="submit" disabled={submitting} className="rounded-full bg-emerald-800 hover:bg-emerald-900 text-white">
                  <Upload className="h-4 w-4 mr-2" /> {submitting ? "Menyimpan..." : (editId ? "Simpan Perubahan" : "Simpan Materi")}
                </Button>
                {editId && <Button type="button" variant="outline" onClick={resetForm} className="rounded-full border-sand-200">Batal</Button>}
              </div>
            </form>

            <div className="rounded-3xl bg-white border border-sand-200 overflow-hidden" data-testid="admin-materials-table">
              <table className="w-full text-sm">
                <thead className="bg-sand-50 border-b border-sand-200 text-left">
                  <tr>
                    <th className="px-6 py-3 font-medium text-stone-600">Jilid</th>
                    <th className="px-6 py-3 font-medium text-stone-600">Judul</th>
                    <th className="px-6 py-3 font-medium text-stone-600">Status</th>
                    <th className="px-6 py-3 text-right font-medium text-stone-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map(m => (
                    <tr key={m.id} className="border-b border-sand-200 last:border-0">
                      <td className="px-6 py-4 font-heading text-lg text-emerald-800">{m.volume}</td>
                      <td className="px-6 py-4">{m.title}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${m.is_locked ? "bg-stone-100 text-stone-600" : "bg-emerald-50 text-emerald-800"}`}>{m.is_locked ? "Terkunci" : "Tersedia"}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button data-testid={`admin-edit-${m.volume}`} size="sm" variant="ghost" onClick={() => onEdit(m)} className="rounded-full"><Pencil className="h-4 w-4" /></Button>
                        <Button data-testid={`admin-delete-${m.volume}`} size="sm" variant="ghost" onClick={() => onDelete(m)} className="rounded-full text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="rounded-3xl bg-white border border-sand-200 overflow-hidden" data-testid="admin-users-table">
              <table className="w-full text-sm">
                <thead className="bg-sand-50 border-b border-sand-200 text-left">
                  <tr>
                    <th className="px-6 py-3 font-medium text-stone-600">Nama</th>
                    <th className="px-6 py-3 font-medium text-stone-600">Email</th>
                    <th className="px-6 py-3 font-medium text-stone-600">Role</th>
                    <th className="px-6 py-3 font-medium text-stone-600">Bergabung</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-sand-200 last:border-0">
                      <td className="px-6 py-4">{u.name}</td>
                      <td className="px-6 py-4 text-stone-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${u.role === "admin" ? "bg-terracotta/15 text-terracotta" : "bg-sand-100 text-stone-700"}`}>{u.role}</span>
                      </td>
                      <td className="px-6 py-4 text-stone-500">{new Date(u.created_at).toLocaleDateString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

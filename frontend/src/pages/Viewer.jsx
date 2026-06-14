import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api, { formatApiErrorDetail } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Maximize2, MessageSquare, Send, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Viewer() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [percent, setPercent] = useState(0);
  const iframeRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/materials/${id}`);
        setMaterial(data);
        try {
          const { data: pd } = await api.get("/progress");
          const p = pd.find(x => x.material_id === id);
          if (p) setPercent(p.percent);
        } catch (_) {}
        try {
          const { data: cd } = await api.get(`/comments/${id}`);
          setComments(cd);
        } catch (_) {}
      } catch (e) {
        setErr(formatApiErrorDetail(e.response?.data?.detail) || e.message);
      } finally { setLoading(false); }
    })();
  }, [id]);

  const saveProgress = async (newPercent) => {
    setPercent(newPercent);
    try { await api.post("/progress", { material_id: id, percent: newPercent, last_page: 0 }); } catch (_) {}
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      const { data } = await api.post("/comments", { material_id: id, content });
      setComments([data, ...comments]);
      setContent("");
    } catch (e) {
      alert(formatApiErrorDetail(e.response?.data?.detail) || e.message);
    } finally { setPosting(false); }
  };

  const removeComment = async (cid) => {
    if (!window.confirm("Hapus komentar ini?")) return;
    try {
      await api.delete(`/comments/${cid}`);
      setComments(comments.filter(c => c.id !== cid));
    } catch (e) { alert(formatApiErrorDetail(e.response?.data?.detail) || e.message); }
  };

  const openFullscreen = () => {
    if (iframeRef.current && iframeRef.current.requestFullscreen) iframeRef.current.requestFullscreen();
  };

  if (loading) return <div className="min-h-screen grid place-items-center bg-sand-50"><div className="h-10 w-10 rounded-full border-4 border-emerald-800 border-t-transparent animate-spin" /></div>;
  if (err) return (
    <div className="min-h-screen grid place-items-center bg-sand-50 p-6">
      <div className="text-center">
        <p className="text-stone-700 mb-4">{err}</p>
        <Button onClick={() => navigate("/library")} className="rounded-full bg-emerald-800 hover:bg-emerald-900 text-white">Kembali ke Perpustakaan</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Glass top bar */}
      <div className="sticky top-0 z-40 glass border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
          <Link to="/library" data-testid="viewer-back-button" className="inline-flex items-center gap-2 text-sm text-stone-700 hover:text-emerald-800">
            <ArrowLeft className="h-4 w-4" /> Perpustakaan
          </Link>
          <div className="font-heading text-lg text-emerald-900 truncate">{material.title}</div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-600">
              <span>Progres:</span>
              <Progress value={percent} className="w-24 h-2" />
              <span className="font-medium">{percent}%</span>
            </div>
            <Button data-testid="viewer-fullscreen-button" onClick={openFullscreen} variant="ghost" size="sm" className="rounded-full"><Maximize2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {/* Iframe with the HTML content */}
      <div className="max-w-7xl mx-auto px-2 lg:px-6 pt-4">
        <div className="rounded-3xl overflow-hidden border border-sand-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] bg-white">
          <iframe
            ref={iframeRef}
            data-testid="material-iframe"
            srcDoc={material.html_content}
            title={material.title}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className="w-full"
            style={{ height: "calc(100vh - 140px)", border: "none" }}
          />
        </div>

        {/* Quick progress controls */}
        <div className="mt-4 rounded-3xl bg-white border border-sand-200 p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-heading text-lg text-stone-900">Tandai progres belajarmu</div>
            <p className="text-stone-600 text-sm">Pilih sesuai kemajuan kamu di jilid ini.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[25, 50, 75, 100].map(v => (
              <Button key={v} data-testid={`progress-${v}-button`} onClick={() => saveProgress(v)} variant={percent >= v ? "default" : "outline"} className={`rounded-full ${percent >= v ? "bg-emerald-800 hover:bg-emerald-900 text-white" : "border-sand-200"}`}>
                {v}%
              </Button>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="my-8 rounded-3xl bg-white border border-sand-200 p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare className="h-5 w-5 text-emerald-800" />
            <h3 className="font-heading text-2xl text-stone-900">Diskusi</h3>
            <span className="text-stone-500 text-sm">({comments.length})</span>
          </div>

          <form onSubmit={postComment} className="mb-6">
            <Textarea data-testid="comment-input" value={content} onChange={e => setContent(e.target.value)} placeholder="Tulis pertanyaan atau pendapat kamu..." className="rounded-2xl border-sand-200 min-h-[90px]" />
            <div className="flex justify-end mt-3">
              <Button data-testid="comment-submit-button" type="submit" disabled={posting || !content.trim()} className="rounded-full bg-emerald-800 hover:bg-emerald-900 text-white">
                <Send className="h-4 w-4 mr-2" /> {posting ? "Mengirim..." : "Kirim"}
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            {comments.length === 0 && <p className="text-stone-500 text-sm text-center py-6">Belum ada komentar. Jadilah yang pertama!</p>}
            {comments.map(c => (
              <div key={c.id} data-testid={`comment-${c.id}`} className="rounded-2xl bg-sand-50 border border-sand-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-800 text-white grid place-items-center text-xs font-medium">{c.user_name.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="text-sm font-medium text-stone-900">{c.user_name}</div>
                      <div className="text-xs text-stone-500">{new Date(c.created_at).toLocaleString("id-ID")}</div>
                    </div>
                  </div>
                  {user && (c.user_id === user.id || user.role === "admin") && (
                    <Button data-testid={`comment-delete-${c.id}`} variant="ghost" size="sm" onClick={() => removeComment(c.id)} className="text-red-600 hover:bg-red-50 rounded-full"><Trash2 className="h-4 w-4" /></Button>
                  )}
                </div>
                <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

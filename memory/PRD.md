# Iqro' Interaktif — PRD

## Original Problem Statement
"bisakah kamu buatkan website yang dapat menampung materi materi ini ?"
User uploaded 2 interactive HTML files (Iqro 5 & Iqro 6) — a buku Iqro' digital interaktif by KH. As'ad Humam.

## User Choices (verbatim)
- Website lengkap dengan login/registrasi user & tracking progress belajar
- Sediakan placeholder/slot untuk Iqro 1-4
- Perlu panel admin untuk upload HTML/materi baru
- Islamic/religius theme
- Perlu fitur komentar/diskusi

## Architecture
- Backend: FastAPI + MongoDB (motor), JWT in httpOnly cookies (access 1d / refresh 7d), bcrypt password hashing
- Frontend: React 19 + React Router 7 + TailwindCSS + Shadcn/UI
- Iqro HTML materials stored as strings in MongoDB and rendered via sandboxed iframe
- Routes: `/`, `/login`, `/register`, `/library`, `/viewer/:id` (auth), `/dashboard` (auth), `/admin` (admin only)
- Design: Organic & Earthy (deep emerald #064E3B + terracotta #D97757 + gold #D4AF37) on sand background; Fraunces (heading) + Manrope (body) + Amiri (Arabic)

## User Personas
1. Santri / Student — registers, browses library, opens Iqro 5/6, tracks progress, comments
2. Parent / Teacher — same as student
3. Admin — manages materials (CRUD), monitors users & stats

## Core Requirements (static)
- Auth: register, login, logout, me, refresh
- 6 Iqro volumes (1-6); Iqro 5 & 6 live, 1-4 placeholders
- Progress tracking (per user, per material, 0-100%)
- Comments (per material, owner/admin can delete)
- Admin panel with stats, material CRUD (with HTML file upload), user list

## What's Been Implemented (2025-12)
- ✅ JWT auth (bcrypt, httpOnly+secure+samesite=none cookies)
- ✅ Admin seeded at startup (admin@iqro.com / Admin@2025)
- ✅ Materials seeded: 6 volumes; 1-4 locked placeholders, 5 & 6 with full HTML
- ✅ Material list (public) + detail (auth)
- ✅ Progress upsert per user+material
- ✅ Comments (list/post/delete)
- ✅ Admin endpoints (users, stats, material CRUD)
- ✅ Landing, Login, Register, Library, Viewer, Dashboard, Admin pages — all in Bahasa Indonesia
- ✅ data-testid coverage on all interactive elements
- ✅ Backend tests: 16/16 passing
- ✅ E2E flow tested end-to-end by testing_agent

## Backlog (priorities)
### P1
- Iqro 1-4 actual content (waiting for user upload via admin panel)
- Silence `/api/auth/me` 401 console noise for guests
- Email verification
- "Forgot password" flow (server scaffold partially designed)
### P2
- Reply threads on comments
- Bookmark per page within a volume (persisted to backend)
- Search across all volumes
- Per-volume quiz analytics (the HTML quiz currently only stores client-side)
### P3
- Multi-language UI (English / Arabic)
- Audio playback per huruf
- Mobile-optimised reader controls
- Achievement badges & streaks

from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated
from contextlib import asynccontextmanager

from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, Response, status
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict


# ──────────────────────────── DB ────────────────────────────
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 60 * 24  # 1 day
REFRESH_TOKEN_DAYS = 7

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("iqro")


# ──────────────────────────── Auth helpers ────────────────────────────
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_DAYS),
        "type": "refresh",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        key="access_token", value=access_token, httponly=True,
        secure=True, samesite="none", max_age=ACCESS_TOKEN_MINUTES * 60, path="/",
    )
    response.set_cookie(
        key="refresh_token", value=refresh_token, httponly=True,
        secure=True, samesite="none", max_age=REFRESH_TOKEN_DAYS * 86400, path="/",
    )


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"password_hash": 0, "_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user


# ──────────────────────────── Models ────────────────────────────
class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    created_at: str


class MaterialIn(BaseModel):
    category: str = "iqro"
    volume: int = Field(ge=1, le=20)
    title: str
    description: Optional[str] = ""
    html_content: str  # the full interactive HTML
    is_locked: bool = False


class MaterialUpdate(BaseModel):
    category: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    html_content: Optional[str] = None
    is_locked: Optional[bool] = None


class MaterialSummary(BaseModel):
    id: str
    volume: int
    title: str
    description: str
    is_locked: bool
    created_at: str


class MaterialFull(MaterialSummary):
    html_content: str


class ProgressIn(BaseModel):
    material_id: str
    percent: int = Field(ge=0, le=100)
    last_page: int = Field(ge=0, default=0)


class ProgressOut(BaseModel):
    material_id: str
    percent: int
    last_page: int
    updated_at: str


class CommentIn(BaseModel):
    material_id: str
    content: str = Field(min_length=1, max_length=1000)


class CommentOut(BaseModel):
    id: str
    material_id: str
    user_id: str
    user_name: str
    content: str
    created_at: str


# ──────────────────────────── Seeding ────────────────────────────
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@iqro.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@2025")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "name": "Admin",
            "role": "admin",
            "password_hash": hash_password(admin_password),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Admin seeded: {admin_email}")
    else:
        if not verify_password(admin_password, existing["password_hash"]):
            await db.users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password)}},
            )


async def seed_materials():
    """Seed Iqro 1–6 placeholders and Tajwid placeholders."""
    # Migration: add 'category' to any existing materials without it
    await db.materials.update_many({"category": {"$exists": False}}, {"$set": {"category": "iqro"}})

    iqro_titles = {
        1: ("Iqro' Jilid 1", "Pengenalan huruf hijaiyah berbaris fathah."),
        2: ("Iqro' Jilid 2", "Huruf bersambung dan baris fathah panjang."),
        3: ("Iqro' Jilid 3", "Tanda baca kasrah dan dhammah."),
        4: ("Iqro' Jilid 4", "Tanwin, sukun, dan huruf qalqalah."),
        5: ("Iqro' Jilid 5", "Tajwid dasar: mad, waqaf, dan tanda baca lanjut."),
        6: ("Iqro' Jilid 6", "Penyempurnaan bacaan dan kaidah tajwid."),
    }
    tajwid_titles = {
        1: ("Tajwid Dasar: Makharijul Huruf", "Pengenalan tempat keluarnya huruf hijaiyah."),
        2: ("Hukum Nun Sukun & Tanwin", "Idzhar, Idgham, Iqlab, dan Ikhfa."),
        3: ("Hukum Mim Sukun", "Idgham Mitslain, Ikhfa Syafawi, dan Idzhar Syafawi."),
        4: ("Hukum Mad", "Mad Thabi'i dan ragam Mad far'i."),
        5: ("Qalqalah & Waqaf", "Qalqalah sughra/kubra dan tanda-tanda waqaf."),
        6: ("Lam Ta'rif & Ra'", "Hukum bacaan Lam Ta'rif dan tafkhim/tarqiq pada Ra'."),
    }

    base = Path("/app")

    async def ensure(category: str, vol: int, title: str, desc: str, html_filename: Optional[str] = None):
        existing = await db.materials.find_one({"category": category, "volume": vol})
        if existing:
            return
        html_content = ""
        is_locked = True
        if html_filename:
            candidate = base / html_filename
            if candidate.exists():
                try:
                    html_content = candidate.read_text(encoding="utf-8")
                    is_locked = False
                except Exception as e:
                    logger.warning(f"Failed to read {candidate}: {e}")
        await db.materials.insert_one({
            "id": str(uuid.uuid4()),
            "category": category,
            "volume": vol,
            "title": title,
            "description": desc,
            "html_content": html_content,
            "is_locked": is_locked,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Seeded {category} vol {vol} (locked={is_locked})")

    for vol, (title, desc) in iqro_titles.items():
        await ensure("iqro", vol, title, desc, f"iqro{vol}.html" if vol in (5, 6) else None)
    for vol, (title, desc) in tajwid_titles.items():
        await ensure("tajwid", vol, title, desc, None)


async def ensure_indexes():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    # Drop legacy unique-on-volume index if present (replaced by compound category+volume index)
    try:
        info = await db.materials.index_information()
        for name, spec in info.items():
            if name == "_id_":
                continue
            keys = spec.get("key", [])
            if keys == [("volume", 1)] and spec.get("unique"):
                await db.materials.drop_index(name)
    except Exception as e:
        logger.warning(f"Index migration: {e}")
    await db.materials.create_index([("category", 1), ("volume", 1)], unique=True)
    await db.materials.create_index("id", unique=True)
    await db.progress.create_index([("user_id", 1), ("material_id", 1)], unique=True)
    await db.comments.create_index("material_id")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await ensure_indexes()
    await seed_admin()
    await seed_materials()
    yield
    client.close()


# ──────────────────────────── App ────────────────────────────
app = FastAPI(title="Iqro Interaktif API", lifespan=lifespan)
api = APIRouter(prefix="/api")


@api.get("/")
async def root():
    return {"message": "Iqro Interaktif API", "status": "ok"}


# ── Auth
@api.post("/auth/register", response_model=UserOut)
async def register(payload: RegisterIn, response: Response):
    email = payload.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    user_doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name.strip(),
        "email": email,
        "role": "user",
        "password_hash": hash_password(payload.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user_doc)
    access = create_access_token(user_doc["id"], email, "user")
    refresh = create_refresh_token(user_doc["id"])
    set_auth_cookies(response, access, refresh)
    return UserOut(**{k: user_doc[k] for k in ("id", "name", "email", "role", "created_at")})


@api.post("/auth/login", response_model=UserOut)
async def login(payload: LoginIn, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email atau password salah")
    access = create_access_token(user["id"], email, user.get("role", "user"))
    refresh = create_refresh_token(user["id"])
    set_auth_cookies(response, access, refresh)
    return UserOut(id=user["id"], name=user["name"], email=user["email"], role=user.get("role", "user"), created_at=user["created_at"])


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@api.get("/auth/me", response_model=UserOut)
async def me(user=Depends(get_current_user)):
    return UserOut(**{k: user[k] for k in ("id", "name", "email", "role", "created_at")})


@api.post("/auth/refresh")
async def refresh_token_endpoint(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access = create_access_token(user["id"], user["email"], user.get("role", "user"))
        response.set_cookie(
            key="access_token", value=access, httponly=True,
            secure=True, samesite="none", max_age=ACCESS_TOKEN_MINUTES * 60, path="/",
        )
        return {"ok": True}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


# ── Materials
@api.get("/materials", response_model=List[MaterialSummary])
async def list_materials(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    docs = await db.materials.find(query, {"_id": 0, "html_content": 0}).sort([("category", 1), ("volume", 1)]).to_list(100)
    return [MaterialSummary(**{**d, "category": d.get("category", "iqro")}) for d in docs]


@api.get("/materials/{material_id}", response_model=MaterialFull)
async def get_material(material_id: str, user=Depends(get_current_user)):
    doc = await db.materials.find_one({"id": material_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Materi tidak ditemukan")
    if doc.get("is_locked") and not doc.get("html_content"):
        raise HTTPException(status_code=423, detail="Materi belum tersedia")
    return MaterialFull(**doc)


@api.post("/materials", response_model=MaterialSummary)
async def create_material(payload: MaterialIn, admin=Depends(require_admin)):
    existing = await db.materials.find_one({"category": payload.category, "volume": payload.volume})
    if existing:
        await db.materials.update_one({"id": existing["id"]}, {"$set": {
            "title": payload.title,
            "description": payload.description or "",
            "html_content": payload.html_content,
            "is_locked": payload.is_locked,
        }})
        doc = await db.materials.find_one({"id": existing["id"]}, {"_id": 0, "html_content": 0})
        return MaterialSummary(**{**doc, "category": doc.get("category", "iqro")})
    doc = {
        "id": str(uuid.uuid4()),
        "category": payload.category,
        "volume": payload.volume,
        "title": payload.title,
        "description": payload.description or "",
        "html_content": payload.html_content,
        "is_locked": payload.is_locked,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.materials.insert_one(doc)
    return MaterialSummary(**{k: doc[k] for k in ("id", "category", "volume", "title", "description", "is_locked", "created_at")})


@api.put("/materials/{material_id}", response_model=MaterialSummary)
async def update_material(material_id: str, payload: MaterialUpdate, admin=Depends(require_admin)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="Tidak ada perubahan")
    result = await db.materials.update_one({"id": material_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Materi tidak ditemukan")
    doc = await db.materials.find_one({"id": material_id}, {"_id": 0, "html_content": 0})
    return MaterialSummary(**{**doc, "category": doc.get("category", "iqro")})


@api.delete("/materials/{material_id}")
async def delete_material(material_id: str, admin=Depends(require_admin)):
    result = await db.materials.delete_one({"id": material_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Materi tidak ditemukan")
    return {"ok": True}


# ── Progress
@api.get("/progress", response_model=List[ProgressOut])
async def get_progress(user=Depends(get_current_user)):
    docs = await db.progress.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    return [ProgressOut(material_id=d["material_id"], percent=d["percent"], last_page=d.get("last_page", 0), updated_at=d["updated_at"]) for d in docs]


@api.post("/progress", response_model=ProgressOut)
async def update_progress(payload: ProgressIn, user=Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    await db.progress.update_one(
        {"user_id": user["id"], "material_id": payload.material_id},
        {"$set": {
            "user_id": user["id"],
            "material_id": payload.material_id,
            "percent": payload.percent,
            "last_page": payload.last_page,
            "updated_at": now,
        }},
        upsert=True,
    )
    return ProgressOut(material_id=payload.material_id, percent=payload.percent, last_page=payload.last_page, updated_at=now)


# ── Comments
@api.get("/comments/{material_id}", response_model=List[CommentOut])
async def list_comments(material_id: str):
    docs = await db.comments.find({"material_id": material_id}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return [CommentOut(**d) for d in docs]


@api.post("/comments", response_model=CommentOut)
async def post_comment(payload: CommentIn, user=Depends(get_current_user)):
    doc = {
        "id": str(uuid.uuid4()),
        "material_id": payload.material_id,
        "user_id": user["id"],
        "user_name": user["name"],
        "content": payload.content.strip(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.comments.insert_one(doc)
    return CommentOut(**doc)


@api.delete("/comments/{comment_id}")
async def delete_comment(comment_id: str, user=Depends(get_current_user)):
    doc = await db.comments.find_one({"id": comment_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Komentar tidak ditemukan")
    if doc["user_id"] != user["id"] and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Tidak diizinkan")
    await db.comments.delete_one({"id": comment_id})
    return {"ok": True}


# ── Admin
@api.get("/admin/users")
async def admin_list_users(admin=Depends(require_admin)):
    docs = await db.users.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", -1).to_list(500)
    return docs


@api.get("/admin/stats")
async def admin_stats(admin=Depends(require_admin)):
    users = await db.users.count_documents({})
    materials = await db.materials.count_documents({})
    available = await db.materials.count_documents({"is_locked": False})
    comments = await db.comments.count_documents({})
    return {"users": users, "materials": materials, "available": available, "comments": comments}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

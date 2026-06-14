"""Comprehensive backend tests for Iqro Interaktif platform."""
import os
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://knowledge-base-666.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@iqro.com"
ADMIN_PASSWORD = "Admin@2025"


def _new_user_payload():
    suffix = uuid.uuid4().hex[:8]
    return {
        "name": f"TEST User {suffix}",
        "email": f"test_{suffix}@example.com",
        "password": "Test@1234",
    }


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return s


@pytest.fixture(scope="module")
def user_session():
    s = requests.Session()
    payload = _new_user_payload()
    r = s.post(f"{API}/auth/register", json=payload)
    assert r.status_code == 200, f"Register failed: {r.status_code} {r.text}"
    s.user_payload = payload  # type: ignore
    s.user = r.json()  # type: ignore
    return s


# ─── Health ───
def test_root_ok():
    r = requests.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# ─── Auth ───
def test_register_and_me_and_logout():
    s = requests.Session()
    payload = _new_user_payload()
    r = s.post(f"{API}/auth/register", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == payload["email"].lower()
    assert data["role"] == "user"
    # cookies set
    assert "access_token" in s.cookies.get_dict()
    # me
    r2 = s.get(f"{API}/auth/me")
    assert r2.status_code == 200
    assert r2.json()["email"] == payload["email"].lower()
    # logout clears
    r3 = s.post(f"{API}/auth/logout")
    assert r3.status_code == 200
    # new session no token
    s.cookies.clear()
    r4 = s.get(f"{API}/auth/me")
    assert r4.status_code == 401


def test_register_duplicate_email():
    s = requests.Session()
    payload = _new_user_payload()
    r = s.post(f"{API}/auth/register", json=payload)
    assert r.status_code == 200
    r2 = requests.post(f"{API}/auth/register", json=payload)
    assert r2.status_code == 400


def test_login_admin(admin_session):
    r = admin_session.get(f"{API}/auth/me")
    assert r.status_code == 200
    assert r.json()["role"] == "admin"
    assert r.json()["email"] == ADMIN_EMAIL


def test_login_wrong_password():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code == 401


# ─── Materials ───
def test_materials_list_six_with_lock_states():
    r = requests.get(f"{API}/materials")
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 6, f"Expected 6 materials, got {len(items)}"
    by_vol = {m["volume"]: m for m in items}
    for v in range(1, 5):
        assert by_vol[v]["is_locked"] is True, f"Vol {v} should be locked"
    for v in (5, 6):
        assert by_vol[v]["is_locked"] is False, f"Vol {v} should be unlocked"


def test_material_detail_requires_auth():
    r = requests.get(f"{API}/materials")
    mid = r.json()[0]["id"]
    r2 = requests.get(f"{API}/materials/{mid}")
    assert r2.status_code == 401


def test_material_detail_locked_returns_423(user_session):
    items = requests.get(f"{API}/materials").json()
    vol1 = next(m for m in items if m["volume"] == 1)
    r = user_session.get(f"{API}/materials/{vol1['id']}")
    assert r.status_code == 423


def test_material_detail_unlocked_returns_html(user_session):
    items = requests.get(f"{API}/materials").json()
    vol5 = next(m for m in items if m["volume"] == 5)
    r = user_session.get(f"{API}/materials/{vol5['id']}")
    assert r.status_code == 200
    assert len(r.json().get("html_content", "")) > 100


# ─── Progress ───
def test_progress_upsert_and_get(user_session):
    items = requests.get(f"{API}/materials").json()
    vol5 = next(m for m in items if m["volume"] == 5)
    r = user_session.post(f"{API}/progress", json={"material_id": vol5["id"], "percent": 50, "last_page": 3})
    assert r.status_code == 200
    assert r.json()["percent"] == 50
    # upsert
    r2 = user_session.post(f"{API}/progress", json={"material_id": vol5["id"], "percent": 75, "last_page": 5})
    assert r2.status_code == 200
    assert r2.json()["percent"] == 75
    # list
    r3 = user_session.get(f"{API}/progress")
    assert r3.status_code == 200
    found = [p for p in r3.json() if p["material_id"] == vol5["id"]]
    assert found and found[0]["percent"] == 75


# ─── Comments ───
def test_comment_flow(user_session, admin_session):
    items = requests.get(f"{API}/materials").json()
    vol5 = next(m for m in items if m["volume"] == 5)
    # public list works (empty/ok)
    r = requests.get(f"{API}/comments/{vol5['id']}")
    assert r.status_code == 200
    # post requires auth
    r2 = requests.post(f"{API}/comments", json={"material_id": vol5["id"], "content": "TEST comment"})
    assert r2.status_code == 401
    # authed post
    r3 = user_session.post(f"{API}/comments", json={"material_id": vol5["id"], "content": "TEST hello"})
    assert r3.status_code == 200
    cid = r3.json()["id"]
    # delete by non-owner forbidden
    s_other = requests.Session()
    p = _new_user_payload()
    s_other.post(f"{API}/auth/register", json=p)
    r4 = s_other.delete(f"{API}/comments/{cid}")
    assert r4.status_code == 403
    # admin can delete
    r5 = admin_session.delete(f"{API}/comments/{cid}")
    assert r5.status_code == 200


# ─── Admin ───
def test_admin_users_forbidden_for_user(user_session):
    r = user_session.get(f"{API}/admin/users")
    assert r.status_code == 403


def test_admin_users_ok(admin_session):
    r = admin_session.get(f"{API}/admin/users")
    assert r.status_code == 200
    assert isinstance(r.json(), list)
    assert any(u["email"] == ADMIN_EMAIL for u in r.json())


def test_admin_stats(admin_session):
    r = admin_session.get(f"{API}/admin/stats")
    assert r.status_code == 200
    d = r.json()
    for k in ("users", "materials", "available", "comments"):
        assert k in d
    assert d["materials"] == 6
    assert d["available"] == 2


def test_admin_material_crud(admin_session):
    # create new volume
    vol = 7  # safe new volume
    # cleanup if exists
    items = requests.get(f"{API}/materials").json()
    existing = next((m for m in items if m["volume"] == vol), None)
    if existing:
        admin_session.delete(f"{API}/materials/{existing['id']}")
    payload = {"volume": vol, "title": "TEST Vol7", "description": "test", "html_content": "<p>hello</p>", "is_locked": False}
    r = admin_session.post(f"{API}/materials", json=payload)
    assert r.status_code == 200
    mid = r.json()["id"]
    # update
    r2 = admin_session.put(f"{API}/materials/{mid}", json={"title": "TEST Vol7 Updated"})
    assert r2.status_code == 200
    assert r2.json()["title"] == "TEST Vol7 Updated"
    # delete
    r3 = admin_session.delete(f"{API}/materials/{mid}")
    assert r3.status_code == 200


def test_material_create_forbidden_for_user(user_session):
    r = user_session.post(f"{API}/materials", json={"volume": 8, "title": "x", "html_content": "y"})
    assert r.status_code == 403

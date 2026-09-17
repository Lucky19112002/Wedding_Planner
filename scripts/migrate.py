#!/usr/bin/env python3
"""Apply pending /schema SQL files to Supabase. Progress log: docs/log.md only."""

from __future__ import annotations

import hashlib
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_DIR = ROOT / "schema"
FILE_RE = re.compile(r"^(\d{3})_[a-z0-9_]+\.sql$")
ENV_URL_KEYS = ("SUPABASE_DB_URL", "DATABASE_URL")

HISTORY_BOOTSTRAP = """
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  version text PRIMARY KEY,
  file_name text NOT NULL,
  checksum text NOT NULL,
  success boolean NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT now(),
  error_message text
);
"""


def load_dotenv() -> None:
    for name in (".env.local", ".env"):
        path = ROOT / name
        if not path.is_file():
            continue
        for raw in path.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value


def db_url() -> str:
    for key in ENV_URL_KEYS:
        value = os.environ.get(key, "").strip()
        if value:
            return value
    raise SystemExit(
        "Missing SUPABASE_DB_URL or DATABASE_URL. "
        "Set it in the environment or an untracked .env file. "
        "Do not use VITE_ keys or service_role in the frontend."
    )


def checksum(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def list_migrations() -> list[tuple[str, Path]]:
    found: list[tuple[str, Path]] = []
    if not SCHEMA_DIR.is_dir():
        raise SystemExit(f"Schema directory not found: {SCHEMA_DIR}")
    for path in SCHEMA_DIR.iterdir():
        if not path.is_file():
            continue
        match = FILE_RE.match(path.name)
        if not match:
            continue
        found.append((match.group(1), path))
    found.sort(key=lambda item: int(item[0]))
    versions = [v for v, _ in found]
    expected = [f"{i:03d}" for i in range(1, len(found) + 1)]
    if versions != expected:
        raise SystemExit(
            f"Migration numbers must be contiguous from 001. Found {versions}."
        )
    return found


def psql(url: str, sql: str, file: Path | None = None) -> subprocess.CompletedProcess[str]:
    cmd = ["psql", url, "-v", "ON_ERROR_STOP=1", "-q"]
    if file is not None:
        cmd.extend(["-f", str(file)])
        return subprocess.run(cmd, capture_output=True, text=True)
    return subprocess.run(cmd, input=sql, capture_output=True, text=True)


def require_psql() -> None:
    try:
        subprocess.run(["psql", "--version"], capture_output=True, check=True)
    except (FileNotFoundError, subprocess.CalledProcessError):
        raise SystemExit(
            "psql is required for scripts/migrate.py. "
            "Install PostgreSQL client tools and retry."
        )


def history_rows(url: str) -> dict[str, dict[str, str | bool]]:
    query = (
        "SELECT version, file_name, checksum, success "
        "FROM public.schema_migrations ORDER BY version;"
    )
    result = psql(url, query)
    if result.returncode != 0:
        raise SystemExit(f"Failed to read schema_migrations:\n{result.stderr}")
    rows: dict[str, dict[str, str | bool]] = {}
    for line in result.stdout.splitlines():
        parts = [p.strip() for p in line.split("|")]
        if len(parts) != 4 or parts[0] == "version":
            continue
        if parts[0] in {"", "version"}:
            continue
        if not re.fullmatch(r"\d{3}", parts[0]):
            continue
        rows[parts[0]] = {
            "file_name": parts[1],
            "checksum": parts[2],
            "success": parts[3].lower() in {"t", "true", "1"},
        }
    return rows


def record(url: str, version: str, name: str, digest: str, ok: bool, error: str) -> None:
    err = error.replace("'", "''")[:2000]
    sql = (
        "INSERT INTO public.schema_migrations "
        "(version, file_name, checksum, success, error_message) VALUES ("
        f"'{version}', '{name}', '{digest}', {str(ok).lower()}, "
        f"{'NULL' if ok else chr(39) + err + chr(39)}"
        ") ON CONFLICT (version) DO UPDATE SET "
        "file_name = EXCLUDED.file_name, checksum = EXCLUDED.checksum, "
        "success = EXCLUDED.success, applied_at = now(), "
        "error_message = EXCLUDED.error_message;"
    )
    result = psql(url, sql)
    if result.returncode != 0:
        raise SystemExit(f"Failed to record history for {version}:\n{result.stderr}")


def main() -> int:
    load_dotenv()
    require_psql()
    url = db_url()
    files = list_migrations()

    boot = psql(url, HISTORY_BOOTSTRAP)
    if boot.returncode != 0:
        print(boot.stderr, file=sys.stderr)
        raise SystemExit("Could not ensure schema_migrations exists.")

    # Align psql output: unaligned tuples
    os.environ.setdefault("PGOPTIONS", "")
    tuples = subprocess.run(
        [
            "psql",
            url,
            "-v",
            "ON_ERROR_STOP=1",
            "-A",
            "-t",
            "-F",
            "|",
            "-c",
            "SELECT version, file_name, checksum, success FROM public.schema_migrations ORDER BY version;",
        ],
        capture_output=True,
        text=True,
    )
    if tuples.returncode != 0:
        print(tuples.stderr, file=sys.stderr)
        raise SystemExit("Could not read migration history.")

    history: dict[str, dict[str, str | bool]] = {}
    for line in tuples.stdout.splitlines():
        parts = line.split("|")
        if len(parts) != 4:
            continue
        history[parts[0]] = {
            "file_name": parts[1],
            "checksum": parts[2],
            "success": parts[3].lower() in {"t", "true", "1"},
        }

    print("Wedding Planner migration runner")
    print(f"Schema: {SCHEMA_DIR}")
    successful = [v for v, meta in history.items() if meta["success"]]
    failed = [v for v, meta in history.items() if not meta["success"]]
    print(f"Applied (success): {', '.join(successful) or '(none)'}")
    if failed:
        print(f"Failed versions: {', '.join(failed)}")
        print("Recovery required before applying later files. See docs/MIGRATIONS.md.")
        return 1

    for version, path in files:
        digest = checksum(path)
        meta = history.get(version)
        if meta and meta["success"]:
            if meta["checksum"] != digest or meta["file_name"] != path.name:
                print(
                    f"ERROR {path.name}: checksum or name changed after successful apply. "
                    "Add a new version instead of editing an applied file."
                )
                return 1
            continue
        expected = f"{(max((int(v) for v in successful), default=0) + 1):03d}"
        if version != expected:
            print(f"ERROR: next pending file must be {expected}_*.sql, found {path.name}")
            return 1
        print(f"Applying {path.name} ...")
        result = psql(url, "", file=path)
        if result.returncode != 0:
            err = (result.stderr or result.stdout or "psql failed").strip()
            print(f"FAILED {path.name}")
            print(err)
            record(url, version, path.name, digest, False, err)
            return 1
        record(url, version, path.name, digest, True, "")
        successful.append(version)
        print(f"OK {path.name}")

    print("Pending: (none)")
    print(f"Report: applied {len(successful)} successful version(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())

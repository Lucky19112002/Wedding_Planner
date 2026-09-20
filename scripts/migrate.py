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

RECONCILED_BASELINE = {
    "001": {
        "file_name": "001_initial_schema.sql",
        "production_checksum": "8d8dd68b5725106b1f1db2bf789dba3b1caa12fcd776e01c9ed238971868219d",
        "source_checksum": "edf2193152e9691fe715309385278137bb5c8039ba2f794a4ab91454f4bed87f",
    },
    "002": {
        "file_name": "002_rls_policies.sql",
        "production_checksum": "89b26cbee10606c192ca2149f73f80262aeee73e6b92517f7b4e2525e220083a",
        "source_checksum": "1e467798072babc300dd05f1ea281ed2bd0b3908d78a30230c500503f51cbb40",
    },
    "003": {
        "file_name": "003_storage.sql",
        "production_checksum": "23b87421118d8e685fdd09795ac8ddfa47a3d5ef4e6c4c230eb1c3eff4e4fc17",
        "source_checksum": "495914501aa72c58f2dd898409c4864db2a795990cc40a05bb002ee7348d3fc7",
    },
    "004": {
        "file_name": "004_seed_data.sql",
        "production_checksum": "1b1465d209912f88b66dd85e8ddfaf3beb10b331bd637e0a4072e6d3bb6ce825",
        "source_checksum": "5486e3aad9ad0207db239b7fef6a3a7abf4b258ec5e0872af7a2c2ab3ce25aaa",
    },
    "005": {
        "file_name": "005_example.sql",
        "production_checksum": "c8032fc42461c1bb444785202601686fdf221c1e627846803f1b22963fba95c1",
        "source_checksum": "381ccad25701c6e492b6b5ded5bd40abe164c1462039e4f7fdd3d2efb07bf023",
    },
    "006": {
        "file_name": "006_fix_pgcrypto_invitation.sql",
        "production_checksum": "8f26ef202f1ca58e70d5ccb710d2418fb3321cba1c6d63599d19acc2efdcd3e7",
        "source_checksum": "3d09ce30594343e83d02ee269893c6cfcdb4dc2f3b7134fb6ea814350489c2e3",
    },
    "007": {
        "file_name": "007_seed_production_wedding.sql",
        "production_checksum": "39a7590f72b8693100f64db25589dfc61f48ba89033eee848cd803b6bc38a9a4",
        "source_checksum": "3fbdbc2cadee7bfda422da672e51011b55b70bcd66c527aad79514df23974678",
    },
    "008": {
        "file_name": "008_invitation_onboarding_details.sql",
        "production_checksum": "5f504941f81812f43ac911af27cd5b3970188eb504994b655fdd02815b23d8ea",
        "source_checksum": "abf68adb9f830a2eaea606b875c644b574513a247dcad08df3e33fc64fef6f7c",
    },
    "009": {
        "file_name": "009_invitation_details_wedding_date.sql",
        "production_checksum": "85404e2c39d8a788c3ddabddd8ad18790157b326ab75f63a3b53b5166f677e95",
        "source_checksum": "7eb53b06045595896178e97e6625487c22300423a9f5700c546b123d498aadb0",
    },
    "010": {
        "file_name": "010_confirm_invited_signup.sql",
        "production_checksum": "c51ebe5bc8663758dcab4aa4f738433a70709045a4d485822244d6b172dd6c5c",
        "source_checksum": "3d9bac0d6ac44dfc2716f3275a5ffd004a14d5b105c28cec9988443f211e0953",
    },
}

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


def is_reconciled_baseline(
    version: str,
    path: Path,
    digest: str,
    meta: dict[str, str | bool],
) -> bool:
    baseline = RECONCILED_BASELINE.get(version)
    if not baseline:
        return False
    return (
        path.name == baseline["file_name"]
        and meta["file_name"] == baseline["file_name"]
        and meta["checksum"] == baseline["production_checksum"]
        and digest == baseline["source_checksum"]
    )


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
            if meta["checksum"] == digest and meta["file_name"] == path.name:
                continue
            if is_reconciled_baseline(version, path, digest, meta):
                print(f"Reconciled baseline {path.name}: production checksum verified.")
                continue
            else:
                print(
                    f"ERROR {path.name}: checksum or name changed after successful apply. "
                    "Add a new version instead of editing an applied file."
                )
                return 1
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

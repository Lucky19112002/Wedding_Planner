# Schema migrations

PostgreSQL / Supabase scripts for Wedding Planner. **Documentation lives in `/docs`.** Project progress is recorded only in [docs/log.md](../docs/log.md). Do not add changelogs here.

Design: [docs/DATABASE.md](../docs/DATABASE.md)  
Runner: [docs/MIGRATIONS.md](../docs/MIGRATIONS.md)

## Apply

```text
python scripts/migrate.py
```

Requires `psql` and `SUPABASE_DB_URL` or `DATABASE_URL`. Do not create tables in the Supabase Dashboard.

## Files

1. `001_initial_schema.sql` — locked baseline
2. `002_rls_policies.sql` — locked baseline
3. `003_storage.sql` — locked baseline
4. `004_seed_data.sql` — locked baseline (Lucky)
5. `005_example.sql` — first forward file (no domain change)

Never edit a file that has been applied. Add `006_*.sql` next.

## Seed login (rotate immediately)

- Email: `lucky@weddingplanner.app`
- Temporary password: `ChangeMe-Lucky-Seed-2026`
- User UUID: `11111111-1111-4111-8111-111111111111`
- Wedding UUID: `22222222-2222-4222-8222-222222222222`

If `004` fails on `auth.users` on your Supabase version, create Lucky in Authentication with that UUID, then add a **new** numbered file if profile/wedding rows still need inserting — do not rewrite `004` after it has succeeded.

## Notes

- Archive is `archived_at`; permanent delete is `DELETE` via Super Admin RPCs after archive.
- Max 5 active images and 5 active URLs per outfit are enforced by triggers.
- Progress is in views `v_*_progress`, not stored columns.

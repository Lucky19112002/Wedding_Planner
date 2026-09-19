# Migration Reconciliation

**Phase:** 3.3.2 - Baseline Migration Reconciliation
**Date:** 2026-09-18
**Scope:** Production migration metadata only. No schema, table, RLS, storage, or business-rule changes.

## Summary

The live Supabase database is production-ready and already contains the intended Phase 3 baseline. The migration framework detected checksum drift for the originally applied baseline files because the local SQL files were normalized or corrected after the first live apply while the live `schema_migrations` table retained the original apply-time checksums.

This reconciliation records the live checksums as the canonical production baseline and teaches the migration runner to validate that exact baseline without editing `schema_migrations`.

## Production Baseline

| Version | File | Live checksum | Current locked source checksum | Status |
| --- | --- | --- | --- | --- |
| 001 | `001_initial_schema.sql` | `8d8dd68b5725106b1f1db2bf789dba3b1caa12fcd776e01c9ed238971868219d` | `edf2193152e9691fe715309385278137bb5c8039ba2f794a4ab91454f4bed87f` | Reconciled |
| 002 | `002_rls_policies.sql` | `89b26cbee10606c192ca2149f73f80262aeee73e6b92517f7b4e2525e220083a` | `1e467798072babc300dd05f1ea281ed2bd0b3908d78a30230c500503f51cbb40` | Reconciled drift |
| 003 | `003_storage.sql` | `23b87421118d8e685fdd09795ac8ddfa47a3d5ef4e6c4c230eb1c3eff4e4fc17` | `495914501aa72c58f2dd898409c4864db2a795990cc40a05bb002ee7348d3fc7` | Reconciled |
| 004 | `004_seed_data.sql` | `1b1465d209912f88b66dd85e8ddfaf3beb10b331bd637e0a4072e6d3bb6ce825` | `5486e3aad9ad0207db239b7fef6a3a7abf4b258ec5e0872af7a2c2ab3ce25aaa` | Reconciled drift |
| 005 | `005_example.sql` | `c8032fc42461c1bb444785202601686fdf221c1e627846803f1b22963fba95c1` | `381ccad25701c6e492b6b5ded5bd40abe164c1462039e4f7fdd3d2efb07bf023` | Reconciled |

## Drift Cause

Versions `001`, `003`, and `005` differ by line-ending normalization between the live apply-time files and the current repository files. Versions `002` and `004` also reflect post-apply baseline cleanup from the Phase 3 live database execution period. The live database state remained correct; only the migration framework's byte-for-byte checksum comparison lacked a way to recognize the locked production baseline.

## Runner Behavior

The migration runner now validates applied baseline migrations in two ways:

1. Normal mode: the live checksum must match the current file checksum.
2. Reconciled baseline mode: for versions `001` through `005`, the live checksum must match the recorded production checksum and the current file checksum must match the recorded locked source checksum.

Any future edit to `001` through `005` changes the current source checksum and is rejected. Any change to live migration metadata changes the production checksum and is rejected. New migrations continue to apply normally in numeric order.

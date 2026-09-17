-- Wedding Planner
-- 003_storage.sql
-- Private bucket and storage RLS for outfit reference images.
-- Apply after 002_rls_policies.sql on a Supabase project (storage schema required).
-- Progress log: docs/log.md

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'outfit-references',
  'outfit-references',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO UPDATE
SET
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Object key: {wedding_id}/{outfit_id}/{filename}

DROP POLICY IF EXISTS outfit_references_select ON storage.objects;
CREATE POLICY outfit_references_select
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'outfit-references'
    AND public.is_current_user_active()
    AND (
      public.is_super_admin()
      OR public.has_wedding_access(((storage.foldername(name))[1])::uuid)
    )
  );

DROP POLICY IF EXISTS outfit_references_insert ON storage.objects;
CREATE POLICY outfit_references_insert
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'outfit-references'
    AND public.is_current_user_active()
    AND EXISTS (
      SELECT 1
      FROM public.outfits o
      WHERE o.id = ((storage.foldername(name))[2])::uuid
        AND o.wedding_id = ((storage.foldername(name))[1])::uuid
        AND o.archived_at IS NULL
        AND (
          public.is_wedding_admin(o.wedding_id)
          OR public.can_manage_own_outfit(o.owner_user_id, o.wedding_id)
        )
    )
  );

DROP POLICY IF EXISTS outfit_references_update ON storage.objects;
CREATE POLICY outfit_references_update
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'outfit-references'
    AND EXISTS (
      SELECT 1
      FROM public.outfits o
      WHERE o.id = ((storage.foldername(name))[2])::uuid
        AND (
          public.is_wedding_admin(o.wedding_id)
          OR public.can_manage_own_outfit(o.owner_user_id, o.wedding_id)
        )
    )
  )
  WITH CHECK (
    bucket_id = 'outfit-references'
    AND EXISTS (
      SELECT 1
      FROM public.outfits o
      WHERE o.id = ((storage.foldername(name))[2])::uuid
        AND (
          public.is_wedding_admin(o.wedding_id)
          OR public.can_manage_own_outfit(o.owner_user_id, o.wedding_id)
        )
    )
  );

DROP POLICY IF EXISTS outfit_references_delete ON storage.objects;
CREATE POLICY outfit_references_delete
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'outfit-references'
    AND (
      public.is_super_admin()
      OR EXISTS (
        SELECT 1
        FROM public.outfits o
        WHERE o.id = ((storage.foldername(name))[2])::uuid
          AND (
            public.is_wedding_admin(o.wedding_id)
            OR (
              o.archived_at IS NULL
              AND public.can_manage_own_outfit(o.owner_user_id, o.wedding_id)
            )
          )
      )
    )
  );

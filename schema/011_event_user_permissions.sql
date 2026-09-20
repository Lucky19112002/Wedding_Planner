-- Wedding Planner
-- 011_event_user_permissions.sql
-- Event-scoped user permissions for View/Edit access.

CREATE TABLE IF NOT EXISTS public.event_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  permission_level text NOT NULL CHECK (permission_level IN ('view', 'edit')),
  archived_at timestamptz,
  archived_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_permissions_event
  ON public.event_permissions (event_id, archived_at);
CREATE INDEX IF NOT EXISTS idx_event_permissions_user
  ON public.event_permissions (user_id, archived_at);

DROP TRIGGER IF EXISTS trg_event_permissions_updated ON public.event_permissions;
CREATE TRIGGER trg_event_permissions_updated
  BEFORE UPDATE ON public.event_permissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_audit();

ALTER TABLE public.event_permissions ENABLE ROW LEVEL SECURITY;


CREATE OR REPLACE FUNCTION public.event_wedding_id(p_event_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT wedding_id FROM public.events WHERE id = p_event_id;
$$;

CREATE OR REPLACE FUNCTION public.event_permission_level(p_event_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN public.is_wedding_admin(e.wedding_id) THEN 'edit'
    ELSE (
      SELECT ep.permission_level
      FROM public.event_permissions ep
      JOIN public.profiles p ON p.id = ep.user_id
      WHERE ep.event_id = p_event_id
        AND ep.user_id = auth.uid()
        AND ep.archived_at IS NULL
        AND p.is_deactivated = false
      LIMIT 1
    )
  END
  FROM public.events e
  WHERE e.id = p_event_id
    AND e.archived_at IS NULL;
$$;

CREATE OR REPLACE FUNCTION public.can_view_event(p_event_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.event_permission_level(p_event_id) IN ('view', 'edit');
$$;

CREATE OR REPLACE FUNCTION public.can_edit_event(p_event_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.event_permission_level(p_event_id) = 'edit';
$$;

CREATE OR REPLACE FUNCTION public.can_edit_outfit(p_outfit_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.can_edit_event(o.event_id)
  FROM public.outfits o
  WHERE o.id = p_outfit_id
    AND o.archived_at IS NULL;
$$;

GRANT EXECUTE ON FUNCTION public.event_wedding_id(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.event_permission_level(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_view_event(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_edit_event(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_edit_outfit(uuid) TO authenticated;

INSERT INTO public.event_permissions (event_id, user_id, permission_level, created_by, updated_by)
SELECT
  e.id,
  m.user_id,
  CASE WHEN m.role = 'viewer' THEN 'view' ELSE 'edit' END,
  e.updated_by,
  e.updated_by
FROM public.events e
JOIN public.wedding_memberships m ON m.wedding_id = e.wedding_id
WHERE e.archived_at IS NULL
  AND m.archived_at IS NULL
ON CONFLICT (event_id, user_id) DO UPDATE
SET permission_level = excluded.permission_level,
    archived_at = NULL,
    archived_by = NULL,
    updated_by = excluded.updated_by;

DROP POLICY IF EXISTS event_permissions_select ON public.event_permissions;
CREATE POLICY event_permissions_select ON public.event_permissions
  FOR SELECT TO authenticated
  USING (
    public.is_wedding_admin(public.event_wedding_id(event_id))
    OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS event_permissions_insert ON public.event_permissions;
CREATE POLICY event_permissions_insert ON public.event_permissions
  FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_admin(public.event_wedding_id(event_id)));

DROP POLICY IF EXISTS event_permissions_update ON public.event_permissions;
CREATE POLICY event_permissions_update ON public.event_permissions
  FOR UPDATE TO authenticated
  USING (public.is_wedding_admin(public.event_wedding_id(event_id)))
  WITH CHECK (public.is_wedding_admin(public.event_wedding_id(event_id)));

DROP POLICY IF EXISTS event_permissions_delete ON public.event_permissions;
CREATE POLICY event_permissions_delete ON public.event_permissions
  FOR DELETE TO authenticated
  USING (public.is_wedding_admin(public.event_wedding_id(event_id)));

DROP POLICY IF EXISTS events_select ON public.events;
CREATE POLICY events_select ON public.events
  FOR SELECT TO authenticated
  USING (public.is_super_admin() OR public.can_view_event(id));

DROP POLICY IF EXISTS participants_select ON public.participants;
CREATE POLICY participants_select ON public.participants
  FOR SELECT TO authenticated
  USING (public.is_super_admin() OR public.can_view_event(event_id));

DROP POLICY IF EXISTS outfits_select ON public.outfits;
CREATE POLICY outfits_select ON public.outfits
  FOR SELECT TO authenticated
  USING (public.is_super_admin() OR public.can_view_event(event_id));

DROP POLICY IF EXISTS outfits_insert ON public.outfits;
CREATE POLICY outfits_insert ON public.outfits
  FOR INSERT TO authenticated
  WITH CHECK (public.can_edit_event(event_id));

DROP POLICY IF EXISTS outfits_update ON public.outfits;
CREATE POLICY outfits_update ON public.outfits
  FOR UPDATE TO authenticated
  USING (public.can_edit_event(event_id))
  WITH CHECK (public.can_edit_event(event_id));

DROP POLICY IF EXISTS images_select ON public.outfit_images;
CREATE POLICY images_select ON public.outfit_images
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR EXISTS (SELECT 1 FROM public.outfits o WHERE o.id = outfit_id AND public.can_view_event(o.event_id))
  );

DROP POLICY IF EXISTS images_insert ON public.outfit_images;
CREATE POLICY images_insert ON public.outfit_images
  FOR INSERT TO authenticated
  WITH CHECK (public.can_edit_outfit(outfit_id));

DROP POLICY IF EXISTS images_update ON public.outfit_images;
CREATE POLICY images_update ON public.outfit_images
  FOR UPDATE TO authenticated
  USING (public.can_edit_outfit(outfit_id))
  WITH CHECK (public.can_edit_outfit(outfit_id));

DROP POLICY IF EXISTS images_delete ON public.outfit_images;
CREATE POLICY images_delete ON public.outfit_images
  FOR DELETE TO authenticated
  USING (public.is_super_admin() OR public.can_edit_outfit(outfit_id));

DROP POLICY IF EXISTS urls_select ON public.outfit_urls;
CREATE POLICY urls_select ON public.outfit_urls
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR EXISTS (SELECT 1 FROM public.outfits o WHERE o.id = outfit_id AND public.can_view_event(o.event_id))
  );

DROP POLICY IF EXISTS urls_insert ON public.outfit_urls;
CREATE POLICY urls_insert ON public.outfit_urls
  FOR INSERT TO authenticated
  WITH CHECK (public.can_edit_outfit(outfit_id));

DROP POLICY IF EXISTS urls_update ON public.outfit_urls;
CREATE POLICY urls_update ON public.outfit_urls
  FOR UPDATE TO authenticated
  USING (public.can_edit_outfit(outfit_id))
  WITH CHECK (public.can_edit_outfit(outfit_id));

DROP POLICY IF EXISTS urls_delete ON public.outfit_urls;
CREATE POLICY urls_delete ON public.outfit_urls
  FOR DELETE TO authenticated
  USING (public.is_super_admin() OR public.can_edit_outfit(outfit_id));

DROP POLICY IF EXISTS outfit_references_select ON storage.objects;
CREATE POLICY outfit_references_select
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'outfit-references'
    AND public.is_current_user_active()
    AND EXISTS (
      SELECT 1 FROM public.outfits o
      WHERE o.id = ((storage.foldername(name))[2])::uuid
        AND o.wedding_id = ((storage.foldername(name))[1])::uuid
        AND public.can_view_event(o.event_id)
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
    AND public.can_edit_outfit(((storage.foldername(name))[2])::uuid)
  );

DROP POLICY IF EXISTS outfit_references_update ON storage.objects;
CREATE POLICY outfit_references_update
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'outfit-references' AND public.can_edit_outfit(((storage.foldername(name))[2])::uuid))
  WITH CHECK (bucket_id = 'outfit-references' AND public.can_edit_outfit(((storage.foldername(name))[2])::uuid));

DROP POLICY IF EXISTS outfit_references_delete ON storage.objects;
CREATE POLICY outfit_references_delete
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'outfit-references'
    AND (public.is_super_admin() OR public.can_edit_outfit(((storage.foldername(name))[2])::uuid))
  );

CREATE OR REPLACE FUNCTION public.archive_outfit(p_outfit_id uuid, p_restore boolean DEFAULT false)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  of public.outfits%ROWTYPE;
  uid uuid := auth.uid();
  ts timestamptz := CASE WHEN p_restore THEN NULL ELSE now() END;
  archived_by_user uuid := CASE WHEN p_restore THEN NULL ELSE uid END;
  act public.activity_type := CASE WHEN p_restore THEN 'restored'::public.activity_type ELSE 'archived'::public.activity_type END;
BEGIN
  SELECT * INTO of FROM public.outfits WHERE id = p_outfit_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Outfit not found';
  END IF;
  IF NOT public.can_edit_outfit(p_outfit_id) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  UPDATE public.outfits SET archived_at = ts, archived_by = archived_by_user WHERE id = p_outfit_id;
  UPDATE public.outfit_images SET archived_at = ts, archived_by = archived_by_user WHERE outfit_id = p_outfit_id;
  UPDATE public.outfit_urls SET archived_at = ts, archived_by = archived_by_user WHERE outfit_id = p_outfit_id;
  INSERT INTO public.activity_logs (
    wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
  ) VALUES (of.wedding_id, uid, act, 'outfit', p_outfit_id, uid, uid);
END;
$$;

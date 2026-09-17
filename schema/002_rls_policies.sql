-- Wedding Planner
-- 002_rls_policies.sql
-- Helpers, RLS, invitation and archive RPCs.
-- Apply after 001_initial_schema.sql.
-- Progress log: docs/log.md

-- Views must respect caller RLS
ALTER VIEW public.v_outfit_progress SET (security_invoker = true);
ALTER VIEW public.v_participant_progress SET (security_invoker = true);
ALTER VIEW public.v_event_progress SET (security_invoker = true);
ALTER VIEW public.v_wedding_progress SET (security_invoker = true);

-- ---------------------------------------------------------------------------
-- Auth profile bootstrap
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, created_by, updated_by)
  VALUES (
    NEW.id,
    NEW.email,
    coalesce(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.id,
    NEW.id
  )
  ON CONFLICT (id) DO UPDATE
    SET email = excluded.email,
        updated_at = now();

  INSERT INTO public.activity_logs (
    wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
  ) VALUES (
    NULL, NEW.id, 'user_created', 'profile', NEW.id, NEW.id, NEW.id
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Authorization helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_current_user_active()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.is_deactivated = false
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.is_super_admin = true
      AND p.is_deactivated = false
  );
$$;

CREATE OR REPLACE FUNCTION public.wedding_role(p_wedding_id uuid)
RETURNS public.wedding_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.role
  FROM public.wedding_memberships m
  JOIN public.weddings w ON w.id = m.wedding_id
  WHERE m.wedding_id = p_wedding_id
    AND m.user_id = auth.uid()
    AND m.archived_at IS NULL
    AND w.archived_at IS NULL
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_wedding_admin(p_wedding_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_super_admin()
      OR public.wedding_role(p_wedding_id) = 'admin';
$$;

CREATE OR REPLACE FUNCTION public.has_wedding_access(p_wedding_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_current_user_active()
     AND (
       public.is_super_admin()
       OR public.wedding_role(p_wedding_id) IS NOT NULL
     );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_own_outfit(p_owner uuid, p_wedding_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_current_user_active()
     AND p_owner = auth.uid()
     AND public.wedding_role(p_wedding_id) = 'member';
$$;

GRANT EXECUTE ON FUNCTION public.is_current_user_active() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.wedding_role(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_wedding_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_wedding_access(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_own_outfit(uuid, uuid) TO authenticated;

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS profiles_select ON public.profiles;
CREATE POLICY profiles_select ON public.profiles
  FOR SELECT TO authenticated
  USING (
    public.is_current_user_active()
    AND (
      public.is_super_admin()
      OR id = auth.uid()
      OR EXISTS (
        SELECT 1
        FROM public.wedding_memberships mine
        JOIN public.wedding_memberships theirs
          ON theirs.wedding_id = mine.wedding_id
         AND theirs.user_id = profiles.id
         AND theirs.archived_at IS NULL
        JOIN public.weddings w ON w.id = mine.wedding_id AND w.archived_at IS NULL
        WHERE mine.user_id = auth.uid()
          AND mine.archived_at IS NULL
      )
    )
  );

DROP POLICY IF EXISTS profiles_update_self ON public.profiles;
CREATE POLICY profiles_update_self ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_current_user_active() AND id = auth.uid())
  WITH CHECK (public.is_current_user_active() AND id = auth.uid());

DROP POLICY IF EXISTS profiles_update_sa ON public.profiles;
CREATE POLICY profiles_update_sa ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS profiles_delete_sa ON public.profiles;
CREATE POLICY profiles_delete_sa ON public.profiles
  FOR DELETE TO authenticated
  USING (public.is_super_admin());

-- Inserts come from handle_new_user (owner) or service role.

-- ---------------------------------------------------------------------------
-- weddings
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS weddings_select ON public.weddings;
CREATE POLICY weddings_select ON public.weddings
  FOR SELECT TO authenticated
  USING (
    public.is_current_user_active()
    AND (
      public.is_super_admin()
      OR (
        archived_at IS NULL
        AND public.wedding_role(id) IS NOT NULL
      )
    )
  );

DROP POLICY IF EXISTS weddings_insert ON public.weddings;
CREATE POLICY weddings_insert ON public.weddings
  FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS weddings_update ON public.weddings;
CREATE POLICY weddings_update ON public.weddings
  FOR UPDATE TO authenticated
  USING (
    public.is_super_admin()
    OR (archived_at IS NULL AND public.wedding_role(id) = 'admin')
  )
  WITH CHECK (
    public.is_super_admin()
    OR public.wedding_role(id) = 'admin'
  );

DROP POLICY IF EXISTS weddings_delete ON public.weddings;
CREATE POLICY weddings_delete ON public.weddings
  FOR DELETE TO authenticated
  USING (public.is_super_admin() AND archived_at IS NOT NULL);

-- ---------------------------------------------------------------------------
-- memberships
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS memberships_select ON public.wedding_memberships;
CREATE POLICY memberships_select ON public.wedding_memberships
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR public.has_wedding_access(wedding_id)
  );

DROP POLICY IF EXISTS memberships_insert ON public.wedding_memberships;
CREATE POLICY memberships_insert ON public.wedding_memberships
  FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_admin(wedding_id));

DROP POLICY IF EXISTS memberships_update ON public.wedding_memberships;
CREATE POLICY memberships_update ON public.wedding_memberships
  FOR UPDATE TO authenticated
  USING (public.is_wedding_admin(wedding_id))
  WITH CHECK (public.is_wedding_admin(wedding_id));

DROP POLICY IF EXISTS memberships_delete ON public.wedding_memberships;
CREATE POLICY memberships_delete ON public.wedding_memberships
  FOR DELETE TO authenticated
  USING (public.is_super_admin() AND archived_at IS NOT NULL);

-- ---------------------------------------------------------------------------
-- invitations
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS invitations_select ON public.invitations;
CREATE POLICY invitations_select ON public.invitations
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR public.is_wedding_admin(wedding_id)
    OR (
      status = 'pending'
      AND archived_at IS NULL
      AND email = (SELECT p.email FROM public.profiles p WHERE p.id = auth.uid())
    )
  );

DROP POLICY IF EXISTS invitations_insert ON public.invitations;
CREATE POLICY invitations_insert ON public.invitations
  FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_admin(wedding_id));

DROP POLICY IF EXISTS invitations_update ON public.invitations;
CREATE POLICY invitations_update ON public.invitations
  FOR UPDATE TO authenticated
  USING (
    public.is_wedding_admin(wedding_id)
    OR (
      status = 'pending'
      AND email = (SELECT p.email FROM public.profiles p WHERE p.id = auth.uid())
    )
  )
  WITH CHECK (
    public.is_wedding_admin(wedding_id)
    OR (
      email = (SELECT p.email FROM public.profiles p WHERE p.id = auth.uid())
    )
  );

DROP POLICY IF EXISTS invitations_delete ON public.invitations;
CREATE POLICY invitations_delete ON public.invitations
  FOR DELETE TO authenticated
  USING (public.is_super_admin() AND archived_at IS NOT NULL);

-- ---------------------------------------------------------------------------
-- events, participants, outfits, media
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS events_select ON public.events;
CREATE POLICY events_select ON public.events
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR (public.is_wedding_admin(wedding_id))
    OR (archived_at IS NULL AND public.has_wedding_access(wedding_id))
  );

DROP POLICY IF EXISTS events_write_admin ON public.events;
CREATE POLICY events_write_admin ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_admin(wedding_id));

DROP POLICY IF EXISTS events_update_admin ON public.events;
CREATE POLICY events_update_admin ON public.events
  FOR UPDATE TO authenticated
  USING (public.is_wedding_admin(wedding_id))
  WITH CHECK (public.is_wedding_admin(wedding_id));

DROP POLICY IF EXISTS events_delete_sa ON public.events;
CREATE POLICY events_delete_sa ON public.events
  FOR DELETE TO authenticated
  USING (public.is_super_admin() AND archived_at IS NOT NULL);

DROP POLICY IF EXISTS participants_select ON public.participants;
CREATE POLICY participants_select ON public.participants
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR public.is_wedding_admin(wedding_id)
    OR (archived_at IS NULL AND public.has_wedding_access(wedding_id))
  );

DROP POLICY IF EXISTS participants_insert ON public.participants;
CREATE POLICY participants_insert ON public.participants
  FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_admin(wedding_id));

DROP POLICY IF EXISTS participants_update ON public.participants;
CREATE POLICY participants_update ON public.participants
  FOR UPDATE TO authenticated
  USING (public.is_wedding_admin(wedding_id))
  WITH CHECK (public.is_wedding_admin(wedding_id));

DROP POLICY IF EXISTS participants_delete ON public.participants;
CREATE POLICY participants_delete ON public.participants
  FOR DELETE TO authenticated
  USING (public.is_super_admin() AND archived_at IS NOT NULL);

DROP POLICY IF EXISTS outfits_select ON public.outfits;
CREATE POLICY outfits_select ON public.outfits
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR public.is_wedding_admin(wedding_id)
    OR (archived_at IS NULL AND public.has_wedding_access(wedding_id))
  );

DROP POLICY IF EXISTS outfits_insert ON public.outfits;
CREATE POLICY outfits_insert ON public.outfits
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_wedding_admin(wedding_id)
    OR public.can_manage_own_outfit(owner_user_id, wedding_id)
  );

DROP POLICY IF EXISTS outfits_update ON public.outfits;
CREATE POLICY outfits_update ON public.outfits
  FOR UPDATE TO authenticated
  USING (
    public.is_wedding_admin(wedding_id)
    OR public.can_manage_own_outfit(owner_user_id, wedding_id)
  )
  WITH CHECK (
    public.is_wedding_admin(wedding_id)
    OR public.can_manage_own_outfit(owner_user_id, wedding_id)
  );

DROP POLICY IF EXISTS outfits_delete ON public.outfits;
CREATE POLICY outfits_delete ON public.outfits
  FOR DELETE TO authenticated
  USING (public.is_super_admin() AND archived_at IS NOT NULL);

DROP POLICY IF EXISTS images_select ON public.outfit_images;
CREATE POLICY images_select ON public.outfit_images
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR public.is_wedding_admin(wedding_id)
    OR (archived_at IS NULL AND public.has_wedding_access(wedding_id))
  );

DROP POLICY IF EXISTS images_insert ON public.outfit_images;
CREATE POLICY images_insert ON public.outfit_images
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.outfits o
      WHERE o.id = outfit_id
        AND (
          public.is_wedding_admin(o.wedding_id)
          OR public.can_manage_own_outfit(o.owner_user_id, o.wedding_id)
        )
    )
  );

DROP POLICY IF EXISTS images_update ON public.outfit_images;
CREATE POLICY images_update ON public.outfit_images
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.outfits o
      WHERE o.id = outfit_id
        AND (
          public.is_wedding_admin(o.wedding_id)
          OR public.can_manage_own_outfit(o.owner_user_id, o.wedding_id)
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.outfits o
      WHERE o.id = outfit_id
        AND (
          public.is_wedding_admin(o.wedding_id)
          OR public.can_manage_own_outfit(o.owner_user_id, o.wedding_id)
        )
    )
  );

DROP POLICY IF EXISTS images_delete ON public.outfit_images;
CREATE POLICY images_delete ON public.outfit_images
  FOR DELETE TO authenticated
  USING (
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM public.outfits o
      WHERE o.id = outfit_id
        AND o.archived_at IS NULL
        AND (
          public.is_wedding_admin(o.wedding_id)
          OR public.can_manage_own_outfit(o.owner_user_id, o.wedding_id)
        )
    )
  );

DROP POLICY IF EXISTS urls_select ON public.outfit_urls;
CREATE POLICY urls_select ON public.outfit_urls
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR public.is_wedding_admin(wedding_id)
    OR (archived_at IS NULL AND public.has_wedding_access(wedding_id))
  );

DROP POLICY IF EXISTS urls_insert ON public.outfit_urls;
CREATE POLICY urls_insert ON public.outfit_urls
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.outfits o
      WHERE o.id = outfit_id
        AND (
          public.is_wedding_admin(o.wedding_id)
          OR public.can_manage_own_outfit(o.owner_user_id, o.wedding_id)
        )
    )
  );

DROP POLICY IF EXISTS urls_update ON public.outfit_urls;
CREATE POLICY urls_update ON public.outfit_urls
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.outfits o
      WHERE o.id = outfit_id
        AND (
          public.is_wedding_admin(o.wedding_id)
          OR public.can_manage_own_outfit(o.owner_user_id, o.wedding_id)
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.outfits o
      WHERE o.id = outfit_id
        AND (
          public.is_wedding_admin(o.wedding_id)
          OR public.can_manage_own_outfit(o.owner_user_id, o.wedding_id)
        )
    )
  );

DROP POLICY IF EXISTS urls_delete ON public.outfit_urls;
CREATE POLICY urls_delete ON public.outfit_urls
  FOR DELETE TO authenticated
  USING (
    public.is_super_admin()
    OR EXISTS (
      SELECT 1 FROM public.outfits o
      WHERE o.id = outfit_id
        AND o.archived_at IS NULL
        AND (
          public.is_wedding_admin(o.wedding_id)
          OR public.can_manage_own_outfit(o.owner_user_id, o.wedding_id)
        )
    )
  );

DROP POLICY IF EXISTS activity_select ON public.activity_logs;
CREATE POLICY activity_select ON public.activity_logs
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR (wedding_id IS NOT NULL AND public.is_wedding_admin(wedding_id))
    OR (
      wedding_id IS NOT NULL
      AND public.has_wedding_access(wedding_id)
      AND public.wedding_role(wedding_id) IN ('member', 'viewer')
    )
    OR actor_id = auth.uid()
  );

DROP POLICY IF EXISTS activity_insert ON public.activity_logs;
CREATE POLICY activity_insert ON public.activity_logs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_current_user_active());

DROP POLICY IF EXISTS activity_delete ON public.activity_logs;
CREATE POLICY activity_delete ON public.activity_logs
  FOR DELETE TO authenticated
  USING (public.is_super_admin());

-- ---------------------------------------------------------------------------
-- Invitation RPCs
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.hash_invite_token(p_token text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT encode(digest(p_token, 'sha256'), 'hex');
$$;

CREATE OR REPLACE FUNCTION public.accept_invitation(p_token text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv public.invitations%ROWTYPE;
  hashed text := public.hash_invite_token(p_token);
  uid uuid := auth.uid();
  user_email citext;
  new_membership uuid;
BEGIN
  IF uid IS NULL OR NOT public.is_current_user_active() THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT email INTO user_email FROM public.profiles WHERE id = uid;

  SELECT * INTO inv FROM public.invitations WHERE token_hash = hashed FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found';
  END IF;

  IF inv.archived_at IS NOT NULL THEN
    RAISE EXCEPTION 'Invitation is not active';
  END IF;

  IF inv.status = 'pending' AND inv.expires_at < now() THEN
    UPDATE public.invitations SET status = 'expired' WHERE id = inv.id;
    RAISE EXCEPTION 'Invitation has expired';
  END IF;

  IF inv.status <> 'pending' THEN
    RAISE EXCEPTION 'Invitation cannot be accepted';
  END IF;

  IF inv.email <> user_email THEN
    RAISE EXCEPTION 'Invitation does not match this account';
  END IF;

  INSERT INTO public.wedding_memberships (wedding_id, user_id, role, created_by, updated_by)
  VALUES (inv.wedding_id, uid, inv.invited_role, uid, uid)
  ON CONFLICT (wedding_id, user_id) DO UPDATE
    SET role = excluded.role,
        archived_at = NULL,
        archived_by = NULL,
        updated_by = uid
  RETURNING id INTO new_membership;

  UPDATE public.invitations
  SET status = 'accepted',
      accepted_by = uid,
      accepted_at = now()
  WHERE id = inv.id;

  INSERT INTO public.activity_logs (
    wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
  ) VALUES (
    inv.wedding_id, uid, 'invitation_accepted', 'invitation', inv.id, uid, uid
  );

  RETURN new_membership;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_invitation(p_token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv public.invitations%ROWTYPE;
  hashed text := public.hash_invite_token(p_token);
  uid uuid := auth.uid();
  user_email citext;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  SELECT email INTO user_email FROM public.profiles WHERE id = uid;
  SELECT * INTO inv FROM public.invitations WHERE token_hash = hashed FOR UPDATE;
  IF NOT FOUND OR inv.status <> 'pending' OR inv.email <> user_email THEN
    RAISE EXCEPTION 'Invitation cannot be rejected';
  END IF;
  IF inv.expires_at < now() THEN
    UPDATE public.invitations SET status = 'expired' WHERE id = inv.id;
    RAISE EXCEPTION 'Invitation has expired';
  END IF;
  UPDATE public.invitations SET status = 'rejected' WHERE id = inv.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.resend_invitation(p_invitation_id uuid, p_new_token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv public.invitations%ROWTYPE;
BEGIN
  SELECT * INTO inv FROM public.invitations WHERE id = p_invitation_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found';
  END IF;
  IF NOT public.is_wedding_admin(inv.wedding_id) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  IF inv.status NOT IN ('pending', 'expired') THEN
    RAISE EXCEPTION 'Invitation cannot be resent';
  END IF;
  UPDATE public.invitations
  SET status = 'pending',
      token_hash = public.hash_invite_token(p_new_token),
      expires_at = now() + interval '14 days'
  WHERE id = p_invitation_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_invitation(p_invitation_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv public.invitations%ROWTYPE;
BEGIN
  SELECT * INTO inv FROM public.invitations WHERE id = p_invitation_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found';
  END IF;
  IF NOT public.is_wedding_admin(inv.wedding_id) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  IF inv.status NOT IN ('pending', 'expired') THEN
    RAISE EXCEPTION 'Invitation cannot be cancelled';
  END IF;
  UPDATE public.invitations SET status = 'cancelled' WHERE id = p_invitation_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_invitation(
  p_wedding_id uuid,
  p_email citext,
  p_role public.wedding_role,
  p_token text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
  uid uuid := auth.uid();
BEGIN
  IF NOT public.is_wedding_admin(p_wedding_id) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  INSERT INTO public.invitations (
    wedding_id, email, invited_role, token_hash, expires_at, created_by, updated_by
  ) VALUES (
    p_wedding_id,
    p_email,
    p_role,
    public.hash_invite_token(p_token),
    now() + interval '14 days',
    uid,
    uid
  )
  RETURNING id INTO new_id;

  INSERT INTO public.activity_logs (
    wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
  ) VALUES (
    p_wedding_id, uid, 'invitation_sent', 'invitation', new_id, uid, uid
  );

  RETURN new_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- Archive / restore RPCs (cascade children)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.stamp_archive(p_archived boolean)
RETURNS timestamptz
LANGUAGE sql
AS $$
  SELECT CASE WHEN p_archived THEN now() ELSE NULL END;
$$;

CREATE OR REPLACE FUNCTION public.archive_event(p_event_id uuid, p_restore boolean DEFAULT false)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ev public.events%ROWTYPE;
  uid uuid := auth.uid();
  ts timestamptz := CASE WHEN p_restore THEN NULL ELSE now() END;
  archived_by_user uuid := CASE WHEN p_restore THEN NULL ELSE uid END;
  act public.activity_type := CASE WHEN p_restore THEN 'restored'::public.activity_type ELSE 'archived'::public.activity_type END;
BEGIN
  SELECT * INTO ev FROM public.events WHERE id = p_event_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found';
  END IF;
  IF NOT public.is_wedding_admin(ev.wedding_id) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  UPDATE public.events SET archived_at = ts, archived_by = archived_by_user WHERE id = p_event_id;
  UPDATE public.participants SET archived_at = ts, archived_by = archived_by_user WHERE event_id = p_event_id;
  UPDATE public.outfits SET archived_at = ts, archived_by = archived_by_user WHERE event_id = p_event_id;
  UPDATE public.outfit_images SET archived_at = ts, archived_by = archived_by_user
    WHERE outfit_id IN (SELECT id FROM public.outfits WHERE event_id = p_event_id);
  UPDATE public.outfit_urls SET archived_at = ts, archived_by = archived_by_user
    WHERE outfit_id IN (SELECT id FROM public.outfits WHERE event_id = p_event_id);

  INSERT INTO public.activity_logs (
    wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
  ) VALUES (ev.wedding_id, uid, act, 'event', p_event_id, uid, uid);
END;
$$;

CREATE OR REPLACE FUNCTION public.archive_participant(p_participant_id uuid, p_restore boolean DEFAULT false)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pa public.participants%ROWTYPE;
  uid uuid := auth.uid();
  ts timestamptz := CASE WHEN p_restore THEN NULL ELSE now() END;
  archived_by_user uuid := CASE WHEN p_restore THEN NULL ELSE uid END;
  act public.activity_type := CASE WHEN p_restore THEN 'restored'::public.activity_type ELSE 'archived'::public.activity_type END;
BEGIN
  SELECT * INTO pa FROM public.participants WHERE id = p_participant_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Participant not found';
  END IF;
  IF NOT public.is_wedding_admin(pa.wedding_id) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  UPDATE public.participants SET archived_at = ts, archived_by = archived_by_user WHERE id = p_participant_id;
  UPDATE public.outfits SET archived_at = ts, archived_by = archived_by_user WHERE participant_id = p_participant_id;
  UPDATE public.outfit_images SET archived_at = ts, archived_by = archived_by_user
    WHERE outfit_id IN (SELECT id FROM public.outfits WHERE participant_id = p_participant_id);
  UPDATE public.outfit_urls SET archived_at = ts, archived_by = archived_by_user
    WHERE outfit_id IN (SELECT id FROM public.outfits WHERE participant_id = p_participant_id);
  INSERT INTO public.activity_logs (
    wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
  ) VALUES (pa.wedding_id, uid, act, 'participant', p_participant_id, uid, uid);
END;
$$;

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
  IF NOT (
    public.is_wedding_admin(of.wedding_id)
    OR public.can_manage_own_outfit(of.owner_user_id, of.wedding_id)
  ) THEN
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

CREATE OR REPLACE FUNCTION public.archive_wedding(p_wedding_id uuid, p_restore boolean DEFAULT false)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  ts timestamptz := CASE WHEN p_restore THEN NULL ELSE now() END;
  archived_by_user uuid := CASE WHEN p_restore THEN NULL ELSE uid END;
  act public.activity_type := CASE WHEN p_restore THEN 'restored'::public.activity_type ELSE 'archived'::public.activity_type END;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  UPDATE public.weddings SET archived_at = ts, archived_by = archived_by_user WHERE id = p_wedding_id;
  UPDATE public.wedding_memberships SET archived_at = ts, archived_by = archived_by_user WHERE wedding_id = p_wedding_id;
  UPDATE public.invitations SET archived_at = ts, archived_by = archived_by_user WHERE wedding_id = p_wedding_id;
  UPDATE public.events SET archived_at = ts, archived_by = archived_by_user WHERE wedding_id = p_wedding_id;
  UPDATE public.participants SET archived_at = ts, archived_by = archived_by_user WHERE wedding_id = p_wedding_id;
  UPDATE public.outfits SET archived_at = ts, archived_by = archived_by_user WHERE wedding_id = p_wedding_id;
  UPDATE public.outfit_images SET archived_at = ts, archived_by = archived_by_user WHERE wedding_id = p_wedding_id;
  UPDATE public.outfit_urls SET archived_at = ts, archived_by = archived_by_user WHERE wedding_id = p_wedding_id;
  INSERT INTO public.activity_logs (
    wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
  ) VALUES (p_wedding_id, uid, act, 'wedding', p_wedding_id, uid, uid);
END;
$$;

CREATE OR REPLACE FUNCTION public.permanently_delete_wedding(p_wedding_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  was_archived timestamptz;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  SELECT archived_at INTO was_archived FROM public.weddings WHERE id = p_wedding_id;
  IF was_archived IS NULL THEN
    RAISE EXCEPTION 'Wedding must be archived before permanent delete';
  END IF;
  INSERT INTO public.activity_logs (
    wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
  ) VALUES (NULL, uid, 'permanently_deleted', 'wedding', p_wedding_id, uid, uid);
  DELETE FROM public.weddings WHERE id = p_wedding_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.permanently_delete_event(p_event_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ev public.events%ROWTYPE;
  uid uuid := auth.uid();
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  SELECT * INTO ev FROM public.events WHERE id = p_event_id;
  IF ev.archived_at IS NULL THEN
    RAISE EXCEPTION 'Event must be archived before permanent delete';
  END IF;
  INSERT INTO public.activity_logs (
    wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
  ) VALUES (ev.wedding_id, uid, 'permanently_deleted', 'event', p_event_id, uid, uid);
  DELETE FROM public.events WHERE id = p_event_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.permanently_delete_participant(p_participant_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pa public.participants%ROWTYPE;
  uid uuid := auth.uid();
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  SELECT * INTO pa FROM public.participants WHERE id = p_participant_id;
  IF pa.archived_at IS NULL THEN
    RAISE EXCEPTION 'Participant must be archived before permanent delete';
  END IF;
  INSERT INTO public.activity_logs (
    wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
  ) VALUES (pa.wedding_id, uid, 'permanently_deleted', 'participant', p_participant_id, uid, uid);
  DELETE FROM public.participants WHERE id = p_participant_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.permanently_delete_outfit(p_outfit_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  of public.outfits%ROWTYPE;
  uid uuid := auth.uid();
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  SELECT * INTO of FROM public.outfits WHERE id = p_outfit_id;
  IF of.archived_at IS NULL THEN
    RAISE EXCEPTION 'Outfit must be archived before permanent delete';
  END IF;
  INSERT INTO public.activity_logs (
    wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
  ) VALUES (of.wedding_id, uid, 'permanently_deleted', 'outfit', p_outfit_id, uid, uid);
  DELETE FROM public.outfits WHERE id = p_outfit_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.hash_invite_token(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_invitation(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_invitation(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.resend_invitation(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_invitation(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_invitation(uuid, citext, public.wedding_role, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.archive_event(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.archive_participant(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.archive_outfit(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.archive_wedding(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.permanently_delete_wedding(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.permanently_delete_event(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.permanently_delete_participant(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.permanently_delete_outfit(uuid) TO authenticated;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.v_outfit_progress TO authenticated;
GRANT SELECT ON public.v_participant_progress TO authenticated;
GRANT SELECT ON public.v_event_progress TO authenticated;
GRANT SELECT ON public.v_wedding_progress TO authenticated;
GRANT USAGE ON TYPE public.wedding_role TO authenticated;
GRANT USAGE ON TYPE public.invitation_status TO authenticated;
GRANT USAGE ON TYPE public.event_status TO authenticated;
GRANT USAGE ON TYPE public.outfit_status TO authenticated;
GRANT USAGE ON TYPE public.activity_type TO authenticated;

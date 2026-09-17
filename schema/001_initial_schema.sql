-- Wedding Planner
-- 001_initial_schema.sql
-- Types, tables, indexes, integrity triggers, progress views.
-- Apply before 002_rls_policies.sql.
-- Progress log: docs/log.md (do not log here).

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- ---------------------------------------------------------------------------
-- Enumerations
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.wedding_role AS ENUM ('admin', 'member', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.invitation_status AS ENUM (
    'pending', 'accepted', 'rejected', 'expired', 'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.event_status AS ENUM (
    'draft', 'planned', 'confirmed', 'completed', 'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.outfit_status AS ENUM (
    'idea', 'shortlisted', 'ordered', 'received', 'altered', 'ready', 'dropped'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.activity_type AS ENUM (
    'user_created',
    'event_created',
    'event_edited',
    'outfit_updated',
    'status_changed',
    'image_added',
    'image_removed',
    'invitation_accepted',
    'invitation_sent',
    'archived',
    'restored',
    'permanently_deleted'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Shared audit helper
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_audit()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  IF auth.uid() IS NOT NULL THEN
    NEW.updated_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.prevent_last_super_admin_loss()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  remaining integer;
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.is_super_admin THEN
      SELECT count(*) INTO remaining
      FROM public.profiles
      WHERE is_super_admin AND id <> OLD.id AND NOT is_deactivated;
      IF remaining < 1 THEN
        RAISE EXCEPTION 'Cannot remove the last remaining Super Admin';
      END IF;
    END IF;
    RETURN OLD;
  END IF;

  IF OLD.is_super_admin AND (NEW.is_super_admin IS FALSE OR NEW.is_deactivated IS TRUE) THEN
    SELECT count(*) INTO remaining
    FROM public.profiles
    WHERE is_super_admin AND id <> NEW.id AND NOT is_deactivated;
    IF remaining < 1 THEN
      RAISE EXCEPTION 'Cannot remove the last remaining Super Admin';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_event_confirm_rules()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status IN ('confirmed', 'completed') THEN
    IF NEW.event_date IS NULL THEN
      RAISE EXCEPTION 'Confirmed and completed events require a date';
    END IF;
    IF NOT EXISTS (
      SELECT 1
      FROM public.participants p
      WHERE p.event_id = NEW.id
        AND p.archived_at IS NULL
    ) THEN
      RAISE EXCEPTION 'Confirmed and completed events require at least one active participant';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_outfit_status_fields()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.quantity < 1 THEN
    RAISE EXCEPTION 'Outfit quantity must be at least 1';
  END IF;
  IF NEW.status NOT IN ('idea', 'dropped') THEN
    IF NEW.dress_type IS NULL OR btrim(NEW.dress_type) = '' THEN
      RAISE EXCEPTION 'Dress type is required beyond Idea status';
    END IF;
    IF NEW.colour IS NULL OR btrim(NEW.colour) = '' THEN
      RAISE EXCEPTION 'Colour is required beyond Idea status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_outfit_image_cap()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.archived_at IS NOT NULL THEN
    RETURN NEW;
  END IF;
  IF (
    SELECT count(*)
    FROM public.outfit_images i
    WHERE i.outfit_id = NEW.outfit_id
      AND i.archived_at IS NULL
      AND i.id IS DISTINCT FROM NEW.id
  ) >= 5 THEN
    RAISE EXCEPTION 'An outfit may have at most 5 active reference images';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_outfit_url_cap()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.archived_at IS NOT NULL THEN
    RETURN NEW;
  END IF;
  IF (
    SELECT count(*)
    FROM public.outfit_urls u
    WHERE u.outfit_id = NEW.outfit_id
      AND u.archived_at IS NULL
      AND u.id IS DISTINCT FROM NEW.id
  ) >= 5 THEN
    RAISE EXCEPTION 'An outfit may have at most 5 active shopping or reference URLs';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_participant_wedding()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  SELECT e.wedding_id INTO NEW.wedding_id
  FROM public.events e
  WHERE e.id = NEW.event_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_outfit_denorm()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  SELECT p.wedding_id, p.event_id, p.user_id
  INTO NEW.wedding_id, NEW.event_id, NEW.owner_user_id
  FROM public.participants p
  WHERE p.id = NEW.participant_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_outfit_child_wedding()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  SELECT o.wedding_id INTO NEW.wedding_id
  FROM public.outfits o
  WHERE o.id = NEW.outfit_id;
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email citext NOT NULL UNIQUE,
  display_name text NOT NULL,
  is_super_admin boolean NOT NULL DEFAULT false,
  is_deactivated boolean NOT NULL DEFAULT false,
  relationship_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.weddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  couple_names text,
  wedding_date date,
  notes text,
  archived_at timestamptz,
  archived_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.wedding_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES public.weddings (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  role public.wedding_role NOT NULL,
  archived_at timestamptz,
  archived_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  UNIQUE (wedding_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES public.weddings (id) ON DELETE CASCADE,
  email citext NOT NULL,
  invited_role public.wedding_role NOT NULL,
  status public.invitation_status NOT NULL DEFAULT 'pending',
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  accepted_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  accepted_at timestamptz,
  archived_at timestamptz,
  archived_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES public.weddings (id) ON DELETE CASCADE,
  name text NOT NULL,
  event_date date,
  start_time time,
  end_time time,
  location text,
  notes text,
  status public.event_status NOT NULL DEFAULT 'draft',
  archived_at timestamptz,
  archived_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  wedding_id uuid NOT NULL REFERENCES public.weddings (id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  role_in_event text,
  archived_at timestamptz,
  archived_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.outfits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES public.participants (id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  wedding_id uuid NOT NULL REFERENCES public.weddings (id) ON DELETE CASCADE,
  owner_user_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  dress_type text,
  colour text,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  notes text,
  status public.outfit_status NOT NULL DEFAULT 'idea',
  archived_at timestamptz,
  archived_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.outfit_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_id uuid NOT NULL REFERENCES public.outfits (id) ON DELETE CASCADE,
  wedding_id uuid NOT NULL REFERENCES public.weddings (id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  sort_order integer NOT NULL CHECK (sort_order BETWEEN 1 AND 5),
  archived_at timestamptz,
  archived_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.outfit_urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_id uuid NOT NULL REFERENCES public.outfits (id) ON DELETE CASCADE,
  wedding_id uuid NOT NULL REFERENCES public.weddings (id) ON DELETE CASCADE,
  url text NOT NULL CHECK (url ~* '^https?://'),
  label text,
  sort_order integer NOT NULL CHECK (sort_order BETWEEN 1 AND 5),
  archived_at timestamptz,
  archived_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid REFERENCES public.weddings (id) ON DELETE SET NULL,
  actor_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  activity_type public.activity_type NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_weddings_archived ON public.weddings (archived_at);
CREATE INDEX IF NOT EXISTS idx_memberships_wedding ON public.wedding_memberships (wedding_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.wedding_memberships (user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_active ON public.wedding_memberships (wedding_id, user_id)
  WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_super_admin ON public.profiles (id)
  WHERE is_super_admin AND NOT is_deactivated;
CREATE INDEX IF NOT EXISTS idx_invitations_wedding ON public.invitations (wedding_id);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations (email);
CREATE INDEX IF NOT EXISTS idx_invitations_expires ON public.invitations (expires_at)
  WHERE status = 'pending';
CREATE UNIQUE INDEX IF NOT EXISTS uq_invitations_pending_email
  ON public.invitations (wedding_id, email)
  WHERE status = 'pending' AND archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_events_wedding ON public.events (wedding_id, archived_at);
CREATE UNIQUE INDEX IF NOT EXISTS uq_events_active_name
  ON public.events (wedding_id, lower(name))
  WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_participants_event ON public.participants (event_id);
CREATE INDEX IF NOT EXISTS idx_participants_wedding ON public.participants (wedding_id, archived_at);
CREATE UNIQUE INDEX IF NOT EXISTS uq_participants_event_user
  ON public.participants (event_id, user_id)
  WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_outfits_participant ON public.outfits (participant_id);
CREATE INDEX IF NOT EXISTS idx_outfits_wedding ON public.outfits (wedding_id, archived_at);
CREATE INDEX IF NOT EXISTS idx_outfits_owner ON public.outfits (owner_user_id);
CREATE INDEX IF NOT EXISTS idx_outfit_images_outfit ON public.outfit_images (outfit_id)
  WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_outfit_urls_outfit ON public.outfit_urls (outfit_id)
  WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_activity_wedding_created
  ON public.activity_logs (wedding_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_entity
  ON public.activity_logs (entity_type, entity_id);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_profiles_updated ON public.profiles;
CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_audit();

DROP TRIGGER IF EXISTS trg_profiles_last_sa ON public.profiles;
CREATE TRIGGER trg_profiles_last_sa
  BEFORE UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_last_super_admin_loss();

DROP TRIGGER IF EXISTS trg_weddings_updated ON public.weddings;
CREATE TRIGGER trg_weddings_updated
  BEFORE UPDATE ON public.weddings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_audit();

DROP TRIGGER IF EXISTS trg_memberships_updated ON public.wedding_memberships;
CREATE TRIGGER trg_memberships_updated
  BEFORE UPDATE ON public.wedding_memberships
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_audit();

DROP TRIGGER IF EXISTS trg_invitations_updated ON public.invitations;
CREATE TRIGGER trg_invitations_updated
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_audit();

DROP TRIGGER IF EXISTS trg_events_updated ON public.events;
CREATE TRIGGER trg_events_updated
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_audit();

DROP TRIGGER IF EXISTS trg_events_confirm ON public.events;
CREATE TRIGGER trg_events_confirm
  BEFORE INSERT OR UPDATE OF status, event_date ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.enforce_event_confirm_rules();

DROP TRIGGER IF EXISTS trg_participants_wedding ON public.participants;
CREATE TRIGGER trg_participants_wedding
  BEFORE INSERT OR UPDATE OF event_id ON public.participants
  FOR EACH ROW EXECUTE FUNCTION public.sync_participant_wedding();

DROP TRIGGER IF EXISTS trg_participants_updated ON public.participants;
CREATE TRIGGER trg_participants_updated
  BEFORE UPDATE ON public.participants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_audit();

DROP TRIGGER IF EXISTS trg_outfits_denorm ON public.outfits;
CREATE TRIGGER trg_outfits_denorm
  BEFORE INSERT OR UPDATE OF participant_id ON public.outfits
  FOR EACH ROW EXECUTE FUNCTION public.sync_outfit_denorm();

DROP TRIGGER IF EXISTS trg_outfits_status ON public.outfits;
CREATE TRIGGER trg_outfits_status
  BEFORE INSERT OR UPDATE ON public.outfits
  FOR EACH ROW EXECUTE FUNCTION public.enforce_outfit_status_fields();

DROP TRIGGER IF EXISTS trg_outfits_updated ON public.outfits;
CREATE TRIGGER trg_outfits_updated
  BEFORE UPDATE ON public.outfits
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_audit();

DROP TRIGGER IF EXISTS trg_images_wedding ON public.outfit_images;
CREATE TRIGGER trg_images_wedding
  BEFORE INSERT OR UPDATE OF outfit_id ON public.outfit_images
  FOR EACH ROW EXECUTE FUNCTION public.sync_outfit_child_wedding();

DROP TRIGGER IF EXISTS trg_images_cap ON public.outfit_images;
CREATE TRIGGER trg_images_cap
  BEFORE INSERT OR UPDATE ON public.outfit_images
  FOR EACH ROW EXECUTE FUNCTION public.enforce_outfit_image_cap();

DROP TRIGGER IF EXISTS trg_images_updated ON public.outfit_images;
CREATE TRIGGER trg_images_updated
  BEFORE UPDATE ON public.outfit_images
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_audit();

DROP TRIGGER IF EXISTS trg_urls_wedding ON public.outfit_urls;
CREATE TRIGGER trg_urls_wedding
  BEFORE INSERT OR UPDATE OF outfit_id ON public.outfit_urls
  FOR EACH ROW EXECUTE FUNCTION public.sync_outfit_child_wedding();

DROP TRIGGER IF EXISTS trg_urls_cap ON public.outfit_urls;
CREATE TRIGGER trg_urls_cap
  BEFORE INSERT OR UPDATE ON public.outfit_urls
  FOR EACH ROW EXECUTE FUNCTION public.enforce_outfit_url_cap();

DROP TRIGGER IF EXISTS trg_urls_updated ON public.outfit_urls;
CREATE TRIGGER trg_urls_updated
  BEFORE UPDATE ON public.outfit_urls
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_audit();

-- Activity logging (data events)

CREATE OR REPLACE FUNCTION public.log_event_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor uuid := coalesce(auth.uid(), NEW.updated_by, NEW.created_by);
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (
      wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
    ) VALUES (
      NEW.wedding_id, actor, 'event_created', 'event', NEW.id, actor, actor
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO public.activity_logs (
        wedding_id, actor_id, activity_type, entity_type, entity_id, payload, created_by, updated_by
      ) VALUES (
        NEW.wedding_id, actor, 'status_changed', 'event', NEW.id,
        jsonb_build_object('from', OLD.status, 'to', NEW.status), actor, actor
      );
    ELSE
      INSERT INTO public.activity_logs (
        wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
      ) VALUES (
        NEW.wedding_id, actor, 'event_edited', 'event', NEW.id, actor, actor
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_events_activity ON public.events;
CREATE TRIGGER trg_events_activity
  AFTER INSERT OR UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.log_event_activity();

CREATE OR REPLACE FUNCTION public.log_outfit_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor uuid := coalesce(auth.uid(), NEW.updated_by, NEW.created_by);
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (
      wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
    ) VALUES (
      NEW.wedding_id, actor, 'outfit_updated', 'outfit', NEW.id, actor, actor
    );
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.activity_logs (
      wedding_id, actor_id, activity_type, entity_type, entity_id, payload, created_by, updated_by
    ) VALUES (
      NEW.wedding_id, actor, 'status_changed', 'outfit', NEW.id,
      jsonb_build_object('from', OLD.status, 'to', NEW.status), actor, actor
    );
  ELSE
    INSERT INTO public.activity_logs (
      wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
    ) VALUES (
      NEW.wedding_id, actor, 'outfit_updated', 'outfit', NEW.id, actor, actor
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_outfits_activity ON public.outfits;
CREATE TRIGGER trg_outfits_activity
  AFTER INSERT OR UPDATE ON public.outfits
  FOR EACH ROW EXECUTE FUNCTION public.log_outfit_activity();

CREATE OR REPLACE FUNCTION public.log_image_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    actor := coalesce(auth.uid(), OLD.updated_by, OLD.created_by);
    INSERT INTO public.activity_logs (
      wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
    ) VALUES (
      OLD.wedding_id, actor, 'image_removed', 'outfit_image', OLD.id, actor, actor
    );
    RETURN OLD;
  END IF;
  actor := coalesce(auth.uid(), NEW.updated_by, NEW.created_by);
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (
      wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
    ) VALUES (
      NEW.wedding_id, actor, 'image_added', 'outfit_image', NEW.id, actor, actor
    );
  ELSIF NEW.archived_at IS NOT NULL AND OLD.archived_at IS NULL THEN
    INSERT INTO public.activity_logs (
      wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
    ) VALUES (
      NEW.wedding_id, actor, 'image_removed', 'outfit_image', NEW.id, actor, actor
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_images_activity ON public.outfit_images;
CREATE TRIGGER trg_images_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.outfit_images
  FOR EACH ROW EXECUTE FUNCTION public.log_image_activity();

-- ---------------------------------------------------------------------------
-- Progress views (PRD Section 19)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.v_outfit_progress AS
SELECT
  o.id AS outfit_id,
  o.participant_id,
  o.event_id,
  o.wedding_id,
  o.status,
  CASE o.status
    WHEN 'idea' THEN 0
    WHEN 'shortlisted' THEN 20
    WHEN 'ordered' THEN 40
    WHEN 'received' THEN 60
    WHEN 'altered' THEN 80
    WHEN 'ready' THEN 100
    ELSE NULL
  END AS readiness_pct
FROM public.outfits o
WHERE o.archived_at IS NULL
  AND o.status <> 'dropped';

CREATE OR REPLACE VIEW public.v_participant_progress AS
SELECT
  p.id AS participant_id,
  p.event_id,
  p.wedding_id,
  COALESCE(avg(v.readiness_pct), 0)::numeric(5, 2) AS progress_pct
FROM public.participants p
LEFT JOIN public.v_outfit_progress v ON v.participant_id = p.id
WHERE p.archived_at IS NULL
GROUP BY p.id, p.event_id, p.wedding_id;

CREATE OR REPLACE VIEW public.v_event_progress AS
SELECT
  e.id AS event_id,
  e.wedding_id,
  e.status,
  e.archived_at,
  CASE
    WHEN e.status = 'cancelled' THEN NULL
    ELSE COALESCE(avg(pp.progress_pct), 0)::numeric(5, 2)
  END AS progress_pct
FROM public.events e
LEFT JOIN public.v_participant_progress pp ON pp.event_id = e.id
WHERE e.archived_at IS NULL
GROUP BY e.id, e.wedding_id, e.status, e.archived_at;

CREATE OR REPLACE VIEW public.v_wedding_progress AS
SELECT
  w.id AS wedding_id,
  COALESCE(avg(ep.progress_pct), 0)::numeric(5, 2) AS overall_completion_pct
FROM public.weddings w
LEFT JOIN public.v_event_progress ep
  ON ep.wedding_id = w.id
  AND ep.status IS DISTINCT FROM 'cancelled'
  AND ep.progress_pct IS NOT NULL
WHERE w.archived_at IS NULL
GROUP BY w.id;

COMMENT ON TABLE public.profiles IS 'Product users. Super Admin is a flag. Lucky is seeded.';
COMMENT ON TABLE public.weddings IS 'Wedding project isolation boundary.';
COMMENT ON VIEW public.v_wedding_progress IS 'Overall completion % = average of non-cancelled, non-archived event progress.';

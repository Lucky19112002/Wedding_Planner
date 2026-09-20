-- Wedding Planner
-- 012_event_edit_rls_alignment.sql
-- Align event and participant edits with event-scoped Edit permission.

DROP POLICY IF EXISTS events_update_admin ON public.events;
CREATE POLICY events_update_admin ON public.events
  FOR UPDATE TO authenticated
  USING (public.can_edit_event(id))
  WITH CHECK (public.can_edit_event(id));

DROP POLICY IF EXISTS participants_insert ON public.participants;
CREATE POLICY participants_insert ON public.participants
  FOR INSERT TO authenticated
  WITH CHECK (public.can_edit_event(event_id));

DROP POLICY IF EXISTS participants_update ON public.participants;
CREATE POLICY participants_update ON public.participants
  FOR UPDATE TO authenticated
  USING (public.can_edit_event(event_id))
  WITH CHECK (public.can_edit_event(event_id));

CREATE OR REPLACE FUNCTION public.archive_event(p_event_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ev public.events%ROWTYPE;
  uid uuid := auth.uid();
  ts timestamptz := now();
BEGIN
  SELECT * INTO ev FROM public.events WHERE id = p_event_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found';
  END IF;
  IF NOT public.can_edit_event(p_event_id) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  UPDATE public.events SET archived_at = ts, archived_by = uid WHERE id = p_event_id;
  UPDATE public.participants SET archived_at = ts, archived_by = uid WHERE event_id = p_event_id;
  UPDATE public.outfits SET archived_at = ts, archived_by = uid WHERE event_id = p_event_id;
  UPDATE public.outfit_images SET archived_at = ts, archived_by = uid
    WHERE outfit_id IN (SELECT id FROM public.outfits WHERE event_id = p_event_id);
  UPDATE public.outfit_urls SET archived_at = ts, archived_by = uid
    WHERE outfit_id IN (SELECT id FROM public.outfits WHERE event_id = p_event_id);
  INSERT INTO public.activity_logs (
    wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
  ) VALUES (ev.wedding_id, uid, 'archived', 'event', p_event_id, uid, uid);
END;
$$;

CREATE OR REPLACE FUNCTION public.archive_participant(p_participant_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pa public.participants%ROWTYPE;
  uid uuid := auth.uid();
  ts timestamptz := now();
BEGIN
  SELECT * INTO pa FROM public.participants WHERE id = p_participant_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Participant not found';
  END IF;
  IF NOT public.can_edit_event(pa.event_id) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  UPDATE public.participants SET archived_at = ts, archived_by = uid WHERE id = p_participant_id;
  UPDATE public.outfits SET archived_at = ts, archived_by = uid WHERE participant_id = p_participant_id;
  UPDATE public.outfit_images SET archived_at = ts, archived_by = uid
    WHERE outfit_id IN (SELECT id FROM public.outfits WHERE participant_id = p_participant_id);
  UPDATE public.outfit_urls SET archived_at = ts, archived_by = uid
    WHERE outfit_id IN (SELECT id FROM public.outfits WHERE participant_id = p_participant_id);
  INSERT INTO public.activity_logs (
    wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
  ) VALUES (pa.wedding_id, uid, 'archived', 'participant', p_participant_id, uid, uid);
END;
$$;

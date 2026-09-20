-- Phase: Admin-only outfit owner switching
-- Keeps outfit ownership tied to a valid participant in the same event.

CREATE OR REPLACE FUNCTION public.switch_outfit_participant(p_outfit_id uuid, p_participant_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  of public.outfits%ROWTYPE;
  target public.participants%ROWTYPE;
  uid uuid := auth.uid();
BEGIN
  SELECT * INTO of
  FROM public.outfits
  WHERE id = p_outfit_id
    AND archived_at IS NULL
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Outfit not found';
  END IF;

  IF NOT (public.is_super_admin() OR public.is_wedding_admin(of.wedding_id)) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  SELECT * INTO target
  FROM public.participants
  WHERE id = p_participant_id
    AND archived_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Participant not found';
  END IF;

  IF target.event_id <> of.event_id OR target.wedding_id <> of.wedding_id THEN
    RAISE EXCEPTION 'Participant must belong to the same event';
  END IF;

  UPDATE public.outfits
  SET participant_id = p_participant_id,
      updated_by = uid
  WHERE id = p_outfit_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.switch_outfit_participant(uuid, uuid) TO authenticated;

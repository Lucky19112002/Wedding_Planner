-- Wedding Planner
-- 009_invitation_details_wedding_date.sql
-- Extends invitation onboarding details with the wedding date.

DROP FUNCTION IF EXISTS public.get_invitation_details(text);

CREATE OR REPLACE FUNCTION public.get_invitation_details(p_token text)
RETURNS TABLE (
  email citext,
  invited_role public.wedding_role,
  status public.invitation_status,
  effective_status text,
  expires_at timestamptz,
  wedding_id uuid,
  wedding_name text,
  wedding_date date,
  existing_account boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hashed text := public.hash_invite_token(p_token);
BEGIN
  RETURN QUERY
  SELECT
    i.email,
    i.invited_role,
    i.status,
    CASE
      WHEN i.status = 'pending' AND i.expires_at < now() THEN 'expired'
      ELSE i.status::text
    END AS effective_status,
    i.expires_at,
    i.wedding_id,
    w.name AS wedding_name,
    w.wedding_date,
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.email = i.email
        AND p.is_deactivated = false
    ) AS existing_account
  FROM public.invitations i
  JOIN public.weddings w ON w.id = i.wedding_id
  WHERE i.token_hash = hashed
    AND i.archived_at IS NULL
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_invitation_details(text) TO anon, authenticated;

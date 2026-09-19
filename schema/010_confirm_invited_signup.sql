-- Wedding Planner
-- 010_confirm_invited_signup.sql
-- Create token-bound invited Auth users with confirmed email for self-service onboarding.

CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.create_invited_auth_user(
  p_token text,
  p_password text,
  p_display_name text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  inv public.invitations%ROWTYPE;
  hashed text := public.hash_invite_token(p_token);
  new_user_id uuid := gen_random_uuid();
  display_name text := nullif(trim(p_display_name), '');
BEGIN
  IF length(coalesce(p_password, '')) < 6 THEN
    RAISE EXCEPTION 'Password must be at least 6 characters';
  END IF;

  SELECT * INTO inv
  FROM public.invitations
  WHERE token_hash = hashed
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found';
  END IF;

  IF inv.archived_at IS NOT NULL OR inv.status <> 'pending' THEN
    RAISE EXCEPTION 'Invitation is not active';
  END IF;

  IF inv.expires_at < now() THEN
    UPDATE public.invitations SET status = 'expired' WHERE id = inv.id;
    RAISE EXCEPTION 'Invitation has expired';
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users u WHERE lower(u.email) = lower(inv.email::text)) THEN
    RAISE EXCEPTION 'This email already has an account';
  END IF;

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    inv.email,
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('display_name', coalesce(display_name, split_part(inv.email::text, '@', 1))),
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    new_user_id,
    new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', inv.email),
    'email',
    new_user_id::text,
    now(),
    now(),
    now()
  );

  RETURN new_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_invited_auth_user(text, text, text) TO anon, authenticated;

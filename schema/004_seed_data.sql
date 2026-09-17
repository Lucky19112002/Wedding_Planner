-- Wedding Planner
-- 004_seed_data.sql
-- Seed Super Admin Lucky and Lucky & Kareena Wedding 2026.
-- Idempotent on fixed UUIDs. Rotate the seed password after first login.
-- Progress log: docs/log.md

-- Fixed identifiers (document these in ops; do not reuse for other people)
-- Lucky profile / auth user: 11111111-1111-4111-8111-111111111111
-- First wedding:             22222222-2222-4222-8222-222222222222

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  seed_lucky_id uuid := '11111111-1111-4111-8111-111111111111';
  seed_wedding_id uuid := '22222222-2222-4222-8222-222222222222';
  lucky_email text := 'lucky@weddingplanner.app';
  -- Temporary only. Change immediately after first sign-in.
  lucky_password text := 'ChangeMe-Lucky-Seed-2026';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = seed_lucky_id) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      seed_lucky_id,
      'authenticated',
      'authenticated',
      lucky_email,
      crypt(lucky_password, gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Lucky"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM auth.identities WHERE user_id = seed_lucky_id AND provider = 'email'
  ) THEN
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      seed_lucky_id,
      jsonb_build_object('sub', seed_lucky_id::text, 'email', lucky_email),
      'email',
      seed_lucky_id::text,
      now(),
      now(),
      now()
    );
  END IF;

  INSERT INTO public.profiles (
    id, email, display_name, is_super_admin, is_deactivated, created_by, updated_by
  ) VALUES (
    seed_lucky_id, lucky_email, 'Lucky', true, false, seed_lucky_id, seed_lucky_id
  )
  ON CONFLICT (id) DO UPDATE
    SET display_name = 'Lucky',
        is_super_admin = true,
        is_deactivated = false,
        email = excluded.email;

  INSERT INTO public.weddings (
    id, name, couple_names, notes, created_by, updated_by
  ) VALUES (
    seed_wedding_id,
    'Lucky & Kareena Wedding 2026',
    'Lucky & Kareena',
    'Initial wedding project.',
    seed_lucky_id,
    seed_lucky_id
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.wedding_memberships (
    wedding_id, user_id, role, created_by, updated_by
  ) VALUES (
    seed_wedding_id, seed_lucky_id, 'admin', seed_lucky_id, seed_lucky_id
  )
  ON CONFLICT (wedding_id, user_id) DO UPDATE
    SET role = 'admin',
        archived_at = NULL;

  IF NOT EXISTS (
    SELECT 1
    FROM public.activity_logs
    WHERE activity_type = 'user_created'
      AND entity_id = seed_lucky_id
  ) THEN
    INSERT INTO public.activity_logs (
      wedding_id, actor_id, activity_type, entity_type, entity_id, created_by, updated_by
    ) VALUES (
      NULL, seed_lucky_id, 'user_created', 'profile', seed_lucky_id, seed_lucky_id, seed_lucky_id
    );
  END IF;
END
$$;

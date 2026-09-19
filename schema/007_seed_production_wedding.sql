-- Wedding Planner
-- 007_seed_production_wedding.sql
-- Reset application data and seed the real production wedding.
-- Data-only migration. Do not change schema, RLS, functions, views, or storage.
-- Progress log: docs/log.md.

CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

DO $$
DECLARE
  v_lucky_id uuid := '11111111-1111-4111-8111-111111111111';
  v_kareena_id uuid := '33333333-3333-4333-8333-333333333333';
  v_mom_id uuid := '44444444-4444-4444-8444-444444444444';
  v_temp_admin_id uuid := '99999999-9999-4999-8999-999999999999';

  v_wedding_id uuid := '22222222-2222-4222-8222-222222222222';
  v_janda_id uuid := '55555555-0001-4555-8555-555555555555';
  v_haldi_id uuid := '55555555-0002-4555-8555-555555555555';
  v_mehndi_id uuid := '55555555-0003-4555-8555-555555555555';
  v_nikah_id uuid := '55555555-0004-4555-8555-555555555555';
  v_shoot_id uuid := '55555555-0005-4555-8555-555555555555';

  v_lucky_email text := 'Lckpathan@gmail.com';
  v_kareena_email text := 'Kareenacandy12@gmail.com';
  v_mom_email text := 'Hasinasp@gmail.com';
BEGIN
  DELETE FROM public.activity_logs;
  DELETE FROM public.outfit_urls;
  DELETE FROM public.outfit_images;
  DELETE FROM public.outfits;
  DELETE FROM public.participants;
  DELETE FROM public.events;
  DELETE FROM public.invitations;
  DELETE FROM public.wedding_memberships;
  DELETE FROM public.weddings;

  -- Keep the "last Super Admin" trigger satisfied while replacing users.
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_temp_admin_id,
    'authenticated',
    'authenticated',
    'seed-temp-admin@weddingplanner.local',
    extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Seed Temp Admin"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (
    id, email, display_name, is_super_admin, is_deactivated, relationship_note, created_by, updated_by
  ) VALUES (
    v_temp_admin_id,
    'seed-temp-admin@weddingplanner.local',
    'Seed Temp Admin',
    true,
    false,
    'Temporary migration guard',
    v_temp_admin_id,
    v_temp_admin_id
  )
  ON CONFLICT (id) DO UPDATE
    SET is_super_admin = true,
        is_deactivated = false;

  DELETE FROM auth.identities
  WHERE user_id NOT IN (v_lucky_id, v_kareena_id, v_mom_id, v_temp_admin_id)
     OR (
       provider = 'email'
       AND lower(identity_data->>'email') IN (lower(v_lucky_email), lower(v_kareena_email), lower(v_mom_email))
       AND user_id NOT IN (v_lucky_id, v_kareena_id, v_mom_id)
     );

  DELETE FROM auth.users
  WHERE id NOT IN (v_lucky_id, v_kareena_id, v_mom_id, v_temp_admin_id)
     OR (
       lower(email) IN (lower(v_lucky_email), lower(v_kareena_email), lower(v_mom_email))
       AND id NOT IN (v_lucky_id, v_kareena_id, v_mom_id)
     );

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES
    (
      '00000000-0000-0000-0000-000000000000',
      v_lucky_id,
      'authenticated',
      'authenticated',
      v_lucky_email,
      extensions.crypt('Lucky@19', extensions.gen_salt('bf')),
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
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      v_kareena_id,
      'authenticated',
      'authenticated',
      v_kareena_email,
      extensions.crypt('Kareena@26', extensions.gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Kareena"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      v_mom_id,
      'authenticated',
      'authenticated',
      v_mom_email,
      extensions.crypt('@123Mom', extensions.gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Mom"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
  ON CONFLICT (id) DO UPDATE
    SET email = excluded.email,
        encrypted_password = excluded.encrypted_password,
        email_confirmed_at = excluded.email_confirmed_at,
        raw_app_meta_data = excluded.raw_app_meta_data,
        raw_user_meta_data = excluded.raw_user_meta_data,
        updated_at = now();

  DELETE FROM auth.identities
  WHERE user_id IN (v_lucky_id, v_kareena_id, v_mom_id)
    AND provider = 'email';

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES
    (
      v_lucky_id,
      v_lucky_id,
      jsonb_build_object('sub', v_lucky_id::text, 'email', v_lucky_email),
      'email',
      v_lucky_id::text,
      now(),
      now(),
      now()
    ),
    (
      v_kareena_id,
      v_kareena_id,
      jsonb_build_object('sub', v_kareena_id::text, 'email', v_kareena_email),
      'email',
      v_kareena_id::text,
      now(),
      now(),
      now()
    ),
    (
      v_mom_id,
      v_mom_id,
      jsonb_build_object('sub', v_mom_id::text, 'email', v_mom_email),
      'email',
      v_mom_id::text,
      now(),
      now(),
      now()
    );

  INSERT INTO public.profiles (
    id, email, display_name, is_super_admin, is_deactivated, relationship_note, created_by, updated_by
  ) VALUES
    (v_lucky_id, v_lucky_email, 'Lucky', true, false, 'Groom', v_lucky_id, v_lucky_id),
    (v_kareena_id, v_kareena_email, 'Kareena', false, false, 'Bride', v_lucky_id, v_lucky_id),
    (v_mom_id, v_mom_email, 'Mom', false, false, 'Mom', v_lucky_id, v_lucky_id)
  ON CONFLICT (id) DO UPDATE
    SET email = excluded.email,
        display_name = excluded.display_name,
        is_super_admin = excluded.is_super_admin,
        is_deactivated = false,
        relationship_note = excluded.relationship_note,
        updated_by = v_lucky_id;

  DELETE FROM auth.users WHERE id = v_temp_admin_id;

  INSERT INTO public.weddings (
    id, name, couple_names, wedding_date, notes, created_by, updated_by
  ) VALUES (
    v_wedding_id,
    'K&L Weds',
    'Kareena & Lucky',
    DATE '2026-12-05',
    'Production wedding.',
    v_lucky_id,
    v_lucky_id
  )
  ON CONFLICT (id) DO UPDATE
    SET name = excluded.name,
        couple_names = excluded.couple_names,
        wedding_date = excluded.wedding_date,
        notes = excluded.notes,
        archived_at = NULL,
        archived_by = NULL,
        updated_by = v_lucky_id;

  INSERT INTO public.wedding_memberships (
    wedding_id, user_id, role, created_by, updated_by
  ) VALUES
    (v_wedding_id, v_lucky_id, 'admin', v_lucky_id, v_lucky_id),
    (v_wedding_id, v_kareena_id, 'member', v_lucky_id, v_lucky_id),
    (v_wedding_id, v_mom_id, 'viewer', v_lucky_id, v_lucky_id)
  ON CONFLICT (wedding_id, user_id) DO UPDATE
    SET role = excluded.role,
        archived_at = NULL,
        archived_by = NULL,
        updated_by = v_lucky_id;

  INSERT INTO public.events (
    id, wedding_id, name, event_date, status, created_by, updated_by
  ) VALUES
    (v_janda_id, v_wedding_id, 'Janda Nikla', DATE '2026-12-03', 'planned', v_lucky_id, v_lucky_id),
    (v_haldi_id, v_wedding_id, 'Haldi', DATE '2026-12-04', 'planned', v_lucky_id, v_lucky_id),
    (v_mehndi_id, v_wedding_id, 'Mehndi', DATE '2026-12-04', 'planned', v_lucky_id, v_lucky_id),
    (v_nikah_id, v_wedding_id, 'Nikah', DATE '2026-12-05', 'planned', v_lucky_id, v_lucky_id),
    (v_shoot_id, v_wedding_id, 'Post Wedding Shoot', DATE '2026-12-06', 'planned', v_lucky_id, v_lucky_id)
  ON CONFLICT (id) DO UPDATE
    SET wedding_id = excluded.wedding_id,
        name = excluded.name,
        event_date = excluded.event_date,
        start_time = NULL,
        end_time = NULL,
        location = NULL,
        notes = NULL,
        status = excluded.status,
        archived_at = NULL,
        archived_by = NULL,
        updated_by = v_lucky_id;

  INSERT INTO public.participants (
    event_id, wedding_id, user_id, role_in_event, created_by, updated_by
  ) VALUES
    (v_janda_id, v_wedding_id, v_lucky_id, 'Groom', v_lucky_id, v_lucky_id),
    (v_haldi_id, v_wedding_id, v_lucky_id, 'Groom', v_lucky_id, v_lucky_id),
    (v_haldi_id, v_wedding_id, v_kareena_id, 'Bride', v_lucky_id, v_lucky_id),
    (v_mehndi_id, v_wedding_id, v_lucky_id, 'Groom', v_lucky_id, v_lucky_id),
    (v_mehndi_id, v_wedding_id, v_kareena_id, 'Bride', v_lucky_id, v_lucky_id),
    (v_nikah_id, v_wedding_id, v_lucky_id, 'Groom', v_lucky_id, v_lucky_id),
    (v_nikah_id, v_wedding_id, v_kareena_id, 'Bride', v_lucky_id, v_lucky_id),
    (v_shoot_id, v_wedding_id, v_lucky_id, 'Groom', v_lucky_id, v_lucky_id),
    (v_shoot_id, v_wedding_id, v_kareena_id, 'Bride', v_lucky_id, v_lucky_id);

  DELETE FROM public.activity_logs;

  IF (SELECT count(*) FROM auth.users) <> 3 THEN
    RAISE EXCEPTION 'Production seed expected exactly 3 auth users';
  END IF;
  IF (SELECT count(*) FROM public.profiles) <> 3 THEN
    RAISE EXCEPTION 'Production seed expected exactly 3 profiles';
  END IF;
  IF (SELECT count(*) FROM public.weddings WHERE archived_at IS NULL) <> 1 THEN
    RAISE EXCEPTION 'Production seed expected exactly 1 active wedding';
  END IF;
  IF (SELECT count(*) FROM public.wedding_memberships WHERE archived_at IS NULL) <> 3 THEN
    RAISE EXCEPTION 'Production seed expected exactly 3 active memberships';
  END IF;
  IF (SELECT count(*) FROM public.events WHERE archived_at IS NULL) <> 5 THEN
    RAISE EXCEPTION 'Production seed expected exactly 5 active events';
  END IF;
  IF (SELECT count(*) FROM public.participants WHERE archived_at IS NULL) <> 9 THEN
    RAISE EXCEPTION 'Production seed expected exactly 9 active participants';
  END IF;
  IF EXISTS (SELECT 1 FROM public.invitations) THEN
    RAISE EXCEPTION 'Production seed expected zero invitations';
  END IF;
  IF EXISTS (SELECT 1 FROM public.outfits) THEN
    RAISE EXCEPTION 'Production seed expected zero outfits';
  END IF;
  IF EXISTS (SELECT 1 FROM public.outfit_images) THEN
    RAISE EXCEPTION 'Production seed expected zero outfit images';
  END IF;
  IF EXISTS (SELECT 1 FROM public.outfit_urls) THEN
    RAISE EXCEPTION 'Production seed expected zero outfit links';
  END IF;
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.wedding_memberships m ON m.user_id = p.id
    WHERE p.id = v_lucky_id
      AND p.is_super_admin
      AND NOT p.is_deactivated
      AND m.wedding_id = v_wedding_id
      AND m.role = 'admin'
      AND m.archived_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Lucky Super Admin membership was not seeded correctly';
  END IF;
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.wedding_memberships m ON m.user_id = p.id
    WHERE p.id = v_kareena_id
      AND NOT p.is_super_admin
      AND NOT p.is_deactivated
      AND m.wedding_id = v_wedding_id
      AND m.role = 'member'
      AND m.archived_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Kareena member membership was not seeded correctly';
  END IF;
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.wedding_memberships m ON m.user_id = p.id
    WHERE p.id = v_mom_id
      AND NOT p.is_super_admin
      AND NOT p.is_deactivated
      AND m.wedding_id = v_wedding_id
      AND m.role = 'viewer'
      AND m.archived_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Mom viewer membership was not seeded correctly';
  END IF;
END
$$;

-- Platform-wide stats for platform_admin dashboard
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF get_user_role() != 'platform_admin' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN jsonb_build_object(
    'school_count',  (SELECT COUNT(*) FROM schools),
    'bus_count',     (SELECT COUNT(*) FROM buses),
    'student_count', (SELECT COUNT(*) FROM students),
    'admin_count',   (SELECT COUNT(*) FROM user_roles WHERE role = 'school_admin')
  );
END;
$$;

-- Schools list with admin info and counts for platform_admin
CREATE OR REPLACE FUNCTION get_schools_with_admins()
RETURNS TABLE (
  id            UUID,
  name          TEXT,
  address       TEXT,
  created_at    TIMESTAMPTZ,
  bus_count     BIGINT,
  student_count BIGINT,
  admin_name    TEXT,
  admin_email   TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF get_user_role() != 'platform_admin' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT
    s.id,
    s.name,
    s.address,
    s.created_at,
    COUNT(DISTINCT b.id)::BIGINT,
    COUNT(DISTINCT st.id)::BIGINT,
    MAX(u.raw_user_meta_data->>'full_name'),
    MAX(u.email)
  FROM schools s
  LEFT JOIN buses b       ON b.school_id  = s.id
  LEFT JOIN students st   ON st.school_id = s.id
  LEFT JOIN user_roles ur ON ur.school_id = s.id AND ur.role = 'school_admin'
  LEFT JOIN auth.users u  ON u.id = ur.user_id
  GROUP BY s.id, s.name, s.address, s.created_at
  ORDER BY s.created_at DESC;
END;
$$;

-- Create a school with PostGIS geography (platform_admin only)
-- Defaults to central Doha coordinates if lat/lng not provided
CREATE OR REPLACE FUNCTION create_school(
  p_name    TEXT,
  p_address TEXT,
  p_lat     DOUBLE PRECISION DEFAULT 25.2854,
  p_lng     DOUBLE PRECISION DEFAULT 51.5310
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  IF get_user_role() != 'platform_admin' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO schools (name, address, starting_point, created_by)
  VALUES (
    p_name,
    p_address,
    ST_GeogFromText('SRID=4326;POINT(' || p_lng || ' ' || p_lat || ')'),
    auth.uid()
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- Generate a school_admin invite link for a school (platform_admin only)
-- Returns the invite code; caller builds the full URL
CREATE OR REPLACE FUNCTION generate_school_admin_invite(p_school_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invite_code TEXT;
BEGIN
  IF get_user_role() != 'platform_admin' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- 10-char uppercase hex code (5 random bytes → 10 hex chars)
  invite_code := upper(encode(gen_random_bytes(5), 'hex'));

  INSERT INTO invites (code, role, school_id, created_by)
  VALUES (invite_code, 'school_admin', p_school_id, auth.uid());

  RETURN invite_code;
END;
$$;

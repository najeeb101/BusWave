-- School-scoped helper functions for school_admin dashboard

-- Get school info for the logged-in school admin
CREATE OR REPLACE FUNCTION get_school_info()
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF get_user_role() NOT IN ('school_admin', 'platform_admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN (
    SELECT jsonb_build_object('id', s.id, 'name', s.name, 'address', s.address)
    FROM schools s
    WHERE s.id = get_user_school_id()
  );
END;
$$;

-- Get school stats for overview dashboard
CREATE OR REPLACE FUNCTION get_school_stats()
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  school_uuid UUID;
BEGIN
  IF get_user_role() NOT IN ('school_admin', 'platform_admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  school_uuid := get_user_school_id();
  RETURN jsonb_build_object(
    'bus_count',     (SELECT COUNT(*) FROM buses    WHERE school_id = school_uuid),
    'active_buses',  (SELECT COUNT(*) FROM buses    WHERE school_id = school_uuid AND is_active = true AND driver_id IS NOT NULL),
    'student_count', (SELECT COUNT(*) FROM students WHERE school_id = school_uuid),
    'route_count',   (SELECT COUNT(*) FROM routes   WHERE school_id = school_uuid)
  );
END;
$$;

-- Get buses with driver names and student counts
CREATE OR REPLACE FUNCTION get_buses_with_drivers()
RETURNS TABLE (
  id            UUID,
  school_id     UUID,
  name          TEXT,
  capacity      INTEGER,
  driver_id     UUID,
  driver_name   TEXT,
  driver_email  TEXT,
  color         TEXT,
  is_active     BOOLEAN,
  student_count BIGINT,
  created_at    TIMESTAMPTZ
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF get_user_role() NOT IN ('school_admin', 'platform_admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN QUERY
  SELECT
    b.id,
    b.school_id,
    b.name,
    b.capacity,
    b.driver_id,
    u.raw_user_meta_data->>'full_name' AS driver_name,
    u.email                            AS driver_email,
    b.color,
    b.is_active,
    COUNT(s.id)::BIGINT                AS student_count,
    b.created_at
  FROM buses b
  LEFT JOIN auth.users u ON u.id    = b.driver_id
  LEFT JOIN students  s  ON s.bus_id = b.id
  WHERE b.school_id = get_user_school_id()
  GROUP BY b.id, b.school_id, b.name, b.capacity, b.driver_id,
           u.raw_user_meta_data, u.email, b.color, b.is_active, b.created_at
  ORDER BY b.created_at ASC;
END;
$$;

-- Get students with their bus name
CREATE OR REPLACE FUNCTION get_students_with_bus()
RETURNS TABLE (
  id           UUID,
  school_id    UUID,
  name         TEXT,
  home_address TEXT,
  bus_id       UUID,
  bus_name     TEXT,
  stop_order   INTEGER,
  created_at   TIMESTAMPTZ
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF get_user_role() NOT IN ('school_admin', 'platform_admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN QUERY
  SELECT
    st.id,
    st.school_id,
    st.name,
    st.home_address,
    st.bus_id,
    b.name   AS bus_name,
    st.stop_order,
    st.created_at
  FROM students st
  LEFT JOIN buses b ON b.id = st.bus_id
  WHERE st.school_id = get_user_school_id()
  ORDER BY st.created_at DESC;
END;
$$;

-- Get recent announcements for activity feed
CREATE OR REPLACE FUNCTION get_recent_announcements(p_limit INTEGER DEFAULT 5)
RETURNS TABLE (
  id         UUID,
  message    TEXT,
  bus_id     UUID,
  bus_name   TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF get_user_role() NOT IN ('school_admin', 'platform_admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN QUERY
  SELECT a.id, a.message, a.bus_id, b.name AS bus_name, a.created_at
  FROM announcements a
  LEFT JOIN buses b ON b.id = a.bus_id
  WHERE a.school_id = get_user_school_id()
  ORDER BY a.created_at DESC
  LIMIT p_limit;
END;
$$;

-- Create bus (school_id injected from session)
CREATE OR REPLACE FUNCTION create_bus(
  p_name     TEXT,
  p_capacity INTEGER DEFAULT 40,
  p_color    TEXT    DEFAULT '#3B82F6'
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE new_id UUID;
BEGIN
  IF get_user_role() NOT IN ('school_admin', 'platform_admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  INSERT INTO buses (school_id, name, capacity, color)
  VALUES (get_user_school_id(), p_name, p_capacity, p_color)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Add student with geocoded home location
-- p_lat/p_lng from Mapbox Geocoding API; defaults to central Doha if not provided
CREATE OR REPLACE FUNCTION add_student(
  p_name         TEXT,
  p_home_address TEXT,
  p_lat          DOUBLE PRECISION DEFAULT 25.2854,
  p_lng          DOUBLE PRECISION DEFAULT 51.5310,
  p_bus_id       UUID             DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE new_id UUID;
BEGIN
  IF get_user_role() NOT IN ('school_admin', 'platform_admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  INSERT INTO students (school_id, name, home_address, home_location, bus_id)
  VALUES (
    get_user_school_id(),
    p_name,
    p_home_address,
    ST_GeogFromText('SRID=4326;POINT(' || p_lng || ' ' || p_lat || ')'),
    p_bus_id
  )
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Generate driver invite pre-assigned to a bus
CREATE OR REPLACE FUNCTION generate_driver_invite(p_bus_id UUID)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE invite_code TEXT;
BEGIN
  IF get_user_role() NOT IN ('school_admin', 'platform_admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  invite_code := upper(encode(gen_random_bytes(5), 'hex'));
  INSERT INTO invites (code, role, school_id, bus_id, created_by)
  VALUES (invite_code, 'driver', get_user_school_id(), p_bus_id, auth.uid());
  RETURN invite_code;
END;
$$;

-- Generate parent invite pre-linked to a student
CREATE OR REPLACE FUNCTION generate_parent_invite(p_student_id UUID)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE invite_code TEXT;
BEGIN
  IF get_user_role() NOT IN ('school_admin', 'platform_admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  invite_code := upper(encode(gen_random_bytes(5), 'hex'));
  INSERT INTO invites (code, role, school_id, student_ids, created_by)
  VALUES (invite_code, 'parent', get_user_school_id(), ARRAY[p_student_id], auth.uid());
  RETURN invite_code;
END;
$$;

-- Send announcement (to all or a specific bus)
CREATE OR REPLACE FUNCTION send_announcement(
  p_message TEXT,
  p_bus_id  UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE new_id UUID;
BEGIN
  IF get_user_role() NOT IN ('school_admin', 'platform_admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  INSERT INTO announcements (school_id, bus_id, sender_id, message)
  VALUES (get_user_school_id(), p_bus_id, auth.uid(), p_message)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

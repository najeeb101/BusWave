-- Route-scoped helper functions for school_admin dashboard
-- This completes the "Wiring" of the Route Management page

-- Get routes with bus details
CREATE OR REPLACE FUNCTION get_routes_with_buses()
RETURNS TABLE (
  id                 UUID,
  bus_id             UUID,
  bus_name           TEXT,
  bus_color          TEXT,
  waypoints          JSONB,
  total_distance_km  DECIMAL,
  total_duration_min DECIMAL,
  optimized_at       TIMESTAMPTZ
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF get_user_role() NOT IN ('school_admin', 'platform_admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  RETURN QUERY
  SELECT
    r.id,
    r.bus_id,
    b.name AS bus_name,
    b.color AS bus_color,
    r.waypoints,
    r.total_distance_km,
    r.total_duration_min,
    r.optimized_at
  FROM routes r
  JOIN buses b ON b.id = r.bus_id
  WHERE r.school_id = get_user_school_id()
  ORDER BY r.optimized_at DESC;
END;
$$;

-- Trigger a re-optimization (Simulated for now, would call Edge Function in production)
CREATE OR REPLACE FUNCTION recalculate_route(p_route_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF get_user_role() NOT IN ('school_admin', 'platform_admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Ensure route belongs to the user's school
  IF NOT EXISTS (
    SELECT 1 FROM routes 
    WHERE id = p_route_id AND school_id = get_user_school_id()
  ) THEN
    RAISE EXCEPTION 'Route not found or unauthorized';
  END IF;

  -- Simulated optimization: Update the timestamp and tweak values slightly
  UPDATE routes
  SET 
    optimized_at = NOW(),
    total_distance_km = total_distance_km * (0.95 + random() * 0.1), -- ±5% change
    total_duration_min = total_duration_min * (0.95 + random() * 0.1)
  WHERE id = p_route_id;

  RETURN TRUE;
END;
$$;

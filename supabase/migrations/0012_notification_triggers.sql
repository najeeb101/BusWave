-- Push notification triggers via pg_net -> send-notification Edge Function
--
-- REQUIRED SETUP (run once in Supabase SQL editor after deployment):
--
--   SELECT set_config('app.settings.supabase_url', 'https://YOUR_PROJECT_REF.supabase.co', false);
--   SELECT set_config('app.settings.service_role_key', 'YOUR_SERVICE_ROLE_KEY', false);
--
-- Or persist across restarts:
--   ALTER DATABASE postgres SET "app.settings.supabase_url" = 'https://YOUR_PROJECT_REF.supabase.co';
--   ALTER DATABASE postgres SET "app.settings.service_role_key" = 'YOUR_SERVICE_ROLE_KEY';

CREATE EXTENSION IF NOT EXISTS pg_net;

-- ---------------------------------------------------------------------------
-- ATTENDANCE -> notify parent
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_notify_parent_attendance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_url TEXT := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-notification';
  v_key TEXT := current_setting('app.settings.service_role_key', true);
BEGIN
  -- Skip if config is missing (e.g. local dev without settings)
  IF v_url IS NULL OR v_url = '/functions/v1/send-notification' OR v_key IS NULL THEN
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url     := v_url,
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || v_key
    ),
    body    := jsonb_build_object(
      'type',       'attendance',
      'student_id', NEW.student_id,
      'status',     NEW.status
    )::text
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS attendance_notify_parent ON attendance;
CREATE TRIGGER attendance_notify_parent
  AFTER INSERT OR UPDATE OF status ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION trigger_notify_parent_attendance();

-- ---------------------------------------------------------------------------
-- ANNOUNCEMENTS -> notify parents
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_notify_parent_announcement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_url TEXT := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-notification';
  v_key TEXT := current_setting('app.settings.service_role_key', true);
BEGIN
  IF v_url IS NULL OR v_url = '/functions/v1/send-notification' OR v_key IS NULL THEN
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url     := v_url,
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || v_key
    ),
    body    := jsonb_build_object(
      'type',      'announcement',
      'school_id', NEW.school_id,
      'bus_id',    NEW.bus_id,
      'message',   NEW.message
    )::text
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS announcements_notify_parent ON announcements;
CREATE TRIGGER announcements_notify_parent
  AFTER INSERT ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION trigger_notify_parent_announcement();

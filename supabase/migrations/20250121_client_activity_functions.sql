-- Functions for client activity analysis
-- These functions perform calculations in SQL for better performance

-- Function to get client activity statistics for charts
CREATE OR REPLACE FUNCTION get_client_activity_stats()
RETURNS TABLE (
  id uuid,
  name text,
  last_active_at timestamp with time zone,
  days_since_login integer
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.last_active_at,
    CASE 
      WHEN p.last_active_at IS NULL THEN 999
      ELSE EXTRACT(epoch FROM (now() - p.last_active_at))::integer / 86400
    END AS days_since_login
  FROM profiles p
  INNER JOIN profiles b ON p.broker_id = b.id
  WHERE p.is_broker = false
    AND b.is_broker = true
    AND b.active = true
    AND b.name NOT ILIKE '%teste%'
    AND p.broker_id IS NOT NULL;
END;
$$;

-- Function to get recent client access for table
CREATE OR REPLACE FUNCTION get_recent_client_access(limit_count integer DEFAULT 20)
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  last_active_at timestamp with time zone,
  broker_name text,
  days_since_login integer
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    ''::text AS email, -- Email will be fetched separately in the frontend
    p.last_active_at,
    b.name AS broker_name,
    CASE 
      WHEN p.last_active_at IS NULL THEN 999
      ELSE EXTRACT(epoch FROM (now() - p.last_active_at))::integer / 86400
    END AS days_since_login
  FROM profiles p
  INNER JOIN profiles b ON p.broker_id = b.id
  WHERE p.is_broker = false
    AND b.is_broker = true
    AND b.active = true
    AND b.name NOT ILIKE '%teste%'
    AND p.broker_id IS NOT NULL
  ORDER BY p.last_active_at DESC NULLS LAST
  LIMIT limit_count;
END;
$$;

-- Add comments
COMMENT ON FUNCTION get_client_activity_stats() IS 'Returns activity statistics for all clients from active brokers, with days since last login calculated in SQL';
COMMENT ON FUNCTION get_recent_client_access(integer) IS 'Returns recent client access data with broker names and emails for the admin dashboard table';

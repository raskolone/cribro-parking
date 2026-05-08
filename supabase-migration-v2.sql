-- ============================================
-- Cribro Parking — Migration V2
-- Adds: role system, confirmation codes, email notifications placeholder
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add 'role' column to profiles (default: 'client')
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client' CHECK (role IN ('client', 'owner', 'admin'));

-- 2. Add 'confirmation_code' column to reservations
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS confirmation_code TEXT;

-- 3. Add 'email_notification_sent' column to reservations (placeholder for email system)
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS email_notification_sent BOOLEAN DEFAULT false;

-- 4. Add 'owner_notified' column to reservations (placeholder for owner notification)
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS owner_notified BOOLEAN DEFAULT false;

-- 5. Create a function to auto-generate confirmation code on reservation insert
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate code: CP-XXXXX (CP = Cribro Parking, 5 random alphanumeric chars)
  NEW.confirmation_code := 'CP-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS set_confirmation_code ON reservations;
CREATE TRIGGER set_confirmation_code
  BEFORE INSERT ON reservations
  FOR EACH ROW EXECUTE FUNCTION generate_confirmation_code();

-- 6. Update existing reservations with confirmation codes (if any exist without one)
UPDATE reservations 
SET confirmation_code = 'CP-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || id::TEXT) FROM 1 FOR 6))
WHERE confirmation_code IS NULL;

-- 7. Add RLS policy for owners to view reservations for their parking lots
-- First, we need a parking_lot_owners junction table
CREATE TABLE IF NOT EXISTS parking_lot_owners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parking_lot_id UUID REFERENCES parking_lots(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, parking_lot_id)
);

ALTER TABLE parking_lot_owners ENABLE ROW LEVEL SECURITY;

-- Owners can see their own assignments
CREATE POLICY "Owners can view own assignments"
  ON parking_lot_owners FOR SELECT
  USING (auth.uid() = user_id);

-- Drop existing reservation select policy and recreate with owner access
DROP POLICY IF EXISTS "Users can view own reservations" ON reservations;

-- Users can view their own reservations
CREATE POLICY "Users can view own reservations"
  ON reservations FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    parking_lot_id IN (
      SELECT parking_lot_id FROM parking_lot_owners WHERE user_id = auth.uid()
    )
  );

-- Owners can update reservations for their parking lots (change status)
DROP POLICY IF EXISTS "Owners can update reservations for their lots" ON reservations;
CREATE POLICY "Owners can update reservations for their lots"
  ON reservations FOR UPDATE
  USING (
    parking_lot_id IN (
      SELECT parking_lot_id FROM parking_lot_owners WHERE user_id = auth.uid()
    )
  );

-- 8. Create notifications_log table (placeholder for email system)
CREATE TABLE IF NOT EXISTS notifications_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('client', 'owner')),
  notification_type TEXT NOT NULL CHECK (notification_type IN ('booking_confirmation', 'booking_cancellation', 'status_change')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;

-- Users can see their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications_log FOR SELECT
  USING (
    reservation_id IN (
      SELECT id FROM reservations WHERE user_id = auth.uid()
    )
  );

-- Authenticated users can insert notifications (for the placeholder system)
CREATE POLICY "Authenticated users can insert notifications"
  ON notifications_log FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- Cribro Parking — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Parking Lots Table
CREATE TABLE IF NOT EXISTS parking_lots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  airport_code TEXT NOT NULL CHECK (airport_code IN ('KTW', 'KRK')),
  distance_km NUMERIC(4,1) NOT NULL,
  transfer_time_min INTEGER NOT NULL,
  price_per_day NUMERIC(6,2) NOT NULL,
  rating NUMERIC(2,1) DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  total_spots INTEGER NOT NULL DEFAULT 100,
  available_spots INTEGER NOT NULL DEFAULT 100,
  description_pl TEXT,
  description_en TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  parking_lot_id UUID REFERENCES parking_lots(id) ON DELETE CASCADE NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  car_plate TEXT NOT NULL,
  flight_number TEXT,
  total_price NUMERIC(8,2) NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE parking_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Parking lots: everyone can read active parking lots
CREATE POLICY "Anyone can view active parking lots"
  ON parking_lots FOR SELECT
  USING (is_active = true);

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Reservations: users can view their own reservations
CREATE POLICY "Users can view own reservations"
  ON reservations FOR SELECT
  USING (auth.uid() = user_id);

-- Reservations: authenticated users can create reservations
CREATE POLICY "Authenticated users can create reservations"
  ON reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Reservations: users can cancel their own reservations
CREATE POLICY "Users can update own reservations"
  ON reservations FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Auto-create profile on signup (trigger)
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Seed Data: Fictional Parking Lots
-- ============================================

INSERT INTO parking_lots (name, airport_code, distance_km, transfer_time_min, price_per_day, rating, reviews_count, features, total_spots, available_spots, description_pl, description_en, image_url) VALUES
(
  'SkyPark Pyrzowice',
  'KTW',
  1.2,
  5,
  29.00,
  4.8,
  342,
  ARRAY['transfer', 'cctv', 'fenced', 'lit'],
  150,
  87,
  'Nowoczesny parking z całodobowym monitoringiem, ogrodzony i oświetlony. Darmowy transfer busem co 15 minut.',
  'Modern parking with 24/7 CCTV monitoring, fenced and well-lit. Free shuttle bus every 15 minutes.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/parking-security-N3X3nWrgSeE6KHrmcgvnvw.webp'
),
(
  'AeroParking KTW',
  'KTW',
  2.5,
  8,
  24.00,
  4.6,
  218,
  ARRAY['transfer', 'cctv', 'fenced'],
  200,
  134,
  'Ekonomiczny parking z szybkim transferem na lotnisko. Ogrodzony teren z monitoringiem.',
  'Budget-friendly parking with fast airport transfer. Fenced area with CCTV monitoring.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/parking-security-N3X3nWrgSeE6KHrmcgvnvw.webp'
),
(
  'Parking Lotnisko Premium',
  'KTW',
  0.8,
  3,
  35.00,
  4.9,
  567,
  ARRAY['transfer', 'cctv', 'fenced', 'lit', 'covered'],
  80,
  23,
  'Parking premium najbliżej terminala. Częściowo zadaszony, z ekspresowym transferem w 3 minuty.',
  'Premium parking closest to the terminal. Partially covered, with express 3-minute shuttle.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/katowice-airport-Tq5ZDWbqmxq7jZ65bcj9DR.webp'
),
(
  'EcoPark Pyrzowice',
  'KTW',
  3.1,
  10,
  19.00,
  4.3,
  89,
  ARRAY['transfer', 'cctv'],
  300,
  245,
  'Najtańszy parking w okolicy. Duży teren, transfer busem co 20 minut.',
  'The cheapest parking in the area. Large lot, shuttle bus every 20 minutes.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/parking-transfer-TSzuMLwLUnR6cTvf8GmR7d.webp'
),
(
  'Balice Park & Fly',
  'KRK',
  1.5,
  5,
  32.00,
  4.7,
  456,
  ARRAY['transfer', 'cctv', 'fenced', 'lit'],
  180,
  62,
  'Popularny parking przy lotnisku Kraków-Balice. Ogrodzony, oświetlony, z szybkim transferem.',
  'Popular parking near Kraków-Balice airport. Fenced, well-lit, with fast shuttle service.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/krakow-airport-KfCL3WzY4A4iBLbNHWTwgj.webp'
),
(
  'KrakPark Express',
  'KRK',
  2.0,
  7,
  27.00,
  4.5,
  312,
  ARRAY['transfer', 'cctv', 'fenced'],
  220,
  156,
  'Dobra cena i szybki dojazd do terminala. Monitoring 24/7, ogrodzony teren.',
  'Good price and quick access to the terminal. 24/7 CCTV, fenced area.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/parking-transfer-TSzuMLwLUnR6cTvf8GmR7d.webp'
),
(
  'Airport Parking Kraków VIP',
  'KRK',
  0.5,
  2,
  45.00,
  4.9,
  234,
  ARRAY['transfer', 'cctv', 'fenced', 'lit', 'covered', 'valet'],
  50,
  8,
  'Parking VIP z usługą valet. Zadaszony, tuż przy terminalu. Najwyższy standard obsługi.',
  'VIP parking with valet service. Covered, right next to the terminal. Highest service standard.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/katowice-airport-Tq5ZDWbqmxq7jZ65bcj9DR.webp'
),
(
  'BudgetPark Balice',
  'KRK',
  3.5,
  12,
  18.00,
  4.2,
  145,
  ARRAY['transfer', 'cctv'],
  350,
  289,
  'Najtańsza opcja przy Kraków-Balice. Duży parking z regularnym transferem.',
  'Cheapest option near Kraków-Balice. Large parking lot with regular shuttle service.',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/parking-security-N3X3nWrgSeE6KHrmcgvnvw.webp'
);

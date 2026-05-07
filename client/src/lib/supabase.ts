import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ehoyeqclzhdystfjrwfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVob3llcWNsemhkeXN0Zmpyd2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNjkxNjEsImV4cCI6MjA5Mzc0NTE2MX0.Zn7QxXmR6jyX6teDqVwLGZ6SB8qRU_z6XRQK2wAQSRU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface ParkingLot {
  id: string;
  name: string;
  airport_code: string;
  distance_km: number;
  transfer_time_min: number;
  price_per_day: number;
  rating: number;
  reviews_count: number;
  features: string[];
  total_spots: number;
  available_spots: number;
  description_pl: string;
  description_en: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  parking_lot_id: string;
  arrival_date: string;
  departure_date: string;
  full_name: string;
  phone: string;
  car_plate: string;
  flight_number?: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  parking_lot?: ParkingLot;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
}

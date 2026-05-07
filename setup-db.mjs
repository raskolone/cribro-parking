import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://ehoyeqclzhdystfjrwfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVob3llcWNsemhkeXN0Zmpyd2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNjkxNjEsImV4cCI6MjA5Mzc0NTE2MX0.Zn7QxXmR6jyX6teDqVwLGZ6SB8qRU_z6XRQK2wAQSRU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection by trying to read parking_lots
async function testConnection() {
  console.log('Testing Supabase connection...');
  const { data, error } = await supabase.from('parking_lots').select('count');
  
  if (error) {
    console.log('Table parking_lots does not exist yet or error:', error.message);
    console.log('\n⚠️  You need to run the SQL in supabase-setup.sql manually in the Supabase SQL Editor.');
    console.log('   Go to: https://supabase.com/dashboard/project/ehoyeqclzhdystfjrwfc/sql/new');
    console.log('   Paste the contents of supabase-setup.sql and click "Run"');
  } else {
    console.log('✅ Connection successful! parking_lots table exists.');
    console.log('   Records found:', data);
  }
}

testConnection();

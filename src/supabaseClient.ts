import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shednbmnvihamngbcrou.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZWRuYm1udmloYW1uZ2Jjcm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NzI2OTksImV4cCI6MjA2NzI0ODY5OX0.1tcRgBedCQClOmD5KJuaeFA4Q9uLzxcaDgwk7mOxgew';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
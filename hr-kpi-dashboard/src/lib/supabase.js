import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get/set user ID
export const getUserId = () => {
  let userId = localStorage.getItem('hr_dashboard_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('hr_dashboard_user_id', userId);
  }
  return userId;
};

// Set user context for RLS
export const setUserContext = async (userId) => {
  await supabase.rpc('set_config', {
    setting: 'app.user_id',
    value: userId
  });
};

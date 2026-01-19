import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.https://gljanuiwwgqzrirtgnmn.supabase.co;
const supabaseAnonKey = import.meta.env.sb_publishable_eaScgsBqe_-3rsFj6g0UTw_Nf-Tjpn4;

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

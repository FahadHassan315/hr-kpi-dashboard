import { supabase, getUserId } from './supabase';

// Initialize user context
export const initializeUserContext = async () => {
  const userId = getUserId();
  return userId;
};

// Save uploaded file metadata
// Save calculated KPI
export const saveCalculatedKPI = async (kpiName, kpiValue, metadata = {}) => {
  const userId = getUserId();
  
  console.log('💾 SAVING KPI:', {
    userId,
    kpiName,
    kpiValue,
    metadata,
    hasMetadata: Object.keys(metadata || {}).length > 0
  });
  
  const { data, error } = await supabase
    .from('calculated_kpis')
    .upsert({
      user_id: userId,
      kpi_name: kpiName,
      kpi_value: kpiValue,
      metadata: metadata,
      calculated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,kpi_name'
    });

  if (error) {
    console.error('❌ Error saving KPI:', error);
    return null;
  }
  
  console.log('✅ KPI saved successfully:', data);
  return data;
};

// Get all calculated KPIs for user
export const getCalculatedKPIs = async () => {
  const userId = getUserId();
  
  console.log('📥 FETCHING KPIs for user:', userId);
  
  const { data, error } = await supabase
    .from('calculated_kpis')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('❌ Error fetching KPIs:', error);
    return [];
  }
  
  console.log('📦 FETCHED KPIs:', data);
  console.log('📦 Number of KPIs found:', data?.length || 0);
  
  return data || [];
};

// Save calculated KPI
export const saveCalculatedKPI = async (kpiName, kpiValue, metadata = {}) => {
  const userId = getUserId();
  
  const { data, error } = await supabase
    .from('calculated_kpis')
    .upsert({
      user_id: userId,
      kpi_name: kpiName,
      kpi_value: kpiValue,
      metadata: metadata,
      calculated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,kpi_name'
    });

  if (error) {
    console.error('Error saving KPI:', error);
    return null;
  }
  return data;
};

// Get all calculated KPIs for user
export const getCalculatedKPIs = async () => {
  const userId = getUserId();
  
  const { data, error } = await supabase
    .from('calculated_kpis')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching KPIs:', error);
    return [];
  }
  return data || [];
};

// Save date range
export const saveDateRange = async (rangeType, startDate, endDate) => {
  const userId = getUserId();
  
  const { data, error } = await supabase
    .from('date_ranges')
    .upsert({
      user_id: userId,
      range_type: rangeType,
      start_date: startDate,
      end_date: endDate,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,range_type'
    });

  if (error) {
    console.error('Error saving date range:', error);
    return null;
  }
  return data;
};

// Get date ranges for user
export const getDateRanges = async () => {
  const userId = getUserId();
  
  const { data, error } = await supabase
    .from('date_ranges')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching date ranges:', error);
    return [];
  }
  return data || [];
};

// Save EDM chart data
export const saveEDMChartData = async (companyData, typeData) => {
  const userId = getUserId();
  
  const { data, error } = await supabase
    .from('edm_chart_data')
    .upsert({
      user_id: userId,
      company_data: companyData,
      type_data: typeData,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Error saving chart data:', error);
    return null;
  }
  return data;
};

// Get EDM chart data for user
export const getEDMChartData = async () => {
  const userId = getUserId();
  
  const { data, error } = await supabase
    .from('edm_chart_data')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching chart data:', error);
    return null;
  }
  return data;
};

// Clear all user data
export const clearAllUserData = async () => {
  const userId = getUserId();
  
  await Promise.all([
    supabase.from('uploaded_files').delete().eq('user_id', userId),
    supabase.from('calculated_kpis').delete().eq('user_id', userId),
    supabase.from('date_ranges').delete().eq('user_id', userId),
    supabase.from('edm_chart_data').delete().eq('user_id', userId)
  ]);
};

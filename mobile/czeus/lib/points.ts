import { supabase } from './supabaseClient';

// Types for Points Management
export interface CustomerPoint {
  id: number;
  profile_id: number;
  points: number;
  created_at: string;
  updated_at: string | null;
  // Profile data joined from profiles table
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
}

export interface CustomerPointsFormData {
  points: number;
}

// Initialize customer points for all customers who don't have entries yet
export async function initializeCustomerPoints(): Promise<void> {
  try {
    // Get all profiles with role 'customer'
    const { data: customers, error: customersError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'customer')
      .is('deleted_at', null);

    if (customersError) {
      throw customersError;
    }

    if (!customers || customers.length === 0) {
      console.log('No customers found to initialize points for');
      return;
    }

    // Get existing customer_points to avoid duplicates
    const { data: existingPoints, error: pointsError } = await supabase
      .from('customer_points')
      .select('profile_id')
      .is('deleted_at', null);

    if (pointsError) {
      throw pointsError;
    }

    const existingProfileIds = new Set(existingPoints?.map(p => p.profile_id) || []);

    // Find customers that don't have points entries
    const customersWithoutPoints = customers.filter(
      customer => !existingProfileIds.has(customer.id)
    );

    if (customersWithoutPoints.length === 0) {
      console.log('All customers already have points entries');
      return;
    }

    // Insert default points (0) for customers without entries
    const pointsToInsert = customersWithoutPoints.map(customer => ({
      profile_id: customer.id,
      points: 0,
    }));

    const { error: insertError } = await supabase
      .from('customer_points')
      .insert(pointsToInsert);

    if (insertError) {
      throw insertError;
    }

    console.log(`Initialized points for ${customersWithoutPoints.length} customers`);
  } catch (error) {
    console.error('Error initializing customer points:', error);
    throw error;
  }
}

// Get all customer points with customer information
export async function getCustomerPoints(): Promise<CustomerPoint[]> {
  try {
    // First initialize any missing customer points
    await initializeCustomerPoints();

    // Fetch customer points with joined profile data
    const { data, error } = await supabase
      .from('customer_points')
      .select(`
        id,
        profile_id,
        points,
        created_at,
        updated_at,
        profiles!customer_points_profile_id_fkey (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .is('deleted_at', null)
      .eq('profiles.role', 'customer')
      .is('profiles.deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    // Transform the data to include customer information
    return data.map((item: any) => ({
      id: item.id,
      profile_id: item.profile_id,
      points: Number(item.points),
      created_at: item.created_at,
      updated_at: item.updated_at,
      customer_name: `${item.profiles.first_name} ${item.profiles.last_name}`.trim(),
      customer_email: item.profiles.email,
      customer_phone: item.profiles.phone,
    }));
  } catch (error) {
    console.error('Error fetching customer points:', error);
    throw error;
  }
}

// Update customer points
export async function updateCustomerPoints(
  id: number,
  pointsData: CustomerPointsFormData
): Promise<CustomerPoint> {
  try {
    const { data, error } = await supabase
      .from('customer_points')
      .update({
        points: pointsData.points,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(`
        id,
        profile_id,
        points,
        created_at,
        updated_at,
        profiles!customer_points_profile_id_fkey (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Customer points not found');
    }

    return {
      id: data.id,
      profile_id: data.profile_id,
      points: Number(data.points),
      created_at: data.created_at,
      updated_at: data.updated_at,
      customer_name: `${data.profiles.first_name} ${data.profiles.last_name}`.trim(),
      customer_email: data.profiles.email,
      customer_phone: data.profiles.phone,
    };
  } catch (error) {
    console.error('Error updating customer points:', error);
    throw error;
  }
}

// Get customer points by profile ID (useful for individual customer lookup)
export async function getCustomerPointsByProfileId(profileId: number): Promise<CustomerPoint | null> {
  try {
    const { data, error } = await supabase
      .from('customer_points')
      .select(`
        id,
        profile_id,
        points,
        created_at,
        updated_at,
        profiles!customer_points_profile_id_fkey (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('profile_id', profileId)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      profile_id: data.profile_id,
      points: Number(data.points),
      created_at: data.created_at,
      updated_at: data.updated_at,
      customer_name: `${data.profiles.first_name} ${data.profiles.last_name}`.trim(),
      customer_email: data.profiles.email,
      customer_phone: data.profiles.phone,
    };
  } catch (error) {
    console.error('Error fetching customer points by profile ID:', error);
    throw error;
  }
}
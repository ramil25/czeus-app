import { supabase } from './supabaseClient';

// Database schema type to match Supabase vouchers table
export interface Voucher {
  id: number;
  created_at: string;
  amount: number;
  code: string;
  is_used: boolean;
}

// Form type for creating/updating vouchers
export interface CreateVoucherInput {
  amount: number;
  code: string;
  is_used?: boolean;
}

export interface UpdateVoucherInput {
  amount?: number;
  code?: string;
  is_used?: boolean;
}

// Sample data for fallback when database is not available
const sampleVouchers: Voucher[] = [
  {
    id: 1,
    created_at: new Date().toISOString(),
    amount: 1000,
    code: 'COFFEE50',
    is_used: false,
  },
  {
    id: 2,
    created_at: new Date().toISOString(),
    amount: 2000,
    code: 'WELCOME20',
    is_used: false,
  },
  {
    id: 3,
    created_at: new Date().toISOString(),
    amount: 500,
    code: 'BONUS10',
    is_used: true,
  },
  {
    id: 4,
    created_at: new Date().toISOString(),
    amount: 1500,
    code: 'SPECIAL30',
    is_used: false,
  },
  {
    id: 5,
    created_at: new Date().toISOString(),
    amount: 3000,
    code: 'MEGA100',
    is_used: true,
  },
];

const localVouchersStore = [...sampleVouchers];
let nextId = 6;

// Check if we're in demo mode (when Supabase is not accessible)
async function isDemoMode(): Promise<boolean> {
  try {
    const { error } = await supabase.from('vouchers').select('id').limit(1);
    return !!error;
  } catch (error) {
    console.log('Demo mode detected - using local voucher data:', error);
    return true;
  }
}

// Get all vouchers
export async function fetchVouchers(): Promise<Voucher[]> {
  if (await isDemoMode()) {
    console.log('Demo mode: returning sample vouchers');
    return localVouchersStore;
  }

  try {
    const { data, error } = await supabase
      .from('vouchers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch vouchers: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    throw error;
  }
}

// Create a new voucher
export async function createVoucher(input: CreateVoucherInput): Promise<Voucher> {
  if (await isDemoMode()) {
    console.log('Demo mode: creating voucher locally');
    const newVoucher: Voucher = {
      id: nextId++,
      created_at: new Date().toISOString(),
      amount: input.amount,
      code: input.code,
      is_used: input.is_used || false,
    };
    localVouchersStore.unshift(newVoucher);
    return newVoucher;
  }

  try {
    const { data, error } = await supabase
      .from('vouchers')
      .insert({
        amount: input.amount,
        code: input.code,
        is_used: input.is_used || false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create voucher: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating voucher:', error);
    throw error;
  }
}

// Update an existing voucher
export async function updateVoucher(id: number, input: UpdateVoucherInput): Promise<Voucher> {
  if (await isDemoMode()) {
    console.log('Demo mode: updating voucher locally');
    const index = localVouchersStore.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Voucher not found');
    }
    
    localVouchersStore[index] = {
      ...localVouchersStore[index],
      ...input,
    };
    return localVouchersStore[index];
  }

  try {
    const { data, error } = await supabase
      .from('vouchers')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update voucher: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error updating voucher:', error);
    throw error;
  }
}

// Delete a voucher (hard delete since the table doesn't have soft delete)
export async function deleteVoucher(id: number): Promise<void> {
  if (await isDemoMode()) {
    console.log('Demo mode: deleting voucher locally');
    const index = localVouchersStore.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Voucher not found');
    }
    localVouchersStore.splice(index, 1);
    return;
  }

  try {
    const { error } = await supabase
      .from('vouchers')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete voucher: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting voucher:', error);
    throw error;
  }
}
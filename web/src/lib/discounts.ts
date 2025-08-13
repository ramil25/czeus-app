import { supabase } from './supabaseClient';

export type DiscountType = 'percentage' | 'actual';

export interface Discount {
  id: number;
  discount_name: string;
  discount_type: DiscountType;
  discount_value: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface CreateDiscountInput {
  discount_name: string;
  discount_type: DiscountType;
  discount_value: number;
}

export interface UpdateDiscountInput {
  discount_name?: string;
  discount_type?: DiscountType;
  discount_value?: number;
}

// Fetch all active discounts (not soft deleted)
export async function fetchDiscounts(): Promise<Discount[]> {
  const { data, error } = await supabase
    .from('pos_discounts')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch discounts: ${error.message}`);
  }

  return data || [];
}

// Create a new discount
export async function createDiscount(input: CreateDiscountInput): Promise<Discount> {
  const { data, error } = await supabase
    .from('pos_discounts')
    .insert({
      discount_name: input.discount_name,
      discount_type: input.discount_type,
      discount_value: input.discount_value,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create discount: ${error.message}`);
  }

  return data;
}

// Update an existing discount
export async function updateDiscount(
  id: number,
  input: UpdateDiscountInput
): Promise<Discount> {
  const { data, error } = await supabase
    .from('pos_discounts')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .is('deleted_at', null)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update discount: ${error.message}`);
  }

  return data;
}

// Soft delete a discount
export async function deleteDiscount(id: number): Promise<void> {
  const { error } = await supabase
    .from('pos_discounts')
    .update({
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .is('deleted_at', null);

  if (error) {
    throw new Error(`Failed to delete discount: ${error.message}`);
  }
}
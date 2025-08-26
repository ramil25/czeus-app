import { supabase } from './supabaseClient';

// Discount type enum matching database schema
export type DiscountType = 'percentage' | 'actual';

// Database schema type to match Supabase table
export interface PosDiscount {
  id: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  discount_name: string;
  discount_type: DiscountType;
  discount_value: number;
}

// Frontend type that matches mobile component expectations
export interface Discount {
  id: number;
  name: string;
  type: DiscountType;
  value: number;
  created_at: string;
  updated_at?: string;
}

// Form type for creating/updating discounts
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

// Convert database record to frontend type
function posDiscountToDiscount(posDiscount: PosDiscount): Discount {
  return {
    id: posDiscount.id,
    name: posDiscount.discount_name,
    type: posDiscount.discount_type,
    value: posDiscount.discount_value,
    created_at: posDiscount.created_at,
    updated_at: posDiscount.updated_at,
  };
}

// Get all non-deleted discounts
export async function fetchDiscounts(): Promise<Discount[]> {
  try {
    const { data, error } = await supabase
      .from('pos_discounts')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch discounts: ${error.message}`);
    }

    return (data || []).map(posDiscountToDiscount);
  } catch (error) {
    console.error('Error fetching discounts:', error);
    throw error;
  }
}

// Create a new discount
export async function createDiscount(input: CreateDiscountInput): Promise<Discount> {
  try {
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

    return posDiscountToDiscount(data);
  } catch (error) {
    console.error('Error creating discount:', error);
    throw error;
  }
}

// Update an existing discount
export async function updateDiscount(
  id: number,
  input: UpdateDiscountInput
): Promise<Discount> {
  try {
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

    return posDiscountToDiscount(data);
  } catch (error) {
    console.error('Error updating discount:', error);
    throw error;
  }
}

// Soft delete a discount
export async function deleteDiscount(id: number): Promise<void> {
  try {
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
  } catch (error) {
    console.error('Error deleting discount:', error);
    throw error;
  }
}

// Helper function to format discount value for display
export function formatDiscountValue(discount: Discount): string {
  if (discount.type === 'percentage') {
    return `${discount.value}%`;
  } else {
    return `$${discount.value.toFixed(2)}`;
  }
}

// Helper function to get discount type display name
export function getDiscountTypeDisplayName(type: DiscountType): string {
  switch (type) {
    case 'percentage':
      return 'Percentage';
    case 'actual':
      return 'Actual Value';
    default:
      return type;
  }
}
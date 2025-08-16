import { supabase } from './supabaseClient';

// Database schema type to match Supabase table
export interface Product {
  id: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  product_name: string;
  category_id: number;
  size_id: number;
  price: number;
  status: 'available' | 'not available';
}

// Frontend type that matches existing component expectations
export interface ProductDisplay {
  id: number;
  name: string;
  category: string;
  size: string;
  price: number;
  status: 'Available' | 'Not Available';
  categoryId: number;
  sizeId: number;
  createdAt: string;
  updatedAt?: string;
}

// Form type for creating/updating products
export interface CreateProductInput {
  product_name: string;
  category_id: number;
  size_id: number;
  price: number;
  status: 'available' | 'not available';
}

export interface UpdateProductInput {
  product_name?: string;
  category_id?: number;
  size_id?: number;
  price?: number;
  status?: 'available' | 'not available';
}

// Extended product type with category and size details for frontend display
export interface ProductWithDetails extends Product {
  pos_categories?: {
    id: number;
    category_name: string;
    category_description: string;
  };
  pos_sizes?: {
    id: number;
    size_name: string;
    category_id: number;
  };
}

// Convert database record to frontend type
function productToProductDisplay(productWithDetails: ProductWithDetails): ProductDisplay {
  return {
    id: productWithDetails.id,
    name: productWithDetails.product_name,
    category: productWithDetails.pos_categories?.category_name || 'Unknown',
    size: productWithDetails.pos_sizes?.size_name || 'Unknown',
    price: productWithDetails.price,
    status: productWithDetails.status === 'available' ? 'Available' : 'Not Available',
    categoryId: productWithDetails.category_id,
    sizeId: productWithDetails.size_id,
    createdAt: productWithDetails.created_at,
    updatedAt: productWithDetails.updated_at,
  };
}

// Sample data for fallback when database is not available
const sampleProducts: ProductWithDetails[] = [
  {
    id: 1,
    product_name: 'Cappuccino',
    category_id: 1,
    size_id: 1,
    price: 120,
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 1, category_name: 'Coffee', category_description: 'All coffee-based drinks' },
    pos_sizes: { id: 1, size_name: 'Small', category_id: 1 },
  },
  {
    id: 2,
    product_name: 'Latte',
    category_id: 1,
    size_id: 2,
    price: 130,
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 1, category_name: 'Coffee', category_description: 'All coffee-based drinks' },
    pos_sizes: { id: 2, size_name: 'Medium', category_id: 1 },
  },
  {
    id: 3,
    product_name: 'Green Tea',
    category_id: 2,
    size_id: 5,
    price: 110,
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 2, category_name: 'Tea', category_description: 'Hot and cold teas' },
    pos_sizes: { id: 5, size_name: 'Large', category_id: 2 },
  },
  {
    id: 4,
    product_name: 'Blueberry Muffin',
    category_id: 3,
    size_id: 6,
    price: 70,
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 3, category_name: 'Pastries', category_description: 'Freshly baked pastries' },
    pos_sizes: { id: 6, size_name: 'Slice', category_id: 3 },
  },
  {
    id: 5,
    product_name: 'Ham Sandwich',
    category_id: 4,
    size_id: 9,
    price: 180,
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 4, category_name: 'Sandwiches', category_description: 'Various sandwiches' },
    pos_sizes: { id: 9, size_name: 'Double', category_id: 4 },
  },
  {
    id: 6,
    product_name: 'Caesar Salad',
    category_id: 5,
    size_id: 10,
    price: 150,
    status: 'not available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pos_categories: { id: 5, category_name: 'Salads', category_description: 'Healthy salads' },
    pos_sizes: { id: 10, size_name: 'Bowl', category_id: 5 },
  },
];

const localProductsStore = [...sampleProducts];
let nextId = 7;

// Check if we're in demo mode (when Supabase is not accessible)
async function isDemoMode(): Promise<boolean> {
  try {
    // Try a simple health check
    const { error } = await supabase.from('products').select('id').limit(1);
    return !!error;
  } catch {
    return true;
  }
}

// Get all non-deleted products with category and size information
export async function fetchProducts(): Promise<ProductDisplay[]> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      console.log('Using demo mode - Supabase not accessible');
      return localProductsStore
        .filter(product => !product.deleted_at)
        .map(productToProductDisplay);
    }

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        pos_categories (
          id,
          category_name,
          category_description
        ),
        pos_sizes (
          id,
          size_name,
          category_id
        )
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return (data || []).map(productToProductDisplay);
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    return localProductsStore
      .filter(product => !product.deleted_at)
      .map(productToProductDisplay);
  }
}

// Create a new product
export async function createProduct(input: CreateProductInput): Promise<ProductDisplay> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      // Find the category and size for demo display
      const categoryMap = {
        1: { id: 1, category_name: 'Coffee', category_description: 'All coffee-based drinks' },
        2: { id: 2, category_name: 'Tea', category_description: 'Hot and cold teas' },
        3: { id: 3, category_name: 'Pastries', category_description: 'Freshly baked pastries' },
        4: { id: 4, category_name: 'Sandwiches', category_description: 'Various sandwiches' },
        5: { id: 5, category_name: 'Salads', category_description: 'Healthy salads' },
      };
      
      const sizeMap = {
        1: { id: 1, size_name: 'Small', category_id: 1 },
        2: { id: 2, size_name: 'Medium', category_id: 1 },
        3: { id: 3, size_name: 'Large', category_id: 1 },
        4: { id: 4, size_name: 'Regular', category_id: 2 },
        5: { id: 5, size_name: 'Large', category_id: 2 },
        6: { id: 6, size_name: 'Slice', category_id: 3 },
        7: { id: 7, size_name: 'Whole', category_id: 3 },
        8: { id: 8, size_name: 'Single', category_id: 4 },
        9: { id: 9, size_name: 'Double', category_id: 4 },
        10: { id: 10, size_name: 'Bowl', category_id: 5 },
      };
      
      const newProduct: ProductWithDetails = {
        id: nextId++,
        product_name: input.product_name,
        category_id: input.category_id,
        size_id: input.size_id,
        price: input.price,
        status: input.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        pos_categories: categoryMap[input.category_id as keyof typeof categoryMap] || 
          { id: input.category_id, category_name: 'Unknown', category_description: 'Unknown category' },
        pos_sizes: sizeMap[input.size_id as keyof typeof sizeMap] || 
          { id: input.size_id, size_name: 'Unknown', category_id: input.category_id },
      };
      localProductsStore.push(newProduct);
      return productToProductDisplay(newProduct);
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        product_name: input.product_name,
        category_id: input.category_id,
        size_id: input.size_id,
        price: input.price,
        status: input.status,
      })
      .select(`
        *,
        pos_categories (
          id,
          category_name,
          category_description
        ),
        pos_sizes (
          id,
          size_name,
          category_id
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return productToProductDisplay(data);
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    const categoryMap = {
      1: { id: 1, category_name: 'Coffee', category_description: 'All coffee-based drinks' },
      2: { id: 2, category_name: 'Tea', category_description: 'Hot and cold teas' },
      3: { id: 3, category_name: 'Pastries', category_description: 'Freshly baked pastries' },
      4: { id: 4, category_name: 'Sandwiches', category_description: 'Various sandwiches' },
      5: { id: 5, category_name: 'Salads', category_description: 'Healthy salads' },
    };
    
    const sizeMap = {
      1: { id: 1, size_name: 'Small', category_id: 1 },
      2: { id: 2, size_name: 'Medium', category_id: 1 },
      3: { id: 3, size_name: 'Large', category_id: 1 },
      4: { id: 4, size_name: 'Regular', category_id: 2 },
      5: { id: 5, size_name: 'Large', category_id: 2 },
      6: { id: 6, size_name: 'Slice', category_id: 3 },
      7: { id: 7, size_name: 'Whole', category_id: 3 },
      8: { id: 8, size_name: 'Single', category_id: 4 },
      9: { id: 9, size_name: 'Double', category_id: 4 },
      10: { id: 10, size_name: 'Bowl', category_id: 5 },
    };
    
    const newProduct: ProductWithDetails = {
      id: nextId++,
      product_name: input.product_name,
      category_id: input.category_id,
      size_id: input.size_id,
      price: input.price,
      status: input.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      pos_categories: categoryMap[input.category_id as keyof typeof categoryMap] || 
        { id: input.category_id, category_name: 'Unknown', category_description: 'Unknown category' },
      pos_sizes: sizeMap[input.size_id as keyof typeof sizeMap] || 
        { id: input.size_id, size_name: 'Unknown', category_id: input.category_id },
    };
    localProductsStore.push(newProduct);
    return productToProductDisplay(newProduct);
  }
}

// Update an existing product
export async function updateProduct(
  id: number,
  input: UpdateProductInput
): Promise<ProductDisplay> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      const index = localProductsStore.findIndex(p => p.id === id && !p.deleted_at);
      if (index === -1) {
        throw new Error('Product not found');
      }
      
      localProductsStore[index] = {
        ...localProductsStore[index],
        product_name: input.product_name || localProductsStore[index].product_name,
        category_id: input.category_id || localProductsStore[index].category_id,
        size_id: input.size_id || localProductsStore[index].size_id,
        price: input.price !== undefined ? input.price : localProductsStore[index].price,
        status: input.status || localProductsStore[index].status,
        updated_at: new Date().toISOString(),
      };
      
      // Update category and size info if changed
      if (input.category_id || input.size_id) {
        const categoryMap = {
          1: { id: 1, category_name: 'Coffee', category_description: 'All coffee-based drinks' },
          2: { id: 2, category_name: 'Tea', category_description: 'Hot and cold teas' },
          3: { id: 3, category_name: 'Pastries', category_description: 'Freshly baked pastries' },
          4: { id: 4, category_name: 'Sandwiches', category_description: 'Various sandwiches' },
          5: { id: 5, category_name: 'Salads', category_description: 'Healthy salads' },
        };
        
        const sizeMap = {
          1: { id: 1, size_name: 'Small', category_id: 1 },
          2: { id: 2, size_name: 'Medium', category_id: 1 },
          3: { id: 3, size_name: 'Large', category_id: 1 },
          4: { id: 4, size_name: 'Regular', category_id: 2 },
          5: { id: 5, size_name: 'Large', category_id: 2 },
          6: { id: 6, size_name: 'Slice', category_id: 3 },
          7: { id: 7, size_name: 'Whole', category_id: 3 },
          8: { id: 8, size_name: 'Single', category_id: 4 },
          9: { id: 9, size_name: 'Double', category_id: 4 },
          10: { id: 10, size_name: 'Bowl', category_id: 5 },
        };
        
        if (input.category_id) {
          localProductsStore[index].pos_categories = categoryMap[input.category_id as keyof typeof categoryMap] || 
            { id: input.category_id, category_name: 'Unknown', category_description: 'Unknown category' };
        }
        
        if (input.size_id) {
          localProductsStore[index].pos_sizes = sizeMap[input.size_id as keyof typeof sizeMap] || 
            { id: input.size_id, size_name: 'Unknown', category_id: localProductsStore[index].category_id };
        }
      }
      
      return productToProductDisplay(localProductsStore[index]);
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(`
        *,
        pos_categories (
          id,
          category_name,
          category_description
        ),
        pos_sizes (
          id,
          size_name,
          category_id
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return productToProductDisplay(data);
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    const index = localProductsStore.findIndex(p => p.id === id && !p.deleted_at);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    localProductsStore[index] = {
      ...localProductsStore[index],
      product_name: input.product_name || localProductsStore[index].product_name,
      category_id: input.category_id || localProductsStore[index].category_id,
      size_id: input.size_id || localProductsStore[index].size_id,
      price: input.price !== undefined ? input.price : localProductsStore[index].price,
      status: input.status || localProductsStore[index].status,
      updated_at: new Date().toISOString(),
    };
    
    // Update category and size info if changed
    if (input.category_id || input.size_id) {
      const categoryMap = {
        1: { id: 1, category_name: 'Coffee', category_description: 'All coffee-based drinks' },
        2: { id: 2, category_name: 'Tea', category_description: 'Hot and cold teas' },
        3: { id: 3, category_name: 'Pastries', category_description: 'Freshly baked pastries' },
        4: { id: 4, category_name: 'Sandwiches', category_description: 'Various sandwiches' },
        5: { id: 5, category_name: 'Salads', category_description: 'Healthy salads' },
      };
      
      const sizeMap = {
        1: { id: 1, size_name: 'Small', category_id: 1 },
        2: { id: 2, size_name: 'Medium', category_id: 1 },
        3: { id: 3, size_name: 'Large', category_id: 1 },
        4: { id: 4, size_name: 'Regular', category_id: 2 },
        5: { id: 5, size_name: 'Large', category_id: 2 },
        6: { id: 6, size_name: 'Slice', category_id: 3 },
        7: { id: 7, size_name: 'Whole', category_id: 3 },
        8: { id: 8, size_name: 'Single', category_id: 4 },
        9: { id: 9, size_name: 'Double', category_id: 4 },
        10: { id: 10, size_name: 'Bowl', category_id: 5 },
      };
      
      if (input.category_id) {
        localProductsStore[index].pos_categories = categoryMap[input.category_id as keyof typeof categoryMap] || 
          { id: input.category_id, category_name: 'Unknown', category_description: 'Unknown category' };
      }
      
      if (input.size_id) {
        localProductsStore[index].pos_sizes = sizeMap[input.size_id as keyof typeof sizeMap] || 
          { id: input.size_id, size_name: 'Unknown', category_id: localProductsStore[index].category_id };
      }
    }
    
    return productToProductDisplay(localProductsStore[index]);
  }
}

// Soft delete a product
export async function deleteProduct(id: number): Promise<void> {
  try {
    const demoMode = await isDemoMode();
    
    if (demoMode) {
      // Use local data when database is not accessible
      const index = localProductsStore.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Product not found');
      }
      
      localProductsStore[index] = {
        ...localProductsStore[index],
        deleted_at: new Date().toISOString(),
      };
      return;
    }

    const { error } = await supabase
      .from('products')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  } catch (error) {
    // Fallback to demo mode if there's any error
    console.log('Falling back to demo mode due to error:', error);
    const index = localProductsStore.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    localProductsStore[index] = {
      ...localProductsStore[index],
      deleted_at: new Date().toISOString(),
    };
  }
}
import { supabase } from './supabaseClient';

// Database schema types to match Supabase tables
export interface DbOrder {
  id: number;
  created_at: string;
  customer_id: number;
  status: 'pending' | 'completed' | 'cancelled';
  updated_at?: string;
  deleted_at?: string;
  cancelled_at?: string;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  voucher?: number;
  discounts?: number;
}

export interface DbProductOrder {
  id: number;
  created_at: string;
  order_id: number;
  product_id: number;
  qty: number;
  price: number;
  points: number;
  updated_at?: string;
  deleted_at?: string;
}

// Frontend types
export interface Order {
  id: number;
  customerId: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  totalAmount: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  points: number;
}

export interface CreateOrderInput {
  customer_id: number;
  items: Array<{
    product_id: number;
    qty: number;
    price: number;
    points: number;
  }>;
  status?: 'pending' | 'completed' | 'cancelled';
  payment_status?: 'unpaid' | 'paid' | 'refunded';
  voucher?: number;
  discounts?: number;
}

// Create a new order with its items
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  try {
    // First, create the order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: input.customer_id,
        status: input.status || 'pending',
        payment_status: input.payment_status || 'unpaid',
        voucher: input.voucher,
        discounts: input.discounts,
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // Then, create the product_order entries
    const productOrders = input.items.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      qty: item.qty,
      price: item.price,
      points: item.points,
    }));

    const { data: productOrdersData, error: productOrdersError } = await supabase
      .from('product_order')
      .insert(productOrders)
      .select(`
        *,
        products (
          product_name
        )
      `);

    if (productOrdersError) {
      // Rollback: delete the order if product_orders failed
      await supabase.from('orders').delete().eq('id', orderData.id);
      throw new Error(`Failed to create order items: ${productOrdersError.message}`);
    }

    // Calculate total amount
    const totalAmount = input.items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Convert to frontend format
    return {
      id: orderData.id,
      customerId: orderData.customer_id,
      status: orderData.status,
      paymentStatus: orderData.payment_status,
      createdAt: orderData.created_at,
      updatedAt: orderData.updated_at,
      items: productOrdersData.map((po: any) => ({
        productId: po.product_id,
        productName: po.products?.product_name || 'Unknown',
        quantity: po.qty,
        price: po.price,
        points: po.points,
      })),
      totalAmount,
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Fetch orders for a specific customer
export async function fetchCustomerOrders(customerId: number): Promise<Order[]> {
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        product_order (
          *,
          products (
            product_name
          )
        )
      `)
      .eq('customer_id', customerId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw new Error(`Failed to fetch orders: ${ordersError.message}`);
    }

    return (ordersData || []).map((order: any) => {
      const items = (order.product_order || []).map((po: any) => ({
        productId: po.product_id,
        productName: po.products?.product_name || 'Unknown',
        quantity: po.qty,
        price: po.price,
        points: po.points,
      }));

      const totalAmount = items.reduce((sum: number, item: OrderItem) => 
        sum + (item.price * item.quantity), 0
      );

      return {
        id: order.id,
        customerId: order.customer_id,
        status: order.status,
        paymentStatus: order.payment_status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items,
        totalAmount,
      };
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }
}

// Update order status
export async function updateOrderStatus(
  orderId: number,
  status: 'pending' | 'completed' | 'cancelled',
  paymentStatus?: 'unpaid' | 'paid' | 'refunded'
): Promise<void> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (paymentStatus) {
      updateData.payment_status = paymentStatus;
    }

    if (status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

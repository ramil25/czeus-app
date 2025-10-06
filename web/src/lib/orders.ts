import { supabase } from './supabaseClient';

// Database schema types to match Supabase tables (adjusted for actual DB schema)
export interface DbOrder {
  id: number;
  created_at: string;
  customer_id: number;
  status: 'pending' | 'processing' | 'cancelled' | 'served';
  updated_at?: string;
  deleted_at?: string;
  cancelled_at?: string;
  payment_status: 'unpaid' | 'paid' | 'void';
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
  customerName: string;
  status: 'pending' | 'processing' | 'cancelled' | 'served';
  paymentStatus: 'unpaid' | 'paid' | 'void';
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  totalAmount: number;
  voucherId?: number;
  discountId?: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  points: number;
}

// Fetch all orders with customer and product information
export async function getOrders(): Promise<Order[]> {
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        profiles!orders_customer_id_fkey (
          first_name,
          last_name
        ),
        product_order!product_order_order_id_fkey (
          *,
          products (
            product_name
          )
        )
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw new Error(`Failed to fetch orders: ${ordersError.message}`);
    }

    return (ordersData || []).map((order: DbOrder & { 
      profiles?: { first_name?: string; last_name?: string }; 
      product_order?: Array<DbProductOrder & { products?: { product_name?: string } }> 
    }) => {
      const items = (order.product_order || [])
        .filter((po) => !po.deleted_at)
        .map((po) => ({
          productId: po.product_id,
          productName: po.products?.product_name || 'Unknown',
          quantity: po.qty,
          price: po.price,
          points: po.points,
        }));

      const totalAmount = items.reduce((sum: number, item: OrderItem) => 
        sum + (item.price * item.quantity), 0
      );

      const profile = order.profiles || {};
      const customerName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown Customer';

      return {
        id: order.id,
        customerId: order.customer_id,
        customerName,
        status: order.status,
        paymentStatus: order.payment_status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items,
        totalAmount,
        voucherId: order.voucher,
        discountId: order.discounts,
      };
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

// Update order status
export async function updateOrderStatus(
  orderId: number,
  status: 'pending' | 'processing' | 'cancelled' | 'served',
  paymentStatus?: 'unpaid' | 'paid' | 'void'
): Promise<void> {
  try {
    const updateData: {
      status: string;
      updated_at: string;
      payment_status?: string;
      cancelled_at?: string;
    } = {
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

// Cancel an order (soft cancel by updating status)
export async function cancelOrder(orderId: number): Promise<void> {
  try {
    await updateOrderStatus(orderId, 'cancelled');
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
}

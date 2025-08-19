import { StyleSheet, ScrollView, View, Alert, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function POSScreen() {
  const { user, signOut } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('coffee');

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (signOutError) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
              console.error('Sign out error:', signOutError);
            }
          }
        }
      ]
    );
  };

  const menuItems = {
    coffee: [
      { id: '1', name: 'Espresso', price: 2.50 },
      { id: '2', name: 'Americano', price: 3.00 },
      { id: '3', name: 'Cappuccino', price: 3.50 },
      { id: '4', name: 'Latte', price: 4.00 },
    ],
    pastries: [
      { id: '5', name: 'Croissant', price: 2.00 },
      { id: '6', name: 'Muffin', price: 2.50 },
      { id: '7', name: 'Danish', price: 3.00 },
    ],
    tea: [
      { id: '8', name: 'Green Tea', price: 2.00 },
      { id: '9', name: 'Earl Grey', price: 2.50 },
      { id: '10', name: 'Chamomile', price: 2.50 },
    ],
  };

  const addToCart = (item: { id: string; name: string; price: number }) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const checkout = () => {
    if (cart.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to cart before checkout.');
      return;
    }
    
    Alert.alert(
      'Checkout',
      `Total: $${getTotal().toFixed(2)}\n\nProcess payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Process', 
          onPress: () => {
            setCart([]);
            Alert.alert('Success', 'Payment processed successfully!');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <IconSymbol size={32} name="person.fill" color="#fff" />
            </View>
            <View style={styles.userDetails}>
              <ThemedText type="defaultSemiBold" style={styles.userName}>
                {user ? `${user.first_name} ${user.last_name}`.trim() || 'Staff' : 'Staff'}
              </ThemedText>
              <ThemedText style={styles.userEmail}>
                {user?.email}
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <IconSymbol size={24} name="arrow.right.square" color="#ef4444" />
          </TouchableOpacity>
        </View>
        <ThemedText type="title" style={styles.title}>Point of Sale</ThemedText>
        <ThemedText style={styles.subtitle}>Coffee Shop POS System</ThemedText>
      </ThemedView>

      <View style={styles.mainContent}>
        <View style={styles.leftPanel}>
          <View style={styles.categories}>
            <TouchableOpacity
              style={[styles.categoryTab, selectedCategory === 'coffee' && styles.activeCategoryTab]}
              onPress={() => setSelectedCategory('coffee')}
            >
              <IconSymbol size={20} name="cup.and.saucer.fill" color={selectedCategory === 'coffee' ? '#fff' : '#6b7280'} />
              <ThemedText style={[styles.categoryText, selectedCategory === 'coffee' && styles.activeCategoryText]}>Coffee</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryTab, selectedCategory === 'pastries' && styles.activeCategoryTab]}
              onPress={() => setSelectedCategory('pastries')}
            >
              <IconSymbol size={20} name="birthday.cake.fill" color={selectedCategory === 'pastries' ? '#fff' : '#6b7280'} />
              <ThemedText style={[styles.categoryText, selectedCategory === 'pastries' && styles.activeCategoryText]}>Pastries</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryTab, selectedCategory === 'tea' && styles.activeCategoryTab]}
              onPress={() => setSelectedCategory('tea')}
            >
              <IconSymbol size={20} name="leaf.fill" color={selectedCategory === 'tea' ? '#fff' : '#6b7280'} />
              <ThemedText style={[styles.categoryText, selectedCategory === 'tea' && styles.activeCategoryText]}>Tea</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.menuItems}>
            <View style={styles.itemGrid}>
              {menuItems[selectedCategory as keyof typeof menuItems].map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => addToCart(item)}
                >
                  <ThemedText type="defaultSemiBold" style={styles.itemName}>{item.name}</ThemedText>
                  <ThemedText style={styles.itemPrice}>${item.price.toFixed(2)}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.rightPanel}>
          <ThemedText type="subtitle" style={styles.cartTitle}>Order</ThemedText>
          
          <ScrollView style={styles.cartItems}>
            {cart.length === 0 ? (
              <View style={styles.emptyCart}>
                <IconSymbol size={48} name="cart" color="#d1d5db" />
                <ThemedText style={styles.emptyCartText}>Cart is empty</ThemedText>
              </View>
            ) : (
              cart.map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.cartItemInfo}>
                    <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                    <ThemedText style={styles.cartItemPrice}>${item.price.toFixed(2)}</ThemedText>
                  </View>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <IconSymbol size={16} name="minus" color="#6b7280" />
                    </TouchableOpacity>
                    <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <IconSymbol size={16} name="plus" color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.checkoutSection}>
            <View style={styles.totalRow}>
              <ThemedText type="subtitle">Total: ${getTotal().toFixed(2)}</ThemedText>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={checkout}>
              <ThemedText style={styles.checkoutButtonText}>Checkout</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2362c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    flex: 2,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  categories: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  activeCategoryTab: {
    backgroundColor: '#2362c7',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeCategoryText: {
    color: '#fff',
  },
  menuItems: {
    flex: 1,
    padding: 16,
  },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#2362c7',
    fontWeight: '600',
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  cartItems: {
    flex: 1,
  },
  emptyCart: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyCartText: {
    marginTop: 12,
    color: '#6b7280',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  checkoutSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  totalRow: {
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: '#2362c7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
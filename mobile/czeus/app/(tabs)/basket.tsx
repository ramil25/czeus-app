import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useBasket } from '@/contexts/BasketContext';
import { createOrder } from '@/lib/orders';

export default function BasketScreen() {
  const { user, signOut } = useAuth();
  const { basketItems, updateQuantity, removeFromBasket, removeSelectedItems, loading } = useBasket();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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

  const toggleItemSelection = (itemId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === basketItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(basketItems.map(item => item.id)));
    }
  };

  const getSelectedTotal = () => {
    return basketItems
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSelectedCount = () => {
    return selectedItems.size;
  };

  const handleCheckout = async () => {
    if (selectedItems.size === 0) {
      Alert.alert('No Items Selected', 'Please select items to checkout.');
      return;
    }

    if (!user?.profileId) {
      Alert.alert('Error', 'You must be logged in to checkout.');
      return;
    }

    const selectedBasketItems = basketItems.filter(item => selectedItems.has(item.id));

    Alert.alert(
      'Confirm Checkout',
      `Checkout ${selectedItems.size} item(s) for ₱${getSelectedTotal().toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setCheckoutLoading(true);
            try {
              // Create order in Supabase
              const orderInput = {
                customer_id: user.profileId,
                items: selectedBasketItems.map(item => ({
                  product_id: item.productId,
                  qty: item.quantity,
                  price: item.price,
                  points: item.points,
                })),
                status: 'pending' as const,
                payment_status: 'unpaid' as const,
              };

              await createOrder(orderInput);

              // Remove checked items from basket
              await removeSelectedItems(Array.from(selectedItems));
              setSelectedItems(new Set());

              Alert.alert(
                'Success',
                'Your order has been placed successfully!',
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error('Checkout error:', error);
              Alert.alert(
                'Error',
                'Failed to place order. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setCheckoutLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2362c7" />
        <ThemedText style={styles.loadingText}>Loading basket...</ThemedText>
      </View>
    );
  }

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
                {user ? `${user.first_name} ${user.last_name}`.trim() || 'Customer' : 'Customer'}
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
        <ThemedText type="title" style={styles.title}>My Basket</ThemedText>
        <ThemedText style={styles.subtitle}>
          {basketItems.length} {basketItems.length === 1 ? 'item' : 'items'} in basket
        </ThemedText>
      </ThemedView>

      {basketItems.length === 0 ? (
        <View style={styles.emptyBasket}>
          <IconSymbol size={64} name="basket" color="#d1d5db" />
          <ThemedText style={styles.emptyText}>Your basket is empty</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Add items from the Foods menu to get started
          </ThemedText>
        </View>
      ) : (
        <>
          <View style={styles.selectAllContainer}>
            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={toggleSelectAll}
            >
              <View style={[
                styles.checkbox,
                selectedItems.size === basketItems.length && styles.checkboxChecked
              ]}>
                {selectedItems.size === basketItems.length && (
                  <IconSymbol size={16} name="checkmark" color="#fff" />
                )}
              </View>
              <ThemedText style={styles.selectAllText}>
                {selectedItems.size === basketItems.length ? 'Deselect All' : 'Select All'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.basketContent}>
            {basketItems.map(item => (
              <View key={item.id} style={styles.basketItem}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => toggleItemSelection(item.id)}
                >
                  <View style={[
                    styles.checkbox,
                    selectedItems.has(item.id) && styles.checkboxChecked
                  ]}>
                    {selectedItems.has(item.id) && (
                      <IconSymbol size={16} name="checkmark" color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>

                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                    contentFit="cover"
                    placeholder="🍽️"
                  />
                )}

                <View style={styles.itemDetails}>
                  <ThemedText type="defaultSemiBold" style={styles.itemName}>
                    {item.name}
                  </ThemedText>
                  <ThemedText style={styles.itemPrice}>
                    ₱{item.price.toFixed(2)}
                  </ThemedText>
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
                  <ThemedText style={styles.itemSubtotal}>
                    Subtotal: ₱{(item.price * item.quantity).toFixed(2)}
                  </ThemedText>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    Alert.alert(
                      'Remove Item',
                      `Remove ${item.name} from basket?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Remove', style: 'destructive', onPress: () => removeFromBasket(item.id) }
                      ]
                    );
                  }}
                >
                  <IconSymbol size={20} name="trash" color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.checkoutSection}>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Selected Items:</ThemedText>
              <ThemedText style={styles.summaryValue}>{getSelectedCount()}</ThemedText>
            </View>
            <View style={styles.totalRow}>
              <ThemedText type="subtitle">Total:</ThemedText>
              <ThemedText type="subtitle" style={styles.totalAmount}>
                ₱{getSelectedTotal().toFixed(2)}
              </ThemedText>
            </View>
            <TouchableOpacity 
              style={[styles.checkoutButton, checkoutLoading && styles.checkoutButtonDisabled]}
              onPress={handleCheckout}
              disabled={checkoutLoading || selectedItems.size === 0}
            >
              {checkoutLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.checkoutButtonText}>
                  Checkout ({getSelectedCount()})
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
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
  emptyBasket: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#374151',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  selectAllContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  basketContent: {
    flex: 1,
  },
  basketItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkboxContainer: {
    marginRight: 12,
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2362c7',
    borderColor: '#2362c7',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f3f4f6',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#2362c7',
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
  itemSubtotal: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'flex-start',
  },
  checkoutSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalAmount: {
    color: '#2362c7',
  },
  checkoutButton: {
    backgroundColor: '#2362c7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

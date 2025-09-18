import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useBasket } from '@/contexts/BasketContext';
import { useAuth } from '@/contexts/AuthContext';

export default function BasketScreen() {
  const { user, signOut } = useAuth();
  const {
    items,
    removeFromBasket,
    updateQuantity,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    clearBasket,
    getSelectedItems,
    getSelectedTotalPrice,
  } = useBasket();

  const [selectAll, setSelectAll] = useState(true);

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

  const handleSelectAll = (value: boolean) => {
    setSelectAll(value);
    if (value) {
      selectAllItems();
    } else {
      deselectAllItems();
    }
  };

  const handleRemoveItem = (id: number, name: string) => {
    Alert.alert(
      'Remove Item',
      `Remove ${name} from your basket?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromBasket(id) }
      ]
    );
  };

  const handleClearBasket = () => {
    Alert.alert(
      'Clear Basket',
      'Remove all items from your basket?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearBasket }
      ]
    );
  };

  const handleCheckout = () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select items to checkout.');
      return;
    }

    const totalPrice = getSelectedTotalPrice();
    Alert.alert(
      'Checkout',
      `Proceed to checkout ${selectedItems.length} item(s) for ₱${totalPrice.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Checkout', onPress: () => Alert.alert('Success', 'Order placed successfully!') }
      ]
    );
  };

  const selectedItems = getSelectedItems();
  const selectedTotal = getSelectedTotalPrice();

  // Show empty state
  if (items.length === 0) {
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
          <ThemedText style={styles.subtitle}>Your selected items</ThemedText>
        </ThemedView>

        <View style={[styles.centered, { flex: 1 }]}>
          <IconSymbol size={64} name="bag" color="#6b7280" />
          <ThemedText style={styles.emptyTitle}>Your basket is empty</ThemedText>
          <ThemedText style={styles.emptyText}>
            Add some delicious items from our menu
          </ThemedText>
        </View>
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
        <View style={styles.titleRow}>
          <View>
            <ThemedText type="title" style={styles.title}>My Basket</ThemedText>
            <ThemedText style={styles.subtitle}>
              {items.length} item{items.length !== 1 ? 's' : ''} in basket
            </ThemedText>
          </View>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearBasket}>
            <IconSymbol size={20} name="trash" color="#ef4444" />
          </TouchableOpacity>
        </View>
      </ThemedView>

      <View style={styles.selectAllContainer}>
        <View style={styles.selectAllRow}>
          <ThemedText style={styles.selectAllText}>Select All</ThemedText>
          <Switch
            value={selectAll}
            onValueChange={handleSelectAll}
            trackColor={{ false: '#d1d5db', true: '#2362c7' }}
            thumbColor={selectAll ? '#ffffff' : '#f3f4f6'}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.itemsList}>
          {items.map(item => (
            <View key={item.id} style={styles.basketItem}>
              <View style={styles.itemRow}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleItemSelection(item.id)}
                >
                  <IconSymbol
                    size={20}
                    name={item.selected ? "checkmark.circle.fill" : "circle"}
                    color={item.selected ? "#2362c7" : "#d1d5db"}
                  />
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
                  <ThemedText style={styles.itemSize}>
                    {item.size} size
                  </ThemedText>
                  <ThemedText style={styles.itemPrice}>
                    ₱{item.price.toFixed(2)} each
                  </ThemedText>
                </View>

                <View style={styles.itemControls}>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <IconSymbol size={16} name="minus" color="#6b7280" />
                    </TouchableOpacity>
                    <ThemedText style={styles.quantityText}>
                      {item.quantity}
                    </ThemedText>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <IconSymbol size={16} name="plus" color="#6b7280" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.id, item.name)}
                  >
                    <IconSymbol size={20} name="trash" color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.itemTotal}>
                <ThemedText style={styles.itemTotalText}>
                  Subtotal: ₱{(item.price * item.quantity).toFixed(2)}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>
              Selected ({selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''})
            </ThemedText>
            <ThemedText style={styles.totalPrice}>
              ₱{selectedTotal.toFixed(2)}
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.checkoutButton,
            selectedItems.length === 0 && styles.checkoutButtonDisabled
          ]}
          onPress={handleCheckout}
          disabled={selectedItems.length === 0}
        >
          <ThemedText style={[
            styles.checkoutButtonText,
            selectedItems.length === 0 && styles.checkoutButtonTextDisabled
          ]}>
            Checkout
          </ThemedText>
        </TouchableOpacity>
      </View>
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  clearButton: {
    padding: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#374151',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  selectAllContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  selectAllRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectAllText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  itemsList: {
    padding: 20,
    gap: 16,
  },
  basketItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    padding: 4,
    marginRight: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f3f4f6',
  },
  itemDetails: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#2362c7',
    fontWeight: '600',
  },
  itemControls: {
    alignItems: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quantityButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'center',
  },
  removeButton: {
    padding: 4,
  },
  itemTotal: {
    alignItems: 'flex-end',
  },
  itemTotalText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 20,
  },
  totalSection: {
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2362c7',
  },
  checkoutButton: {
    backgroundColor: '#2362c7',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  checkoutButtonTextDisabled: {
    color: '#9ca3af',
  },
});
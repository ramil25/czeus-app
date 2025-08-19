import { StyleSheet, ScrollView, View, Alert, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export default function FoodsScreen() {
  const { user, signOut } = useAuth();
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

  const foodItems: FoodItem[] = [
    // Coffee
    { id: '1', name: 'Espresso', description: 'Strong coffee shot', price: 2.50, category: 'coffee', available: true },
    { id: '2', name: 'Americano', description: 'Espresso with hot water', price: 3.00, category: 'coffee', available: true },
    { id: '3', name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 3.50, category: 'coffee', available: true },
    { id: '4', name: 'Latte', description: 'Espresso with steamed milk', price: 4.00, category: 'coffee', available: true },
    { id: '5', name: 'Mocha', description: 'Chocolate coffee delight', price: 4.50, category: 'coffee', available: false },
    
    // Pastries
    { id: '6', name: 'Croissant', description: 'Buttery French pastry', price: 2.00, category: 'pastries', available: true },
    { id: '7', name: 'Blueberry Muffin', description: 'Fresh baked with blueberries', price: 2.50, category: 'pastries', available: true },
    { id: '8', name: 'Danish', description: 'Sweet pastry with filling', price: 3.00, category: 'pastries', available: true },
    { id: '9', name: 'Scone', description: 'Traditional British biscuit', price: 2.75, category: 'pastries', available: false },
    
    // Tea
    { id: '10', name: 'Green Tea', description: 'Refreshing green tea', price: 2.00, category: 'tea', available: true },
    { id: '11', name: 'Earl Grey', description: 'Classic British tea', price: 2.50, category: 'tea', available: true },
    { id: '12', name: 'Chamomile', description: 'Calming herbal tea', price: 2.50, category: 'tea', available: true },
    { id: '13', name: 'Jasmine Tea', description: 'Fragrant jasmine tea', price: 2.75, category: 'tea', available: true },
    
    // Snacks
    { id: '14', name: 'Sandwich', description: 'Fresh deli sandwich', price: 5.50, category: 'snacks', available: true },
    { id: '15', name: 'Bagel', description: 'Fresh baked bagel', price: 2.25, category: 'snacks', available: true },
    { id: '16', name: 'Cookie', description: 'Homemade chocolate chip cookie', price: 1.50, category: 'snacks', available: true },
  ];

  const categories = [
    { id: 'coffee', name: 'Coffee', icon: 'cup.and.saucer.fill' as const, color: '#f59e0b' },
    { id: 'pastries', name: 'Pastries', icon: 'birthday.cake.fill' as const, color: '#10b981' },
    { id: 'tea', name: 'Tea', icon: 'leaf.fill' as const, color: '#8b5cf6' },
    { id: 'snacks', name: 'Snacks', icon: 'fork.knife' as const, color: '#ef4444' },
  ];

  const filteredItems = foodItems.filter(item => item.category === selectedCategory);

  const addToOrder = (item: FoodItem) => {
    if (!item.available) {
      Alert.alert('Unavailable', 'This item is currently not available.');
      return;
    }
    Alert.alert(
      'Add to Order',
      `Add ${item.name} ($${item.price.toFixed(2)}) to your order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: () => Alert.alert('Added!', `${item.name} added to order.`) }
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
        <ThemedText type="title" style={styles.title}>Our Menu</ThemedText>
        <ThemedText style={styles.subtitle}>Fresh coffee and delicious treats</ThemedText>
      </ThemedView>

      <View style={styles.categories}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                selectedCategory === category.id && styles.activeCategoryTab,
                { borderColor: category.color }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <IconSymbol 
                size={20} 
                name={category.icon} 
                color={selectedCategory === category.id ? '#fff' : category.color} 
              />
              <ThemedText 
                style={[
                  styles.categoryText, 
                  selectedCategory === category.id && styles.activeCategoryText
                ]}
              >
                {category.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.menuContent}>
        <View style={styles.itemsGrid}>
          {filteredItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.foodItem, !item.available && styles.unavailableItem]}
              onPress={() => addToOrder(item)}
            >
              <View style={styles.foodItemHeader}>
                <ThemedText type="defaultSemiBold" style={styles.foodName}>
                  {item.name}
                </ThemedText>
                <ThemedText style={styles.foodPrice}>
                  ${item.price.toFixed(2)}
                </ThemedText>
              </View>
              
              <ThemedText style={styles.foodDescription}>
                {item.description}
              </ThemedText>
              
              <View style={styles.foodFooter}>
                {item.available ? (
                  <View style={styles.availableBadge}>
                    <IconSymbol size={12} name="checkmark.circle.fill" color="#10b981" />
                    <ThemedText style={styles.availableText}>Available</ThemedText>
                  </View>
                ) : (
                  <View style={styles.unavailableBadge}>
                    <IconSymbol size={12} name="xmark.circle.fill" color="#ef4444" />
                    <ThemedText style={styles.unavailableText}>Unavailable</ThemedText>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  categories: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 16,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
  },
  activeCategoryTab: {
    backgroundColor: '#2362c7',
    borderColor: '#2362c7',
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
  menuContent: {
    flex: 1,
    padding: 20,
  },
  itemsGrid: {
    gap: 16,
  },
  foodItem: {
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
  unavailableItem: {
    opacity: 0.6,
  },
  foodItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
    flex: 1,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2362c7',
  },
  foodDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  foodFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unavailableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  unavailableText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
});
import React from 'react';
import { StyleSheet, ScrollView, View, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useBasket } from '@/contexts/BasketContext';
import { useState, useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Product } from '@/lib/products';
import { Category } from '@/lib/categories';

interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId: number;
  available: boolean;
  size: string;
  image?: string;
}

export default function FoodsScreen() {
  const { user, signOut } = useAuth();
  const { addToBasket } = useBasket();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Transform database products into FoodItem format
  const foodItems: FoodItem[] = useMemo(() => {
    return products.map(product => ({
      id: product.id,
      name: product.name,
      description: `${product.size} size`, // Using size as description since we don't have description field
      price: product.price,
      category: product.category,
      categoryId: product.categoryId,
      available: product.status === 'Available',
      size: product.size,
      image: product.image,
    }));
  }, [products]);

  // Use the first category as default if none selected
  const defaultCategoryId = categories.length > 0 ? categories[0].id : null;
  const currentCategoryId = selectedCategory || defaultCategoryId;

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

  const filteredItems = foodItems.filter(item => item.categoryId === currentCategoryId);

  const addToOrder = (item: FoodItem) => {
    if (!item.available) {
      Alert.alert('Unavailable', 'This item is currently not available.');
      return;
    }
    
    // Add to basket instead of just showing alert
    addToBasket({
      id: item.id,
      name: item.name,
      price: item.price,
      size: item.size,
      image: item.image,
    });
    
    Alert.alert('Added to Basket!', `${item.name} has been added to your basket.`);
  };

  // Show loading state
  if (productsLoading || categoriesLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2362c7" />
        <ThemedText style={styles.loadingText}>Loading menu...</ThemedText>
      </View>
    );
  }

  // Show error state
  if (productsError || categoriesError) {
    return (
      <View style={[styles.container, styles.centered]}>
        <IconSymbol size={48} name="exclamationmark.triangle" color="#ef4444" />
        <ThemedText style={styles.errorText}>
          {productsError || categoriesError}
        </ThemedText>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            // Since we can't access the hook's refresh methods here, 
            // we'll rely on the useEffect to retry on component remount
          }}
        >
          <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  // Show empty state
  if (categories.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <IconSymbol size={48} name="list.bullet" color="#6b7280" />
        <ThemedText style={styles.emptyText}>No menu categories found</ThemedText>
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
                currentCategoryId === category.id && styles.activeCategoryTab,
                { borderColor: category.color }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <IconSymbol 
                size={20} 
                name={category.icon as any} 
                color={currentCategoryId === category.id ? '#fff' : category.color} 
              />
              <ThemedText 
                style={[
                  styles.categoryText, 
                  currentCategoryId === category.id && styles.activeCategoryText
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
            <View
              key={item.id}
              style={[styles.foodItem, !item.available && styles.unavailableItem]}
            >
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.foodImage}
                  contentFit="cover"
                  placeholder="🍽️"
                />
              )}
              
              <View style={styles.foodItemHeader}>
                <ThemedText type="defaultSemiBold" style={styles.foodName}>
                  {item.name}
                </ThemedText>
                <ThemedText style={styles.foodPrice}>
                  ₱{item.price.toFixed(2)}
                </ThemedText>
              </View>
              
              <ThemedText style={styles.foodDescription}>
                {item.description}
              </ThemedText>
              
              <View style={styles.foodFooter}>
                <View style={styles.statusContainer}>
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
                
                <TouchableOpacity
                  style={[
                    styles.addToOrderButton,
                    !item.available && styles.addToOrderButtonDisabled
                  ]}
                  onPress={() => addToOrder(item)}
                  disabled={!item.available}
                >
                  <IconSymbol 
                    size={16} 
                    name={item.available ? "plus.circle.fill" : "xmark.circle.fill"} 
                    color={item.available ? "#fff" : "#9ca3af"} 
                  />
                  <ThemedText style={[
                    styles.addToOrderButtonText,
                    !item.available && styles.addToOrderButtonTextDisabled
                  ]}>
                    {item.available ? "Add to Order" : "Unavailable"}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
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
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2362c7',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  foodImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f3f4f6',
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
  statusContainer: {
    flex: 1,
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
  addToOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2362c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 12,
  },
  addToOrderButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  addToOrderButtonText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  addToOrderButtonTextDisabled: {
    color: '#9ca3af',
  },
});
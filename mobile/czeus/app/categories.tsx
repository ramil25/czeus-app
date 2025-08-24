import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState } from 'react';

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  backgroundColor: string;
  itemCount: number;
  description: string;
}

export default function CategoriesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for categories
  const [categories] = useState<Category[]>([
    {
      id: 1,
      name: 'Coffee',
      icon: 'cup.and.saucer.fill',
      color: '#8b5a3c',
      backgroundColor: '#8b5a3c20',
      itemCount: 12,
      description: 'Hot and cold coffee beverages',
    },
    {
      id: 2,
      name: 'Pastries',
      icon: 'birthday.cake.fill',
      color: '#f59e0b',
      backgroundColor: '#f59e0b20',
      itemCount: 8,
      description: 'Fresh baked pastries and desserts',
    },
    {
      id: 3,
      name: 'Tea',
      icon: 'leaf.fill',
      color: '#10b981',
      backgroundColor: '#10b98120',
      itemCount: 6,
      description: 'Premium tea selection',
    },
    {
      id: 4,
      name: 'Sandwiches',
      icon: 'takeoutbag.and.cup.and.straw',
      color: '#ef4444',
      backgroundColor: '#ef444420',
      itemCount: 15,
      description: 'Gourmet sandwiches and wraps',
    },
    {
      id: 5,
      name: 'Salads',
      icon: 'carrot',
      color: '#22c55e',
      backgroundColor: '#22c55e20',
      itemCount: 7,
      description: 'Fresh and healthy salads',
    },
    {
      id: 6,
      name: 'Beverages',
      icon: 'waterbottle',
      color: '#3b82f6',
      backgroundColor: '#3b82f620',
      itemCount: 10,
      description: 'Non-coffee beverages and juices',
    },
  ]);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = () => {
    Alert.alert('Add New Category', 'This will open the add category form.', [
      { text: 'OK' },
    ]);
  };

  return (
    <View style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <IconSymbol size={20} name="magnifyingglass" color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search categories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <IconSymbol
                  size={20}
                  name="xmark.circle.fill"
                  color="#6b7280"
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <ScrollView
          style={styles.categoriesList}
          showsVerticalScrollIndicator={false}
        >
          {filteredCategories.map((category) => (
            <View key={category.id} style={styles.categoryItem}>
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: category.backgroundColor },
                ]}
              >
                <IconSymbol
                  size={24}
                  name={category.icon as any}
                  color={category.color}
                />
              </View>
              <View style={styles.categoryInfo}>
                <ThemedText type="defaultSemiBold" style={styles.categoryName}>
                  {category.name}
                </ThemedText>
                <ThemedText style={styles.categoryDescription}>
                  {category.description}
                </ThemedText>
                <ThemedText style={styles.itemCount}>
                  {category.itemCount} items
                </ThemedText>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#6b7280" />
            </View>
          ))}

          {filteredCategories.length === 0 && (
            <View style={styles.emptyState}>
              <IconSymbol size={48} name="square.grid.2x2" color="#d1d5db" />
              <ThemedText style={styles.emptyText}>
                {searchQuery
                  ? 'No categories found'
                  : 'No categories available'}
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Add your first category to get started'}
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </ThemedView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddCategory}
        activeOpacity={0.8}
      >
        <IconSymbol size={24} name="plus" color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  categoriesList: {
    flex: 1,
  },
  categoryItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

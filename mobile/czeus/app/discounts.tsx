import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { useState } from 'react';

interface Discount {
  id: number;
  name: string;
  type: 'percentage' | 'fixed' | 'bogo';
  value: number;
  description: string;
  isActive: boolean;
  validUntil: string;
  minOrder?: number;
}

export default function DiscountsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for discounts
  const [discounts] = useState<Discount[]>([
    {
      id: 1,
      name: 'Welcome Discount',
      type: 'percentage',
      value: 10,
      description: 'First time customer discount',
      isActive: true,
      validUntil: '2024-12-31',
      minOrder: 20
    },
    {
      id: 2,
      name: 'Happy Hour',
      type: 'percentage',
      value: 25,
      description: '25% off all coffee from 2-4 PM',
      isActive: true,
      validUntil: '2024-12-31'
    },
    {
      id: 3,
      name: 'Student Special',
      type: 'fixed',
      value: 5,
      description: '$5 off with valid student ID',
      isActive: true,
      validUntil: '2024-12-31',
      minOrder: 15
    },
    {
      id: 4,
      name: 'Buy One Get One',
      type: 'bogo',
      value: 50,
      description: 'Buy one pastry, get second 50% off',
      isActive: true,
      validUntil: '2024-10-31'
    },
    {
      id: 5,
      name: 'Loyalty Reward',
      type: 'percentage',
      value: 15,
      description: 'Reward for loyal customers',
      isActive: false,
      validUntil: '2024-09-30',
      minOrder: 30
    },
    {
      id: 6,
      name: 'Weekend Special',
      type: 'fixed',
      value: 3,
      description: '$3 off weekend orders',
      isActive: true,
      validUntil: '2024-12-31',
      minOrder: 25
    }
  ]);

  const filteredDiscounts = discounts.filter(discount =>
    discount.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discount.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDiscountDisplayValue = (discount: Discount) => {
    switch (discount.type) {
      case 'percentage':
        return `${discount.value}%`;
      case 'fixed':
        return `$${discount.value}`;
      case 'bogo':
        return `${discount.value}% off`;
      default:
        return `${discount.value}`;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return '#3b82f6';
      case 'fixed': return '#10b981';
      case 'bogo': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getTypeBackground = (type: string) => {
    switch (type) {
      case 'percentage': return '#3b82f620';
      case 'fixed': return '#10b98120';
      case 'bogo': return '#f59e0b20';
      default: return '#6b728020';
    }
  };

  const handleAddDiscount = () => {
    Alert.alert(
      'Add New Discount',
      'This will open the add discount form.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol size={24} name="chevron.left" color="#374151" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>Discounts</ThemedText>
          <View style={styles.placeholder} />
        </View>
      </ThemedView>

      <ThemedView style={styles.content}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <IconSymbol size={20} name="magnifyingglass" color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search discounts..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <IconSymbol size={20} name="xmark.circle.fill" color="#6b7280" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <ScrollView style={styles.discountsList} showsVerticalScrollIndicator={false}>
          {filteredDiscounts.map((discount) => (
            <View key={discount.id} style={styles.discountItem}>
              <View style={styles.discountInfo}>
                <View style={styles.discountHeader}>
                  <View style={styles.discountTitleRow}>
                    <ThemedText type="defaultSemiBold" style={styles.discountName}>
                      {discount.name}
                    </ThemedText>
                    <View style={styles.badges}>
                      <View style={[styles.typeBadge, { backgroundColor: getTypeBackground(discount.type) }]}>
                        <ThemedText style={[styles.typeText, { color: getTypeColor(discount.type) }]}>
                          {discount.type.toUpperCase()}
                        </ThemedText>
                      </View>
                      {discount.isActive ? (
                        <View style={styles.activeBadge}>
                          <ThemedText style={styles.activeText}>ACTIVE</ThemedText>
                        </View>
                      ) : (
                        <View style={styles.inactiveBadge}>
                          <ThemedText style={styles.inactiveText}>INACTIVE</ThemedText>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.valueContainer}>
                    <ThemedText style={styles.discountValue}>
                      {getDiscountDisplayValue(discount)} OFF
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.discountDescription}>
                  {discount.description}
                </ThemedText>
                <View style={styles.discountDetails}>
                  <View style={styles.detailItem}>
                    <IconSymbol size={14} name="calendar" color="#6b7280" />
                    <ThemedText style={styles.detailText}>
                      Valid until {discount.validUntil}
                    </ThemedText>
                  </View>
                  {discount.minOrder && (
                    <View style={styles.detailItem}>
                      <IconSymbol size={14} name="dollarsign.circle" color="#6b7280" />
                      <ThemedText style={styles.detailText}>
                        Min. order: ${discount.minOrder}
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#6b7280" />
            </View>
          ))}
          
          {filteredDiscounts.length === 0 && (
            <View style={styles.emptyState}>
              <IconSymbol size={48} name="tag.fill" color="#d1d5db" />
              <ThemedText style={styles.emptyText}>
                {searchQuery ? 'No discounts found' : 'No discounts available'}
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                {searchQuery ? 'Try adjusting your search' : 'Add your first discount to get started'}
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </ThemedView>

      {/* Floating Add Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddDiscount}
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
  discountsList: {
    flex: 1,
  },
  discountItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountInfo: {
    flex: 1,
  },
  discountHeader: {
    marginBottom: 8,
  },
  discountTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  discountName: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  activeBadge: {
    backgroundColor: '#10b98120',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10b981',
  },
  inactiveBadge: {
    backgroundColor: '#6b728020',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  inactiveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
  },
  valueContainer: {
    alignSelf: 'flex-start',
  },
  discountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  discountDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  discountDetails: {
    gap: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
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
    backgroundColor: '#ef4444',
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
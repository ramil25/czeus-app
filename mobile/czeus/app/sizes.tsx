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

interface Size {
  id: number;
  name: string;
  abbreviation: string;
  multiplier: number;
  description: string;
  isActive: boolean;
}

export default function SizesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for sizes
  const [sizes] = useState<Size[]>([
    {
      id: 1,
      name: 'Small',
      abbreviation: 'S',
      multiplier: 1.0,
      description: 'Standard small size',
      isActive: true,
    },
    {
      id: 2,
      name: 'Medium',
      abbreviation: 'M',
      multiplier: 1.5,
      description: 'Medium size option',
      isActive: true,
    },
    {
      id: 3,
      name: 'Large',
      abbreviation: 'L',
      multiplier: 2.0,
      description: 'Large size option',
      isActive: true,
    },
    {
      id: 4,
      name: 'Extra Large',
      abbreviation: 'XL',
      multiplier: 2.5,
      description: 'Extra large premium size',
      isActive: true,
    },
    {
      id: 5,
      name: 'Family Pack',
      abbreviation: 'FP',
      multiplier: 4.0,
      description: 'Family sharing size',
      isActive: true,
    },
    {
      id: 6,
      name: 'Mini',
      abbreviation: 'Mini',
      multiplier: 0.5,
      description: 'Sample or mini size',
      isActive: false,
    },
  ]);

  const filteredSizes = sizes.filter(
    (size) =>
      size.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      size.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      size.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSize = () => {
    Alert.alert(
      'Add Size',
      'Add new size functionality would be implemented here'
    );
  };

  const getSizeColor = (multiplier: number) => {
    if (multiplier <= 0.5) return '#6b7280';
    if (multiplier <= 1.0) return '#10b981';
    if (multiplier <= 2.0) return '#f59e0b';
    if (multiplier <= 3.0) return '#ef4444';
    return '#8b5cf6';
  };

  const getSizeBackgroundColor = (multiplier: number) => {
    if (multiplier <= 0.5) return '#6b728020';
    if (multiplier <= 1.0) return '#10b98120';
    if (multiplier <= 2.0) return '#f59e0b20';
    if (multiplier <= 3.0) return '#ef444420';
    return '#8b5cf620';
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.searchContainer}>
          <IconSymbol size={20} name="magnifyingglass" color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sizes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.sizesList}>
          {filteredSizes.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol size={48} name="ruler.fill" color="#d1d5db" />
              <ThemedText style={styles.emptyText}>No sizes found</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Add your first size to get started'}
              </ThemedText>
            </View>
          ) : (
            filteredSizes.map((size) => (
              <View key={size.id} style={styles.sizeCard}>
                <View
                  style={[
                    styles.sizeIcon,
                    {
                      backgroundColor: getSizeBackgroundColor(size.multiplier),
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.sizeAbbreviation,
                      { color: getSizeColor(size.multiplier) },
                    ]}
                  >
                    {size.abbreviation}
                  </ThemedText>
                </View>
                <View style={styles.sizeInfo}>
                  <View style={styles.sizeHeader}>
                    <ThemedText type="defaultSemiBold" style={styles.sizeName}>
                      {size.name}
                    </ThemedText>
                    <View style={styles.statusContainer}>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: size.isActive
                              ? '#10b98120'
                              : '#6b728020',
                          },
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.statusText,
                            { color: size.isActive ? '#10b981' : '#6b7280' },
                          ]}
                        >
                          {size.isActive ? 'Active' : 'Inactive'}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  <ThemedText style={styles.sizeDescription}>
                    {size.description}
                  </ThemedText>
                  <View style={styles.sizeDetails}>
                    <View style={styles.multiplierContainer}>
                      <IconSymbol
                        size={16}
                        name="multiply.circle.fill"
                        color="#6b7280"
                      />
                      <ThemedText style={styles.multiplierText}>
                        {size.multiplier}x multiplier
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <IconSymbol size={20} name="chevron.right" color="#d1d5db" />
              </View>
            ))
          )}
        </View>
      </ThemedView>

      <TouchableOpacity style={styles.fab} onPress={handleAddSize}>
        <IconSymbol size={24} name="plus" color="#fff" />
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 4,
    color: '#3b82f6',
    fontSize: 16,
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
  content: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1f2937',
  },
  sizesList: {
    gap: 12,
  },
  sizeCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sizeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sizeAbbreviation: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sizeInfo: {
    flex: 1,
  },
  sizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sizeName: {
    fontSize: 16,
    flex: 1,
  },
  statusContainer: {
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sizeDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  sizeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  multiplierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  multiplierText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    color: '#6b7280',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
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

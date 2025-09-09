import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState, useEffect } from 'react';
import { useCustomerPoints, useUpdateCustomerPoints, useInitializeCustomerPoints } from '@/hooks/usePoints';
import { CustomerPoint } from '@/lib/points';
import EditPointsModal from '@/components/modals/EditPointsModal';
import { router } from 'expo-router';

export default function PointsManagementScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCustomerPoint, setSelectedCustomerPoint] = useState<CustomerPoint | null>(null);

  // Hooks for data management
  const { data: customerPoints = [], isLoading, error, refetch } = useCustomerPoints();
  const updatePointsMutation = useUpdateCustomerPoints();
  const initializeMutation = useInitializeCustomerPoints();

  // Initialize customer points on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeMutation.mutateAsync();
      } catch (error) {
        console.error('Error initializing customer points:', error);
      }
    };

    initialize();
  }, []);

  const filteredCustomerPoints = customerPoints.filter((item) =>
    item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditPoints = (customerPoint: CustomerPoint) => {
    setSelectedCustomerPoint(customerPoint);
    setEditModalVisible(true);
  };

  const handleUpdatePoints = async (id: number, newPoints: number) => {
    try {
      await updatePointsMutation.mutateAsync({
        id,
        pointsData: { points: newPoints },
      });
      Alert.alert('Success', 'Points updated successfully!');
    } catch (error) {
      console.error('Error updating points:', error);
      throw error;
    }
  };

  const refreshPoints = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing points:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getPointsColor = (points: number) => {
    if (points >= 1000) return '#10b981'; // Green for high points
    if (points >= 500) return '#f59e0b'; // Orange for medium points
    if (points >= 100) return '#3b82f6'; // Blue for low points
    return '#6b7280'; // Gray for very low/no points
  };

  const getPointsLabel = (points: number) => {
    if (points >= 1000) return 'Premium';
    if (points >= 500) return 'Gold';
    if (points >= 100) return 'Silver';
    return 'Bronze';
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol size={24} name="chevron.left" color="#2362c7" />
        </TouchableOpacity>
        <ThemedText type="title">Points Management</ThemedText>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <IconSymbol size={20} name="magnifyingglass" color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers by name or email..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <IconSymbol size={16} name="xmark.circle.fill" color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <IconSymbol
            size={20}
            name="exclamationmark.triangle"
            color="#ef4444"
          />
          <ThemedText style={styles.errorText}>
            Failed to load customer points
          </ThemedText>
          <TouchableOpacity
            onPress={refreshPoints}
            style={styles.retryButton}
          >
            <ThemedText style={styles.retryText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Customer Points List */}
      <ScrollView
        style={styles.pointsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshPoints}
            colors={['#8b5cf6']}
            tintColor="#8b5cf6"
          />
        }
      >
        {isLoading && customerPoints.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8b5cf6" />
            <ThemedText style={styles.loadingText}>Loading customer points...</ThemedText>
          </View>
        ) : (
          <>
            {filteredCustomerPoints.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.pointsItem}
                onPress={() => handleEditPoints(item)}
              >
                <View style={styles.customerAvatar}>
                  <IconSymbol size={24} name="person.fill" color="#fff" />
                </View>
                <View style={styles.customerInfo}>
                  <ThemedText style={styles.customerName}>
                    {item.customer_name}
                  </ThemedText>
                  <ThemedText style={styles.customerEmail}>
                    {item.customer_email}
                  </ThemedText>
                  <View style={styles.pointsInfo}>
                    <ThemedText
                      style={[
                        styles.pointsAmount,
                        { color: getPointsColor(item.points) }
                      ]}
                    >
                      {item.points} Points
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.pointsTier,
                        { color: getPointsColor(item.points) }
                      ]}
                    >
                      {getPointsLabel(item.points)}
                    </ThemedText>
                  </View>
                </View>
                <IconSymbol size={16} name="chevron.right" color="#6b7280" />
              </TouchableOpacity>
            ))}

            {filteredCustomerPoints.length === 0 && !isLoading && (
              <View style={styles.emptyState}>
                <IconSymbol
                  size={48}
                  name="star.fill"
                  color="#d1d5db"
                />
                <ThemedText style={styles.emptyText}>
                  {searchQuery
                    ? 'No customers found'
                    : 'No customer points available'}
                </ThemedText>
                <ThemedText style={styles.emptySubtext}>
                  {searchQuery
                    ? 'Try adjusting your search criteria'
                    : 'Customer points will appear here once customers are added'}
                </ThemedText>
              </View>
            )}
          </>
        )}

        {/* Stats Summary */}
        {customerPoints.length > 0 && (
          <View style={styles.statsContainer}>
            <ThemedText style={styles.statsTitle}>Summary</ThemedText>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <ThemedText style={styles.statValue}>
                  {customerPoints.length}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Total Customers</ThemedText>
              </View>
              <View style={styles.statCard}>
                <ThemedText style={styles.statValue}>
                  {customerPoints.reduce((sum, item) => sum + item.points, 0).toLocaleString()}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Total Points</ThemedText>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Edit Points Modal */}
      <EditPointsModal
        visible={editModalVisible}
        customerPoint={selectedCustomerPoint}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedCustomerPoint(null);
        }}
        onUpdate={handleUpdatePoints}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    marginLeft: 8,
    marginRight: 12,
    fontSize: 14,
    color: '#dc2626',
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ef4444',
    borderRadius: 6,
  },
  retryText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  pointsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  pointsItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointsAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  pointsTier: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginBottom: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});
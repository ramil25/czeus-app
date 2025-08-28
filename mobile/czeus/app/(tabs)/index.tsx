import { StyleSheet, ScrollView, View, Alert, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatCard } from '@/components/StatCard';
import { TrendCard } from '@/components/TrendCard';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardScreen() {
  const { products, loading } = useProducts();
  const { user, signOut } = useAuth();

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

  // Calculate stats from products
  const totalProducts = products.length;
  const availableProducts = products.filter((p: any) => p.status === 'Available').length;
  const outOfStockProducts = products.filter((p: any) => p.status === 'Not Available').length;
  const lowStockProducts = 0; // Stock tracking not available in current implementation
  const totalValue = products.reduce((sum: number, p: any) => sum + p.price, 0);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <IconSymbol size={32} name="person.fill" color="#fff" />
            </View>
            <View style={styles.userDetails}>
              <ThemedText type="defaultSemiBold" style={styles.userName}>
                {user ? `${user.first_name} ${user.last_name}`.trim() || 'Admin' : 'Admin'}
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
        <ThemedText type="title" style={styles.title}>Dashboard</ThemedText>
        <ThemedText style={styles.subtitle}>Welcome to CZEUS POS System</ThemedText>
      </ThemedView>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            title="Total Sales"
            value="₱0.00"
            subtitle="Today"
            color="#10b981"
          />
          <StatCard
            title="Orders"
            value="0"
            subtitle="Today"
            color="#2362c7"
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title="Products"
            value={loading ? '...' : totalProducts.toString()}
            subtitle={`${availableProducts} Available`}
            color="#f59e0b"
          />
          <StatCard
            title="Inventory Value"
            value={loading ? '...' : `₱${totalValue.toFixed(0)}`}
            subtitle="Total Stock"
            color="#8b5cf6"
          />
        </View>
      </View>

      <View style={styles.trendsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Inventory Overview
        </ThemedText>
        <TrendCard
          title="Available Products"
          value={`📦 ${availableProducts} items`}
          description={`${outOfStockProducts} out of stock`}
        />
        {lowStockProducts > 0 && (
          <TrendCard
            title="Low Stock Alert"
            value={`⚠️ ${lowStockProducts} items`}
            description="Items with stock ≤ 10"
          />
        )}
        <TrendCard
          title="Product Categories"
          value={`📂 ${[...new Set(products.map((p: any) => p.category))].length} categories`}
          description="Coffee, Tea, Pastries, etc."
        />
      </View>
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
  statsContainer: {
    padding: 16,
    gap: 16,
    backgroundColor: 'transparent',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  trendsContainer: {
    padding: 16,
    gap: 12,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    marginBottom: 8,
  },
});

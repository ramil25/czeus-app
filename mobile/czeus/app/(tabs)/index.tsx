import { StyleSheet, ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { StatCard } from '@/components/StatCard';
import { TrendCard } from '@/components/TrendCard';
import { useProducts } from '@/hooks/useProducts';

export default function DashboardScreen() {
  const { data: products = [], isLoading } = useProducts();

  // Calculate stats from products
  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.status === 'Available').length;
  const outOfStockProducts = products.filter(p => p.status === 'Out of Stock').length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" lightColor="#000000">Dashboard</ThemedText>
        <ThemedText lightColor="#000000">Welcome to CZEUS POS System</ThemedText>
      </View>

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
            value={isLoading ? '...' : totalProducts.toString()}
            subtitle={`${availableProducts} Available`}
            color="#f59e0b"
          />
          <StatCard
            title="Inventory Value"
            value={isLoading ? '...' : `₱${totalValue.toFixed(0)}`}
            subtitle="Total Stock"
            color="#8b5cf6"
          />
        </View>
      </View>

      <View style={styles.trendsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle} lightColor="#000000">
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
          value={`📂 ${[...new Set(products.map(p => p.category))].length} categories`}
          description="Coffee, Tea, Pastries, etc."
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f2ff', // Light blue background
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'transparent', // Transparent to show light blue background
  },
  statsContainer: {
    padding: 16,
    gap: 16,
    backgroundColor: 'transparent', // Transparent to show light blue background
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  trendsContainer: {
    padding: 16,
    gap: 12,
    backgroundColor: 'transparent', // Transparent to show light blue background
  },
  sectionTitle: {
    marginBottom: 8,
  },
});

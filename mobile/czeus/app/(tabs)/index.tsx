import { StyleSheet, ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatCard } from '@/components/StatCard';
import { TrendCard } from '@/components/TrendCard';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Dashboard</ThemedText>
        <ThemedText>Welcome to CZEUS POS System</ThemedText>
      </ThemedView>

      <ThemedView style={styles.statsContainer}>
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
            color="#3b82f6"
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title="Products"
            value="0"
            subtitle="In Stock"
            color="#f59e0b"
          />
          <StatCard
            title="Users"
            value="0"
            subtitle="Active"
            color="#8b5cf6"
          />
        </View>
      </ThemedView>

      <ThemedView style={styles.trendsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Recent Activity
        </ThemedText>
        <TrendCard
          title="Sales Trend"
          value="↗ +0%"
          description="No sales data available"
        />
        <TrendCard
          title="Inventory Status"
          value="📦 0 items"
          description="No products in inventory"
        />
      </ThemedView>
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
  statsContainer: {
    padding: 16,
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  trendsContainer: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 8,
  },
});

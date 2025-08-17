import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface Sale {
  id: number;
  amount: number;
  items: number;
  date: string;
  customer?: string;
}

export default function SalesScreen() {
  const [sales] = useState<Sale[]>([
    { 
      id: 1, 
      amount: 150.00, 
      items: 3, 
      date: new Date().toLocaleDateString(),
      customer: "John Doe"
    }
  ]);

  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalItems = sales.reduce((sum, sale) => sum + sale.items, 0);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Sales</ThemedText>
        <TouchableOpacity style={styles.newSaleButton}>
          <IconSymbol size={20} name="plus" color="#fff" />
          <Text style={styles.newSaleButtonText}>New Sale</Text>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <ThemedText type="subtitle" style={styles.summaryValue}>
              ₱{totalSales.toFixed(2)}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>Total Sales</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText type="subtitle" style={styles.summaryValue}>
              {sales.length}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>Transactions</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText type="subtitle" style={styles.summaryValue}>
              {totalItems}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>Items Sold</ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedView style={styles.salesList}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Recent Sales
        </ThemedText>
        
        {sales.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <IconSymbol size={64} name="creditcard" color="#9ca3af" />
            <ThemedText style={styles.emptyText}>No sales yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Make your first sale to get started
            </ThemedText>
          </ThemedView>
        ) : (
          sales.map((sale) => (
            <View key={sale.id} style={styles.saleCard}>
              <View style={styles.saleHeader}>
                <View>
                  <ThemedText type="defaultSemiBold">Sale #{sale.id}</ThemedText>
                  <ThemedText style={styles.saleDate}>{sale.date}</ThemedText>
                </View>
                <ThemedText type="subtitle" style={styles.saleAmount}>
                  ₱{sale.amount.toFixed(2)}
                </ThemedText>
              </View>
              <View style={styles.saleDetails}>
                <View style={styles.saleDetail}>
                  <IconSymbol size={16} name="bag" color="#6b7280" />
                  <ThemedText style={styles.saleDetailText}>
                    {sale.items} items
                  </ThemedText>
                </View>
                {sale.customer && (
                  <View style={styles.saleDetail}>
                    <IconSymbol size={16} name="person" color="#6b7280" />
                    <ThemedText style={styles.saleDetailText}>
                      {sale.customer}
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newSaleButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newSaleButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  summaryContainer: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    color: '#10b981',
    fontSize: 20,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  salesList: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: '#6b7280',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  saleCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  saleDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  saleAmount: {
    color: '#10b981',
  },
  saleDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  saleDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saleDetailText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
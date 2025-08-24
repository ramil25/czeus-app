import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { useState } from 'react';

interface Table {
  id: number;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  description: string;
}

export default function TablesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for tables
  const [tables] = useState<Table[]>([
    {
      id: 1,
      name: 'Table 1',
      capacity: 2,
      status: 'available',
      description: 'Window side table for 2'
    },
    {
      id: 2,
      name: 'Table 2',
      capacity: 4,
      status: 'occupied',
      description: 'Central table for 4 people'
    },
    {
      id: 3,
      name: 'Table 3',
      capacity: 6,
      status: 'reserved',
      description: 'Large family table'
    },
    {
      id: 4,
      name: 'Table 4',
      capacity: 2,
      status: 'available',
      description: 'Cozy corner table'
    },
    {
      id: 5,
      name: 'Table 5',
      capacity: 8,
      status: 'available',
      description: 'Party table for large groups'
    },
    {
      id: 6,
      name: 'VIP Table',
      capacity: 4,
      status: 'available',
      description: 'Premium table with special service'
    }
  ]);

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'occupied': return '#ef4444';
      case 'reserved': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'available': return '#10b98120';
      case 'occupied': return '#ef444420';
      case 'reserved': return '#f59e0b20';
      default: return '#6b728020';
    }
  };

  const handleAddTable = () => {
    Alert.alert(
      'Add New Table',
      'This will open the add table form.',
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
          <ThemedText type="title" style={styles.title}>Tables</ThemedText>
          <View style={styles.placeholder} />
        </View>
      </ThemedView>

      <ThemedView style={styles.content}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <IconSymbol size={20} name="magnifyingglass" color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tables..."
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

        <ScrollView style={styles.tablesList} showsVerticalScrollIndicator={false}>
          {filteredTables.map((table) => (
            <View key={table.id} style={styles.tableItem}>
              <View style={styles.tableInfo}>
                <View style={styles.tableHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.tableName}>
                    {table.name}
                  </ThemedText>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusBackground(table.status) }]}>
                    <ThemedText style={[styles.statusText, { color: getStatusColor(table.status) }]}>
                      {table.status}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.tableDescription}>
                  {table.description}
                </ThemedText>
                <View style={styles.tableCapacity}>
                  <IconSymbol size={16} name="person.fill" color="#6b7280" />
                  <ThemedText style={styles.capacityText}>
                    Capacity: {table.capacity} people
                  </ThemedText>
                </View>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#6b7280" />
            </View>
          ))}
          
          {filteredTables.length === 0 && (
            <View style={styles.emptyState}>
              <IconSymbol size={48} name="table.furniture.fill" color="#d1d5db" />
              <ThemedText style={styles.emptyText}>
                {searchQuery ? 'No tables found' : 'No tables available'}
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                {searchQuery ? 'Try adjusting your search' : 'Add your first table to get started'}
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </ThemedView>

      {/* Floating Add Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddTable}
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
  tablesList: {
    flex: 1,
  },
  tableItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableInfo: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tableName: {
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  tableDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  tableCapacity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  capacityText: {
    fontSize: 14,
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
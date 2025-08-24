import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useDeleteTable, useUpdateTable } from '@/hooks/useTables';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Table {
  id: number;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  description: string;
}

interface EditTableModalProps {
  visible: boolean;
  table: Table | null;
  onClose: () => void;
}

export default function EditTableModal({ visible, table, onClose }: EditTableModalProps) {
  const [tableName, setTableName] = useState('');
  const [numberOfSeats, setNumberOfSeats] = useState('');
  const [deleting, setDeleting] = useState(false);
  
  const updateTableMutation = useUpdateTable();
  const deleteTableMutation = useDeleteTable();

  useEffect(() => {
    if (table) {
      setTableName(table.name);
      setNumberOfSeats(table.capacity.toString());
    }
  }, [table]);

  const handleSubmit = () => {
    if (!table) return;

    if (!tableName.trim()) {
      Alert.alert('Error', 'Please enter a table name');
      return;
    }

    const seats = parseInt(numberOfSeats);
    if (!seats || seats < 1) {
      Alert.alert('Error', 'Please enter a valid number of seats (minimum 1)');
      return;
    }

    updateTableMutation.mutate(
      {
        id: table.id,
        input: {
          table_name: tableName.trim(),
          number_of_seats: seats,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleDelete = () => {
    if (!table) return;

    Alert.alert(
      'Delete Table',
      `Are you sure you want to delete "${table.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
            style: 'destructive',
            onPress: async () => {
            try {
              setDeleting(true);
              await new Promise<void>((resolve, reject) => {
                deleteTableMutation.mutate(table.id, {
                  onSuccess: () => resolve(),
                  onError: (e) => reject(e),
                });
              });
              onClose();
              Alert.alert('Success', 'Table deleted successfully');
            } catch (e) {
              const message = e instanceof Error ? e.message : 'Failed to delete table';
              Alert.alert('Error', message);
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleClose = () => {
    if (!updateTableMutation.isPending && !deleting) {
      onClose();
    }
  };

  if (!table) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            disabled={updateTableMutation.isPending || deleting}
          >
            <IconSymbol size={24} name="xmark.circle.fill" color="#6b7280" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>Edit Table</ThemedText>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={updateTableMutation.isPending || deleting}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <IconSymbol size={24} name="trash" color="#ef4444" />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Table Name *</ThemedText>
              <TextInput
                style={styles.input}
                value={tableName}
                onChangeText={setTableName}
                placeholder="Enter table name"
                placeholderTextColor="#9ca3af"
                editable={!updateTableMutation.isPending && !deleting}
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Number of Seats *</ThemedText>
              <TextInput
                style={styles.input}
                value={numberOfSeats}
                onChangeText={setNumberOfSeats}
                placeholder="e.g., 4"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                editable={!updateTableMutation.isPending && !deleting}
                maxLength={3}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
            disabled={updateTableMutation.isPending || deleting}
          >
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.updateButton,
              (!tableName.trim() || !numberOfSeats.trim() || updateTableMutation.isPending || deleting) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!tableName.trim() || !numberOfSeats.trim() || updateTableMutation.isPending || deleting}
          >
            {updateTableMutation.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText style={styles.updateButtonText}>Update Table</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
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
  closeButton: { padding: 8, marginLeft: -8 },
  deleteButton: { padding: 8, marginRight: -8 },
  title: { fontSize: 18, fontWeight: '600', color: '#111827' },
  content: { flex: 1, padding: 20 },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db' },
  cancelButtonText: { fontSize: 16, fontWeight: '500', color: '#374151' },
  updateButton: { backgroundColor: '#3b82f6' },
  updateButtonText: { fontSize: 16, fontWeight: '500', color: '#fff' },
  disabledButton: { opacity: 0.5 },
});
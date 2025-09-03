import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { UpdateInventoryInput, InventoryItem } from '@/lib/inventory';

interface EditInventoryModalProps {
  visible: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onUpdate: (id: number, input: UpdateInventoryInput) => Promise<InventoryItem>;
  onDelete: (id: number) => Promise<void>;
}

export default function EditInventoryModal({
  visible,
  item,
  onClose,
  onUpdate,
  onDelete,
}: EditInventoryModalProps) {
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemQty, setItemQty] = useState('');
  const [unitMeasure, setUnitMeasure] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (item) {
      setItemName(item.item_name);
      setItemCategory(item.item_category);
      setItemQty(item.item_qty.toString());
      setUnitMeasure(item.unit_measure);
    }
  }, [item]);

  const handleClose = () => {
    if (loading || deleting) return;
    onClose();
  };

  const handleUpdate = async () => {
    if (!item) return;

    if (!itemName.trim()) {
      Alert.alert('Validation Error', 'Item name is required');
      return;
    }

    if (!itemCategory.trim()) {
      Alert.alert('Validation Error', 'Item category is required');
      return;
    }

    if (!itemQty.trim() || isNaN(Number(itemQty)) || Number(itemQty) < 0) {
      Alert.alert('Validation Error', 'Please enter a valid quantity');
      return;
    }

    if (!unitMeasure.trim()) {
      Alert.alert('Validation Error', 'Unit of measure is required');
      return;
    }

    try {
      setLoading(true);
      
      const input: UpdateInventoryInput = {
        item_name: itemName.trim(),
        item_category: itemCategory.trim(),
        item_qty: Number(itemQty),
        unit_measure: unitMeasure.trim(),
      };

      await onUpdate(item.id, input);
      onClose();
      Alert.alert('Success', 'Inventory item updated successfully!');
    } catch (error) {
      console.error('Error updating inventory item:', error);
      Alert.alert('Error', 'Failed to update inventory item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!item) return;

    Alert.alert(
      'Delete Inventory Item',
      `Are you sure you want to delete "${item.item_name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await onDelete(item.id);
              onClose();
              Alert.alert('Success', 'Inventory item deleted successfully!');
            } catch (error) {
              console.error('Error deleting inventory item:', error);
              Alert.alert('Error', 'Failed to delete inventory item. Please try again.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} disabled={loading || deleting}>
            <IconSymbol size={24} name="multiply.circle.fill" color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Inventory Item</Text>
          <TouchableOpacity onPress={handleDelete} disabled={loading || deleting}>
            {deleting ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <IconSymbol size={24} name="trash" color="#ef4444" />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Item Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Item Name *</Text>
              <TextInput
                style={styles.input}
                value={itemName}
                onChangeText={setItemName}
                placeholder="Enter item name"
                placeholderTextColor="#9ca3af"
                editable={!loading && !deleting}
                maxLength={100}
              />
            </View>

            {/* Item Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <TextInput
                style={styles.input}
                value={itemCategory}
                onChangeText={setItemCategory}
                placeholder="Enter category (e.g., Coffee, Dairy, Condiment)"
                placeholderTextColor="#9ca3af"
                editable={!loading && !deleting}
                maxLength={50}
              />
            </View>

            {/* Quantity */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantity *</Text>
              <TextInput
                style={styles.input}
                value={itemQty}
                onChangeText={setItemQty}
                placeholder="Enter quantity"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                editable={!loading && !deleting}
              />
            </View>

            {/* Unit of Measure */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Unit of Measure *</Text>
              <TextInput
                style={styles.input}
                value={unitMeasure}
                onChangeText={setUnitMeasure}
                placeholder="Enter unit (e.g., kg, L, pcs, boxes)"
                placeholderTextColor="#9ca3af"
                editable={!loading && !deleting}
                maxLength={20}
              />
            </View>

            <View style={styles.itemInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Created:</Text>
                <Text style={styles.infoValue}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
              {item.updated_at && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Last Updated:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(item.updated_at).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
            disabled={loading || deleting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.updateButton,
              (!itemName.trim() || !itemCategory.trim() || !itemQty.trim() || !unitMeasure.trim() || loading || deleting) && styles.disabledButton,
            ]}
            onPress={handleUpdate}
            disabled={!itemName.trim() || !itemCategory.trim() || !itemQty.trim() || !unitMeasure.trim() || loading || deleting}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Update Item</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
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
  itemInfo: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
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
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  updateButton: {
    backgroundColor: '#f59e0b',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
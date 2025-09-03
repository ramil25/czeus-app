import React, { useState } from 'react';
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
import { CreateInventoryInput, InventoryItem } from '@/lib/inventory';

interface AddInventoryModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (input: CreateInventoryInput) => Promise<InventoryItem>;
}

export default function AddInventoryModal({ visible, onClose, onAdd }: AddInventoryModalProps) {
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemQty, setItemQty] = useState('');
  const [unitMeasure, setUnitMeasure] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setItemName('');
    setItemCategory('');
    setItemQty('');
    setUnitMeasure('');
  };

  const handleSubmit = async () => {
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
      
      const input: CreateInventoryInput = {
        item_name: itemName.trim(),
        item_category: itemCategory.trim(),
        item_qty: Number(itemQty),
        unit_measure: unitMeasure.trim(),
      };

      await onAdd(input);
      resetForm();
      onClose();
      Alert.alert('Success', 'Inventory item added successfully!');
    } catch (error) {
      console.error('Error adding inventory item:', error);
      Alert.alert('Error', 'Failed to add inventory item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} disabled={loading}>
            <IconSymbol size={24} name="multiply.circle.fill" color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Add Inventory Item</Text>
          <View style={{ width: 24 }} />
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
                editable={!loading}
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
                editable={!loading}
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
                editable={!loading}
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
                editable={!loading}
                maxLength={20}
              />
            </View>

            <View style={styles.helpText}>
              <IconSymbol size={16} name="info.circle.fill" color="#6b7280" />
              <Text style={styles.helpTextContent}>
                All fields are required. Quantity must be a positive number.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.addButton,
              (!itemName.trim() || !itemCategory.trim() || !itemQty.trim() || !unitMeasure.trim() || loading) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!itemName.trim() || !itemCategory.trim() || !itemQty.trim() || !unitMeasure.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>Add Item</Text>
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
  helpText: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginTop: 8,
  },
  helpTextContent: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
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
  addButton: {
    backgroundColor: '#f59e0b',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
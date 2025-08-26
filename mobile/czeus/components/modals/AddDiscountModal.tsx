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
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { CreateDiscountInput, Discount, DiscountType } from '@/lib/discounts';

interface AddDiscountModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (input: CreateDiscountInput) => Promise<Discount>;
}

export default function AddDiscountModal({ visible, onClose, onAdd }: AddDiscountModalProps) {
  const [discountName, setDiscountName] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (loading) return;
    
    // Reset form
    setDiscountName('');
    setDiscountType('percentage');
    setDiscountValue('');
    onClose();
  };

  const validateForm = (): string | null => {
    if (!discountName.trim()) {
      return 'Discount name is required';
    }
    
    if (!discountValue.trim()) {
      return 'Discount value is required';
    }
    
    const value = parseFloat(discountValue);
    if (isNaN(value) || value <= 0) {
      return 'Discount value must be a positive number';
    }
    
    if (discountType === 'percentage' && value > 100) {
      return 'Percentage discount cannot exceed 100%';
    }
    
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    try {
      setLoading(true);
      await onAdd({
        discount_name: discountName.trim(),
        discount_type: discountType,
        discount_value: parseFloat(discountValue),
      });
      
      // Reset form
      setDiscountName('');
      setDiscountType('percentage');
      setDiscountValue('');
      onClose();
      
      Alert.alert('Success', 'Discount created successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create discount';
      Alert.alert('Error', message);
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
            <IconSymbol size={24} name="xmark" color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Add Discount</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Discount Name *</Text>
              <TextInput
                style={styles.input}
                value={discountName}
                onChangeText={setDiscountName}
                placeholder="Enter discount name"
                placeholderTextColor="#9ca3af"
                editable={!loading}
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Discount Type *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={discountType}
                  onValueChange={(itemValue) => setDiscountType(itemValue)}
                  style={styles.picker}
                  enabled={!loading}
                  dropdownIconColor="#374151"
                  mode={Platform.OS === 'android' ? 'dropdown' : undefined}
                  itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined}
                >
                  <Picker.Item label="Percentage" value="percentage" />
                  <Picker.Item label="Actual Value" value="actual" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Discount Value * {discountType === 'percentage' ? '(%)' : '($)'}
              </Text>
              <TextInput
                style={styles.input}
                value={discountValue}
                onChangeText={setDiscountValue}
                placeholder={discountType === 'percentage' ? 'Enter percentage (e.g., 10)' : 'Enter amount (e.g., 5.00)'}
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                editable={!loading}
              />
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
              loading && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContent}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.addButtonText}>Adding...</Text>
              </View>
            ) : (
              <Text style={styles.addButtonText}>Add Discount</Text>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 24,
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
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    color: '#111827',
    ...(Platform.OS === 'android' ? { height: 52 } : {}),
  },
  pickerItem: {
    fontSize: 16,
    color: '#111827',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
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
    backgroundColor: '#ef4444',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
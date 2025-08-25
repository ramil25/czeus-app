import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCategories } from '@/hooks/useCategories';
import { CreateSizeInput, Size } from '@/lib/sizes';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface AddSizeModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (input: CreateSizeInput) => Promise<Size>;
}

export default function AddSizeModal({ visible, onClose, onAdd }: AddSizeModalProps) {
  const [sizeName, setSizeName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { categories, loading: categoriesLoading } = useCategories();

  const handleSubmit = async () => {
    if (!sizeName.trim()) {
      Alert.alert('Validation Error', 'Size name is required');
      return;
    }

    if (!selectedCategoryId) {
      Alert.alert('Validation Error', 'Please select a category');
      return;
    }

    try {
      setLoading(true);
      await onAdd({
        size_name: sizeName.trim(),
        category_id: selectedCategoryId,
      });
      
      // Reset form
      setSizeName('');
      setSelectedCategoryId(null);
      onClose();
      
      Alert.alert('Success', 'Size created successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create size';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSizeName('');
      setSelectedCategoryId(null);
      onClose();
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
          <TouchableOpacity onPress={handleClose} disabled={loading} style={styles.closeButton}>
            <IconSymbol size={24} name="xmark.circle.fill" color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Add New Size</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Size Name *</Text>
              <TextInput
                style={styles.input}
                value={sizeName}
                onChangeText={setSizeName}
                placeholder="Enter size name"
                placeholderTextColor="#9ca3af"
                editable={!loading}
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              {categoriesLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#f59e0b" />
                  <Text style={styles.loadingText}>Loading categories...</Text>
                </View>
              ) : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedCategoryId}
                    onValueChange={(itemValue) => setSelectedCategoryId(itemValue)}
                    style={styles.picker}
                    enabled={!loading}
                    dropdownIconColor="#374151"
                    mode={Platform.OS === 'android' ? 'dropdown' : undefined}
                    itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined}
                  >
                    <Picker.Item label="Select a category" value={null} />
                    {categories.map((category) => (
                      <Picker.Item
                        key={category.id}
                        label={category.name}
                        value={category.id}
                      />
                    ))}
                  </Picker>
                </View>
              )}
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
              (!sizeName.trim() || !selectedCategoryId || loading) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!sizeName.trim() || !selectedCategoryId || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>Add Size</Text>
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
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginLeft: 8,
    color: '#6b7280',
    fontSize: 14,
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
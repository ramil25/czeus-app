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
import { Picker } from '@react-native-picker/picker';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Size, UpdateSizeInput } from '@/lib/sizes';
import { useCategories } from '@/hooks/useCategories';

interface EditSizeModalProps {
  visible: boolean;
  size: Size | null;
  onClose: () => void;
  onUpdate: (id: number, input: UpdateSizeInput) => Promise<Size>;
  onDelete: (id: number) => Promise<void>;
}

export default function EditSizeModal({ 
  visible, 
  size, 
  onClose, 
  onUpdate, 
  onDelete 
}: EditSizeModalProps) {
  const [sizeName, setSizeName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const { categories, loading: categoriesLoading } = useCategories();

  // Initialize form when size changes
  useEffect(() => {
    if (visible && size) {
      setSizeName(size.name);
      setSelectedCategoryId(size.categoryId);
    }
  }, [visible, size]);

  const handleUpdate = async () => {
    if (!size) return;

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
      await onUpdate(size.id, {
        size_name: sizeName.trim(),
        category_id: selectedCategoryId,
      });
      
      onClose();
      Alert.alert('Success', 'Size updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update size';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!size) return;

    Alert.alert(
      'Delete Size',
      `Are you sure you want to delete "${size.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleteLoading(true);
              await onDelete(size.id);
              onClose();
              Alert.alert('Success', 'Size deleted successfully');
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to delete size';
              Alert.alert('Error', message);
            } finally {
              setDeleteLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    if (size) {
      setSizeName(size.name);
      setSelectedCategoryId(size.categoryId);
    }
    onClose();
  };

  if (!visible || !size) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Size</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <IconSymbol size={24} name="xmark.circle.fill" color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Size Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter size name (e.g., Small, Medium, Large)"
                value={sizeName}
                onChangeText={setSizeName}
                maxLength={100}
                autoCapitalize="words"
                editable={!loading && !deleteLoading}
              />
              <Text style={styles.charCount}>{sizeName.length}/100</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category *</Text>
              {categoriesLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#3b82f6" />
                  <Text style={styles.loadingText}>Loading categories...</Text>
                </View>
              ) : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedCategoryId}
                    onValueChange={(itemValue) => setSelectedCategoryId(itemValue)}
                    style={styles.picker}
                    enabled={!loading && !deleteLoading}
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

            <View style={styles.categoryInfo}>
              <Text style={styles.categoryInfoLabel}>Current Category:</Text>
              <Text style={styles.categoryInfoText}>{size.categoryName}</Text>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
              disabled={loading || deleteLoading}
            >
              {deleteLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <IconSymbol size={16} name="trash" color="#fff" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading || deleteLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                (loading || deleteLoading) && styles.disabledButton,
              ]}
              onPress={handleUpdate}
              disabled={loading || deleteLoading || !sizeName.trim() || !selectedCategoryId}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Update</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  formGroup: {
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
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1f2937',
  },
  charCount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 4,
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
  },
  picker: {
    height: 50,
    color: '#1f2937',
  },
  categoryInfo: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  categoryInfoLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  categoryInfoText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    flexDirection: 'row',
    gap: 4,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
});
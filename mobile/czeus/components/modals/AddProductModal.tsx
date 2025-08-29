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
  Image,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { CreateProductInput, Product } from '@/lib/products';
import { useCategories } from '@/hooks/useCategories';
import { useSizes } from '@/hooks/useSizes';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageFromMobile, isLocalFileUri } from '@/utils/imageUpload';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (input: CreateProductInput) => Promise<Product>;
}

export default function AddProductModal({ visible, onClose, onAdd }: AddProductModalProps) {
  const [productName, setProductName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState<'available' | 'not available'>('available');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  const { categories, loading: categoriesLoading } = useCategories();
  const { sizes, loading: sizesLoading } = useSizes();

  // Filter sizes based on selected category
  const availableSizes = selectedCategoryId 
    ? sizes.filter(size => size.categoryId === selectedCategoryId)
    : [];

  useEffect(() => {
    // Reset size when category changes
    if (selectedCategoryId) {
      setSelectedSizeId(null);
    }
  }, [selectedCategoryId]);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        setImageUri(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const handleSubmit = async () => {
    if (!productName.trim()) {
      Alert.alert('Validation Error', 'Product name is required');
      return;
    }

    if (!selectedCategoryId) {
      Alert.alert('Validation Error', 'Please select a category');
      return;
    }

    if (!selectedSizeId) {
      Alert.alert('Validation Error', 'Please select a size');
      return;
    }

    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price');
      return;
    }

    try {
      setLoading(true);
      
      let finalImageUrl: string | undefined = undefined;
      
      // Upload image if we have a local file URI
      if (imageUri && isLocalFileUri(imageUri)) {
        try {
          setUploadingImage(true);
          finalImageUrl = await uploadImageFromMobile(imageUri, 'products');
        } catch (error) {
          console.error('Failed to upload image:', error);
          Alert.alert('Upload Error', 'Failed to upload image. Product will be created without an image.');
          // Continue without image
        } finally {
          setUploadingImage(false);
        }
      } else if (imageUri) {
        // If it's already a URL (not local file), use it as is
        finalImageUrl = imageUri;
      }
      
      await onAdd({
        product_name: productName.trim(),
        category_id: selectedCategoryId,
        size_id: selectedSizeId,
        price: Number(price),
        status,
        image_url: finalImageUrl,
      });
      
      // Reset form
      resetForm();
      onClose();
      
      Alert.alert('Success', 'Product created successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create product';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setProductName('');
    setSelectedCategoryId(null);
    setSelectedSizeId(null);
    setPrice('');
    setStatus('available');
    setImageUri(null);
    setShowCategoryDropdown(false);
    setShowSizeDropdown(false);
    setUploadingImage(false);
  };

  const handleClose = () => {
    if (!loading && !uploadingImage) {
      resetForm();
      onClose();
    }
  };

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
  const selectedSize = availableSizes.find(size => size.id === selectedSizeId);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} disabled={loading || uploadingImage} style={styles.closeButton}>
            <IconSymbol size={24} name="xmark.circle.fill" color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Add New Product</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            
            {/* Image Upload */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Image</Text>
              {uploadingImage && (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="small" color="#3b82f6" />
                  <Text style={styles.uploadingText}>Uploading image...</Text>
                </View>
              )}
              <View style={styles.imageContainer}>
                {imageUri ? (
                  <View style={styles.imagePreview}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                      <IconSymbol size={16} name="xmark.circle.fill" color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.imagePlaceholder} 
                    onPress={pickImage}
                    disabled={uploadingImage}
                  >
                    <IconSymbol size={32} name="camera.fill" color="#9ca3af" />
                    <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Product Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                style={styles.input}
                value={productName}
                onChangeText={setProductName}
                placeholder="Enter product name"
                placeholderTextColor="#9ca3af"
                editable={!loading}
                maxLength={100}
              />
            </View>

            {/* Category Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                disabled={loading || categoriesLoading}
              >
                <Text style={[styles.dropdownText, !selectedCategory && styles.placeholderText]}>
                  {selectedCategory ? selectedCategory.name : 'Select category'}
                </Text>
                <IconSymbol 
                  size={16} 
                  name={showCategoryDropdown ? "chevron.up" : "chevron.down"} 
                  color="#6b7280" 
                />
              </TouchableOpacity>
              
              {showCategoryDropdown && (
                <View style={styles.dropdownOptions}>
                  <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={styles.dropdownOption}
                        onPress={() => {
                          setSelectedCategoryId(category.id);
                          setShowCategoryDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownOptionText}>{category.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Size Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Size *</Text>
              <TouchableOpacity
                style={[styles.dropdown, !selectedCategoryId && styles.disabledDropdown]}
                onPress={() => selectedCategoryId && setShowSizeDropdown(!showSizeDropdown)}
                disabled={loading || sizesLoading || !selectedCategoryId}
              >
                <Text style={[styles.dropdownText, !selectedSize && styles.placeholderText]}>
                  {selectedSize ? selectedSize.name : 
                   selectedCategoryId ? 'Select size' : 'Select category first'}
                </Text>
                <IconSymbol 
                  size={16} 
                  name={showSizeDropdown ? "chevron.up" : "chevron.down"} 
                  color="#6b7280" 
                />
              </TouchableOpacity>
              
              {showSizeDropdown && selectedCategoryId && (
                <View style={styles.dropdownOptions}>
                  <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                    {availableSizes.map((size) => (
                      <TouchableOpacity
                        key={size.id}
                        style={styles.dropdownOption}
                        onPress={() => {
                          setSelectedSizeId(size.id);
                          setShowSizeDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownOptionText}>{size.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
              
              {selectedCategoryId && availableSizes.length === 0 && !sizesLoading && (
                <Text style={styles.warningText}>No sizes available for this category</Text>
              )}
            </View>

            {/* Price */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price *</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                editable={!loading}
              />
            </View>

            {/* Status Toggle */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusToggle}>
                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    status === 'available' && styles.statusOptionActive,
                  ]}
                  onPress={() => setStatus('available')}
                  disabled={loading}
                >
                  <Text style={[
                    styles.statusOptionText,
                    status === 'available' && styles.statusOptionTextActive,
                  ]}>
                    Available
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    status === 'not available' && styles.statusOptionActive,
                  ]}
                  onPress={() => setStatus('not available')}
                  disabled={loading}
                >
                  <Text style={[
                    styles.statusOptionText,
                    status === 'not available' && styles.statusOptionTextActive,
                  ]}>
                    Not Available
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
            disabled={loading || uploadingImage}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.addButton,
              (!productName.trim() || !selectedCategoryId || !selectedSizeId || !price.trim() || loading || uploadingImage) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!productName.trim() || !selectedCategoryId || !selectedSizeId || !price.trim() || loading || uploadingImage}
          >
            {loading || uploadingImage ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>Add Product</Text>
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
  dropdown: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledDropdown: {
    backgroundColor: '#f9fafb',
    opacity: 0.6,
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  dropdownOptions: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  warningText: {
    fontSize: 14,
    color: '#f59e0b',
    marginTop: 4,
  },
  statusToggle: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  statusOptionActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  statusOptionTextActive: {
    color: '#111827',
  },
  imageContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 6,
  },
  uploadingText: {
    fontSize: 14,
    color: '#3b82f6',
    marginLeft: 8,
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
    backgroundColor: '#3b82f6',
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
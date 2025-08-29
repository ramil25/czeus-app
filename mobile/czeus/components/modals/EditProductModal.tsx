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
import { Product, UpdateProductInput } from '@/lib/products';
import { useCategories } from '@/hooks/useCategories';
import { useSizes } from '@/hooks/useSizes';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageFromMobile, isLocalFileUri } from '@/utils/imageUpload';

interface EditProductModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onUpdate: (id: number, input: UpdateProductInput) => Promise<Product>;
  onDelete: (id: number) => Promise<void>;
}

export default function EditProductModal({
  visible,
  product,
  onClose,
  onUpdate,
  onDelete,
}: EditProductModalProps) {
  const [productName, setProductName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState<'available' | 'not available'>('available');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
    if (product) {
      setProductName(product.name);
      setSelectedCategoryId(product.categoryId);
      setSelectedSizeId(product.sizeId);
      setPrice(product.price.toString());
      setStatus(product.status === 'Available' ? 'available' : 'not available');
      setImageUri(product.image || null);
    }
  }, [product]);

  useEffect(() => {
    // Reset size when category changes and it's not the original category
    if (selectedCategoryId && product && selectedCategoryId !== product.categoryId) {
      setSelectedSizeId(null);
    }
  }, [selectedCategoryId, product]);

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

  const handleUpdate = async () => {
    if (!product) return;
    
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
      
      let finalImageUrl: string | undefined = imageUri || undefined;
      
      // Upload image if we have a new local file URI
      if (imageUri && isLocalFileUri(imageUri)) {
        try {
          setUploadingImage(true);
          finalImageUrl = await uploadImageFromMobile(imageUri, 'products');
        } catch (error) {
          console.error('Failed to upload image:', error);
          Alert.alert('Upload Error', 'Failed to upload image. Product will be updated without changing the image.');
          // Keep original image URL
          finalImageUrl = product.image;
        } finally {
          setUploadingImage(false);
        }
      }
      
      await onUpdate(product.id, {
        product_name: productName.trim(),
        category_id: selectedCategoryId,
        size_id: selectedSizeId,
        price: Number(price),
        status,
        image_url: finalImageUrl,
      });
      
      onClose();
      Alert.alert('Success', 'Product updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update product';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await onDelete(product.id);
              onClose();
              Alert.alert('Success', 'Product deleted successfully');
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to delete product';
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
    if (!loading && !deleting && !uploadingImage) {
      onClose();
    }
  };

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
  const selectedSize = availableSizes.find(size => size.id === selectedSizeId);

  if (!product) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} disabled={loading || deleting || uploadingImage} style={styles.closeButton}>
            <IconSymbol size={24} name="xmark.circle.fill" color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Product</Text>
          <TouchableOpacity 
            onPress={handleDelete} 
            disabled={loading || deleting || uploadingImage}
            style={styles.deleteButton}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <IconSymbol size={24} name="trash.fill" color="#ef4444" />
            )}
          </TouchableOpacity>
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
                editable={!loading && !deleting && !uploadingImage}
                maxLength={100}
              />
            </View>

            {/* Category Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                disabled={loading || deleting || categoriesLoading || uploadingImage}
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
                disabled={loading || deleting || sizesLoading || !selectedCategoryId || uploadingImage}
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
                editable={!loading && !deleting && !uploadingImage}
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
                  disabled={loading || deleting || uploadingImage}
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
                  disabled={loading || deleting || uploadingImage}
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
            disabled={loading || deleting || uploadingImage}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.updateButton,
              (!productName.trim() || !selectedCategoryId || !selectedSizeId || !price.trim() || loading || deleting || uploadingImage) && styles.disabledButton,
            ]}
            onPress={handleUpdate}
            disabled={!productName.trim() || !selectedCategoryId || !selectedSizeId || !price.trim() || loading || deleting || uploadingImage}
          >
            {loading || uploadingImage ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Update Product</Text>
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
  deleteButton: {
    padding: 8,
    marginRight: -8,
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
  updateButton: {
    backgroundColor: '#3b82f6',
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
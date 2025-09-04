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
import { CustomerFormData, Customer } from '@/lib/customers';
// import DatePicker from '@/components/DatePicker';

interface EditCustomerModalProps {
  visible: boolean;
  customer: Customer | null;
  onClose: () => void;
  onUpdate: (params: { id: number; customerData: Omit<CustomerFormData, 'email'> }) => Promise<Customer>;
  onDelete: (id: number) => Promise<void>;
}

export default function EditCustomerModal({
  visible,
  customer,
  onClose,
  onUpdate,
  onDelete,
}: EditCustomerModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Populate form with customer data when modal opens
  useEffect(() => {
    if (customer && visible) {
      setFirstName(customer.firstName);
      setLastName(customer.lastName);
      setPhone(customer.phone);
      setAddress(customer.address);
      setBirthDay(customer.birthDay || '');
    }
  }, [customer, visible]);

  const handleUpdate = async () => {
    if (!firstName.trim()) {
      Alert.alert('Validation Error', 'First name is required');
      return;
    }

    if (!lastName.trim()) {
      Alert.alert('Validation Error', 'Last name is required');
      return;
    }

    try {
      setLoading(true);
      await onUpdate({ 
        id: customer!.id, 
        customerData: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          birthDay: birthDay,
        }
      });
      
      onClose();
      Alert.alert('Success', 'Customer updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update customer';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete ${customer?.firstName} ${customer?.lastName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await onDelete(customer!.id);
              onClose();
              Alert.alert('Success', 'Customer deleted successfully');
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to delete customer';
              Alert.alert('Error', message);
            } finally {
              setDeleting(false);
            }
          }
        }
      ]
    );
  };

  const handleClose = () => {
    if (!loading && !deleting) {
      onClose();
    }
  };

  if (!customer) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            disabled={loading || deleting}
            style={styles.closeButton}
          >
            <IconSymbol size={24} name="xmark.circle.fill" color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Customer</Text>
          <TouchableOpacity
            onPress={handleDelete}
            disabled={loading || deleting}
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
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor="#9ca3af"
                editable={!loading && !deleting}
                autoCapitalize="words"
                maxLength={50}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor="#9ca3af"
                editable={!loading && !deleting}
                autoCapitalize="words"
                maxLength={50}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.input, styles.disabledInput]}>
                <Text style={styles.disabledText}>{customer.email}</Text>
              </View>
              <Text style={styles.fieldNote}>Email cannot be changed</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number (optional)"
                placeholderTextColor="#9ca3af"
                editable={!loading && !deleting}
                keyboardType="phone-pad"
                maxLength={20}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Birth Date</Text>
              <TextInput
                style={styles.input}
                value={birthDay}
                onChangeText={setBirthDay}
                placeholder="YYYY-MM-DD (optional)"
                placeholderTextColor="#9ca3af"
                editable={!loading && !deleting}
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter address (optional)"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!loading && !deleting}
                autoCapitalize="words"
                maxLength={200}
              />
            </View>

            <View style={styles.roleInfo}>
              <Text style={styles.roleInfoText}>
                Role: Customer (cannot be changed)
              </Text>
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
              (!firstName.trim() || !lastName.trim() || loading || deleting) && styles.disabledButton,
            ]}
            onPress={handleUpdate}
            disabled={!firstName.trim() || !lastName.trim() || loading || deleting}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Update Customer</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker Modal - TODO: Implement proper date picker */}
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
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  deleteButton: {
    padding: 8,
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
  disabledInput: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  disabledText: {
    fontSize: 16,
    color: '#6b7280',
  },
  fieldNote: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  roleInfo: {
    backgroundColor: '#f59e0b20',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  roleInfoText: {
    fontSize: 14,
    color: '#d97706',
    fontStyle: 'italic',
    textAlign: 'center',
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
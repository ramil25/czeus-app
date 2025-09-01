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
import { Staff, StaffFormData } from '@/lib/staff';

interface EditStaffModalProps {
  visible: boolean;
  staff: Staff | null;
  onClose: () => void;
  onUpdate: (params: { id: number; staffData: StaffFormData }) => Promise<Staff>;
  onDelete: (id: number) => Promise<void>;
}

export default function EditStaffModal({
  visible,
  staff,
  onClose,
  onUpdate,
  onDelete,
}: EditStaffModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (staff) {
      setFirstName(staff.firstName || '');
      setLastName(staff.lastName || '');
      setPhone(staff.phone || '');
      setPosition(staff.position || '');
      setAddress(staff.address || '');
    } else {
      // Reset form when staff is null
      setFirstName('');
      setLastName('');
      setPhone('');
      setPosition('');
      setAddress('');
    }
  }, [staff]);

  const handleUpdate = async () => {
    if (!staff) return;
    
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
        id: staff.id, 
        staffData: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: staff.email, // Keep the same email
          phone: phone.trim(),
          position: position.trim(),
          address: address.trim(),
        }
      });
      
      onClose();
      Alert.alert('Success', 'Staff member updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update staff member';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!staff) return;

    Alert.alert(
      'Delete Staff Member',
      `Are you sure you want to delete "${staff.firstName} ${staff.lastName}"? This action cannot be undone.`,
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
              setDeleting(true);
              await onDelete(staff.id);
              onClose();
              Alert.alert('Success', 'Staff member deleted successfully');
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to delete staff member';
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
    if (!loading && !deleting) {
      onClose();
    }
  };

  if (!staff) return null;

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
          <Text style={styles.title}>Edit Staff</Text>
          <TouchableOpacity
            onPress={handleDelete}
            disabled={loading || deleting}
            style={styles.deleteButton}
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
              <Text style={styles.label}>Email (Read-only)</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={staff.email}
                editable={false}
                placeholderTextColor="#6b7280"
              />
              <Text style={styles.helpText}>
                Email addresses cannot be changed for security reasons
              </Text>
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
              <Text style={styles.label}>Position</Text>
              <TextInput
                style={styles.input}
                value={position}
                onChangeText={setPosition}
                placeholder="Enter position/job title (optional)"
                placeholderTextColor="#9ca3af"
                editable={!loading && !deleting}
                autoCapitalize="words"
                maxLength={100}
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
              <Text style={styles.updateButtonText}>Update Staff</Text>
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
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  deleteButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
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
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#374151',
  },
  inputDisabled: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  updateButton: {
    backgroundColor: '#10b981',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
});
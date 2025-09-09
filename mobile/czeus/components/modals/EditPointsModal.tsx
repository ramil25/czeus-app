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
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { CustomerPoint } from '@/lib/points';

interface EditPointsModalProps {
  visible: boolean;
  customerPoint: CustomerPoint | null;
  onClose: () => void;
  onUpdate: (id: number, points: number) => void;
}

export default function EditPointsModal({
  visible,
  customerPoint,
  onClose,
  onUpdate,
}: EditPointsModalProps) {
  const [points, setPoints] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes or when customerPoint changes
  useEffect(() => {
    if (visible && customerPoint) {
      setPoints(customerPoint.points.toString());
    } else {
      setPoints('');
    }
  }, [visible, customerPoint]);

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleUpdate = () => {
    if (!customerPoint) return;

    const pointsValue = parseInt(points.trim(), 10);

    // Validation
    if (isNaN(pointsValue) || pointsValue < 0) {
      Alert.alert('Invalid Points', 'Please enter a valid points amount (0 or greater).');
      return;
    }

    // Show confirmation modal before updating
    Alert.alert(
      'Update Points',
      `Are you sure you want to update ${customerPoint.customer_name}'s points to ${pointsValue}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          style: 'default',
          onPress: async () => {
            try {
              setLoading(true);
              await onUpdate(customerPoint.id, pointsValue);
              onClose();
            } catch (error) {
              Alert.alert('Error', 'Failed to update points. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!customerPoint) return null;

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
            disabled={loading}
            style={styles.closeButton}
          >
            <IconSymbol size={24} name="xmark.circle.fill" color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Points</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.customerInfo}>
            <View style={styles.avatarContainer}>
              <IconSymbol size={32} name="person.fill" color="#fff" />
            </View>
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{customerPoint.customer_name}</Text>
              <Text style={styles.customerEmail}>{customerPoint.customer_email}</Text>
              <Text style={styles.currentPoints}>
                Current Points: {customerPoint.points}
              </Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Points Amount</Text>
            <TextInput
              style={styles.input}
              value={points}
              onChangeText={setPoints}
              placeholder="Enter points amount"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              editable={!loading}
              autoFocus
            />
            <Text style={styles.helperText}>
              Enter the total points amount for this customer
            </Text>
          </View>
        </View>

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
              styles.updateButton,
              (!points.trim() || loading) && styles.disabledButton,
            ]}
            onPress={handleUpdate}
            disabled={!points.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Update Points</Text>
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
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  currentPoints: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8b5cf6',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
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
    backgroundColor: '#8b5cf6',
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
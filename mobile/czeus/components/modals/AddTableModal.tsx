import React, { useState } from 'react';
import {
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCreateTable } from '@/hooks/useTables';

interface AddTableModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddTableModal({ visible, onClose }: AddTableModalProps) {
  const [tableName, setTableName] = useState('');
  const [numberOfSeats, setNumberOfSeats] = useState('');
  
  const createTableMutation = useCreateTable();

  const handleSubmit = () => {
    if (!tableName.trim()) {
      Alert.alert('Error', 'Please enter a table name');
      return;
    }

    const seats = parseInt(numberOfSeats);
    if (!seats || seats < 1) {
      Alert.alert('Error', 'Please enter a valid number of seats (minimum 1)');
      return;
    }

    createTableMutation.mutate(
      {
        table_name: tableName.trim(),
        number_of_seats: seats,
      },
      {
        onSuccess: () => {
          setTableName('');
          setNumberOfSeats('');
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (!createTableMutation.isPending) {
      setTableName('');
      setNumberOfSeats('');
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
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={handleClose}
            disabled={createTableMutation.isPending}
          >
            <IconSymbol size={24} name="xmark.circle.fill" color="#374151" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>Add New Table</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Table Name</ThemedText>
            <TextInput
              style={styles.input}
              value={tableName}
              onChangeText={setTableName}
              placeholder="e.g., Table 1, A1, VIP Table"
              placeholderTextColor="#9ca3af"
              editable={!createTableMutation.isPending}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Number of Seats</ThemedText>
            <TextInput
              style={styles.input}
              value={numberOfSeats}
              onChangeText={setNumberOfSeats}
              placeholder="e.g., 4"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              editable={!createTableMutation.isPending}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              createTableMutation.isPending && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={createTableMutation.isPending}
          >
            {createTableMutation.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText style={styles.submitButtonText}>Add Table</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </ThemedView>
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
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
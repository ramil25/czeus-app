import { StyleSheet, ScrollView, View, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useUser, useUpdateUser } from '@/hooks/useUsers';
import { UserFormData } from '@/lib/users';
import { UserRole } from '@/types/auth';

export default function EditUserScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { data: user, isLoading: userLoading, error } = useUser(parseInt(userId || '0'));
  const updateUserMutation = useUpdateUser();

  const [form, setForm] = useState<UserFormData>({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    role: 'staff',
    phone: '',
    position: '',
    address: '',
    birth_day: '',
  });

  // Populate form with user data when it loads
  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name,
        middle_name: user.middle_name || '',
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        position: user.position || '',
        address: user.address || '',
        birth_day: user.birth_day || '',
      });
    }
  }, [user]);

  const handleBack = () => {
    router.back();
  };

  const updateForm = (field: keyof UserFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!form.first_name.trim()) {
      Alert.alert('Error', 'First name is required');
      return false;
    }
    if (!form.last_name.trim()) {
      Alert.alert('Error', 'Last name is required');
      return false;
    }
    // Note: Email is not editable as per requirements
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;

    try {
      await updateUserMutation.mutateAsync({ 
        id: user.id, 
        userData: form 
      });
      Alert.alert(
        'Success',
        'User updated successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update user');
    }
  };

  const roleOptions: { value: UserRole; label: string }[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'staff', label: 'Staff' },
    { value: 'customer', label: 'Customer' },
  ];

  if (userLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <IconSymbol size={24} name="chevron.left" color="#2362c7" />
            </TouchableOpacity>
            <ThemedText type="title" style={styles.title}>Edit User</ThemedText>
            <View style={styles.placeholder} />
          </View>
        </ThemedView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2362c7" />
          <ThemedText style={styles.loadingText}>Loading user data...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error || !user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <IconSymbol size={24} name="chevron.left" color="#2362c7" />
            </TouchableOpacity>
            <ThemedText type="title" style={styles.title}>Edit User</ThemedText>
            <View style={styles.placeholder} />
          </View>
        </ThemedView>
        <View style={styles.errorContainer}>
          <IconSymbol size={48} name="exclamationmark.triangle" color="#ef4444" />
          <ThemedText style={styles.errorText}>User not found</ThemedText>
          <TouchableOpacity style={styles.errorButton} onPress={handleBack}>
            <ThemedText style={styles.errorButtonText}>Go Back</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <IconSymbol size={24} name="chevron.left" color="#2362c7" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>Edit User</ThemedText>
          <View style={styles.placeholder} />
        </View>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.form}>
          {/* Required Fields */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Basic Information</ThemedText>
            
            <View style={styles.field}>
              <ThemedText style={styles.label}>First Name *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter first name"
                placeholderTextColor="#9ca3af"
                value={form.first_name}
                onChangeText={(value) => updateForm('first_name', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Last Name *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter last name"
                placeholderTextColor="#9ca3af"
                value={form.last_name}
                onChangeText={(value) => updateForm('last_name', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Email (Read-only)</ThemedText>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={form.email}
                editable={false}
              />
              <ThemedText style={styles.helpText}>
                Email addresses cannot be changed for security reasons
              </ThemedText>
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Role *</ThemedText>
              <View style={styles.roleContainer}>
                {roleOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.roleOption,
                      form.role === option.value && styles.roleOptionSelected,
                    ]}
                    onPress={() => updateForm('role', option.value)}
                  >
                    <ThemedText
                      style={[
                        styles.roleOptionText,
                        form.role === option.value && styles.roleOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Optional Fields */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Additional Information</ThemedText>
            
            <View style={styles.field}>
              <ThemedText style={styles.label}>Middle Name</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter middle name (optional)"
                placeholderTextColor="#9ca3af"
                value={form.middle_name}
                onChangeText={(value) => updateForm('middle_name', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Phone</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number (optional)"
                placeholderTextColor="#9ca3af"
                value={form.phone}
                onChangeText={(value) => updateForm('phone', value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Position</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter position/job title (optional)"
                placeholderTextColor="#9ca3af"
                value={form.position}
                onChangeText={(value) => updateForm('position', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Address</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter address (optional)"
                placeholderTextColor="#9ca3af"
                value={form.address}
                onChangeText={(value) => updateForm('address', value)}
                autoCapitalize="words"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Birth Date</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD (optional)"
                placeholderTextColor="#9ca3af"
                value={form.birth_day}
                onChangeText={(value) => updateForm('birth_day', value)}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, updateUserMutation.isPending && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={updateUserMutation.isPending}
          >
            <ThemedText style={styles.submitButtonText}>
              {updateUserMutation.isPending ? 'Updating User...' : 'Update User'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: '#2362c7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#374151',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  inputDisabled: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  roleOptionSelected: {
    borderColor: '#2362c7',
    backgroundColor: '#eff6ff',
  },
  roleOptionText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  roleOptionTextSelected: {
    color: '#2362c7',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2362c7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
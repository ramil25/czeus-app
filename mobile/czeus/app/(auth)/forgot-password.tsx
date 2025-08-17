import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
      Alert.alert(
        'Reset Link Sent',
        'If an account with this email exists, you will receive a password reset link shortly.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(
        'Error', 
        error instanceof Error ? error.message : 'An error occurred while sending the reset link'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <IconSymbol size={24} name="chevron.left" color="#3b82f6" />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <IconSymbol size={64} name="cube.box.fill" color="#3b82f6" />
            <ThemedText type="title" style={styles.title}>CZEUS POS</ThemedText>
            <ThemedText style={styles.subtitle}>Reset Your Password</ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={styles.formContainer}>
          <ThemedText type="subtitle" style={styles.formTitle}>
            Forgot Password
          </ThemedText>

          <ThemedText style={styles.description}>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </ThemedText>

          <View style={styles.inputContainer}>
            <IconSymbol size={20} name="envelope.fill" color="#6b7280" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading && !sent}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.resetButton, 
              (loading || sent) && styles.resetButtonDisabled
            ]}
            onPress={handleResetPassword}
            disabled={loading || sent}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.resetButtonText}>
                {sent ? 'Reset Link Sent' : 'Send Reset Link'}
              </ThemedText>
            )}
          </TouchableOpacity>

          {sent && (
            <View style={styles.successContainer}>
              <IconSymbol size={24} name="checkmark.circle.fill" color="#10b981" />
              <ThemedText style={styles.successText}>
                Check your email for the reset link
              </ThemedText>
            </View>
          )}

          <View style={styles.loginContainer}>
            <ThemedText style={styles.loginText}>
              Remember your password?{' '}
            </ThemedText>
            <TouchableOpacity onPress={handleBackToLogin}>
              <ThemedText style={styles.loginLink}>Sign In</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.demoContainer}>
            <IconSymbol size={20} name="info.circle.fill" color="#3b82f6" />
            <ThemedText style={styles.demoText}>
              This is a demo app. Password reset functionality is simulated and no actual email will be sent.
            </ThemedText>
          </View>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 0,
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 8,
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#1f2937',
  },
  resetButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    marginBottom: 16,
    gap: 8,
  },
  successText: {
    color: '#065f46',
    fontSize: 14,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  loginText: {
    color: '#6b7280',
    fontSize: 14,
  },
  loginLink: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  demoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    gap: 8,
  },
  demoText: {
    flex: 1,
    fontSize: 12,
    color: '#1d4ed8',
    lineHeight: 16,
  },
});
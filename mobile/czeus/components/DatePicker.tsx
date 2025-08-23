import React, { useState } from 'react';
import { TouchableOpacity, Platform, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

interface DatePickerProps {
  value?: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  placeholder?: string;
  style?: any;
}

export function DatePicker({ value, onChange, placeholder = "Select date", style }: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  
  // Convert YYYY-MM-DD string to Date object
  const getDateFromValue = (dateString?: string): Date => {
    if (!dateString || dateString.trim() === '') {
      return new Date();
    }
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  // Format Date object to YYYY-MM-DD string
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
    
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      onChange(formattedDate);
    }
  };

  const displayText = value && value.trim() !== '' ? value : placeholder;
  const isPlaceholder = !value || value.trim() === '';

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <ThemedText style={[
          styles.text,
          isPlaceholder && styles.placeholder
        ]}>
          {displayText}
        </ThemedText>
        <IconSymbol 
          size={20} 
          name="calendar" 
          color={isPlaceholder ? "#9ca3af" : "#374151"} 
        />
      </TouchableOpacity>
      
      {showPicker && (
        <DateTimePicker
          value={getDateFromValue(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()} // Prevent future dates for birth dates
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // This will be overridden by the parent style
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  placeholder: {
    color: '#9ca3af',
  },
});
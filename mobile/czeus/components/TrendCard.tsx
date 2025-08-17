import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface TrendCardProps {
  title: string;
  value: string;
  description: string;
}

export function TrendCard({ title, value, description }: TrendCardProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText type="subtitle" style={styles.value}>
          {value}
        </ThemedText>
        <ThemedText style={styles.description}>
          {description}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    marginBottom: 4,
    color: '#10b981',
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
});
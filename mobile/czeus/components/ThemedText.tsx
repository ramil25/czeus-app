import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  // Call all hooks unconditionally at the top level
  const defaultTextColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const titleTextColor = useThemeColor({ light: '#111827', dark: '#111827' }, 'text');
  const subtitleTextColor = useThemeColor({ light: '#4B5563', dark: '#4B5563' }, 'subtitle');
  const linkTextColor = useThemeColor({ light: '#2362c7', dark: '#2362c7' }, 'tint');
  
  // Select the appropriate color based on type and provided colors
  let textColor = lightColor || darkColor;
  
  if (!textColor) {
    switch (type) {
      case 'title':
        textColor = titleTextColor;
        break;
      case 'subtitle':
        textColor = subtitleTextColor;
        break;
      case 'link':
        textColor = linkTextColor;
        break;
      default:
        textColor = defaultTextColor;
        break;
    }
  }

  return (
    <Text
      style={[
        { color: textColor },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  color: '#2362c7',
  },
});

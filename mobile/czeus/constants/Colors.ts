/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Primary brand / accent colors
const tintColorLight = '#2362c7';
const tintColorDark = '#2362c7';

export const Colors = {
  // Light mode palette (forced throughout the app for consistency)
  light: {
    text: '#111827',            // Gray 900
    background: '#F9FAFB',      // Gray 50
    tint: tintColorLight,       // Brand primary
    icon: '#4B5563',            // Gray 600 for good contrast on light bg
    tabIconDefault: '#6B7280',  // Gray 500
    tabIconSelected: tintColorLight,
    subtitle: '#4B5563',        // Slightly darker than previous for readability
  },
  // Retain a "dark" object to satisfy hook typing, but mirror light theme with adjusted neutrals
  dark: {
    text: '#111827',
    background: '#F9FAFB',
    tint: tintColorDark,
    icon: '#4B5563',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    subtitle: '#4B5563',
  },
};

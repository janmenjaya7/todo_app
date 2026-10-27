/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    accent: '#208AEF',
    accentSoft: '#DCEBFC',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    accent: '#4DA3F5',
    accentSoft: '#16304D',
  },
} as const;

export const Gradients = {
  light: 'linear-gradient(160deg, #8EC5FC 0%, #E0C3FC 55%, #FBD3E9 100%)',
  dark: 'linear-gradient(160deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
} as const;

/** Soft card backgrounds with a matching accent (tint) color. */
export const Pastels = [
  {
    light: { gradient: 'linear-gradient(135deg, #E0F0FF 0%, #C7E2FF 100%)', tint: '#208AEF' },
    dark: { gradient: 'linear-gradient(135deg, #1B3A5C 0%, #12263D 100%)', tint: '#6CB4FF' },
  },
  {
    light: { gradient: 'linear-gradient(135deg, #FFE4EC 0%, #FFD1DC 100%)', tint: '#E5487A' },
    dark: { gradient: 'linear-gradient(135deg, #4A2233 0%, #2E1520 100%)', tint: '#FF8FB1' },
  },
  {
    light: { gradient: 'linear-gradient(135deg, #DFF7EC 0%, #C3EFD9 100%)', tint: '#1F9D63' },
    dark: { gradient: 'linear-gradient(135deg, #1C3D30 0%, #11261E 100%)', tint: '#5FD49C' },
  },
  {
    light: { gradient: 'linear-gradient(135deg, #EDE7FF 0%, #DCD0FF 100%)', tint: '#7C5CF6' },
    dark: { gradient: 'linear-gradient(135deg, #2E2552 0%, #1C1736 100%)', tint: '#A995FF' },
  },
  {
    light: { gradient: 'linear-gradient(135deg, #FFF3DC 0%, #FFE3B3 100%)', tint: '#D98A00' },
    dark: { gradient: 'linear-gradient(135deg, #4A3714 0%, #2E220C 100%)', tint: '#FFC35C' },
  },
] as const;

export type ThemeColor =keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

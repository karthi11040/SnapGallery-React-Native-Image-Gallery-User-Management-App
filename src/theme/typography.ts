import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  displayLg: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.6,
    fontWeight: '700',
  },
  displayLgMobile: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    fontWeight: '700',
  },
  headlineMd: {
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    fontWeight: '600',
  },
  headlineSm: {
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
    fontWeight: '600',
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.1,
    fontWeight: '400',
  },
  bodyMd: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    fontWeight: '400',
  },
  bodySm: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.1,
    fontWeight: '400',
  },
  labelLg: {
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.1,
    fontWeight: '600',
  },
  labelMd: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
    fontWeight: '600',
  },
  labelCaps: {
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.8,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
};

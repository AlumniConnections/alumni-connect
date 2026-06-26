/**
 * Central design system for AlumniConnect.
 * The maple-red primary intentionally bridges Chinese red and the Canadian maple leaf.
 */

export const palette = {
  maple: '#C8102E',
  mapleDark: '#9E0C24',
  mapleSoft: '#FBE7EA',
  gold: '#C99A2E',
  goldSoft: '#FBF1D8',
  ink: '#0E1A2B',
  slate: '#3C4A5C',
  muted: '#6B7787',
  hint: '#9AA5B1',
  line: '#E5E9EF',
  cloud: '#F4F6F9',
  surface: '#FFFFFF',
  white: '#FFFFFF',
  jade: '#1F8A70',
  jadeSoft: '#E2F4EE',
  sky: '#2C6FB3',
  skySoft: '#E4EFFA',
  plum: '#7A4FB5',
  plumSoft: '#EEE7F8',
  amber: '#D98324',
  amberSoft: '#FBEEDD',
  danger: '#D14343',
  success: '#1F8A70',
};

export const colors = {
  ...palette,
  primary: palette.maple,
  primaryDark: palette.mapleDark,
  primarySoft: palette.mapleSoft,
  accent: palette.gold,
  accentSoft: palette.goldSoft,

  bg: palette.cloud,
  chatBg: '#ECEFF3',
  surface: palette.surface,
  surfaceAlt: palette.cloud,
  card: palette.white,

  text: palette.ink,
  textSecondary: palette.slate,
  textMuted: palette.muted,
  textHint: palette.hint,
  onPrimary: palette.white,

  border: palette.line,
  divider: palette.line,

  tabActive: palette.maple,
  tabInactive: palette.hint,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const typography = {
  display: { fontSize: 28, fontWeight: '800' as const, letterSpacing: 0.2 },
  title: { fontSize: 22, fontWeight: '800' as const },
  h2: { fontSize: 18, fontWeight: '700' as const },
  h3: { fontSize: 16, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const },
  label: { fontSize: 13, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
  micro: { fontSize: 11, fontWeight: '600' as const },
};

export const shadow = {
  card: {
    shadowColor: '#0E1A2B',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  floating: {
    shadowColor: '#0E1A2B',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
};

export const theme = { colors, spacing, radii, typography, shadow };
export type Theme = typeof theme;

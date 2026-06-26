import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography, shadow } from '../theme';

export function Card({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, style, pressed && { opacity: 0.85 }]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Avatar({
  initials,
  color,
  size = 48,
  verified,
}: {
  initials: string;
  color: string;
  size?: number;
  verified?: boolean;
}) {
  return (
    <View>
      <View
        style={[
          styles.avatar,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        ]}
      >
        <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{initials}</Text>
      </View>
      {verified && (
        <View style={[styles.verifiedBadge, { right: -2, bottom: -2 }]}>
          <Ionicons name="checkmark" size={10} color="#fff" />
        </View>
      )}
    </View>
  );
}

export function Tag({
  label,
  color = colors.primary,
  soft = colors.primarySoft,
  icon,
}: {
  label: string;
  color?: string;
  soft?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={[styles.tag, { backgroundColor: soft }]}>
      {icon && <Ionicons name={icon} size={12} color={color} style={{ marginRight: 4 }} />}
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
    >
      <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextIdle]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  style,
  small,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
}) {
  const palettes: Record<string, { bg: string; fg: string; border?: string }> = {
    primary: { bg: colors.primary, fg: colors.onPrimary },
    secondary: { bg: colors.primarySoft, fg: colors.primary },
    ghost: { bg: 'transparent', fg: colors.textSecondary, border: colors.border },
    dark: { bg: colors.ink, fg: '#fff' },
  };
  const p = palettes[variant];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        small && styles.buttonSmall,
        { backgroundColor: p.bg, borderColor: p.border ?? 'transparent', borderWidth: p.border ? 1 : 0 },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={small ? 15 : 17} color={p.fg} style={{ marginRight: 6 }} />}
      <Text style={[styles.buttonText, small && { fontSize: 13 }, { color: p.fg }]}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  color = colors.text,
  bg = colors.surface,
  size = 40,
  badge,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  color?: string;
  bg?: string;
  size?: number;
  badge?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Ionicons name={icon} size={size * 0.5} color={color} />
      {badge ? (
        <View style={styles.iconBadge}>
          <Text style={styles.iconBadgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, style]} />;
}

export function NavHeader({
  title,
  subtitle,
  onBack,
  right,
  dark,
  topInset = 0,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  dark?: boolean;
  topInset?: number;
}) {
  const fg = dark ? '#fff' : colors.text;
  const subFg = dark ? 'rgba(255,255,255,0.7)' : colors.textMuted;
  const backBg = dark ? 'rgba(255,255,255,0.16)' : colors.surfaceAlt;
  return (
    <View
      style={[
        styles.navHeader,
        { paddingTop: topInset + 8, backgroundColor: dark ? colors.ink : colors.surface },
        !dark && styles.navHeaderBorder,
      ]}
    >
      <Pressable
        onPress={onBack}
        style={[styles.navBack, { backgroundColor: backBg }]}
        hitSlop={8}
      >
        <Ionicons name="chevron-back" size={22} color={fg} />
      </Pressable>
      <View style={{ flex: 1, marginHorizontal: spacing.md }}>
        <Text style={[styles.navTitle, { color: fg }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.navSubtitle, { color: subFg }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

export function StatPill({ icon, value }: { icon: keyof typeof Ionicons.glyphMap; value: string }) {
  return (
    <View style={styles.statPill}>
      <Ionicons name={icon} size={13} color={colors.textMuted} />
      <Text style={styles.statPillText}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700' },
  verifiedBadge: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
  tagText: { ...typography.micro },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.ink },
  chipIdle: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chipText: { ...typography.label },
  chipTextActive: { color: '#fff' },
  chipTextIdle: { color: colors.textSecondary },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h2, color: colors.text },
  sectionAction: { ...typography.label, color: colors.primary },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: radii.md,
  },
  buttonSmall: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: radii.sm },
  buttonText: { ...typography.bodyStrong, fontWeight: '700' },
  iconButton: { alignItems: 'center', justifyContent: 'center', ...shadow.card },
  iconBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  iconBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.divider },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  navHeaderBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  navBack: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  navTitle: { ...typography.h2 },
  navSubtitle: { ...typography.caption, marginTop: 1 },
  statPill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statPillText: { ...typography.caption, color: colors.textMuted },
});

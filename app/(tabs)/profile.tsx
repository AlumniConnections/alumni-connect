import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radii, spacing, typography, shadow } from '../../src/theme';
import { useApp } from '../../src/store/AppContext';
import { useAuth } from '../../src/store/AuthContext';
import { Avatar, Tag } from '../../src/components/ui';
import { currentUser } from '../../src/data/profiles';

export default function ProfileScreen() {
  const { t, tx, lang, toggleLang } = useApp();
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const u = user ?? currentUser;
  const openTo = (u.openTo ?? []) as string[];

  const infoRows: { icon: any; label: string; value: string }[] = [
    { icon: 'school-outline', label: t('profile_university'), value: tx(u.university) },
    { icon: 'book-outline', label: t('profile_major'), value: tx(u.major) },
    { icon: 'ribbon-outline', label: t('profile_grad'), value: String(u.gradYear) },
    { icon: 'location-outline', label: t('profile_city'), value: u.city },
    { icon: 'briefcase-outline', label: t('profile_occupation'), value: tx(u.occupation) },
    { icon: 'airplane-outline', label: t('profile_immigrated'), value: String(u.immigrationYear ?? '—') },
  ];

  const menu: { icon: any; label: string; route?: string; trailing?: string; onPress?: () => void }[] = [
    { icon: 'language-outline', label: t('language'), trailing: t('language_value'), onPress: toggleLang },
    { icon: 'people-outline', label: t('my_groups'), route: '/(tabs)/messages' },
    { icon: 'bookmark-outline', label: t('saved_items') },
    { icon: 'notifications-outline', label: t('notifications_setting'), route: '/notifications' },
    { icon: 'lock-closed-outline', label: t('privacy') },
    { icon: 'help-circle-outline', label: t('help_support') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.headerTopRow}>
            <Pressable onPress={toggleLang} style={styles.langToggle}>
              <Ionicons name="language" size={15} color="#fff" />
              <Text style={styles.langToggleText}>{lang === 'zh' ? 'EN' : '中'}</Text>
            </Pressable>
            <Pressable style={styles.settingsBtn}>
              <Ionicons name="settings-outline" size={20} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.profileTop}>
            <Avatar initials={u.initials} color={colors.gold} size={80} verified={u.verified} />
            <Text style={styles.name}>{tx(u.name)}</Text>
            {u.headline && <Text style={styles.headline}>{tx(u.headline)}</Text>}
            <View style={styles.openToRow}>
              {openTo.includes('mentoring') && (
                <Tag label={t('open_to_mentoring')} color="#fff" soft="rgba(255,255,255,0.18)" icon="ribbon" />
              )}
              {openTo.includes('newcomer-help') && (
                <Tag label={t('open_to_newcomer')} color="#fff" soft="rgba(255,255,255,0.18)" icon="heart" />
              )}
            </View>
          </View>

          <View style={styles.statsRow}>
            <Stat value="438" label={t('stat_connections')} />
            <View style={styles.statDivider} />
            <Stat value="27" label={t('stat_posts')} />
            <View style={styles.statDivider} />
            <Stat value="6" label={t('stat_groups')} />
          </View>
        </View>

        <View style={styles.body}>
          <Pressable style={styles.editBtn}>
            <Ionicons name="create-outline" size={18} color={colors.primary} />
            <Text style={styles.editBtnText}>{t('edit_profile')}</Text>
          </Pressable>

          <View style={styles.card}>
            {infoRows.map((row, i) => (
              <View key={row.label}>
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name={row.icon} size={18} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>{row.label}</Text>
                    <Text style={styles.infoValue}>{row.value}</Text>
                  </View>
                </View>
                {i < infoRows.length - 1 && <View style={styles.infoDivider} />}
              </View>
            ))}
          </View>

          <View style={[styles.card, { marginTop: spacing.lg, paddingVertical: spacing.xs }]}>
            {menu.map((m, i) => (
              <Pressable
                key={m.label}
                style={styles.menuRow}
                onPress={m.onPress ?? (m.route ? () => router.push(m.route as any) : undefined)}
              >
                <Ionicons name={m.icon} size={20} color={colors.textSecondary} />
                <Text style={styles.menuLabel}>{m.label}</Text>
                {m.trailing && <Text style={styles.menuTrailing}>{m.trailing}</Text>}
                <Ionicons name="chevron-forward" size={18} color={colors.textHint} />
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.signOut} onPress={signOut}>
            <Text style={styles.signOutText}>{t('sign_out')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  langToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.16)', paddingHorizontal: 12, height: 36, borderRadius: radii.pill,
  },
  langToggleText: { color: '#fff', ...typography.label },
  settingsBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  profileTop: { alignItems: 'center', marginTop: spacing.sm },
  name: { ...typography.title, color: '#fff', marginTop: spacing.md },
  headline: { ...typography.body, color: 'rgba(255,255,255,0.75)', marginTop: 4, textAlign: 'center' },
  openToRow: { flexDirection: 'row', gap: 6, marginTop: spacing.md },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radii.md,
    paddingVertical: spacing.md,
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { ...typography.h2, color: '#fff' },
  statLabel: { ...typography.caption, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.15)' },
  body: { padding: spacing.lg },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: colors.primarySoft, borderRadius: radii.md, paddingVertical: 12, marginBottom: spacing.lg,
  },
  editBtnText: { ...typography.bodyStrong, color: colors.primary, fontWeight: '700' },
  card: { backgroundColor: colors.card, borderRadius: radii.lg, paddingHorizontal: spacing.lg, ...shadow.card },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  infoIcon: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  infoLabel: { ...typography.caption, color: colors.textMuted },
  infoValue: { ...typography.bodyStrong, color: colors.text, marginTop: 1 },
  infoDivider: { height: 1, backgroundColor: colors.divider, marginLeft: 50 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 14, paddingHorizontal: 2 },
  menuLabel: { ...typography.body, color: colors.text, flex: 1 },
  menuTrailing: { ...typography.caption, color: colors.textMuted },
  signOut: { alignItems: 'center', paddingVertical: spacing.lg, marginTop: spacing.md },
  signOutText: { ...typography.bodyStrong, color: colors.danger },
});

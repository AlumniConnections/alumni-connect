import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radii, spacing, typography, shadow } from '../../src/theme';
import { useApp } from '../../src/store/AppContext';
import { Avatar, Button, NavHeader, Tag } from '../../src/components/ui';
import { profileById } from '../../src/data/profiles';
import { conversations } from '../../src/data/conversations';

const openToMeta: Record<string, { key: any; color: string; soft: string; icon: string }> = {
  mentoring: { key: 'open_to_mentoring', color: colors.jade, soft: colors.jadeSoft, icon: 'ribbon' },
  hiring: { key: 'open_to_hiring', color: colors.maple, soft: colors.mapleSoft, icon: 'briefcase' },
  jobs: { key: 'open_to_jobs', color: colors.sky, soft: colors.skySoft, icon: 'search' },
  cofounder: { key: 'open_to_cofounder', color: colors.amber, soft: colors.amberSoft, icon: 'rocket' },
  'newcomer-help': { key: 'open_to_newcomer', color: colors.plum, soft: colors.plumSoft, icon: 'heart' },
};

export default function AlumniDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { t, tx, lang } = useApp();
  const u = profileById(id);

  if (!u) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <NavHeader title={t('back')} onBack={() => router.back()} topInset={insets.top} />
        <Text style={{ padding: spacing.lg, color: colors.textMuted }}>Not found.</Text>
      </View>
    );
  }

  const openDirectChat = () => {
    const existing = conversations.find((c) => c.kind === 'direct' && c.participantIds.includes(u.id));
    if (existing) router.push(`/chat/${existing.id}`);
    else router.push(`/chat/${conversations[1].id}`);
  };

  const infoRows: { icon: any; label: string; value: string }[] = [
    { icon: 'school-outline', label: t('profile_university'), value: tx(u.university) },
    { icon: 'book-outline', label: t('profile_major'), value: tx(u.major) },
    { icon: 'ribbon-outline', label: t('profile_grad'), value: String(u.gradYear) },
    { icon: 'location-outline', label: t('profile_city'), value: u.city },
    { icon: 'briefcase-outline', label: t('profile_occupation'), value: tx(u.occupation) },
    { icon: 'airplane-outline', label: t('profile_immigrated'), value: String(u.immigrationYear ?? '—') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <NavHeader title={t('view_profile')} onBack={() => router.back()} dark topInset={insets.top} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        <View style={styles.hero}>
          <Avatar initials={u.initials} color={u.avatarColor} size={88} verified={u.verified} />
          <Text style={styles.name}>{tx(u.name)}</Text>
          <Text style={styles.occupation}>{tx(u.occupation)}</Text>
          {u.headline && <Text style={styles.headline}>{tx(u.headline)}</Text>}

          <View style={styles.actions}>
            <Button label={t('message_btn')} icon="chatbubble-outline" style={{ flex: 1 }} onPress={openDirectChat} />
            <Button label={t('connect_btn')} icon="person-add-outline" variant="ghost" style={{ flex: 1 }} />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            {infoRows.map((row, i) => (
              <View key={row.label}>
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name={row.icon} size={18} color={u.avatarColor} />
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

          {u.openTo && u.openTo.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{t('profile_offers')}</Text>
              <View style={styles.tagsRow}>
                {u.openTo.map((o) => {
                  const m = openToMeta[o];
                  return <Tag key={o} label={t(m.key)} color={m.color} soft={m.soft} icon={m.icon as any} />;
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.ink,
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  name: { ...typography.title, color: '#fff', marginTop: spacing.md },
  occupation: { ...typography.bodyStrong, color: colors.gold, marginTop: 4 },
  headline: { ...typography.body, color: 'rgba(255,255,255,0.72)', marginTop: 4, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg, alignSelf: 'stretch' },
  section: { padding: spacing.lg },
  card: { backgroundColor: colors.card, borderRadius: radii.lg, paddingHorizontal: spacing.lg, ...shadow.card },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  infoIcon: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  infoLabel: { ...typography.caption, color: colors.textMuted },
  infoValue: { ...typography.bodyStrong, color: colors.text, marginTop: 1 },
  infoDivider: { height: 1, backgroundColor: colors.divider, marginLeft: 50 },
  sectionTitle: { ...typography.h3, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});

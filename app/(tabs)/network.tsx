import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radii, spacing, typography } from '../../src/theme';
import { useApp } from '../../src/store/AppContext';
import { Avatar, Card, Chip, Tag } from '../../src/components/ui';
import { otherProfiles } from '../../src/data/profiles';
import type { Profile } from '../../src/types';

const openToMeta: Record<string, { key: any; color: string; soft: string }> = {
  mentoring: { key: 'open_to_mentoring', color: colors.jade, soft: colors.jadeSoft },
  hiring: { key: 'open_to_hiring', color: colors.maple, soft: colors.mapleSoft },
  jobs: { key: 'open_to_jobs', color: colors.sky, soft: colors.skySoft },
  cofounder: { key: 'open_to_cofounder', color: colors.amber, soft: colors.amberSoft },
  'newcomer-help': { key: 'open_to_newcomer', color: colors.plum, soft: colors.plumSoft },
};

const cities = ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Waterloo', 'Richmond', 'Mississauga'];

export default function NetworkScreen() {
  const { t, tx, lang } = useApp();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [cityFilter, setCityFilter] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return otherProfiles.filter((p) => {
      if (cityFilter && p.city !== cityFilter) return false;
      if (!q) return true;
      const hay = [
        p.name.zh, p.name.en, p.university.zh, p.university.en,
        p.major.zh, p.major.en, p.occupation.zh, p.occupation.en, p.city,
        String(p.gradYear),
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [query, cityFilter]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>{t('network_title')}</Text>
        <Text style={styles.subtitle}>
          {otherProfiles.length}+ {t('network_members')}
        </Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textHint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('network_search')}
            placeholderTextColor={colors.textHint}
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textHint} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
          <Chip label={t('filter_all')} active={!cityFilter} onPress={() => setCityFilter(null)} />
          {cities.map((c) => (
            <Chip key={c} label={c} active={cityFilter === c} onPress={() => setCityFilter(c)} />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, gap: spacing.md, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <AlumniRow profile={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={40} color={colors.textHint} />
            <Text style={styles.emptyText}>{lang === 'zh' ? '没有找到匹配的校友' : 'No matching alumni'}</Text>
          </View>
        }
      />
    </View>
  );
}

function AlumniRow({ profile }: { profile: Profile }) {
  const { tx, t } = useApp();
  return (
    <Card onPress={() => router.push(`/alumni/${profile.id}`)}>
      <View style={{ flexDirection: 'row' }}>
        <Avatar initials={profile.initials} color={profile.avatarColor} size={54} verified={profile.verified} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{tx(profile.name)}</Text>
            <Text style={styles.gradYear}>'{String(profile.gradYear).slice(2)}</Text>
          </View>
          <Text style={styles.occupation} numberOfLines={1}>{tx(profile.occupation)}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="school-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText} numberOfLines={1}>{tx(profile.university)} · {tx(profile.major)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>{profile.city}</Text>
          </View>
        </View>
      </View>
      {profile.openTo && profile.openTo.length > 0 && (
        <View style={styles.tagsRow}>
          {profile.openTo.map((o) => {
            const m = openToMeta[o];
            return <Tag key={o} label={t(m.key)} color={m.color} soft={m.soft} />;
          })}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  title: { ...typography.title, color: '#fff' },
  subtitle: { ...typography.caption, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radii.md,
    paddingHorizontal: 12,
    height: 44,
    marginTop: spacing.md,
    gap: 8,
  },
  searchInput: { flex: 1, color: '#fff', ...typography.body },
  filterRow: { paddingVertical: spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { ...typography.h3, color: colors.text },
  gradYear: { ...typography.label, color: colors.textMuted },
  occupation: { ...typography.bodyStrong, color: colors.primary, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  metaText: { ...typography.caption, color: colors.textMuted, flex: 1 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.md },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl, gap: spacing.md },
  emptyText: { ...typography.body, color: colors.textMuted },
});

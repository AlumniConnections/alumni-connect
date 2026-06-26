import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radii, spacing, typography } from '../src/theme';
import { useApp } from '../src/store/AppContext';
import { Card, NavHeader, Tag, Button, SectionHeader } from '../src/components/ui';
import { meetings } from '../src/data/meetings';
import type { Meeting } from '../src/types';

export default function MeetingsScreen() {
  const { t, tx } = useApp();
  const insets = useSafeAreaInsets();
  const live = meetings.filter((m) => m.live);
  const upcoming = meetings.filter((m) => !m.live);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <NavHeader title={t('meetings_title')} onBack={() => router.back()} topInset={insets.top} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
        <Button label={t('start_meeting')} icon="add" onPress={() => router.push('/meeting/new-video')} style={{ marginBottom: spacing.xl }} />

        {live.length > 0 && (
          <View style={{ marginBottom: spacing.xl }}>
            <SectionHeader title={t('meetings_live')} />
            <View style={{ gap: spacing.md }}>
              {live.map((m) => <MeetingCard key={m.id} meeting={m} />)}
            </View>
          </View>
        )}

        <SectionHeader title={t('meetings_upcoming')} />
        <View style={{ gap: spacing.md }}>
          {upcoming.map((m) => <MeetingCard key={m.id} meeting={m} />)}
        </View>
      </ScrollView>
    </View>
  );
}

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const { t, tx } = useApp();
  return (
    <Card onPress={() => router.push(`/meeting/${meeting.id}`)}>
      <View style={styles.top}>
        <Tag label={tx(meeting.tag)} color={colors.sky} soft={colors.skySoft} />
        {meeting.live ? (
          <View style={styles.liveChip}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{t('meetings_live')}</Text>
          </View>
        ) : (
          <Text style={styles.startsAt}>{tx(meeting.startsAt)}</Text>
        )}
      </View>
      <Text style={styles.title}>{tx(meeting.title)}</Text>
      <View style={styles.metaRow}>
        <Ionicons name={meeting.kind === 'video' ? 'videocam-outline' : 'mic-outline'} size={14} color={colors.textMuted} />
        <Text style={styles.meta}>{tx(meeting.host)}</Text>
      </View>
      <View style={styles.footRow}>
        <View style={styles.metaRow}>
          <Ionicons name="people-outline" size={14} color={colors.textMuted} />
          <Text style={styles.meta}>{meeting.attendees} {t('meeting_attendees')} · {meeting.durationMin} min</Text>
        </View>
        <Button
          label={meeting.live ? t('join_meeting') : t('join_meeting')}
          small
          icon="enter-outline"
          variant={meeting.live ? 'primary' : 'secondary'}
          onPress={() => router.push(`/meeting/${meeting.id}`)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  liveChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.mapleSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.sm },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.maple },
  liveText: { ...typography.micro, color: colors.maple },
  startsAt: { ...typography.caption, color: colors.textMuted },
  title: { ...typography.h3, color: colors.text, lineHeight: 22 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  meta: { ...typography.caption, color: colors.textMuted },
  footRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md },
});

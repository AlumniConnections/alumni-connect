import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radii, spacing, typography, shadow } from '../../src/theme';
import { useApp } from '../../src/store/AppContext';
import { useAuth } from '../../src/store/AuthContext';
import { Avatar, Card, IconButton, SectionHeader, Tag, Button } from '../../src/components/ui';
import { PollCard } from '../../src/components/PollCard';
import { feed } from '../../src/data/feed';
import { meetings, meetingById } from '../../src/data/meetings';
import { currentUser, profileById } from '../../src/data/profiles';
import { notifications } from '../../src/data/notifications';
import type { FeedItem } from '../../src/types';

const quickActions = [
  { key: 'qa_meetings', icon: 'videocam', color: colors.maple, soft: colors.mapleSoft, route: '/meetings' },
  { key: 'qa_newcomer', icon: 'airplane', color: colors.jade, soft: colors.jadeSoft, route: '/resources/newcomer' },
  { key: 'qa_career', icon: 'briefcase', color: colors.sky, soft: colors.skySoft, route: '/resources/career' },
  { key: 'qa_startup', icon: 'rocket', color: colors.amber, soft: colors.amberSoft, route: '/resources/startup' },
  { key: 'qa_polls', icon: 'bar-chart', color: colors.plum, soft: colors.plumSoft, route: '/voting' },
  { key: 'qa_notifications', icon: 'megaphone', color: colors.gold, soft: colors.goldSoft, route: '/notifications' },
] as const;

function greetingKey() {
  const h = new Date().getHours();
  if (h < 12) return 'home_greeting_am' as const;
  if (h < 18) return 'home_greeting_pm' as const;
  return 'home_greeting_eve' as const;
}

export default function HomeScreen() {
  const { t, tx, lang, toggleLang } = useApp();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const me = user ?? currentUser;
  const unreadCount = notifications.filter((n) => n.unread).length;
  const liveMeeting = meetings.find((m) => m.live);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{t(greetingKey())}</Text>
            <Text style={styles.headerName}>{tx(me.name)}</Text>
          </View>
          <Pressable onPress={toggleLang} style={styles.langToggle}>
            <Ionicons name="language" size={15} color="#fff" />
            <Text style={styles.langToggleText}>{lang === 'zh' ? 'EN' : '中'}</Text>
          </Pressable>
          <View style={{ width: 10 }} />
          <IconButton
            icon="notifications-outline"
            bg="rgba(255,255,255,0.16)"
            color="#fff"
            badge={unreadCount}
            onPress={() => router.push('/notifications')}
          />
          <View style={{ width: 10 }} />
          <Pressable onPress={() => router.push('/(tabs)/profile')}>
            <Avatar initials={me.initials} color={colors.gold} size={40} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick actions */}
        <View style={styles.quickGrid}>
          {quickActions.map((qa) => (
            <Pressable
              key={qa.key}
              style={styles.quickItem}
              onPress={() => router.push(qa.route as any)}
            >
              <View style={[styles.quickIcon, { backgroundColor: qa.soft }]}>
                <Ionicons name={qa.icon as any} size={22} color={qa.color} />
              </View>
              <Text style={styles.quickLabel}>{t(qa.key as any)}</Text>
            </Pressable>
          ))}
        </View>

        {/* Live meeting banner */}
        {liveMeeting && (
          <Pressable onPress={() => router.push(`/meeting/${liveMeeting.id}`)} style={styles.liveBanner}>
            <View style={styles.liveDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.liveLabel}>{t('meetings_live')}</Text>
              <Text style={styles.liveTitle} numberOfLines={1}>{tx(liveMeeting.title)}</Text>
              <Text style={styles.liveMeta}>
                {tx(liveMeeting.host)} · {liveMeeting.attendees} {t('meeting_attendees')}
              </Text>
            </View>
            <View style={styles.liveJoin}>
              <Ionicons name="videocam" size={16} color="#fff" />
              <Text style={styles.liveJoinText}>{t('join_meeting')}</Text>
            </View>
          </Pressable>
        )}

        {/* Feed */}
        <View style={{ marginTop: spacing.xl }}>
          <SectionHeader title={t('home_feed')} />
          <View style={{ gap: spacing.md }}>
            {feed.map((item) => (
              <FeedCard key={item.id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  const { t, tx } = useApp();

  if (item.type === 'ad') {
    return (
      <Card style={{ borderLeftWidth: 3, borderLeftColor: item.accent }}>
        <View style={styles.feedTop}>
          <Tag label={t('home_sponsored')} color={item.accent} soft={colors.surfaceAlt} icon="pricetag" />
        </View>
        <Text style={styles.adHeadline}>{tx(item.headline)}</Text>
        <Text style={styles.feedBody}>{tx(item.body)}</Text>
        <Text style={styles.adBrand}>{tx(item.brand)}</Text>
        <Button label={tx(item.cta)} variant="secondary" small style={{ alignSelf: 'flex-start', marginTop: spacing.md }} />
      </Card>
    );
  }

  if (item.type === 'meeting') {
    const m = meetingById(item.meetingId);
    if (!m) return null;
    return (
      <Card onPress={() => router.push(`/meeting/${m.id}`)}>
        <View style={styles.feedTop}>
          <Tag label={tx(item.group)} color={colors.jade} soft={colors.jadeSoft} icon="videocam" />
          <Text style={styles.feedTime}>{tx(item.time)}</Text>
        </View>
        <Text style={styles.feedTitle}>{tx(m.title)}</Text>
        <View style={styles.meetingMetaRow}>
          <View style={styles.liveDotSm} />
          <Text style={styles.feedBody}>
            {tx(m.host)} · {m.attendees} {t('meeting_attendees')}
          </Text>
        </View>
        <Button label={t('join_meeting')} small icon="enter-outline" style={{ alignSelf: 'flex-start', marginTop: spacing.md }} onPress={() => router.push(`/meeting/${m.id}`)} />
      </Card>
    );
  }

  // poll & announcement share an author header
  const author = profileById(item.authorId);
  return (
    <Card>
      <View style={styles.feedHeaderRow}>
        <Avatar initials={author?.initials ?? '校'} color={author?.avatarColor ?? colors.primary} size={40} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={styles.feedAuthor}>{author ? tx(author.name) : tx(item.group)}</Text>
          <Text style={styles.feedSub}>
            {tx(item.group)} · {tx(item.time)}
          </Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={18} color={colors.textHint} />
      </View>

      {item.type === 'poll' ? (
        <View style={{ marginTop: spacing.md }}>
          <PollCard poll={item.poll} />
        </View>
      ) : (
        <>
          <Text style={[styles.feedBody, { marginTop: spacing.sm }]}>{tx(item.body)}</Text>
          <View style={styles.feedActions}>
            <View style={styles.feedAction}>
              <Ionicons name="heart-outline" size={18} color={colors.textMuted} />
              <Text style={styles.feedActionText}>{item.likes}</Text>
            </View>
            <View style={styles.feedAction}>
              <Ionicons name="chatbubble-outline" size={17} color={colors.textMuted} />
              <Text style={styles.feedActionText}>{item.comments}</Text>
            </View>
            <View style={styles.feedAction}>
              <Ionicons name="share-social-outline" size={17} color={colors.textMuted} />
            </View>
          </View>
        </>
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
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  greeting: { ...typography.caption, color: 'rgba(255,255,255,0.7)' },
  headerName: { ...typography.title, color: '#fff', marginTop: 2 },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: radii.pill,
  },
  langToggleText: { color: '#fff', ...typography.label },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadow.card,
  },
  quickItem: { width: '33.33%', alignItems: 'center', paddingVertical: spacing.sm },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickLabel: { ...typography.caption, color: colors.textSecondary },
  liveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.maple,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.md,
    ...shadow.card,
  },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  liveDotSm: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.maple, marginRight: 6 },
  liveLabel: { ...typography.micro, color: 'rgba(255,255,255,0.85)', letterSpacing: 1 },
  liveTitle: { ...typography.h3, color: '#fff', marginTop: 2 },
  liveMeta: { ...typography.caption, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  liveJoin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
  },
  liveJoinText: { color: '#fff', ...typography.label },
  feedTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  feedHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  feedAuthor: { ...typography.bodyStrong, color: colors.text },
  feedSub: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
  feedTitle: { ...typography.h3, color: colors.text, marginBottom: 4 },
  feedTime: { ...typography.caption, color: colors.textMuted },
  feedBody: { ...typography.body, color: colors.textSecondary, lineHeight: 21 },
  adHeadline: { ...typography.h3, color: colors.text, marginBottom: 4 },
  adBrand: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
  meetingMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  feedActions: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.md },
  feedAction: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  feedActionText: { ...typography.caption, color: colors.textMuted },
});

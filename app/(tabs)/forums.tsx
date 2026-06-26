import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radii, spacing, typography, shadow } from '../../src/theme';
import { useApp } from '../../src/store/AppContext';
import { Avatar, Card, SectionHeader, Tag, IconButton } from '../../src/components/ui';
import { forumCategories } from '../../src/data/forums';
import { forumThreads } from '../../src/data/forums';
import { profileById } from '../../src/data/profiles';
import type { ForumThread } from '../../src/types';

export default function ForumsScreen() {
  const { t, tx } = useApp();
  const insets = useSafeAreaInsets();
  const trending = [...forumThreads].sort((a, b) => b.views - a.views);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t('forums_title')}</Text>
          <IconButton icon="create-outline" bg="rgba(255,255,255,0.16)" color="#fff" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title={t('forums_categories')} />
        <View style={styles.catGrid}>
          {forumCategories.map((c) => (
            <Pressable
              key={c.id}
              style={styles.catCard}
              onPress={() => router.push(`/category/${c.id}`)}
            >
              <View style={[styles.catIcon, { backgroundColor: c.color + '1A' }]}>
                <Ionicons name={c.icon as any} size={22} color={c.color} />
              </View>
              <Text style={styles.catName} numberOfLines={1}>{tx(c.name)}</Text>
              <Text style={styles.catDesc} numberOfLines={2}>{tx(c.description)}</Text>
              <Text style={styles.catStats}>
                {c.threads.toLocaleString()} {t('tab_forums')} · {c.posts.toLocaleString()}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <SectionHeader title={t('forums_trending')} />
          <View style={{ gap: spacing.md }}>
            {trending.map((thread) => (
              <ThreadRow key={thread.id} thread={thread} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export function ThreadRow({ thread }: { thread: ForumThread }) {
  const { t, tx } = useApp();
  const author = profileById(thread.authorId);
  return (
    <Card onPress={() => router.push(`/thread/${thread.id}`)}>
      <View style={styles.threadTop}>
        {thread.pinned && <Tag label={t('pinned')} color={colors.sky} soft={colors.skySoft} icon="pin" />}
        {thread.hot && <Tag label={t('hot')} color={colors.maple} soft={colors.mapleSoft} icon="flame" />}
        {thread.tags.map((tg, i) => (
          <Tag key={i} label={tx(tg)} color={colors.textMuted} soft={colors.surfaceAlt} />
        ))}
      </View>
      <Text style={styles.threadTitle}>{tx(thread.title)}</Text>
      <Text style={styles.threadExcerpt} numberOfLines={2}>{tx(thread.excerpt)}</Text>
      <View style={styles.threadFoot}>
        <Avatar initials={author?.initials ?? '校'} color={author?.avatarColor ?? colors.primary} size={24} />
        <Text style={styles.threadAuthor}>{author ? tx(author.name) : ''}</Text>
        <Text style={styles.threadDot}>·</Text>
        <Text style={styles.threadMeta}>{tx(thread.lastActivity)}</Text>
        <View style={{ flex: 1 }} />
        <Ionicons name="chatbubble-outline" size={13} color={colors.textMuted} />
        <Text style={styles.threadMeta}>{thread.replies}</Text>
        <Ionicons name="eye-outline" size={14} color={colors.textMuted} style={{ marginLeft: 10 }} />
        <Text style={styles.threadMeta}>{(thread.views / 1000).toFixed(1)}k</Text>
      </View>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...typography.title, color: '#fff' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  catCard: {
    width: '47.6%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadow.card,
  },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  catName: { ...typography.h3, color: colors.text },
  catDesc: { ...typography.caption, color: colors.textMuted, marginTop: 2, minHeight: 32 },
  catStats: { ...typography.micro, color: colors.textHint, marginTop: spacing.sm },
  threadTop: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.sm },
  threadTitle: { ...typography.h3, color: colors.text, lineHeight: 22 },
  threadExcerpt: { ...typography.body, color: colors.textSecondary, marginTop: 4, lineHeight: 20 },
  threadFoot: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md },
  threadAuthor: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  threadDot: { color: colors.textHint },
  threadMeta: { ...typography.caption, color: colors.textMuted, marginLeft: 2 },
});

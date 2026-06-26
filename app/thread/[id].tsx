import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radii, spacing, typography } from '../../src/theme';
import { useApp } from '../../src/store/AppContext';
import { Avatar, NavHeader, Tag, Divider } from '../../src/components/ui';
import { threadById, forumReplies } from '../../src/data/forums';
import { profileById, currentUser } from '../../src/data/profiles';
import type { ForumReply } from '../../src/types';

export default function ThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { t, tx, lang } = useApp();
  const thread = threadById(id);
  const [replies, setReplies] = useState<ForumReply[]>(forumReplies[id] ?? []);
  const [draft, setDraft] = useState('');
  const [votes, setVotes] = useState<Record<string, number>>({});

  if (!thread) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <NavHeader title={t('forums_title')} onBack={() => router.back()} topInset={insets.top} />
      </View>
    );
  }

  const author = profileById(thread.authorId);

  const postReply = () => {
    if (!draft.trim()) return;
    setReplies((prev) => [
      ...prev,
      {
        id: `lr_${Date.now()}`,
        threadId: id,
        authorId: 'me',
        body: { zh: draft.trim(), en: draft.trim() },
        time: { zh: t('now'), en: t('now') },
        upvotes: 0,
      },
    ]);
    setDraft('');
  };

  const toggleVote = (rid: string, base: number) => {
    setVotes((prev) => ({ ...prev, [rid]: prev[rid] ? 0 : 1 }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <NavHeader
        title={tx(thread.title)}
        onBack={() => router.back()}
        topInset={insets.top}
        right={<Ionicons name="bookmark-outline" size={22} color={colors.textSecondary} />}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
          {/* Original post */}
          <View style={styles.opTags}>
            {thread.pinned && <Tag label={t('pinned')} color={colors.sky} soft={colors.skySoft} icon="pin" />}
            {thread.hot && <Tag label={t('hot')} color={colors.maple} soft={colors.mapleSoft} icon="flame" />}
            {thread.tags.map((tg, i) => (
              <Tag key={i} label={tx(tg)} color={colors.textMuted} soft={colors.surfaceAlt} />
            ))}
          </View>
          <Text style={styles.opTitle}>{tx(thread.title)}</Text>
          <View style={styles.opAuthor}>
            <Avatar initials={author?.initials ?? '校'} color={author?.avatarColor ?? colors.primary} size={36} />
            <View style={{ marginLeft: spacing.sm }}>
              <Text style={styles.authorName}>{author ? tx(author.name) : ''}</Text>
              <Text style={styles.authorSub}>
                {author ? tx(author.university) : ''} · {tx(thread.lastActivity)}
              </Text>
            </View>
          </View>
          <Text style={styles.opBody}>{tx(thread.excerpt)}</Text>
          <View style={styles.opStats}>
            <Text style={styles.statText}>{thread.views.toLocaleString()} {t('thread_views')}</Text>
            <Text style={styles.statDot}>·</Text>
            <Text style={styles.statText}>{replies.length} {t('thread_replies')}</Text>
          </View>

          <Divider style={{ marginVertical: spacing.lg }} />

          <Text style={styles.repliesHeading}>{replies.length} {t('thread_replies')}</Text>
          <View style={{ gap: spacing.lg, marginTop: spacing.md }}>
            {replies.map((r) => {
              const ra = profileById(r.authorId);
              const isMe = r.authorId === 'me';
              const voted = votes[r.id] === 1;
              return (
                <View key={r.id} style={styles.reply}>
                  <Avatar
                    initials={isMe ? currentUser.initials : ra?.initials ?? '?'}
                    color={isMe ? colors.gold : ra?.avatarColor ?? colors.primary}
                    size={34}
                  />
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <View style={styles.replyTop}>
                      <Text style={styles.replyName}>
                        {isMe ? tx(currentUser.name) : ra ? tx(ra.name) : ''}
                      </Text>
                      <Text style={styles.replyTime}>{tx(r.time)}</Text>
                    </View>
                    <Text style={styles.replyBody}>{tx(r.body)}</Text>
                    <Pressable style={styles.upvote} onPress={() => toggleVote(r.id, r.upvotes)}>
                      <Ionicons
                        name={voted ? 'arrow-up-circle' : 'arrow-up-circle-outline'}
                        size={17}
                        color={voted ? colors.primary : colors.textMuted}
                      />
                      <Text style={[styles.upvoteText, voted && { color: colors.primary }]}>
                        {r.upvotes + (voted ? 1 : 0)}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View style={[styles.composer, { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.md }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t('reply_placeholder')}
            placeholderTextColor={colors.textHint}
            style={styles.input}
            multiline
          />
          <Pressable
            style={[styles.sendBtn, { backgroundColor: draft.trim() ? colors.primary : colors.border }]}
            onPress={postReply}
            disabled={!draft.trim()}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  opTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  opTitle: { ...typography.title, color: colors.text, marginTop: spacing.md, lineHeight: 30 },
  opAuthor: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  authorName: { ...typography.bodyStrong, color: colors.text },
  authorSub: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
  opBody: { ...typography.body, color: colors.textSecondary, lineHeight: 23, marginTop: spacing.lg },
  opStats: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.lg },
  statText: { ...typography.caption, color: colors.textMuted },
  statDot: { color: colors.textHint },
  repliesHeading: { ...typography.h3, color: colors.text },
  reply: { flexDirection: 'row' },
  replyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  replyName: { ...typography.bodyStrong, color: colors.text },
  replyTime: { ...typography.caption, color: colors.textHint },
  replyBody: { ...typography.body, color: colors.textSecondary, lineHeight: 21, marginTop: 3 },
  upvote: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  upvoteText: { ...typography.caption, color: colors.textMuted },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    maxHeight: 110,
    minHeight: 42,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.lg,
  },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});

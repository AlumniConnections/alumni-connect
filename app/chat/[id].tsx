import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
import { Avatar } from '../../src/components/ui';
import { profileById } from '../../src/data/profiles';
import type { Message } from '../../src/types';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const {
    t,
    tx,
    messages,
    sendMessage,
    sendTyping,
    markRead,
    loadMessages,
    conversationById,
    currentUserId,
    typingByConversation,
    onlineUserIds,
  } = useApp();
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<Message>>(null);

  const conversation = conversationById(id);
  const thread = messages[id] ?? [];

  // Load history and mark the conversation as read on open.
  useEffect(() => {
    loadMessages(id);
    markRead(id);
  }, [id, loadMessages, markRead]);

  if (!conversation) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  const isGroup = conversation.kind === 'group';
  const otherId = conversation.participantIds.find((p) => p !== currentUserId);
  const someoneTyping = typingByConversation[id];
  const otherOnline = otherId ? onlineUserIds.has(otherId) : false;
  const subtitle = someoneTyping
    ? t('typing_indicator')
    : isGroup
      ? `${conversation.participantIds.length} ${t('members_count')}`
      : otherOnline
        ? t('online')
        : t('status_offline');

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(id, draft);
    setDraft('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 60);
  };

  const handleChangeText = (text: string) => {
    setDraft(text);
    if (text.trim()) sendTyping(id);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.chatBg }}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Avatar initials={conversation.initials} color={conversation.avatarColor} size={38} />
        <View style={{ flex: 1, marginLeft: spacing.sm }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{tx(conversation.title)}</Text>
          <Text
            style={[
              styles.headerSub,
              { color: someoneTyping || otherOnline || isGroup ? colors.success : colors.textMuted },
            ]}
          >
            {subtitle}
          </Text>
        </View>
        <Pressable style={styles.callBtn} onPress={() => router.push(`/meeting/voice-${conversation.id}`)}>
          <Ionicons name="call" size={20} color={colors.primary} />
        </Pressable>
        <Pressable style={styles.callBtn} onPress={() => router.push(`/meeting/video-${conversation.id}`)}>
          <Ionicons name="videocam" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={thread}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => <Bubble message={item} isGroup={isGroup} />}
        />

        <View style={[styles.inputBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.md }]}>
          <Pressable style={styles.plusBtn}>
            <Ionicons name="add-circle-outline" size={26} color={colors.textMuted} />
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={handleChangeText}
            placeholder={t('type_message')}
            placeholderTextColor={colors.textHint}
            style={styles.input}
            multiline
            onSubmitEditing={handleSend}
          />
          <Pressable
            style={[styles.sendBtn, { backgroundColor: draft.trim() ? colors.primary : colors.border }]}
            onPress={handleSend}
            disabled={!draft.trim()}
          >
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Bubble({ message, isGroup }: { message: Message; isGroup: boolean }) {
  const { tx, currentUserId } = useApp();
  const mine = message.senderId === currentUserId;
  const sender = profileById(message.senderId);

  if (message.system) {
    return (
      <View style={styles.systemWrap}>
        <Text style={styles.systemText}>{tx(message.text)}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.bubbleRow, mine ? styles.rowMine : styles.rowOther]}>
      {!mine && (
        <Avatar initials={sender?.initials ?? '?'} color={sender?.avatarColor ?? colors.primary} size={32} />
      )}
      <View style={{ maxWidth: '74%', marginHorizontal: 8 }}>
        {!mine && isGroup && sender && (
          <Text style={styles.senderName}>{tx(sender.name)}</Text>
        )}
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, mine && { color: '#fff' }]}>{tx(message.text)}</Text>
        </View>
        <Text style={[styles.time, mine ? { textAlign: 'right' } : null]}>{message.time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: { paddingRight: 4 },
  headerTitle: { ...typography.h3, color: colors.text },
  headerSub: { ...typography.caption, color: colors.success, marginTop: 1 },
  callBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end' },
  rowMine: { justifyContent: 'flex-end' },
  rowOther: { justifyContent: 'flex-start' },
  senderName: { ...typography.micro, color: colors.textMuted, marginBottom: 3, marginLeft: 4 },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: colors.surface, borderBottomLeftRadius: 4, ...{ shadowColor: '#0E1A2B', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 } },
  bubbleText: { ...typography.body, color: colors.text, lineHeight: 21 },
  time: { ...typography.micro, color: colors.textHint, marginTop: 3, marginHorizontal: 4 },
  systemWrap: { alignItems: 'center', marginVertical: spacing.sm },
  systemText: {
    ...typography.caption,
    color: colors.textMuted,
    backgroundColor: 'rgba(14,26,43,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 6,
  },
  plusBtn: { paddingBottom: 6 },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    maxHeight: 120,
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.lg,
  },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});

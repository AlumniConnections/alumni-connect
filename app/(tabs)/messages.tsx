import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radii, spacing, typography } from '../../src/theme';
import { useApp } from '../../src/store/AppContext';
import { Avatar, IconButton } from '../../src/components/ui';
import { conversations } from '../../src/data/conversations';
import type { Conversation } from '../../src/types';

export default function MessagesScreen() {
  const { t, tx } = useApp();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = conversations.filter((c) => {
      if (!q) return true;
      return (c.title.zh + c.title.en + c.lastMessage.zh + c.lastMessage.en).toLowerCase().includes(q);
    });
    return [...list].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));
  }, [query]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t('messages_title')}</Text>
          <IconButton icon="create-outline" bg="rgba(255,255,255,0.16)" color="#fff" />
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textHint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('messages_search')}
            placeholderTextColor={colors.textHint}
            style={styles.searchInput}
          />
        </View>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: spacing.sm, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ConversationRow conversation={item} />}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
}

function ConversationRow({ conversation }: { conversation: Conversation }) {
  const { tx, t } = useApp();
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfaceAlt }]}
      onPress={() => router.push(`/chat/${conversation.id}`)}
    >
      <View>
        <Avatar initials={conversation.initials} color={conversation.avatarColor} size={52} />
        {conversation.kind === 'group' && (
          <View style={styles.groupBadge}>
            <Ionicons name="people" size={10} color="#fff" />
          </View>
        )}
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <View style={styles.rowTop}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {tx(conversation.title)}
          </Text>
          <Text style={styles.rowTime}>{conversation.lastTime}</Text>
        </View>
        <View style={styles.rowBottom}>
          <Text style={styles.rowPreview} numberOfLines={1}>
            {conversation.kind === 'group' && (
              <Text style={styles.groupTag}>[{t('group_chat')}] </Text>
            )}
            {tx(conversation.lastMessage)}
          </Text>
          {conversation.pinned && (
            <Ionicons name="pin" size={13} color={colors.textHint} style={{ marginRight: 6 }} />
          )}
          {conversation.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{conversation.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radii.md,
    paddingHorizontal: 12,
    height: 42,
    marginTop: spacing.md,
    gap: 8,
  },
  searchInput: { flex: 1, color: '#fff', ...typography.body },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  groupBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.jade,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowTitle: { ...typography.h3, color: colors.text, flex: 1, marginRight: 8 },
  rowTime: { ...typography.caption, color: colors.textMuted },
  rowBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  rowPreview: { ...typography.body, color: colors.textMuted, flex: 1, marginRight: 8 },
  groupTag: { color: colors.jade, fontWeight: '600' },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  sep: { height: 1, backgroundColor: colors.divider, marginLeft: 80 },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radii, spacing, typography } from '../src/theme';
import { useApp } from '../src/store/AppContext';
import { Card, NavHeader } from '../src/components/ui';
import { notifications as seed } from '../src/data/notifications';
import type { NotificationItem } from '../src/types';

export default function NotificationsScreen() {
  const { t, tx } = useApp();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<NotificationItem[]>(seed);

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <NavHeader
        title={t('notifications_title')}
        onBack={() => router.back()}
        topInset={insets.top}
        right={
          <Pressable onPress={markAllRead} hitSlop={8}>
            <Text style={styles.markRead}>{t('mark_all_read')}</Text>
          </Pressable>
        }
      />
      <FlatList
        data={items}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Row item={item} />}
      />
    </View>
  );
}

function Row({ item }: { item: NotificationItem }) {
  const { tx } = useApp();
  return (
    <Card style={item.unread ? styles.unreadCard : undefined}>
      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.icon, { backgroundColor: item.color + '1A' }]}>
          <Ionicons name={item.icon as any} size={20} color={item.color} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <View style={styles.topRow}>
            <Text style={styles.group} numberOfLines={1}>{tx(item.group)}</Text>
            <Text style={styles.time}>{tx(item.time)}</Text>
          </View>
          <Text style={styles.title}>{tx(item.title)}</Text>
          <Text style={styles.body} numberOfLines={2}>{tx(item.body)}</Text>
        </View>
        {item.unread && <View style={styles.dot} />}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  markRead: { ...typography.label, color: colors.primary },
  unreadCard: { borderLeftWidth: 3, borderLeftColor: colors.primary },
  icon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  group: { ...typography.caption, color: colors.textMuted, flex: 1, marginRight: 8 },
  time: { ...typography.caption, color: colors.textHint },
  title: { ...typography.bodyStrong, color: colors.text, marginTop: 2 },
  body: { ...typography.body, color: colors.textSecondary, marginTop: 2, lineHeight: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: 6, marginTop: 6 },
});

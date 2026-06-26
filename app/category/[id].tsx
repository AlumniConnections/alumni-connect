import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, spacing, typography } from '../../src/theme';
import { useApp } from '../../src/store/AppContext';
import { NavHeader, Button } from '../../src/components/ui';
import { ThreadRow } from '../(tabs)/forums';
import { forumCategoryById, threadsByCategory } from '../../src/data/forums';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { t, tx, lang } = useApp();
  const category = forumCategoryById(id);
  const threads = threadsByCategory(id);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <NavHeader
        title={category ? tx(category.name) : t('forums_title')}
        subtitle={category ? tx(category.description) : undefined}
        onBack={() => router.back()}
        topInset={insets.top}
      />
      <FlatList
        data={threads}
        keyExtractor={(thread) => thread.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Button label={t('new_thread')} icon="create-outline" style={{ marginBottom: spacing.xs }} />
        }
        renderItem={({ item }) => <ThreadRow thread={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={40} color={colors.textHint} />
            <Text style={styles.emptyText}>{lang === 'zh' ? '该版块暂无帖子' : 'No posts yet in this category'}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', paddingTop: spacing.xxxl, gap: spacing.md },
  emptyText: { ...typography.body, color: colors.textMuted },
});

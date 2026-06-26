import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radii, spacing, typography, shadow } from '../../src/theme';
import { useApp } from '../../src/store/AppContext';
import { NavHeader } from '../../src/components/ui';
import { resourceCategories, resourcesByCategory } from '../../src/data/resources';

export default function ResourcesHub() {
  const { t, tx } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <NavHeader title={t('resources_title')} onBack={() => router.back()} topInset={insets.top} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
        {resourceCategories.map((cat) => {
          const items = resourcesByCategory(cat.id).slice(0, 2);
          return (
            <Pressable key={cat.id} style={styles.card} onPress={() => router.push(`/resources/${cat.id}`)}>
              <View style={styles.head}>
                <View style={[styles.icon, { backgroundColor: cat.colorSoft }]}>
                  <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={styles.title}>{tx(cat.title)}</Text>
                  <Text style={styles.sub}>{tx(cat.subtitle)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textHint} />
              </View>
              <View style={styles.previewList}>
                {items.map((it) => (
                  <View key={it.id} style={styles.previewItem}>
                    <View style={[styles.bullet, { backgroundColor: cat.color }]} />
                    <Text style={styles.previewText} numberOfLines={1}>{tx(it.title)}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radii.lg, padding: spacing.lg, ...shadow.card },
  head: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.h3, color: colors.text },
  sub: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  previewList: { marginTop: spacing.md, gap: spacing.sm },
  previewItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bullet: { width: 6, height: 6, borderRadius: 3 },
  previewText: { ...typography.body, color: colors.textSecondary, flex: 1 },
});

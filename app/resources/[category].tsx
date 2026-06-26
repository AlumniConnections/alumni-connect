import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radii, spacing, typography } from '../../src/theme';
import { useApp } from '../../src/store/AppContext';
import { Card, NavHeader, Tag, Button } from '../../src/components/ui';
import { resourceCategoryById, resourcesByCategory } from '../../src/data/resources';
import type { ResourceCategory, ResourceItem } from '../../src/types';

export default function ResourceCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const insets = useSafeAreaInsets();
  const { t, tx } = useApp();
  const cat = resourceCategoryById(category as ResourceCategory['id']);
  const items = cat ? resourcesByCategory(cat.id) : [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <NavHeader
        title={cat ? tx(cat.title) : t('resources_title')}
        onBack={() => router.back()}
        topInset={insets.top}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
        {cat && (
          <View style={[styles.hero, { backgroundColor: cat.color }]}>
            <View style={styles.heroIcon}>
              <Ionicons name={cat.icon as any} size={28} color="#fff" />
            </View>
            <Text style={styles.heroTitle}>{tx(cat.title)}</Text>
            <Text style={styles.heroSub}>{tx(cat.subtitle)}</Text>
          </View>
        )}

        <View style={{ padding: spacing.lg, gap: spacing.md }}>
          {items.map((item) => (
            <ResourceCard key={item.id} item={item} accent={cat?.color ?? colors.primary} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ResourceCard({ item, accent }: { item: ResourceItem; accent: string }) {
  const { tx } = useApp();
  return (
    <Card>
      <View style={styles.cardTop}>
        <Tag label={tx(item.tag)} color={accent} soft={accent + '1A'} />
        <Text style={styles.meta}>{tx(item.meta)}</Text>
      </View>
      <Text style={styles.title}>{tx(item.title)}</Text>
      <Text style={styles.body}>{tx(item.body)}</Text>
      <Button
        label={tx(item.action)}
        small
        icon="arrow-forward"
        variant="secondary"
        style={{ alignSelf: 'flex-start', marginTop: spacing.md }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  heroIcon: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  heroTitle: { ...typography.title, color: '#fff' },
  heroSub: { ...typography.body, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  meta: { ...typography.caption, color: colors.textMuted },
  title: { ...typography.h3, color: colors.text },
  body: { ...typography.body, color: colors.textSecondary, marginTop: 4, lineHeight: 21 },
});

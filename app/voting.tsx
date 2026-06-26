import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, typography } from '../src/theme';
import { useApp } from '../src/store/AppContext';
import { Card, NavHeader, Tag } from '../src/components/ui';
import { PollCard } from '../src/components/PollCard';
import { polls } from '../src/data/feed';

export default function VotingScreen() {
  const { t } = useApp();
  const insets = useSafeAreaInsets();
  const active = polls.filter((p) => !p.closed);
  const closed = polls.filter((p) => p.closed);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <NavHeader title={t('voting_title')} onBack={() => router.back()} topInset={insets.top} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.md }} showsVerticalScrollIndicator={false}>
        {active.map((p) => (
          <Card key={p.id}>
            <PollCard poll={p} />
          </Card>
        ))}
        {closed.length > 0 && (
          <Text style={styles.closedHeading}>{t('poll_closed')}</Text>
        )}
        {closed.map((p) => (
          <Card key={p.id} style={{ opacity: 0.85 }}>
            <View style={{ marginBottom: spacing.sm }}>
              <Tag label={t('poll_closed')} color={colors.textMuted} soft={colors.surfaceAlt} icon="lock-closed" />
            </View>
            <PollCard poll={p} />
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  closedHeading: { ...typography.h3, color: colors.textSecondary, marginTop: spacing.md },
});

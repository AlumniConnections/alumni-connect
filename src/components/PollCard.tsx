import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme';
import { useApp } from '../store/AppContext';
import type { Poll } from '../types';

export function PollCard({ poll }: { poll: Poll }) {
  const { tx, t, votes, castVote } = useApp();
  const selected = votes[poll.id];
  const hasVoted = !!selected || poll.closed;

  // Reflect the in-session vote in the displayed totals.
  const computed = poll.options.map((o) => ({
    ...o,
    votes: o.votes + (selected === o.id ? 1 : 0),
  }));
  const total = poll.totalVotes + (selected ? 1 : 0);

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Ionicons name="bar-chart" size={16} color={colors.primary} />
        <Text style={styles.question}>{tx(poll.question)}</Text>
      </View>

      <View style={{ gap: 8, marginTop: spacing.md }}>
        {computed.map((opt) => {
          const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
          const isMine = selected === opt.id;
          return (
            <Pressable
              key={opt.id}
              disabled={hasVoted}
              onPress={() => castVote(poll.id, opt.id)}
              style={styles.optWrap}
            >
              {hasVoted && (
                <View
                  style={[
                    styles.bar,
                    { width: `${pct}%`, backgroundColor: isMine ? colors.primarySoft : colors.surfaceAlt },
                  ]}
                />
              )}
              <View style={styles.optRow}>
                <View style={styles.optLeft}>
                  {!hasVoted && (
                    <Ionicons name="ellipse-outline" size={18} color={colors.textHint} />
                  )}
                  {isMine && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
                  {hasVoted && !isMine && (
                    <Ionicons name="ellipse-outline" size={18} color={colors.textHint} />
                  )}
                  <Text style={[styles.optLabel, isMine && { color: colors.primary, fontWeight: '700' }]}>
                    {tx(opt.label)}
                  </Text>
                </View>
                {hasVoted && <Text style={styles.pct}>{pct}%</Text>}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.foot}>
        <Text style={styles.footText}>
          {total.toLocaleString()} {t('total_votes')} · {tx(poll.endsAt)}
        </Text>
        {poll.closed ? (
          <Text style={[styles.footText, { color: colors.textMuted }]}>{t('poll_closed')}</Text>
        ) : selected ? (
          <Text style={[styles.footText, { color: colors.success }]}>{t('your_vote_counted')}</Text>
        ) : (
          <Text style={[styles.footText, { color: colors.primary }]}>{t('vote_now')}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 2 },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  question: { ...typography.h3, color: colors.text, flex: 1, lineHeight: 22 },
  optWrap: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    justifyContent: 'center',
    minHeight: 44,
  },
  bar: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  optRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  optLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  optLabel: { ...typography.body, color: colors.text, flexShrink: 1 },
  pct: { ...typography.label, color: colors.textSecondary },
  foot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  footText: { ...typography.caption, color: colors.textMuted },
});

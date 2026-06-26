import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radii, spacing, typography } from '../../src/theme';
import { useApp } from '../../src/store/AppContext';
import { Avatar } from '../../src/components/ui';
import { meetingById } from '../../src/data/meetings';
import { conversationById } from '../../src/data/conversations';
import { profileById, otherProfiles } from '../../src/data/profiles';
import type { Profile } from '../../src/types';

export default function MeetingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { t, tx, lang } = useApp();

  const [connecting, setConnecting] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  // Resolve meeting context from the id.
  let kind: 'video' | 'voice' = 'video';
  let title = '';
  let participants: Profile[] = [];

  if (id.startsWith('voice-') || id.startsWith('video-')) {
    kind = id.startsWith('voice-') ? 'voice' : 'video';
    const convId = id.replace(/^(voice|video)-/, '');
    const conv = conversationById(convId);
    title = conv ? tx(conv.title) : t('meetings_title');
    participants = (conv?.participantIds ?? [])
      .filter((p) => p !== 'me')
      .map((p) => profileById(p))
      .filter(Boolean) as Profile[];
  } else {
    const m = meetingById(id);
    kind = m?.kind ?? 'video';
    title = m ? tx(m.title) : t('meetings_title');
    participants = otherProfiles.slice(0, 5);
  }

  if (participants.length === 0) participants = otherProfiles.slice(0, 3);

  useEffect(() => {
    const tmo = setTimeout(() => setConnecting(false), 1400);
    return () => clearTimeout(tmo);
  }, []);

  useEffect(() => {
    if (connecting) return;
    const iv = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(iv);
  }, [connecting]);

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  const tiles = [
    { id: 'me', initials: '我', color: colors.gold, name: lang === 'zh' ? '我' : 'You' },
    ...participants.map((p) => ({ id: p.id, initials: p.initials, color: p.avatarColor, name: tx(p.name) })),
  ];

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <View style={styles.statusRow}>
            {connecting ? (
              <Text style={styles.connecting}>{t('meeting_connecting')}</Text>
            ) : (
              <>
                <View style={styles.recDot} />
                <Text style={styles.timer}>{mmss}</Text>
                <Text style={styles.count}> · {tiles.length} {t('members_count')}</Text>
              </>
            )}
          </View>
        </View>
        <Pressable style={styles.minBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-down" size={24} color="#fff" />
        </Pressable>
      </View>

      {kind === 'video' ? (
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {tiles.map((tile) => (
            <View key={tile.id} style={styles.tile}>
              {tile.id === 'me' && !camOn ? (
                <View style={styles.camOff}>
                  <Avatar initials={tile.initials} color={tile.color} size={56} />
                  <Text style={styles.tileNameCenter}>{tile.name}</Text>
                </View>
              ) : (
                <View style={[styles.tileVideo, { backgroundColor: tile.color + '33' }]}>
                  <Avatar initials={tile.initials} color={tile.color} size={56} />
                </View>
              )}
              <View style={styles.tileLabel}>
                <Ionicons
                  name={tile.id === 'me' && !micOn ? 'mic-off' : 'mic'}
                  size={11}
                  color="#fff"
                />
                <Text style={styles.tileName} numberOfLines={1}>{tile.name}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.voiceWrap} showsVerticalScrollIndicator={false}>
          {tiles.map((tile) => (
            <View key={tile.id} style={styles.voiceItem}>
              <View style={styles.voiceAvatar}>
                <Avatar initials={tile.initials} color={tile.color} size={68} />
              </View>
              <Text style={styles.voiceName} numberOfLines={1}>{tile.name}</Text>
              <Ionicons name="mic" size={14} color={colors.jade} />
            </View>
          ))}
        </ScrollView>
      )}

      <View style={[styles.controls, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Control
          icon={micOn ? 'mic' : 'mic-off'}
          label={t('meeting_mic')}
          active={micOn}
          onPress={() => setMicOn((v) => !v)}
        />
        {kind === 'video' && (
          <Control
            icon={camOn ? 'videocam' : 'videocam-off'}
            label={t('meeting_camera')}
            active={camOn}
            onPress={() => setCamOn((v) => !v)}
          />
        )}
        <Control icon="share-outline" label={t('meeting_share')} />
        <Control icon="person-add" label={t('meeting_invite')} />
        <Control icon="call" label={t('meeting_leave')} danger onPress={() => router.back()} />
      </View>
    </View>
  );
}

function Control({
  icon,
  label,
  active = true,
  danger,
  onPress,
}: {
  icon: any;
  label: string;
  active?: boolean;
  danger?: boolean;
  onPress?: () => void;
}) {
  const bg = danger ? colors.danger : active ? 'rgba(255,255,255,0.16)' : '#fff';
  const fg = danger ? '#fff' : active ? '#fff' : colors.ink;
  return (
    <Pressable style={styles.control} onPress={onPress}>
      <View style={[styles.controlBtn, { backgroundColor: bg }, danger && styles.leaveBtn]}>
        <Ionicons name={icon} size={24} color={fg} style={danger && { transform: [{ rotate: '135deg' }] }} />
      </View>
      <Text style={styles.controlLabel}>{label}</Text>
    </Pressable>
  );
}

const TILE_W = '47%';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A1422' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  title: { ...typography.h3, color: '#fff' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  connecting: { ...typography.caption, color: colors.gold },
  recDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.maple, marginRight: 6 },
  timer: { ...typography.caption, color: '#fff' },
  count: { ...typography.caption, color: 'rgba(255,255,255,0.6)' },
  minBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.12)' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: spacing.lg, gap: spacing.md },
  tile: {
    width: TILE_W,
    aspectRatio: 0.82,
    borderRadius: radii.lg,
    backgroundColor: '#11203A',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  tileVideo: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  camOff: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0E1A2B', gap: 8 },
  tileNameCenter: { ...typography.caption, color: 'rgba(255,255,255,0.7)' },
  tileLabel: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    maxWidth: '85%',
  },
  tileName: { ...typography.micro, color: '#fff' },
  voiceWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.xl, padding: spacing.xl },
  voiceItem: { alignItems: 'center', width: 92, gap: 6 },
  voiceAvatar: { borderWidth: 2, borderColor: colors.jade, borderRadius: 40, padding: 3 },
  voiceName: { ...typography.caption, color: '#fff' },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  control: { alignItems: 'center', gap: 6 },
  controlBtn: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  leaveBtn: {},
  controlLabel: { ...typography.micro, color: 'rgba(255,255,255,0.8)' },
});

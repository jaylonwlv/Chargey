import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { chunky, colors } from '../lib/theme';
import { ChunkyButton } from './ui';

const pages = [
  {
    emoji: '🔌',
    title: 'your phone deserves a hype man',
    body: "every time you plug in, chargey plays a sound. that's it. that's the app. it's perfect.",
  },
  {
    emoji: '🗣️',
    title: 'plug in → it SCREAMS',
    body: 'airhorns. dramatic booms. a sad trombone when you unplug. pick your fighter or upload your own.',
  },
  {
    emoji: '🤝',
    title: 'setup takes like 60 sec',
    body: "apple makes us use the Shortcuts app for this (not our fault). we'll hold your hand the whole way. zero brain cells required.",
  },
];

export function Onboarding({ visible, onFinish }: { visible: boolean; onFinish: () => void }) {
  const [page, setPage] = useState(0);
  const last = page === pages.length - 1;
  const current = pages[page];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.root}>
        <View style={styles.page}>
          <Text style={{ fontSize: 110 }}>{current.emoji}</Text>
          <Text style={[chunky(34), styles.center]}>{current.title}</Text>
          <Text style={[chunky(17, '500'), styles.center, { color: colors.dim }]}>{current.body}</Text>
        </View>
        <View style={styles.dots}>
          {pages.map((_, i) => (
            <View key={i} style={[styles.dot, i === page && styles.dotOn]} />
          ))}
        </View>
        <ChunkyButton label={last ? "let's gooo ⚡️" : 'ok and?'} onPress={() => (last ? onFinish() : setPage(page + 1))} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.grape, padding: 24 },
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22 },
  center: { textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotOn: { width: 24, backgroundColor: colors.white },
});

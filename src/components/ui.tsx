import { ReactNode, useState } from 'react';
import { Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { chunky, colors } from '../lib/theme';

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>{children}</ScrollView>
    </SafeAreaView>
  );
}

export function ScreenTitle({ title, subtitle, onPress }: { title: string; subtitle: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Text style={chunky(36)}>{title}</Text>
      <Text style={[chunky(16, '500'), { color: colors.dim, marginTop: 6 }]}>{subtitle}</Text>
    </Pressable>
  );
}

/** Card with a hard offset "sticker" shadow. */
export function Sticker({ accent = colors.slime, children, style }: { accent?: string; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={style}>
      <View style={[styles.stickerShadow, { backgroundColor: accent }]} />
      <View style={styles.sticker}>{children}</View>
    </View>
  );
}

export function ChunkyButton({
  label,
  onPress,
  fill = colors.slime,
  text = colors.black,
  disabled,
}: {
  label: string;
  onPress: () => void;
  fill?: string;
  text?: string;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      {({ pressed }) => (
        <View>
          <View style={[styles.buttonShadow, pressed && { opacity: 0 }]} />
          <View style={[styles.button, { backgroundColor: fill }, pressed && { transform: [{ translateX: 4 }, { translateY: 5 }] }]}>
            <Text style={[chunky(18), { color: text, textAlign: 'center' }]}>{label}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

export function Label({ children }: { children: string }) {
  return <Text style={[chunky(12, '800'), { color: colors.faint, letterSpacing: 1 }]}>{children.toUpperCase()}</Text>;
}

export function LinkText({ label, color, onPress }: { label: string; color: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Text style={[chunky(15, '700'), { color }]}>{label}</Text>
    </Pressable>
  );
}

/** Renders **bold** and *italic* inside a string. */
export function RichText({ children, style }: { children: string; style?: object }) {
  const parts = children.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <Text style={[chunky(15, '500'), { color: colors.dim, lineHeight: 21 }, style]}>
      {parts.map((part, i) =>
        part.startsWith('**') ? (
          <Text key={i} style={{ fontWeight: '900', color: colors.white }}>{part.slice(2, -2)}</Text>
        ) : part.startsWith('*') ? (
          <Text key={i} style={{ fontStyle: 'italic', color: colors.white }}>{part.slice(1, -1)}</Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}

export function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.round(value * 100)}%`, backgroundColor: color }]} />
    </View>
  );
}

export function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable onPress={() => setOpen(!open)} style={styles.faq}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
        <Text style={[chunky(16, '700'), { flex: 1 }]}>{q}</Text>
        <Text style={[chunky(16), { color: colors.slime }]}>{open ? '–' : '+'}</Text>
      </View>
      {open && <RichText style={{ marginTop: 8 }}>{a}</RichText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 48, gap: 22 },
  sticker: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: colors.black,
    padding: 18,
  },
  stickerShadow: { ...StyleSheet.absoluteFill, borderRadius: 22, transform: [{ translateX: 5 }, { translateY: 6 }] },
  button: { borderRadius: 18, borderWidth: 3, borderColor: colors.black, paddingVertical: 16, paddingHorizontal: 20 },
  buttonShadow: {
    ...StyleSheet.absoluteFill,
    borderRadius: 18,
    backgroundColor: colors.white,
    transform: [{ translateX: 4 }, { translateY: 5 }],
  },
  progressTrack: { height: 10, borderRadius: 5, backgroundColor: colors.card, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  faq: { backgroundColor: colors.card, borderRadius: 16, padding: 14 },
});

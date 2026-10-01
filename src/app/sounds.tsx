import * as DocumentPicker from 'expo-document-picker';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ChunkyButton, Screen, ScreenTitle } from '../components/ui';
import { moments } from '../lib/sounds';
import { useChargey } from '../lib/store';
import { chunky, colors } from '../lib/theme';

function SoundRow({
  emoji,
  name,
  vibe,
  selected,
  playing,
  accent,
  onPress,
  onLongPress,
}: {
  emoji: string;
  name: string;
  vibe: string;
  selected: boolean;
  playing: boolean;
  accent: string;
  onPress: () => void;
  onLongPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={[styles.row, { borderColor: selected ? accent : 'transparent' }]}>
      <Text style={{ fontSize: 34, transform: [{ scale: playing ? 1.25 : 1 }, { rotate: playing ? '10deg' : '0deg' }] }}>{emoji}</Text>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={chunky(18)}>{name}</Text>
        <Text style={[chunky(13, '500'), { color: colors.dim }]}>{vibe}</Text>
      </View>
      <View style={[styles.check, selected ? { backgroundColor: accent, borderColor: accent } : null]}>
        {selected && <Text style={[chunky(14), { color: colors.black }]}>✓</Text>}
      </View>
    </Pressable>
  );
}

export default function Sounds() {
  const chargey = useChargey();
  const moment = chargey.pickerMoment;
  const accent = colors[moments.find((m) => m.id === moment)!.accentKey];
  const selected = chargey.selection[moment];

  const upload = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*', copyToCacheDirectory: true });
    if (result.canceled) return;
    const file = result.assets[0];
    try {
      chargey.addCustom(file.uri, file.name, moment);
    } catch (e) {
      Alert.alert('that file is NOT it 💀', `couldn't import it. try an mp3, m4a, or wav.\n\n${String(e)}`);
    }
  };

  const confirmDelete = (id: string, name: string) =>
    Alert.alert(`yeet "${name}"?`, "it'll be gone forever. like your ex.", [
      { text: 'nvm', style: 'cancel' },
      { text: 'yeet it', style: 'destructive', onPress: () => chargey.removeCustom(id) },
    ]);

  return (
    <Screen>
      <ScreenTitle title="the sound lab 🧪" subtitle="tap to preview + pick. Shortcuts always plays whatever's picked here." />

      <View style={styles.segment}>
        {moments.map((m) => {
          const on = m.id === moment;
          return (
            <Pressable key={m.id} onPress={() => chargey.setPickerMoment(m.id)} style={[styles.segmentItem, on && { backgroundColor: colors[m.accentKey] }]}>
              <Text style={[chunky(15, '800'), { color: on ? colors.black : colors.white }]}>{m.picker}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: 12 }}>
        {moment === 'unplug' && (
          <SoundRow
            emoji="🤐"
            name="off"
            vibe="no unplug sound. very mature of you."
            selected={selected === null}
            playing={false}
            accent={accent}
            onPress={() => chargey.select('unplug', null)}
          />
        )}
        {chargey.sounds.map((sound) => (
          <SoundRow
            key={sound.id}
            emoji={sound.emoji}
            name={sound.name}
            vibe={sound.vibe}
            selected={selected === sound.id}
            playing={chargey.nowPlayingId === sound.id}
            accent={accent}
            onPress={() => {
              chargey.select(moment, sound.id);
              chargey.preview(sound);
            }}
            onLongPress={sound.isCustom ? () => confirmDelete(sound.id, sound.name) : undefined}
          />
        ))}
      </View>

      <ChunkyButton label="⬇️ upload your own sound" onPress={upload} fill={colors.bubblegum} text={colors.white} />
      <Text style={[chunky(13, '500'), { color: colors.faint }]}>
        mp3 / m4a / wav from Files. keep it under ~25 sec, it's a charger not a podcast. long-press a custom sound to delete it.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    borderWidth: 3,
    backgroundColor: colors.card,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segment: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 14, padding: 4, gap: 4 },
  segmentItem: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
});

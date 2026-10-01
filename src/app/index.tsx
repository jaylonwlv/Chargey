import { BatteryState, useBatteryState } from 'expo-battery';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BatteryHero, BatteryStatus } from '../components/BatteryHero';
import { ChunkyButton, Label, LinkText, ProgressBar, Screen, ScreenTitle, Sticker } from '../components/ui';
import { moments } from '../lib/sounds';
import { countDone, setupBlurb, setupSteps } from '../lib/setup';
import { useChargey } from '../lib/store';
import { chunky, colors, quips } from '../lib/theme';

const pick = () => quips[Math.floor(Math.random() * quips.length)];

function batteryLabel(state: BatteryState) {
  switch (state) {
    case BatteryState.CHARGING:
      return 'eating rn 🍽️ (charging)';
    case BatteryState.FULL:
      return '100%. thriving. 💅';
    case BatteryState.UNPLUGGED:
      return 'running on vibes 🫠';
    default:
      return 'simulator says idk 🤷';
  }
}

export default function Home() {
  const chargey = useChargey();
  const battery = useBatteryState();
  const [quip, setQuip] = useState(pick);
  const [hype, setHype] = useState(false);
  const done = countDone(chargey.completedSteps);

  const simulate = () => {
    const sound = chargey.soundFor('plugIn');
    if (sound) chargey.preview(sound);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setHype(true);
    setTimeout(() => setHype(false), 1800);
  };

  return (
    <Screen>
      <ScreenTitle title="chargey ⚡️" subtitle={quip} onPress={() => setQuip(pick())} />

      <View style={{ gap: 10 }}>
        <BatteryHero hype={hype} />
        <BatteryStatus label={batteryLabel(battery)} />
      </View>

      <ChunkyButton label="⚡️ simulate plug in" onPress={simulate} disabled={hype} />

      {moments.map((m) => {
        const sound = chargey.soundFor(m.id);
        const accent = colors[m.accentKey];
        const playing = sound && chargey.nowPlayingId === sound.id;
        return (
          <Sticker key={m.id} accent={accent}>
            <View style={{ gap: 12 }}>
              <Label>{m.card}</Label>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <Text style={{ fontSize: 40 }}>{sound?.emoji ?? '🤐'}</Text>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={chunky(20)}>{sound?.name ?? 'nothing. silence. peace.'}</Text>
                  <Text style={[chunky(13, '500'), { color: colors.dim }]}>{sound?.vibe ?? 'you turned this one off.'}</Text>
                </View>
                {sound && (
                  <Pressable
                    onPress={() => chargey.togglePreview(sound)}
                    style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: accent, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={[chunky(18), { color: colors.black }]}>{playing ? '■' : '▶'}</Text>
                  </Pressable>
                )}
              </View>
              <LinkText
                label="change it up →"
                color={accent}
                onPress={() => {
                  chargey.setPickerMoment(m.id);
                  router.navigate('/sounds');
                }}
              />
            </View>
          </Sticker>
        );
      })}

      <Sticker accent={colors.sky}>
        <View style={{ gap: 12 }}>
          <Label>setup</Label>
          <Text style={chunky(18)}>{setupBlurb(done)}</Text>
          <ProgressBar value={done / setupSteps.length} color={colors.sky} />
          {done < setupSteps.length && <LinkText label="finish setup →" color={colors.sky} onPress={() => router.navigate('/setup')} />}
        </View>
      </Sticker>

      {chargey.syncError && (
        <Text style={[chunky(13, '600'), { color: colors.bubblegum }]}>
          heads up: couldn't save your sound for Shortcuts ({chargey.syncError}). try picking it again.
        </Text>
      )}
    </Screen>
  );
}

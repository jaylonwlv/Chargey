import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ChunkyButton, Screen, ScreenTitle, Sticker } from '../components/ui';
import { useChargey } from '../lib/store';
import { chunky, colors } from '../lib/theme';

/** Teaser for wallpaper packs: a wallpaper + matching charge sound, sold as one vibe. */
export default function Drip() {
  const chargey = useChargey();
  const [charging, setCharging] = useState(false);
  const [seated, setSeated] = useState(false);
  const emoji = chargey.soundFor('plugIn')?.emoji ?? '⚡️';

  return (
    <Screen>
      <ScreenTitle
        title="drip 💧"
        subtitle="coming soon: wallpapers that match your charge sound. lock screen and speaker sharing one braincell."
      />

      <View style={{ alignItems: 'center', gap: 10 }}>
        <Pressable onPress={() => setCharging(!charging)} style={[styles.phone, { backgroundColor: charging ? colors.slime : colors.grape }]}>
          <View style={[styles.glow, { backgroundColor: charging ? colors.sky : colors.bubblegum }]} />
          <Text style={chunky(14, '600')}>Tuesday, slay</Text>
          <Text style={[chunky(64, '700'), { marginTop: -4 }]}>9:41</Text>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Text style={{ fontSize: charging ? 84 : 54, transform: [{ rotate: charging ? '-10deg' : '0deg' }] }}>{emoji}</Text>
            <View style={styles.pill}>
              <Text style={chunky(13, '700')}>{charging ? '⚡️ charging · 100% that girl' : 'tap to plug in'}</Text>
            </View>
          </View>
        </Pressable>
        <Text style={[chunky(13, '500'), { color: colors.faint }]}>(tap the phone. go on.)</Text>
      </View>

      <Sticker accent={colors.sky}>
        <View style={{ gap: 8 }}>
          <Text style={chunky(20)}>what's cooking 👨‍🍳</Text>
          <Text style={[chunky(15, '500'), { color: colors.dim, lineHeight: 22 }]}>
            {'• wallpaper + sound packs you set in one tap\n• new drops regularly, filmed IRL\n• your lock screen will finally match your personality'}
          </Text>
        </View>
      </Sticker>

      <ChunkyButton
        label={seated ? "you're seated. we'll be loud about it. 🍿" : "i'm seated 🍿"}
        onPress={() => setSeated(true)}
        fill={seated ? colors.card : colors.slime}
        text={seated ? colors.white : colors.black}
        disabled={seated}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  phone: {
    width: 220,
    height: 440,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: colors.black,
    alignItems: 'center',
    paddingTop: 32,
    overflow: 'hidden',
  },
  glow: { position: 'absolute', width: 300, height: 300, borderRadius: 150, bottom: -120, right: -120, opacity: 0.8 },
  pill: { backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
});

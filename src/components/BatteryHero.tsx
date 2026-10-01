import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { colors } from '../lib/theme';

const BURST = ['⚡️', '🔋', '🔥', '💅', '🗣️', '‼️', '🤯', '✨'];

export function BatteryHero({ hype }: { hype: boolean }) {
  const level = useRef(new Animated.Value(0.2)).current;
  const pop = useRef(new Animated.Value(0)).current;
  const burst = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(level, { toValue: hype ? 1 : 0.2, useNativeDriver: false, friction: hype ? 5 : 9 }).start();
    Animated.spring(pop, { toValue: hype ? 1 : 0, useNativeDriver: true, friction: 4 }).start();
    if (hype) {
      burst.setValue(0);
      Animated.timing(burst, { toValue: 1, duration: 1200, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    }
  }, [hype]);

  return (
    <View style={styles.row}>
      <View style={styles.body}>
        <View style={styles.track}>
          <Animated.View
            style={[styles.fill, { width: level.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
          />
        </View>
        <Animated.Text
          style={[
            styles.bolt,
            {
              transform: [
                { scale: pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] }) },
                { rotate: pop.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-12deg'] }) },
              ],
            },
          ]}
        >
          ⚡️
        </Animated.Text>
      </View>
      <View style={styles.nub} />

      {hype && (
        <View pointerEvents="none" style={styles.burst}>
          {BURST.map((emoji, i) => {
            const angle = (i / BURST.length) * Math.PI * 2;
            return (
              <Animated.Text
                key={emoji}
                style={{
                  position: 'absolute',
                  fontSize: 34,
                  opacity: burst.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                  transform: [
                    { translateX: burst.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(angle) * 160] }) },
                    { translateY: burst.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(angle) * 110] }) },
                    { scale: burst.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.4] }) },
                  ],
                }}
              >
                {emoji}
              </Animated.Text>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  body: {
    flex: 1,
    height: 130,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: colors.card,
    padding: 8,
    justifyContent: 'center',
  },
  track: { position: 'absolute', left: 8, right: 8, top: 8, bottom: 8 },
  fill: { height: '100%', borderRadius: 20, backgroundColor: colors.slime },
  bolt: { alignSelf: 'center', fontSize: 56 },
  nub: { width: 14, height: 46, borderRadius: 6, backgroundColor: colors.white },
  burst: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});

export function BatteryStatus({ label }: { label: string }) {
  return <Text style={{ fontFamily: 'ui-rounded', fontSize: 14, fontWeight: '600', color: colors.faint }}>status: {label}</Text>;
}

import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Linking, Modal, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChunkyButton, FAQ, LinkText, ProgressBar, RichText, Screen, ScreenTitle, Sticker } from '../components/ui';
import { countDone, setupSteps } from '../lib/setup';
import { useChargey } from '../lib/store';
import { chunky, colors } from '../lib/theme';

const faqs = [
  {
    q: "I tapped + but there's no Charger option",
    a: "You're in the **Library** tab (it has a + too, very rude of Apple). Tap **Automation** at the bottom. No automations yet? Use the blue **New Automation** button, since the Automation + only shows up once you have one.",
  },
  {
    q: "I can't find Chargey in the actions",
    a: "Open Chargey at least once (you're here, so ✅). Then force-quit Shortcuts and reopen it. iOS takes a sec to notice new apps. Still nothing? Restart your phone. The classic.",
  },
  {
    q: "it's completely silent",
    a: 'Crank your **media** volume (play a song, then hit volume up). If AirPods or a speaker are connected, the sound goes there lol.',
  },
  {
    q: 'it plays even on silent mode',
    a: "Yeah, it's a media sound so the silent switch doesn't stop it. In a lecture or a funeral? Open Shortcuts → Automation, tap the Charger automation and toggle it off for a bit.",
  },
  { q: 'I get a notification every time', a: 'Open the automation in Shortcuts and turn off **Notify When Run**.' },
  { q: 'it played twice', a: 'You made two automations. Happens to the best of us. Swipe left on the extra one in Shortcuts to delete it.' },
  { q: 'it asks me to confirm before running', a: 'Edit the automation and switch it to **Run Immediately**.' },
];

/** Room the step card takes around the screenshot: screen padding, card padding/border, number bubble. */
const CARD_CHROME = 140;
/** Keeps screenshots sane on big screens (iPad, landscape). */
const THUMB_MAX_WIDTH = 360;
/** Room the zoom view keeps for safe areas and the "tap to close" line. */
const ZOOM_CHROME = 140;

/** Screenshots are cropped to different shapes, so read each one's width / height. */
function aspectOf(image: number) {
  const { width, height } = Image.resolveAssetSource(image);
  return width / height;
}

/** Largest size with the image's proportions that fits inside maxWidth x maxHeight. */
function fit(image: number, maxWidth: number, maxHeight: number) {
  const aspect = aspectOf(image);
  const width = Math.min(maxWidth, maxHeight * aspect);
  return { width, height: width / aspect };
}

export default function Setup() {
  const chargey = useChargey();
  const done = countDone(chargey.completedSteps);
  const [zoomed, setZoomed] = useState<number | null>(null);
  const screen = useWindowDimensions();
  const thumbWidth = Math.min(screen.width - CARD_CHROME, THUMB_MAX_WIDTH);

  return (
    <Screen>
      <ScreenTitle title="setup 🛠️" subtitle="you're ~60 seconds from greatness. tap a step when you've done it." />
      <ProgressBar value={done / setupSteps.length} color={colors.slime} />

      {setupSteps.map((step, i) => {
        const isDone = chargey.completedSteps.includes(step.id);
        return (
          <Pressable key={step.id} onPress={() => chargey.toggleStep(step.id)}>
            <Sticker accent={isDone ? colors.slime : colors.grape} style={{ opacity: isDone ? 0.75 : 1 }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: isDone ? colors.slime : colors.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={[chunky(18), { color: colors.black }]}>{isDone ? '✓' : i + 1}</Text>
                </View>
                <View style={{ flex: 1, gap: 6 }}>
                  <Text style={[chunky(19), isDone && { textDecorationLine: 'line-through' }]}>
                    {step.emoji} {step.title}
                  </Text>
                  <RichText>{step.body}</RichText>
                  {step.image != null && (
                    <Pressable onPress={() => setZoomed(step.image!)} style={{ marginTop: 6 }}>
                      <Image
                        source={step.image}
                        style={[fit(step.image, thumbWidth, screen.height), { borderRadius: 16, borderWidth: 2, borderColor: colors.black }]}
                        resizeMode="cover"
                      />
                      <Text style={[chunky(12, '600'), { color: colors.faint, marginTop: 4 }]}>tap to zoom 🔍</Text>
                    </Pressable>
                  )}
                  {step.action === 'pickSound' && (
                    <LinkText label="go pick →" color={colors.slime} onPress={() => router.navigate('/sounds')} />
                  )}
                  {step.action === 'openShortcuts' && (
                    <View style={{ marginTop: 6 }}>
                      <ChunkyButton label="open Shortcuts ↗" fill={colors.grape} text={colors.white} onPress={() => Linking.openURL('shortcuts://')} />
                    </View>
                  )}
                </View>
              </View>
            </Sticker>
          </Pressable>
        );
      })}

      {done === setupSteps.length && (
        <Text style={[chunky(20), { color: colors.slime, textAlign: 'center' }]}>ALL DONE. you ate and left no crumbs. 🍽️</Text>
      )}

      <Sticker accent={colors.bubblegum}>
        <View style={{ gap: 8 }}>
          <Text style={chunky(19)}>BONUS: unplug sound 🚪</Text>
          <RichText>
            {'Do steps 3–7 again, but on the Charger screen tick **Is Disconnected** instead of Is Connected. Then open the new automation, tap *Plugged in* in the Chargey action and switch it to *Unplugged*. Now your phone is dramatic in both directions.'}
          </RichText>
        </View>
      </Sticker>

      <View style={{ gap: 12 }}>
        <Text style={[chunky(24), { marginTop: 8 }]}>it's not working 😭</Text>
        {faqs.map((f) => (
          <FAQ key={f.q} q={f.q} a={f.a} />
        ))}
      </View>

      <Modal visible={zoomed != null} animationType="fade" onRequestClose={() => setZoomed(null)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
          <Pressable onPress={() => setZoomed(null)} style={{ flex: 1, padding: 16, gap: 12, alignItems: 'center', justifyContent: 'center' }}>
            {zoomed != null && (
              <Image source={zoomed} style={[fit(zoomed, screen.width - 32, screen.height - ZOOM_CHROME), { borderRadius: 24 }]} resizeMode="contain" />
            )}
            <Text style={chunky(15, '700')}>tap anywhere to close</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </Screen>
  );
}

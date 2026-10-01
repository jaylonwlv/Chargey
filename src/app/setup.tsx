import { router } from 'expo-router';
import { Linking, Pressable, Text, View } from 'react-native';

import { ChunkyButton, FAQ, LinkText, ProgressBar, RichText, Screen, ScreenTitle, Sticker } from '../components/ui';
import { countDone, setupSteps } from '../lib/setup';
import { useChargey } from '../lib/store';
import { chunky, colors } from '../lib/theme';

const faqs = [
  {
    q: "I tapped + but there's no Charger option",
    a: "You're in the **Library** tab (it has a + too, very rude of Apple). Go back, tap **Automation** at the bottom, then tap **+** there. The Automation + shows triggers like Time of Day, Alarm, and **Charger**.",
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

export default function Setup() {
  const chargey = useChargey();
  const done = countDone(chargey.completedSteps);

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
          <Text style={chunky(19)}>BONUS: unplug sound 🎺</Text>
          <RichText>
            {'Do steps 3–5 again but pick **Is Disconnected**. In the Chargey action, tap *Plugged in* and switch it to *Unplugged*. Now your phone is dramatic in both directions.'}
          </RichText>
        </View>
      </Sticker>

      <View style={{ gap: 12 }}>
        <Text style={[chunky(24), { marginTop: 8 }]}>it's not working 😭</Text>
        {faqs.map((f) => (
          <FAQ key={f.q} q={f.q} a={f.a} />
        ))}
      </View>
    </Screen>
  );
}

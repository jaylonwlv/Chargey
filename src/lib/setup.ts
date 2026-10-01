export type SetupStep = {
  id: string;
  emoji: string;
  title: string;
  body: string;
  action?: 'pickSound' | 'openShortcuts';
};

export const setupSteps: SetupStep[] = [
  {
    id: 'pick',
    emoji: '🎧',
    title: 'pick ur sound',
    body: "Choose your fighter in the **sounds** tab. Swap it whenever: the automation always plays whatever's picked in the app.",
    action: 'pickSound',
  },
  {
    id: 'open',
    emoji: '📲',
    title: 'open Shortcuts → Automation',
    body: "It's the Shortcuts app Apple pre-installed that you've never opened. Tap the **Automation** tab at the bottom. ⚠️ NOT **Library**: that tab has a + too and it's a trap. If you don't see the word *Charger* on the next screen, you're in the wrong tab.",
    action: 'openShortcuts',
  },
  {
    id: 'new',
    emoji: '➕',
    title: 'start a new automation',
    body: "Still on the **Automation** tab? Good. Tap **+** in the top right (or **New Automation** if it's your first one). You'll see a list of triggers like Time of Day and Alarm. Scroll down and tap **Charger**.",
  },
  {
    id: 'connected',
    emoji: '🔌',
    title: 'set it to "Is Connected"',
    body: 'Select **Is Connected** and **Run Immediately** (not "after confirmation", we don\'t ask permission). Turn **Notify When Run** off so you don\'t get a banner every time. Tap **Next**.',
  },
  {
    id: 'action',
    emoji: '⚡️',
    title: 'add the Chargey action',
    body: 'Tap **New Blank Automation** → **Add Action** → search **Chargey** → tap **Play Chargey Sound**. Make sure it says *Plugged in*. Tap **Done**.',
  },
  {
    id: 'test',
    emoji: '🧪',
    title: 'the vibe check',
    body: "Unplug. Plug back in. If your phone screams, congrats, you're a developer now. Tell no one. (tell everyone.)",
  },
];

export function setupBlurb(done: number) {
  if (done === 0) return "haven't started. it's ok, we all procrastinate.";
  if (done >= setupSteps.length) return 'fully set up. you ate. 💅';
  return `${done}/${setupSteps.length} done. lock in. 🔒`;
}

export function countDone(completed: string[]) {
  return setupSteps.filter((s) => completed.includes(s.id)).length;
}

export type SetupStep = {
  id: string;
  emoji: string;
  title: string;
  body: string;
  /** Screenshot from a real run-through, tap target boxed in green. */
  image?: number;
  action?: 'pickSound' | 'openShortcuts';
};

// Matches the real Shortcuts flow on iOS 26. Regenerate the screenshots with
// tools/make_tutorial.py if Apple moves things around again.
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
    title: 'open Shortcuts, then tap Automation',
    body: "Shortcuts opens on **Library**. That's the trap: it has a + too, and it leads nowhere useful. Tap **Automation** at the bottom.",
    image: require('../../assets/tutorial/1-library-trap.jpg'),
    action: 'openShortcuts',
  },
  {
    id: 'new',
    emoji: '➕',
    title: 'tap New Automation',
    body: 'First automation ever? Tap the blue **New Automation** button. Already have some? Tap **+** in the top right instead.',
    image: require('../../assets/tutorial/2-new-automation.jpg'),
  },
  {
    id: 'charger',
    emoji: '🔌',
    title: 'scroll down, tap Charger',
    body: "It's a long list. **Charger** lives near the bottom, under Battery Level.",
    image: require('../../assets/tutorial/3-charger.jpg'),
  },
  {
    id: 'connected',
    emoji: '✅',
    title: 'Run Immediately, then Next',
    body: "**Is Connected** should already be ticked. Pick **Run Immediately** (not after confirmation, we don't ask permission) and leave **Notify When Run** off. Tap **Next**.",
    image: require('../../assets/tutorial/4-run-immediately.jpg'),
  },
  {
    id: 'chargey',
    emoji: '⚡️',
    title: 'find Chargey in the list',
    body: 'Scroll the app list (it goes A to Z) and tap **Chargey**. Or type "Chargey" in the search bar at the bottom.',
    image: require('../../assets/tutorial/5-pick-chargey.jpg'),
  },
  {
    id: 'play',
    emoji: '🔊',
    title: 'tap Play Chargey Sound',
    body: "That's it, it saves on its own. No Done button, no paperwork.",
    image: require('../../assets/tutorial/6-play-sound.jpg'),
  },
  {
    id: 'test',
    emoji: '🧪',
    title: 'the vibe check',
    body: "Your Automation tab should look like this. Now unplug, plug back in. If your phone screams, congrats, you're a developer now. Tell no one. (tell everyone.)",
    image: require('../../assets/tutorial/7-done.jpg'),
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

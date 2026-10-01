export type Moment = 'plugIn' | 'unplug';

export type ChargeSound = {
  id: string;
  name: string;
  emoji: string;
  vibe: string;
  /** require() id for bundled sounds, file uri for uploads. */
  source: number | string;
  ext: string;
  isCustom: boolean;
};

export const moments: { id: Moment; picker: string; card: string; accentKey: 'slime' | 'bubblegum' }[] = [
  { id: 'plugIn', picker: '🔌 plug in', card: 'when you plug in', accentKey: 'slime' },
  { id: 'unplug', picker: '🫥 unplug', card: 'when you unplug', accentKey: 'bubblegum' },
];

export const defaultSelection: Record<Moment, string | null> = {
  plugIn: 'power_up',
  unplug: 'sad_trombone',
};

export const builtInSounds: ChargeSound[] = [
  { id: 'ggez', name: 'gg ez', emoji: '🏆', vibe: 'you plugged in. you won. simple as.', source: require('../../assets/sounds/ggez.m4a'), ext: 'm4a', isCustom: false },
  { id: 'power_up', name: 'power up fr', emoji: '⚡️', vibe: '8-bit hero arc. main character energy.', source: require('../../assets/sounds/power_up.wav'), ext: 'wav', isCustom: false },
  { id: 'airhorn', name: 'airhorn (respectfully)', emoji: '📯', vibe: '3% → plugged in is a W. celebrate it.', source: require('../../assets/sounds/airhorn.wav'), ext: 'wav', isCustom: false },
  { id: 'the_boom', name: 'the boom', emoji: '💥', vibe: 'every plug-in is a plot twist.', source: require('../../assets/sounds/the_boom.wav'), ext: 'wav', isCustom: false },
  { id: 'nom_nom', name: 'nom nom nom', emoji: '😋', vibe: 'phone is eating good tonight.', source: require('../../assets/sounds/nom_nom.wav'), ext: 'wav', isCustom: false },
  { id: 'ka_ching', name: 'ka-ching', emoji: '🪙', vibe: 'battery is the new currency.', source: require('../../assets/sounds/ka_ching.wav'), ext: 'wav', isCustom: false },
  { id: 'microwave_done', name: 'microwave done', emoji: '♨️', vibe: 'beep beep beep. ur phone is a hot pocket now.', source: require('../../assets/sounds/microwave_done.wav'), ext: 'wav', isCustom: false },
  { id: 'bonk', name: 'bonk', emoji: '🔨', vibe: 'short. sweet. concussive.', source: require('../../assets/sounds/bonk.wav'), ext: 'wav', isCustom: false },
  { id: 'sad_trombone', name: 'sad trombone', emoji: '🎺', vibe: "elite unplug sound. it's giving abandonment.", source: require('../../assets/sounds/sad_trombone.wav'), ext: 'wav', isCustom: false },
];

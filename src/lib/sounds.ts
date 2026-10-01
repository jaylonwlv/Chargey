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
  plugIn: 'nani',
  unplug: 'get_out',
};

// Sources and licenses for every file live in assets/sounds/CREDITS.md.
export const builtInSounds: ChargeSound[] = [
  { id: 'nani', name: 'nani?!', emoji: '🤯', vibe: 'omae wa mou... plugged in.', source: require('../../assets/sounds/nani.m4a'), ext: 'm4a', isCustom: false },
  { id: 'yeet', name: 'YEET', emoji: '🫳', vibe: 'electrons yeeted directly into the battery.', source: require('../../assets/sounds/yeet.m4a'), ext: 'm4a', isCustom: false },
  { id: 'flashbang', name: 'flashbang', emoji: '💥', vibe: 'out of nowhere. no survivors.', source: require('../../assets/sounds/flashbang.m4a'), ext: 'm4a', isCustom: false },
  { id: 'aaaagh', name: 'AAAAGH', emoji: '😱', vibe: 'your phone at 1% seeing the charger.', source: require('../../assets/sounds/aaaagh.m4a'), ext: 'm4a', isCustom: false },
  { id: 'fahh', name: 'FAHH', emoji: '😩', vibe: 'finally. relief. sustenance.', source: require('../../assets/sounds/fahh.m4a'), ext: 'm4a', isCustom: false },
  { id: 'metal_bars', name: 'metal bars', emoji: '🔩', vibe: 'dropped a whole hardware store. on purpose.', source: require('../../assets/sounds/metal_bars.m4a'), ext: 'm4a', isCustom: false },
  { id: 'bonk', name: 'bonk', emoji: '🔨', vibe: 'short. sweet. concussive.', source: require('../../assets/sounds/bonk.m4a'), ext: 'm4a', isCustom: false },
  { id: 'buwomp', name: 'buwomp', emoji: '🫠', vibe: 'the sound of a mild inconvenience.', source: require('../../assets/sounds/buwomp.m4a'), ext: 'm4a', isCustom: false },
  { id: 'ggez', name: 'gg ez', emoji: '🏆', vibe: 'you plugged in. you won. simple as.', source: require('../../assets/sounds/ggez.m4a'), ext: 'm4a', isCustom: false },
  { id: 'get_out', name: 'GET OUT', emoji: '🚪', vibe: 'elite unplug sound. the charger has been evicted.', source: require('../../assets/sounds/get_out.m4a'), ext: 'm4a', isCustom: false },
  { id: 'ahh_fade', name: 'AHH (fade)', emoji: '🫥', vibe: 'your phone, slowly drifting off without its charger.', source: require('../../assets/sounds/ahh_fade.m4a'), ext: 'm4a', isCustom: false },
  { id: 'stock_horror', name: 'stock horror', emoji: '👻', vibe: 'something is living in the outlet.', source: require('../../assets/sounds/stock_horror.m4a'), ext: 'm4a', isCustom: false },
  { id: 'jump_scare_1', name: 'jump scare', emoji: '😨', vibe: 'and you thought charging was safe.', source: require('../../assets/sounds/jump_scare_1.m4a'), ext: 'm4a', isCustom: false },
  { id: 'jump_scare_2', name: 'jump scare 2', emoji: '💀', vibe: 'the sequel. scarier. zero budget.', source: require('../../assets/sounds/jump_scare_2.m4a'), ext: 'm4a', isCustom: false },
];

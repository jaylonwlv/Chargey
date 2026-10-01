import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { builtInSounds, ChargeSound, defaultSelection, Moment } from './sounds';
import {
  customSoundUri,
  CustomSoundRecord,
  deleteCustomSound,
  importCustomSound,
  loadState,
  saveState,
  SavedState,
  syncMomentSound,
} from './storage';

type Chargey = {
  sounds: ChargeSound[];
  selection: Record<Moment, string | null>;
  soundFor: (moment: Moment) => ChargeSound | null;
  select: (moment: Moment, id: string | null) => void;
  addCustom: (pickedUri: string, fileName: string, moment: Moment) => void;
  removeCustom: (id: string) => void;
  pickerMoment: Moment;
  setPickerMoment: (moment: Moment) => void;
  completedSteps: string[];
  toggleStep: (id: string) => void;
  onboarded: boolean;
  finishOnboarding: () => void;
  nowPlayingId: string | null;
  preview: (sound: ChargeSound) => void;
  togglePreview: (sound: ChargeSound) => void;
  syncError: string | null;
};

const ChargeyContext = createContext<Chargey | null>(null);

function toSound(record: CustomSoundRecord): ChargeSound {
  return {
    id: record.id,
    name: record.name,
    emoji: '🎤',
    vibe: 'custom. iconic. yours.',
    source: customSoundUri(record),
    ext: record.ext,
    isCustom: true,
  };
}

export function ChargeyProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<SavedState>(loadState);
  const [pickerMoment, setPickerMoment] = useState<Moment>('plugIn');
  const [nowPlayingId, setNowPlayingId] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const player = useRef(createAudioPlayer()).current;

  const custom = saved.customSounds ?? [];
  const sounds = useMemo(() => [...builtInSounds, ...custom.map(toSound)], [custom]);

  const resolve = (moment: Moment): string | null => {
    const picked = saved.selection?.[moment];
    if (picked === null) return null;
    // Missing, or points at a deleted upload: fall back to the default.
    if (picked && sounds.some((s) => s.id === picked)) return picked;
    return defaultSelection[moment];
  };
  const selection = { plugIn: resolve('plugIn'), unplug: resolve('unplug') };
  const soundFor = (moment: Moment) => sounds.find((s) => s.id === selection[moment]) ?? null;

  const update = useCallback((patch: (s: SavedState) => SavedState) => {
    setSaved((prev) => {
      const next = patch(prev);
      saveState(next);
      return next;
    });
  }, []);

  // Keep the files the Shortcuts action reads in step with the picks.
  const plugInSound = soundFor('plugIn');
  const unplugSound = soundFor('unplug');
  useEffect(() => {
    Promise.all([syncMomentSound('plugIn', plugInSound), syncMomentSound('unplug', unplugSound)])
      .then(() => setSyncError(null))
      .catch((e) => setSyncError(String(e?.message ?? e)));
  }, [plugInSound?.id, unplugSound?.id]);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'duckOthers' });
    const sub = player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish) setNowPlayingId(null);
    });
    return () => {
      sub.remove();
      player.remove();
    };
  }, [player]);

  const preview = useCallback(
    (sound: ChargeSound) => {
      player.replace(sound.source);
      player.play();
      setNowPlayingId(sound.id);
    },
    [player],
  );

  const value: Chargey = {
    sounds,
    selection,
    soundFor,
    select: (moment, id) => update((s) => ({ ...s, selection: { ...s.selection, [moment]: id } })),
    addCustom: (pickedUri, fileName, moment) => {
      const record = importCustomSound(pickedUri, fileName);
      update((s) => ({
        ...s,
        customSounds: [...(s.customSounds ?? []), record],
        selection: { ...s.selection, [moment]: record.id },
      }));
    },
    removeCustom: (id) => {
      const record = custom.find((c) => c.id === id);
      if (record) deleteCustomSound(record);
      update((s) => ({ ...s, customSounds: (s.customSounds ?? []).filter((c) => c.id !== id) }));
    },
    pickerMoment,
    setPickerMoment,
    completedSteps: saved.completedSteps ?? [],
    toggleStep: (id) =>
      update((s) => {
        const steps = s.completedSteps ?? [];
        return { ...s, completedSteps: steps.includes(id) ? steps.filter((x) => x !== id) : [...steps, id] };
      }),
    onboarded: saved.onboarded ?? false,
    finishOnboarding: () => update((s) => ({ ...s, onboarded: true })),
    nowPlayingId,
    preview,
    togglePreview: (sound) => {
      if (nowPlayingId === sound.id) {
        player.pause();
        setNowPlayingId(null);
      } else {
        preview(sound);
      }
    },
    syncError,
  };

  return <ChargeyContext.Provider value={value}>{children}</ChargeyContext.Provider>;
}

export function useChargey() {
  const ctx = useContext(ChargeyContext);
  if (!ctx) throw new Error('useChargey must be used inside ChargeyProvider');
  return ctx;
}

import { Asset } from 'expo-asset';
import { Directory, File, Paths } from 'expo-file-system';

import { ChargeSound, Moment } from './sounds';

/**
 * Everything lives in Documents/chargey/. The native Shortcuts action
 * (plugins/ios/ChargeyIntent.swift) plays Documents/chargey/<moment>.<ext>,
 * so whatever we copy there is what goes off when you plug in.
 */
const root = new Directory(Paths.document, 'chargey');
const customDir = new Directory(root, 'custom');
const stateFile = new File(root, 'state.json');

export type CustomSoundRecord = { id: string; name: string; ext: string };

export type SavedState = {
  onboarded?: boolean;
  selection?: Partial<Record<Moment, string | null>>;
  customSounds?: CustomSoundRecord[];
  completedSteps?: string[];
};

function ensureDirs() {
  if (!root.exists) root.create({ intermediates: true });
  if (!customDir.exists) customDir.create({ intermediates: true });
}

export function loadState(): SavedState {
  try {
    return stateFile.exists ? JSON.parse(stateFile.textSync()) : {};
  } catch {
    return {};
  }
}

export function saveState(state: SavedState) {
  ensureDirs();
  stateFile.write(JSON.stringify(state));
}

export function customSoundUri(record: CustomSoundRecord) {
  return new File(customDir, `${record.id}.${record.ext}`).uri;
}

/** Copies the picked sound into the slot the Shortcuts action reads. null clears it. */
export async function syncMomentSound(moment: Moment, sound: ChargeSound | null) {
  ensureDirs();
  for (const item of root.list()) {
    if (item instanceof File && item.name.startsWith(`${moment}.`)) item.delete();
  }
  if (!sound) return;

  let sourceUri: string;
  if (typeof sound.source === 'number') {
    const asset = await Asset.fromModule(sound.source).downloadAsync();
    if (!asset.localUri) throw new Error(`couldn't load ${sound.name}`);
    sourceUri = asset.localUri;
  } else {
    sourceUri = sound.source;
  }
  new File(sourceUri).copySync(new File(root, `${moment}.${sound.ext}`), { overwrite: true });
}

export function importCustomSound(pickedUri: string, fileName: string): CustomSoundRecord {
  ensureDirs();
  const dot = fileName.lastIndexOf('.');
  const ext = dot > 0 ? fileName.slice(dot + 1).toLowerCase() : 'm4a';
  const name = dot > 0 ? fileName.slice(0, dot) : fileName;
  const record = { id: `custom-${Date.now()}`, name, ext };
  new File(pickedUri).copySync(new File(customDir, `${record.id}.${ext}`));
  return record;
}

export function deleteCustomSound(record: CustomSoundRecord) {
  const file = new File(customDir, `${record.id}.${record.ext}`);
  if (file.exists) file.delete();
}

# chargey ⚡️

Your phone's hype man. Plug in → it plays a sound. Unplug → (optionally) a sad trombone.

Built with **Expo (SDK 57) + Expo Router**. No Mac needed: EAS builds the iOS app in the cloud,
and Metro serves the JS from your Linux machine.

## How it works

iOS doesn't let apps listen for charging in the background. Instead:

1. The app copies the sound you pick to `Documents/chargey/plugIn.<ext>` (and `unplug.<ext>`).
2. A native Swift **Play Chargey Sound** action (`plugins/ios/ChargeyIntent.swift`) plays that file.
   The config plugin `plugins/withChargeyIntent.js` adds it to the iOS project at build time.
3. A Shortcuts automation (Charger → Is Connected → Play Chargey Sound) fires it.
   It's an `AudioPlaybackIntent`, so it plays in the background without opening the app.

Because step 2 is native code, it **won't run in Expo Go**. Use a development build.

## One-time setup (Linux + iPhone)

You need a paid Apple Developer account and an Expo account.

```bash
npm install
npx eas-cli@latest login
npx eas-cli@latest init          # links this repo to an expo.dev project (writes projectId into app.json, commit it)
npx eas-cli@latest device:create # open the link on your iPhone to register it for internal builds
```

On the iPhone: **Settings → Privacy & Security → Developer Mode → On** (it restarts).

## Build the dev app (only when native stuff changes)

```bash
npm run build:dev   # = eas build --profile development --platform ios
```

The first run asks for your Apple login so EAS can create certificates and a provisioning profile.
Do this first run from the CLI. After that you can also trigger builds from GitHub on expo.dev
(Project → GitHub → connect `jaylonwlv/Chargey`, build profile `development`, platform iOS).

When the build finishes, open its expo.dev page on your iPhone and install it.

Rebuild **only** when you change something native: `plugins/ios/*.swift`, plugins in `app.json`,
or a new package with native code. JS/TS changes never need a rebuild.

## Day-to-day: Metro

```bash
npm start           # = expo start --dev-client
```

Open the **Chargey** dev app on your iPhone. It finds the server on the same Wi-Fi, or scan the QR
code with the Camera. Not on the same network? Use `npx expo start --dev-client --tunnel`.
Edits hot-reload.

The Shortcuts action is native, so it works even when Metro isn't running. Open the app once after
installing so it writes the sound files.

## Setup flow (the same steps the app shows)

1. Pick a sound in the **sounds** tab.
2. Open **Shortcuts** → **Automation** tab.
3. **+** → **Charger**.
4. **Is Connected** → **Run Immediately** → turn off **Notify When Run** → Next.
5. **New Blank Automation** → **Add Action** → search "Chargey" → **Play Chargey Sound** (Moment: *Plugged in*) → Done.
6. Bonus: repeat with **Is Disconnected** and Moment: *Unplugged*.

## Layout

```
src/app/            Expo Router screens: _layout (tabs + onboarding), index (home), sounds, setup, drip
src/components/     ui.tsx (sticker cards, chunky buttons, rich text, FAQ), BatteryHero, Onboarding
src/lib/            sounds (catalog), storage (files the Shortcuts action reads), store (app state), setup, theme
plugins/            withChargeyIntent.js + ios/ChargeyIntent.swift (the native Shortcuts action)
assets/sounds/      built-in sounds (gg ez is a real clip; the rest are synthesized placeholders)
tools/              make_sounds.py, make_icon.py (stdlib Python)
```

To add a built-in sound: drop the file into `assets/sounds/` and add an entry to
`builtInSounds` in `src/lib/sounds.ts`.

## Checks

```bash
npm run typecheck
npx expo export --platform ios   # bundles with Metro, catches import/asset errors
npx expo prebuild --platform ios --no-install --clean && rm -rf ios   # verifies the config plugin output
```

## Roadmap: wallpaper packs (the "drip" tab)

The drip tab is a teaser for now. The plan is packs where a wallpaper and a charge sound ship
together, with a "save wallpaper to Photos" button (iOS doesn't let apps set the wallpaper
directly, so the user sets it from Photos or Settings).

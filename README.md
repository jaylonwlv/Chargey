# chargey ⚡️

Your phone's hype man. Plug in → it plays a sound. Unplug → (optionally) a sad trombone.

iOS doesn't let apps listen for charging in the background, so Chargey ships a
**Play Chargey Sound** action, and a Shortcuts automation (Charger → Is Connected) runs it.
The app plays the sound in the background without opening, and walks the user through
setting up the automation.

## Run it

1. Open `Chargey.xcodeproj` in **Xcode 16+** (the project uses folder-synced groups, so any
   file you drop into `Chargey/` is picked up automatically).
2. Target → Signing & Capabilities → pick your **Team**. Change the bundle ID
   (`com.jaylonw.chargey`) if it's taken.
3. Run on a **real iPhone** (iOS 17+). The simulator can't plug into a charger, so automations
   won't fire there.
4. Follow the in-app **setup** tab.

## Setup flow (the same steps the app shows)

1. Pick a sound in the **sounds** tab.
2. Open **Shortcuts** → **Automation** tab.
3. **+** → **Charger**.
4. **Is Connected** → **Run Immediately** → turn off **Notify When Run** → Next.
5. **New Blank Automation** → **Add Action** → search "Chargey" → **Play Chargey Sound** (Moment: *Plugged in*) → Done.
6. Bonus: repeat with **Is Disconnected** and Moment: *Unplugged*.

## Layout

```
Chargey/
  App/        ChargeyApp entry point
  Models/     ChargeSound, ChargeMoment (also the Shortcuts parameter), SoundStore (UserDefaults + files), AppModel
  Audio/      SoundPlayer (AVAudioPlayer, .playback session)
  Intents/    PlayChargeSoundIntent (AudioPlaybackIntent), ChargeyShortcuts
  Views/      Home, Sounds ("the sound lab"), SetupGuide, Drip (wallpaper teaser), Onboarding
  Theme/      colors, fonts, sticker cards, chunky buttons, quips
  Resources/Sounds/  built-in WAVs
Config/Info.plist    UIBackgroundModes = audio (merged with the generated plist)
tools/      make_sounds.py, make_icon.py (stdlib Python; re-run to regenerate)
```

Built-in sounds are synthesized placeholders. Swap any `.wav` in `Chargey/Resources/Sounds/`
for a real recording with the same filename, or add new ones to `ChargeSound.builtIns`.
Users can also upload their own mp3/m4a/wav from Files.

## Roadmap: wallpaper packs (the "drip" tab)

The drip tab is a teaser for now. The plan is packs where a wallpaper and a charge sound ship
together. A natural next step is a `ChargePack { sound: ChargeSound, wallpaper: String }`
model, plus a "save wallpaper to Photos" button (iOS doesn't let apps set the wallpaper
directly, so the user sets it from Photos or Settings).

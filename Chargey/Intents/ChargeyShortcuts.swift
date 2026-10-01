import AppIntents

/// Makes "Play Chargey Sound" show up in Shortcuts and Siri the moment the app is installed.
struct ChargeyShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: PlayChargeSoundIntent(),
            phrases: [
                "Play my \(.applicationName) sound",
                "\(.applicationName) it up",
            ],
            shortTitle: "Play Chargey Sound",
            systemImageName: "bolt.fill"
        )
    }
}

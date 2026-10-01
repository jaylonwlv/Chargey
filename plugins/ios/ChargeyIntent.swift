import AppIntents
import AVFoundation

// Injected into the iOS app target by plugins/withChargeyIntent.js at prebuild time.
//
// Contract with the JS side (src/lib/storage.ts): the app copies the picked sound to
// Documents/chargey/plugIn.<ext> and Documents/chargey/unplug.<ext>. No file means "off".

enum ChargeMoment: String, AppEnum {
    case plugIn
    case unplug

    static let typeDisplayRepresentation: TypeDisplayRepresentation = "Moment"
    static let caseDisplayRepresentations: [ChargeMoment: DisplayRepresentation] = [
        .plugIn: "Plugged in",
        .unplug: "Unplugged",
    ]
}

@MainActor
enum ChargeyPlayer {
    /// Shortcuts gives an intent roughly 30s before giving up on it.
    static let maxLength: TimeInterval = 25
    private static var player: AVAudioPlayer?

    static func soundURL(for moment: ChargeMoment) -> URL? {
        let folder = URL.documentsDirectory.appending(path: "chargey", directoryHint: .isDirectory)
        let files = (try? FileManager.default.contentsOfDirectory(at: folder, includingPropertiesForKeys: nil)) ?? []
        return files.first { $0.deletingPathExtension().lastPathComponent == moment.rawValue }
    }

    static func playAndWait(_ url: URL) async {
        let session = AVAudioSession.sharedInstance()
        do {
            try session.setCategory(.playback, mode: .default, options: [.duckOthers])
            try session.setActive(true)
            let newPlayer = try AVAudioPlayer(contentsOf: url)
            player?.stop()
            player = newPlayer
            newPlayer.play()
            // Stay alive until the sound is done, otherwise iOS suspends us mid-scream.
            try? await Task.sleep(for: .seconds(min(newPlayer.duration, maxLength) + 0.3))
            newPlayer.stop()
            if player === newPlayer { player = nil }
            try? session.setActive(false, options: .notifyOthersOnDeactivation)
        } catch {
            print("chargey: couldn't play \(url.lastPathComponent): \(error)")
        }
    }
}

/// The action people drop into their "Charger → Is Connected" automation.
/// AudioPlaybackIntent lets it play in the background without opening the app.
struct PlayChargeSoundIntent: AudioPlaybackIntent {
    static let title: LocalizedStringResource = "Play Chargey Sound"
    static let description = IntentDescription(
        "Plays the sound you picked in Chargey. Put it in a Charger automation and let your phone scream."
    )

    @Parameter(title: "Moment", default: .plugIn)
    var moment: ChargeMoment

    static var parameterSummary: some ParameterSummary {
        Summary("Play Chargey sound for \(\.$moment)")
    }

    init() {}

    @MainActor
    func perform() async throws -> some IntentResult {
        // Switched off for this moment: do nothing, quietly.
        guard let url = ChargeyPlayer.soundURL(for: moment) else { return .result() }
        await ChargeyPlayer.playAndWait(url)
        return .result()
    }
}

/// Makes "Play Chargey Sound" show up in Shortcuts and Siri as soon as the app is installed.
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

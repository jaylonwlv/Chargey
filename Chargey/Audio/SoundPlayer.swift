import AVFoundation
import Observation

@Observable @MainActor
final class SoundPlayer {
    static let shared = SoundPlayer()

    /// Anything longer gets cut off. Shortcuts gives intents ~30s before it gives up.
    static let maxLength: TimeInterval = 25

    private(set) var nowPlayingID: String?
    @ObservationIgnored private var player: AVAudioPlayer?
    @ObservationIgnored private var playToken = 0

    /// Starts playback and returns how long it will run (0 if it couldn't play).
    @discardableResult
    func play(_ sound: ChargeSound) -> TimeInterval {
        guard let url = sound.url else { return 0 }
        do {
            // .playback so it still goes off in the background via Shortcuts.
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default, options: [.duckOthers])
            try session.setActive(true)

            player?.stop()
            let newPlayer = try AVAudioPlayer(contentsOf: url)
            newPlayer.play()
            player = newPlayer
            nowPlayingID = sound.id

            playToken += 1
            let token = playToken
            let length = min(newPlayer.duration, Self.maxLength)
            Task {
                try? await Task.sleep(for: .seconds(length + 0.2))
                finish(token)
            }
            return length
        } catch {
            print("chargey: couldn't play \(sound.name): \(error)")
            return 0
        }
    }

    /// Used by the Shortcuts action so iOS keeps us alive until the sound is done.
    func playAndWait(_ sound: ChargeSound) async {
        let length = play(sound)
        try? await Task.sleep(for: .seconds(length + 0.3))
    }

    func toggle(_ sound: ChargeSound) {
        if nowPlayingID == sound.id {
            finish(playToken)
        } else {
            play(sound)
        }
    }

    private func finish(_ token: Int) {
        guard token == playToken, player != nil else { return }
        player?.stop()
        player = nil
        nowPlayingID = nil
        try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
    }
}

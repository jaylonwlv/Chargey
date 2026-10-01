import AppIntents

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

    init(moment: ChargeMoment) {
        self.moment = moment
    }

    @MainActor
    func perform() async throws -> some IntentResult {
        // Switched off for this moment: do nothing, quietly.
        guard let sound = SoundStore.sound(for: moment) else { return .result() }
        await SoundPlayer.shared.playAndWait(sound)
        return .result()
    }
}

import AVFoundation
import Foundation

/// Plain UserDefaults + file storage. No actor isolation so the Shortcuts intent
/// can read the current pick without spinning up any UI state.
enum SoundStore {
    private static let defaults = UserDefaults.standard
    private static let customKey = "customSounds"
    private static let offValue = ""

    static var customDirectory: URL {
        URL.applicationSupportDirectory.appending(path: "CustomSounds", directoryHint: .isDirectory)
    }

    static func allSounds() -> [ChargeSound] {
        ChargeSound.builtIns + customSounds()
    }

    static func customSounds() -> [ChargeSound] {
        guard let data = defaults.data(forKey: customKey) else { return [] }
        return (try? JSONDecoder().decode([ChargeSound].self, from: data)) ?? []
    }

    private static func saveCustom(_ sounds: [ChargeSound]) {
        defaults.set(try? JSONEncoder().encode(sounds), forKey: customKey)
    }

    // MARK: Selection

    private static func key(for moment: ChargeMoment) -> String { "selected.\(moment.rawValue)" }

    private static func defaultID(for moment: ChargeMoment) -> String {
        switch moment {
        case .plugIn: "power_up"
        case .unplug: "sad_trombone"
        }
    }

    /// nil means the moment is switched off.
    static func selectedID(for moment: ChargeMoment) -> String? {
        guard let stored = defaults.string(forKey: key(for: moment)) else { return defaultID(for: moment) }
        if stored == offValue { return nil }
        // The picked custom sound got deleted: fall back instead of going silent.
        return allSounds().contains { $0.id == stored } ? stored : defaultID(for: moment)
    }

    static func setSelectedID(_ id: String?, for moment: ChargeMoment) {
        defaults.set(id ?? offValue, forKey: key(for: moment))
    }

    static func sound(for moment: ChargeMoment) -> ChargeSound? {
        guard let id = selectedID(for: moment) else { return nil }
        return allSounds().first { $0.id == id }
    }

    // MARK: Custom sounds

    enum ImportError: LocalizedError {
        case notAudio

        var errorDescription: String? {
            "couldn't play that file. try an mp3, m4a, or wav."
        }
    }

    static func importSound(from source: URL) throws -> ChargeSound {
        let scoped = source.startAccessingSecurityScopedResource()
        defer { if scoped { source.stopAccessingSecurityScopedResource() } }

        try FileManager.default.createDirectory(at: customDirectory, withIntermediateDirectories: true)
        let id = "custom-\(UUID().uuidString)"
        let ext = source.pathExtension.isEmpty ? "m4a" : source.pathExtension
        let fileName = "\(id).\(ext)"
        let destination = customDirectory.appending(path: fileName)
        try FileManager.default.copyItem(at: source, to: destination)

        guard (try? AVAudioPlayer(contentsOf: destination)) != nil else {
            try? FileManager.default.removeItem(at: destination)
            throw ImportError.notAudio
        }

        let sound = ChargeSound(
            id: id,
            name: source.deletingPathExtension().lastPathComponent,
            emoji: "🎤",
            vibe: "custom. iconic. yours.",
            fileName: fileName,
            isCustom: true
        )
        saveCustom(customSounds() + [sound])
        return sound
    }

    static func deleteCustom(_ sound: ChargeSound) {
        guard sound.isCustom else { return }
        if let url = sound.url { try? FileManager.default.removeItem(at: url) }
        saveCustom(customSounds().filter { $0.id != sound.id })
    }
}

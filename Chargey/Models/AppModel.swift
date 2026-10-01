import SwiftUI

@Observable @MainActor
final class AppModel {
    private(set) var sounds = SoundStore.allSounds()
    private(set) var plugInID = SoundStore.selectedID(for: .plugIn)
    private(set) var unplugID = SoundStore.selectedID(for: .unplug)
    private(set) var batteryState: UIDevice.BatteryState = .unknown

    /// Which moment the Sound Lab is editing. Lives here so Home can deep-link into it.
    var pickerMoment: ChargeMoment = .plugIn

    @ObservationIgnored private var batteryObserver: NSObjectProtocol?

    var completedSteps = Set(UserDefaults.standard.stringArray(forKey: "completedSteps") ?? []) {
        didSet { UserDefaults.standard.set(Array(completedSteps), forKey: "completedSteps") }
    }

    init() {
        UIDevice.current.isBatteryMonitoringEnabled = true
        batteryState = UIDevice.current.batteryState
        batteryObserver = NotificationCenter.default.addObserver(
            forName: UIDevice.batteryStateDidChangeNotification, object: nil, queue: .main
        ) { [weak self] _ in
            MainActor.assumeIsolated { self?.batteryState = UIDevice.current.batteryState }
        }
    }

    func selectedID(for moment: ChargeMoment) -> String? {
        moment == .plugIn ? plugInID : unplugID
    }

    func sound(for moment: ChargeMoment) -> ChargeSound? {
        guard let id = selectedID(for: moment) else { return nil }
        return sounds.first { $0.id == id }
    }

    func select(_ id: String?, for moment: ChargeMoment) {
        SoundStore.setSelectedID(id, for: moment)
        refreshSelection()
    }

    func importSound(from url: URL) throws {
        let sound = try SoundStore.importSound(from: url)
        sounds = SoundStore.allSounds()
        select(sound.id, for: pickerMoment)
    }

    func delete(_ sound: ChargeSound) {
        SoundStore.deleteCustom(sound)
        sounds = SoundStore.allSounds()
        refreshSelection()
    }

    func toggleStep(_ id: String) {
        if completedSteps.contains(id) {
            completedSteps.remove(id)
        } else {
            completedSteps.insert(id)
        }
    }

    var batteryLabel: String {
        switch batteryState {
        case .charging: "eating rn 🍽️ (charging)"
        case .full: "100%. thriving. 💅"
        case .unplugged: "running on vibes 🫠"
        default: "simulator says idk 🤷"
        }
    }

    private func refreshSelection() {
        plugInID = SoundStore.selectedID(for: .plugIn)
        unplugID = SoundStore.selectedID(for: .unplug)
    }
}

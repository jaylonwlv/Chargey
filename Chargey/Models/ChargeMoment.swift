import AppIntents
import SwiftUI

/// The two moments Chargey reacts to. Doubles as the parameter on the Shortcuts action,
/// so one automation can say "plugged in" and another "unplugged".
enum ChargeMoment: String, AppEnum, CaseIterable, Identifiable {
    case plugIn
    case unplug

    var id: String { rawValue }

    static let typeDisplayRepresentation: TypeDisplayRepresentation = "Moment"
    static let caseDisplayRepresentations: [ChargeMoment: DisplayRepresentation] = [
        .plugIn: "Plugged in",
        .unplug: "Unplugged",
    ]

    var pickerLabel: String {
        switch self {
        case .plugIn: "🔌 plug in"
        case .unplug: "🫥 unplug"
        }
    }

    var cardTitle: String {
        switch self {
        case .plugIn: "when you plug in"
        case .unplug: "when you unplug"
        }
    }

    var accent: Color {
        switch self {
        case .plugIn: .slime
        case .unplug: .bubblegum
        }
    }
}

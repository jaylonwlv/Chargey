import SwiftUI

@main
struct ChargeyApp: App {
    @State private var model = AppModel()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(model)
                .environment(SoundPlayer.shared)
                .preferredColorScheme(.dark)
        }
    }
}

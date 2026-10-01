import SwiftUI

enum AppTab: Hashable {
    case home, sounds, setup, drip
}

struct RootView: View {
    @AppStorage("hasOnboarded") private var hasOnboarded = false
    @State private var tab: AppTab = .home

    var body: some View {
        TabView(selection: $tab) {
            HomeView(tab: $tab)
                .tabItem { Label("home", systemImage: "bolt.fill") }
                .tag(AppTab.home)
            SoundsView()
                .tabItem { Label("sounds", systemImage: "speaker.wave.3.fill") }
                .tag(AppTab.sounds)
            SetupGuideView(tab: $tab)
                .tabItem { Label("setup", systemImage: "checklist") }
                .tag(AppTab.setup)
            DripView()
                .tabItem { Label("drip", systemImage: "sparkles") }
                .tag(AppTab.drip)
        }
        .tint(.slime)
        .fullScreenCover(isPresented: .init(get: { !hasOnboarded }, set: { hasOnboarded = !$0 })) {
            OnboardingView {
                hasOnboarded = true
                tab = .setup
            }
        }
    }
}

#Preview {
    RootView()
        .environment(AppModel())
        .environment(SoundPlayer.shared)
        .preferredColorScheme(.dark)
}

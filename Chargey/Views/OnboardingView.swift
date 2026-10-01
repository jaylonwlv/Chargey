import SwiftUI

struct OnboardingView: View {
    var onFinish: () -> Void
    @State private var page = 0

    private let pages: [(emoji: String, title: String, body: String)] = [
        ("🔌", "your phone deserves a hype man",
         "every time you plug in, chargey plays a sound. that's it. that's the app. it's perfect."),
        ("🗣️", "plug in → it SCREAMS",
         "airhorns. dramatic booms. a sad trombone when you unplug. pick your fighter or upload your own."),
        ("🤝", "setup takes like 60 sec",
         "apple makes us use the Shortcuts app for this (not our fault). we'll hold your hand the whole way. zero brain cells required."),
    ]

    var body: some View {
        VStack {
            TabView(selection: $page) {
                ForEach(pages.indices, id: \.self) { i in
                    VStack(spacing: 22) {
                        Text(pages[i].emoji).font(.system(size: 110))
                        Text(pages[i].title)
                            .font(.chunky(34))
                            .multilineTextAlignment(.center)
                        Text(pages[i].body)
                            .font(.chunky(17, .medium))
                            .multilineTextAlignment(.center)
                            .foregroundStyle(.white.opacity(0.75))
                    }
                    .padding(28)
                    .tag(i)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .always))

            Button(page == pages.count - 1 ? "let's gooo ⚡️" : "ok and?") {
                if page == pages.count - 1 {
                    onFinish()
                } else {
                    withAnimation { page += 1 }
                }
            }
            .buttonStyle(ChunkyButtonStyle())
            .padding(24)
        }
        .foregroundStyle(.white)
        .background(
            LinearGradient(colors: [.grape, .chargeyBG], startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()
        )
    }
}

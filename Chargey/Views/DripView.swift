import SwiftUI

/// Teaser for wallpaper packs: a wallpaper + matching charge sound, sold as one vibe.
struct DripView: View {
    @Environment(AppModel.self) private var model
    @AppStorage("dripWaitlist") private var seated = false
    @State private var charging = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                ScreenTitle(title: "drip 💧", subtitle: "coming soon: wallpapers that match your charge sound. lock screen and speaker sharing one braincell.")

                LockScreenMock(emoji: model.sound(for: .plugIn)?.emoji ?? "⚡️", charging: charging)
                    .frame(maxWidth: .infinity)
                    .onTapGesture {
                        withAnimation(.spring(response: 0.4, dampingFraction: 0.6)) { charging.toggle() }
                    }
                Text("(tap the phone. go on.)")
                    .font(.chunky(13, .medium))
                    .foregroundStyle(.white.opacity(0.5))
                    .frame(maxWidth: .infinity)

                VStack(alignment: .leading, spacing: 8) {
                    Text("what's cooking 👨‍🍳").font(.chunky(20))
                    Text("• wallpaper + sound packs you set in one tap\n• new drops regularly, filmed IRL\n• your lock screen will finally match your personality")
                        .font(.chunky(15, .medium))
                        .foregroundStyle(.white.opacity(0.75))
                }
                .sticker(.sky)

                Button(seated ? "you're seated. we'll be loud about it. 🍿" : "i'm seated 🍿") {
                    withAnimation { seated = true }
                }
                .buttonStyle(ChunkyButtonStyle(fill: seated ? .chargeyCard : .slime, text: seated ? .white : .black))
                .disabled(seated)
            }
            .padding(20)
        }
        .foregroundStyle(.white)
        .background(Color.chargeyBG.ignoresSafeArea())
    }
}

private struct LockScreenMock: View {
    var emoji: String
    var charging: Bool

    var body: some View {
        ZStack {
            LinearGradient(colors: charging ? [.slime, .sky, .grape] : [.grape, .bubblegum, .chargeyBG],
                           startPoint: .topLeading, endPoint: .bottomTrailing)
            VStack(spacing: 4) {
                Text("Tuesday, slay").font(.chunky(14, .semibold))
                Text("9:41").font(.system(size: 64, weight: .bold, design: .rounded))
                Spacer()
                Text(emoji)
                    .font(.system(size: charging ? 84 : 54))
                    .rotationEffect(.degrees(charging ? -10 : 0))
                Text(charging ? "⚡️ charging · 100% that girl" : "tap to plug in")
                    .font(.chunky(13, .bold))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Capsule().fill(.black.opacity(0.35)))
                Spacer()
            }
            .foregroundStyle(.white)
            .padding(.top, 36)
        }
        .frame(width: 220, height: 440)
        .clipShape(RoundedRectangle(cornerRadius: 40))
        .overlay(RoundedRectangle(cornerRadius: 40).stroke(.black, lineWidth: 8))
        .overlay(RoundedRectangle(cornerRadius: 40).stroke(.white.opacity(0.4), lineWidth: 2))
        .shadow(color: (charging ? Color.slime : .grape).opacity(0.5), radius: 30)
    }
}

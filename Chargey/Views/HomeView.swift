import SwiftUI

struct HomeView: View {
    @Environment(AppModel.self) private var model
    @Environment(SoundPlayer.self) private var player
    @Binding var tab: AppTab

    @State private var level: CGFloat = 0.2
    @State private var hype = false
    @State private var quip = Quips.home.randomElement()!

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                ScreenTitle(title: "chargey ⚡️", subtitle: quip)
                    .onTapGesture { quip = Quips.home.randomElement()! }

                BatteryHero(level: level, hype: hype)
                Text("status: \(model.batteryLabel)")
                    .font(.chunky(14, .semibold))
                    .foregroundStyle(.white.opacity(0.6))

                Button(action: simulatePlugIn) {
                    Label("simulate plug in", systemImage: "bolt.fill")
                }
                .buttonStyle(ChunkyButtonStyle())
                .disabled(hype)

                momentCard(.plugIn)
                momentCard(.unplug)
                setupCard
            }
            .padding(20)
        }
        .foregroundStyle(.white)
        .background(Color.chargeyBG.ignoresSafeArea())
    }

    private func simulatePlugIn() {
        if let sound = model.sound(for: .plugIn) { player.play(sound) }
        withAnimation(.spring(response: 0.5, dampingFraction: 0.55)) {
            level = 1
            hype = true
        }
        Task {
            try? await Task.sleep(for: .seconds(1.8))
            withAnimation(.easeInOut(duration: 0.6)) {
                level = 0.2
                hype = false
            }
        }
    }

    private func momentCard(_ moment: ChargeMoment) -> some View {
        let sound = model.sound(for: moment)
        return VStack(alignment: .leading, spacing: 12) {
            Text(moment.cardTitle.uppercased())
                .font(.chunky(12, .heavy))
                .foregroundStyle(.white.opacity(0.55))
            HStack(spacing: 14) {
                Text(sound?.emoji ?? "🤐").font(.system(size: 40))
                VStack(alignment: .leading, spacing: 2) {
                    Text(sound?.name ?? "nothing. silence. peace.").font(.chunky(20))
                    Text(sound?.vibe ?? "you turned this one off.")
                        .font(.chunky(13, .medium))
                        .foregroundStyle(.white.opacity(0.65))
                }
                Spacer(minLength: 0)
                if let sound {
                    Button { player.toggle(sound) } label: {
                        Image(systemName: player.nowPlayingID == sound.id ? "stop.fill" : "play.fill")
                            .font(.system(size: 18, weight: .black))
                            .foregroundStyle(.black)
                            .frame(width: 46, height: 46)
                            .background(Circle().fill(moment.accent))
                    }
                }
            }
            Button("change it up →") {
                model.pickerMoment = moment
                tab = .sounds
            }
            .font(.chunky(14, .bold))
            .foregroundStyle(moment.accent)
        }
        .sticker(moment.accent)
    }

    private var setupCard: some View {
        let done = model.completedSteps.intersection(SetupStep.all.map(\.id)).count
        let total = SetupStep.all.count
        let blurb = switch done {
        case 0: "haven't started. it's ok, we all procrastinate."
        case total: "fully set up. you ate. 💅"
        default: "\(done)/\(total) done. lock in. 🔒"
        }
        return VStack(alignment: .leading, spacing: 12) {
            Text("SETUP").font(.chunky(12, .heavy)).foregroundStyle(.white.opacity(0.55))
            Text(blurb).font(.chunky(18))
            ProgressView(value: Double(done), total: Double(total)).tint(.sky)
            if done < total {
                Button("finish setup →") { tab = .setup }
                    .font(.chunky(14, .bold))
                    .foregroundStyle(Color.sky)
            }
        }
        .sticker(.sky)
    }
}

struct BatteryHero: View {
    var level: CGFloat
    var hype: Bool

    var body: some View {
        HStack(spacing: 6) {
            ZStack {
                RoundedRectangle(cornerRadius: 28).fill(Color.chargeyCard)
                GeometryReader { geo in
                    RoundedRectangle(cornerRadius: 20)
                        .fill(LinearGradient(colors: [.slime, .sky], startPoint: .leading, endPoint: .trailing))
                        .frame(width: max(24, (geo.size.width - 16) * level))
                        .padding(8)
                }
                Image(systemName: "bolt.fill")
                    .font(.system(size: 56, weight: .black))
                    .foregroundStyle(.white)
                    .shadow(color: .black, radius: 0, x: 3, y: 3)
                    .scaleEffect(hype ? 1.35 : 1)
                    .rotationEffect(.degrees(hype ? -12 : 0))
            }
            .frame(height: 130)
            .overlay(RoundedRectangle(cornerRadius: 28).stroke(.white, lineWidth: 4))
            RoundedRectangle(cornerRadius: 6).fill(.white).frame(width: 14, height: 46)
        }
        .overlay {
            if hype { EmojiBurst() }
        }
    }
}

struct EmojiBurst: View {
    @State private var go = false
    private let emojis = ["⚡️", "🔋", "🔥", "💅", "🗣️", "‼️", "🤯", "✨"]

    var body: some View {
        ZStack {
            ForEach(emojis.indices, id: \.self) { i in
                let angle = Double(i) / Double(emojis.count) * 2 * .pi
                Text(emojis[i])
                    .font(.system(size: 34))
                    .offset(x: go ? cos(angle) * 160 : 0, y: go ? sin(angle) * 110 : 0)
                    .scaleEffect(go ? 1.4 : 0.4)
                    .opacity(go ? 0 : 1)
            }
        }
        .allowsHitTesting(false)
        .onAppear {
            withAnimation(.easeOut(duration: 1.2)) { go = true }
        }
    }
}

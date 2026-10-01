import SwiftUI

struct SetupStep: Identifiable {
    enum Action {
        case pickSound, openShortcuts
    }

    let id: String
    let emoji: String
    let title: String
    let body: String
    var action: Action?

    static let all: [SetupStep] = [
        .init(id: "pick", emoji: "🎧", title: "pick ur sound",
              body: "Choose your fighter in the **sounds** tab. You can swap it whenever — the automation always plays whatever's picked in the app.",
              action: .pickSound),
        .init(id: "open", emoji: "📲", title: "open Shortcuts → Automation",
              body: "It's the Shortcuts app Apple pre-installed that you've never opened. Tap the **Automation** tab at the bottom.",
              action: .openShortcuts),
        .init(id: "new", emoji: "➕", title: "start a new automation",
              body: "Tap **+** in the top right (or **New Automation** if it's your first one). Scroll down and tap **Charger**."),
        .init(id: "connected", emoji: "🔌", title: "set it to \"Is Connected\"",
              body: "Select **Is Connected** and **Run Immediately** (not \"after confirmation\" — we don't ask permission). Turn **Notify When Run** off so you don't get a banner every time. Tap **Next**."),
        .init(id: "action", emoji: "⚡️", title: "add the Chargey action",
              body: "Tap **New Blank Automation** → **Add Action** → search **Chargey** → tap **Play Chargey Sound**. Make sure it says *Plugged in*. Tap **Done**."),
        .init(id: "test", emoji: "🧪", title: "the vibe check",
              body: "Unplug. Plug back in. If your phone screams, congrats, you're a developer now. Tell no one. (tell everyone.)"),
    ]
}

struct SetupGuideView: View {
    @Environment(AppModel.self) private var model
    @Environment(\.openURL) private var openURL
    @Binding var tab: AppTab

    var body: some View {
        let done = model.completedSteps.intersection(SetupStep.all.map(\.id)).count
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                ScreenTitle(title: "setup 🛠️", subtitle: "you're ~60 seconds from greatness. tap a step when you've done it.")

                ProgressView(value: Double(done), total: Double(SetupStep.all.count))
                    .tint(.slime)
                    .scaleEffect(y: 2)
                    .padding(.vertical, 6)

                ForEach(Array(SetupStep.all.enumerated()), id: \.element.id) { index, step in
                    stepCard(step, number: index + 1)
                }

                if done == SetupStep.all.count {
                    Text("ALL DONE. you ate and left no crumbs. 🍽️")
                        .font(.chunky(20))
                        .foregroundStyle(Color.slime)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                }

                bonusCard
                troubleshooting
            }
            .padding(20)
        }
        .foregroundStyle(.white)
        .background(Color.chargeyBG.ignoresSafeArea())
    }

    private func stepCard(_ step: SetupStep, number: Int) -> some View {
        let isDone = model.completedSteps.contains(step.id)
        return VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .top, spacing: 12) {
                Text("\(number)")
                    .font(.chunky(18))
                    .foregroundStyle(.black)
                    .frame(width: 34, height: 34)
                    .background(Circle().fill(isDone ? Color.slime : .white))
                VStack(alignment: .leading, spacing: 6) {
                    Text("\(step.emoji) \(step.title)")
                        .font(.chunky(19))
                        .strikethrough(isDone, color: .slime)
                    Text(LocalizedStringKey(step.body))
                        .font(.chunky(15, .medium))
                        .foregroundStyle(.white.opacity(0.75))
                        .fixedSize(horizontal: false, vertical: true)
                }
                Spacer(minLength: 0)
                Image(systemName: isDone ? "checkmark.square.fill" : "square")
                    .font(.system(size: 26, weight: .bold))
                    .foregroundStyle(isDone ? Color.slime : .white.opacity(0.35))
            }
            switch step.action {
            case .pickSound:
                Button("go pick →") { tab = .sounds }
                    .font(.chunky(15, .bold))
                    .foregroundStyle(Color.slime)
                    .padding(.leading, 46)
            case .openShortcuts:
                Button("open Shortcuts ↗") {
                    if let url = URL(string: "shortcuts://") { openURL(url) }
                }
                .buttonStyle(ChunkyButtonStyle(fill: .grape, text: .white))
                .padding(.leading, 46)
            case nil:
                EmptyView()
            }
        }
        .sticker(isDone ? .slime : .grape)
        .opacity(isDone ? 0.75 : 1)
        .contentShape(Rectangle())
        .onTapGesture {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) { model.toggleStep(step.id) }
        }
    }

    private var bonusCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("BONUS: unplug sound 🎺").font(.chunky(19))
            Text("Do steps 3–5 again but pick **Is Disconnected**. In the Chargey action, tap *Plugged in* and switch it to *Unplugged*. Now your phone is dramatic in both directions.")
                .font(.chunky(15, .medium))
                .foregroundStyle(.white.opacity(0.75))
                .fixedSize(horizontal: false, vertical: true)
        }
        .sticker(.bubblegum)
    }

    private var troubleshooting: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("it's not working 😭").font(.chunky(24)).padding(.top, 12)
            FAQ(q: "I can't find Chargey in the actions",
                a: "Open Chargey at least once (you're here, so ✅). Then force-quit Shortcuts and reopen it. iOS takes a sec to notice new apps. Still nothing? Restart your phone. The classic.")
            FAQ(q: "it's completely silent",
                a: "Crank your **media** volume (play a song, then hit volume up). If AirPods or a speaker are connected, the sound goes there lol.")
            FAQ(q: "it plays even on silent mode",
                a: "Yeah, it's a media sound so the silent switch doesn't stop it. In a lecture or a funeral? Open Shortcuts → Automation, tap the Charger automation and toggle it off for a bit.")
            FAQ(q: "I get a notification every time",
                a: "Open the automation in Shortcuts and turn off **Notify When Run**.")
            FAQ(q: "it played twice",
                a: "You made two automations. Happens to the best of us. Swipe left on the extra one in Shortcuts to delete it.")
            FAQ(q: "it asks me to confirm before running",
                a: "Edit the automation and switch it to **Run Immediately**.")
        }
    }
}

private struct FAQ: View {
    var q: String
    var a: String
    @State private var open = false

    var body: some View {
        DisclosureGroup(isExpanded: $open) {
            Text(LocalizedStringKey(a))
                .font(.chunky(15, .medium))
                .foregroundStyle(.white.opacity(0.75))
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.top, 6)
        } label: {
            Text(q).font(.chunky(16, .bold)).foregroundStyle(.white)
        }
        .tint(.slime)
        .padding(14)
        .background(RoundedRectangle(cornerRadius: 16).fill(Color.chargeyCard))
    }
}

import SwiftUI

extension Color {
    static let chargeyBG = Color(red: 0.06, green: 0.05, blue: 0.09)
    static let chargeyCard = Color(red: 0.13, green: 0.12, blue: 0.18)
    static let slime = Color(red: 0.78, green: 1.0, blue: 0.0)
    static let bubblegum = Color(red: 1.0, green: 0.24, blue: 0.6)
    static let grape = Color(red: 0.55, green: 0.36, blue: 1.0)
    static let sky = Color(red: 0.3, green: 0.85, blue: 1.0)
}

extension Font {
    static func chunky(_ size: CGFloat, _ weight: Font.Weight = .black) -> Font {
        .system(size: size, weight: weight, design: .rounded)
    }
}

/// Card with a hard offset "sticker" shadow.
struct StickerCard: ViewModifier {
    var accent: Color

    func body(content: Content) -> some View {
        content
            .padding(18)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(RoundedRectangle(cornerRadius: 22).fill(Color.chargeyCard))
            .overlay(RoundedRectangle(cornerRadius: 22).stroke(.black, lineWidth: 3))
            .background(RoundedRectangle(cornerRadius: 22).fill(accent).offset(x: 5, y: 6))
    }
}

extension View {
    func sticker(_ accent: Color = .slime) -> some View {
        modifier(StickerCard(accent: accent))
    }
}

struct ChunkyButtonStyle: ButtonStyle {
    var fill: Color = .slime
    var text: Color = .black

    func makeBody(configuration: Configuration) -> some View {
        let pressed = configuration.isPressed
        configuration.label
            .font(.chunky(18))
            .foregroundStyle(text)
            .padding(.vertical, 16)
            .padding(.horizontal, 20)
            .frame(maxWidth: .infinity)
            .background(RoundedRectangle(cornerRadius: 18).fill(fill))
            .overlay(RoundedRectangle(cornerRadius: 18).stroke(.black, lineWidth: 3))
            .background(RoundedRectangle(cornerRadius: 18).fill(.white).offset(x: pressed ? 0 : 4, y: pressed ? 0 : 5))
            .offset(x: pressed ? 4 : 0, y: pressed ? 5 : 0)
            .animation(.spring(response: 0.2, dampingFraction: 0.6), value: pressed)
    }
}

/// Big heavy page title with a little subtitle under it.
struct ScreenTitle: View {
    var title: String
    var subtitle: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title).font(.chunky(36))
            Text(subtitle).font(.chunky(16, .medium)).foregroundStyle(.white.opacity(0.65))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

enum Quips {
    static let home = [
        "your phone's biggest fan 📣",
        "plug in. get hyped. repeat.",
        "no thoughts, just charging",
        "certified outlet enjoyer 🔌",
        "battery anxiety? we don't know her",
        "the charger is ur phone's roman empire",
    ]
}

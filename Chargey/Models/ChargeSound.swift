import Foundation

struct ChargeSound: Identifiable, Codable, Hashable {
    let id: String
    var name: String
    var emoji: String
    var vibe: String
    var fileName: String
    var isCustom: Bool

    var url: URL? {
        if isCustom {
            return SoundStore.customDirectory.appending(path: fileName)
        }
        let base = (fileName as NSString).deletingPathExtension
        let ext = (fileName as NSString).pathExtension
        return Bundle.main.url(forResource: base, withExtension: ext)
    }

    static let builtIns: [ChargeSound] = [
        .init(id: "ggez", name: "gg ez", emoji: "🏆", vibe: "you plugged in. you won. simple as.", fileName: "ggez.m4a", isCustom: false),
        .init(id: "power_up", name: "power up fr", emoji: "⚡️", vibe: "8-bit hero arc. main character energy.", fileName: "power_up.wav", isCustom: false),
        .init(id: "airhorn", name: "airhorn (respectfully)", emoji: "📯", vibe: "3% → plugged in is a W. celebrate it.", fileName: "airhorn.wav", isCustom: false),
        .init(id: "the_boom", name: "the boom", emoji: "💥", vibe: "every plug-in is a plot twist.", fileName: "the_boom.wav", isCustom: false),
        .init(id: "nom_nom", name: "nom nom nom", emoji: "😋", vibe: "phone is eating good tonight.", fileName: "nom_nom.wav", isCustom: false),
        .init(id: "ka_ching", name: "ka-ching", emoji: "🪙", vibe: "battery is the new currency.", fileName: "ka_ching.wav", isCustom: false),
        .init(id: "microwave_done", name: "microwave done", emoji: "♨️", vibe: "beep beep beep. ur phone is a hot pocket now.", fileName: "microwave_done.wav", isCustom: false),
        .init(id: "bonk", name: "bonk", emoji: "🔨", vibe: "short. sweet. concussive.", fileName: "bonk.wav", isCustom: false),
        .init(id: "sad_trombone", name: "sad trombone", emoji: "🎺", vibe: "elite unplug sound. it's giving abandonment.", fileName: "sad_trombone.wav", isCustom: false),
    ]
}

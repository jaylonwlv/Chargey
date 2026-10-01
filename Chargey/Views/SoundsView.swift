import SwiftUI
import UniformTypeIdentifiers

struct SoundsView: View {
    @Environment(AppModel.self) private var model
    @Environment(SoundPlayer.self) private var player
    @State private var importing = false
    @State private var importError: String?

    var body: some View {
        @Bindable var model = model
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                ScreenTitle(title: "the sound lab 🧪", subtitle: "tap to preview + pick. Shortcuts always plays whatever's picked here.")

                Picker("moment", selection: $model.pickerMoment) {
                    ForEach(ChargeMoment.allCases) { Text($0.pickerLabel).tag($0) }
                }
                .pickerStyle(.segmented)
                .padding(.bottom, 4)

                let selected = model.selectedID(for: model.pickerMoment)
                let accent = model.pickerMoment.accent

                if model.pickerMoment == .unplug {
                    SoundRow(emoji: "🤐", name: "off", vibe: "no unplug sound. very mature of you.",
                             selected: selected == nil, playing: false, accent: accent)
                        .onTapGesture { model.select(nil, for: .unplug) }
                }

                ForEach(model.sounds) { sound in
                    SoundRow(emoji: sound.emoji, name: sound.name, vibe: sound.vibe,
                             selected: selected == sound.id, playing: player.nowPlayingID == sound.id, accent: accent)
                        .onTapGesture {
                            model.select(sound.id, for: model.pickerMoment)
                            player.play(sound)
                        }
                        .contextMenu {
                            if sound.isCustom {
                                Button("yeet it", systemImage: "trash", role: .destructive) { model.delete(sound) }
                            }
                        }
                }

                Button { importing = true } label: {
                    Label("upload your own sound", systemImage: "square.and.arrow.down.fill")
                }
                .buttonStyle(ChunkyButtonStyle(fill: .bubblegum, text: .white))
                .padding(.top, 8)

                Text("mp3 / m4a / wav from Files. keep it under ~25 sec, it's a charger not a podcast. long-press a custom sound to delete it.")
                    .font(.chunky(13, .medium))
                    .foregroundStyle(.white.opacity(0.55))
            }
            .padding(20)
        }
        .foregroundStyle(.white)
        .background(Color.chargeyBG.ignoresSafeArea())
        .fileImporter(isPresented: $importing, allowedContentTypes: [.audio]) { result in
            do {
                try model.importSound(from: result.get())
            } catch {
                importError = error.localizedDescription
            }
        }
        .alert("that file is NOT it 💀", isPresented: .init(get: { importError != nil }, set: { if !$0 { importError = nil } })) {
            Button("ok fine", role: .cancel) {}
        } message: {
            Text(importError ?? "")
        }
    }
}

struct SoundRow: View {
    var emoji: String
    var name: String
    var vibe: String
    var selected: Bool
    var playing: Bool
    var accent: Color

    var body: some View {
        HStack(spacing: 14) {
            Text(emoji)
                .font(.system(size: 34))
                .scaleEffect(playing ? 1.25 : 1)
                .rotationEffect(.degrees(playing ? 10 : 0))
                .animation(.spring(response: 0.25, dampingFraction: 0.4).repeatForever(autoreverses: true), value: playing)
            VStack(alignment: .leading, spacing: 2) {
                Text(name).font(.chunky(18))
                Text(vibe).font(.chunky(13, .medium)).foregroundStyle(.white.opacity(0.6))
            }
            Spacer(minLength: 0)
            Image(systemName: selected ? "checkmark.circle.fill" : "circle")
                .font(.system(size: 24, weight: .bold))
                .foregroundStyle(selected ? accent : .white.opacity(0.3))
        }
        .padding(14)
        .background(RoundedRectangle(cornerRadius: 18).fill(Color.chargeyCard))
        .overlay(RoundedRectangle(cornerRadius: 18).stroke(selected ? accent : .clear, lineWidth: 3))
        .contentShape(Rectangle())
    }
}

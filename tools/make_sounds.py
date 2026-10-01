#!/usr/bin/env python3
"""Synthesizes Chargey's built-in sounds. Stdlib only, no numpy needed.

    python3 tools/make_sounds.py

Writes 44.1kHz 16-bit mono WAVs into Chargey/Resources/Sounds/.
"""
import math
import os
import random
import struct
import wave

RATE = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "Chargey", "Resources", "Sounds")


def silence(sec):
    return [0.0] * int(RATE * sec)


def osc(kind, phase):
    p = phase % 1.0
    if kind == "sine":
        return math.sin(2 * math.pi * p)
    if kind == "square":
        return 1.0 if p < 0.5 else -1.0
    if kind == "saw":
        return 2.0 * p - 1.0
    if kind == "tri":
        return 4.0 * abs(p - 0.5) - 1.0
    raise ValueError(kind)


def tone(freq, sec, kind="sine", vol=0.5, attack=0.005, release=0.05, freq_end=None, vibrato=0.0):
    """One note. freq_end makes a glide, vibrato is in Hz of wobble depth."""
    n = int(RATE * sec)
    out, phase = [], 0.0
    for i in range(n):
        t = i / RATE
        f = freq if freq_end is None else freq + (freq_end - freq) * (i / n)
        if vibrato:
            f += vibrato * math.sin(2 * math.pi * 5.5 * t)
        phase += f / RATE
        env = 1.0
        if t < attack:
            env = t / attack
        elif t > sec - release:
            env = max(0.0, (sec - t) / release)
        out.append(osc(kind, phase) * env * vol)
    return out


def mix(*tracks):
    n = max(len(t) for t in tracks)
    return [sum(t[i] for t in tracks if i < len(t)) for i in range(n)]


def cat(*parts):
    out = []
    for p in parts:
        out.extend(p)
    return out


def write(name, samples):
    peak = max(1e-9, max(abs(s) for s in samples))
    gain = 0.9 / peak
    path = os.path.join(OUT, name + ".wav")
    with wave.open(path, "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, s * gain)) * 32767)) for s in samples))
    print("wrote", os.path.relpath(path))


def power_up():
    notes = [261.6, 329.6, 392.0, 523.3, 659.3, 784.0, 1046.5]
    run = cat(*[tone(f, 0.07, "square", 0.3, release=0.02) for f in notes])
    return cat(run, tone(1046.5, 0.45, "square", 0.3, vibrato=12, release=0.25))


def the_boom():
    n = int(RATE * 1.6)
    out, phase = [], 0.0
    for i in range(n):
        t = i / RATE
        f = 40 + 90 * math.exp(-t * 9)
        phase += f / RATE
        s = math.sin(2 * math.pi * phase) * math.exp(-t * 2.2)
        out.append(math.tanh(s * 3.5))  # crunch
    return out


def airhorn():
    def blast(sec):
        return mix(
            tone(466.2, sec, "saw", 0.3, attack=0.01, release=0.03),
            tone(587.3, sec, "saw", 0.25, attack=0.01, release=0.03),
            tone(698.5, sec, "saw", 0.2, attack=0.01, release=0.03),
        )
    return cat(blast(0.18), silence(0.05), blast(0.18), silence(0.05), blast(0.7))


def microwave_done():
    beep = tone(1975.5, 0.22, "sine", 0.5, release=0.02)
    return cat(beep, silence(0.18), beep, silence(0.18), beep)


def ka_ching():
    coin = cat(tone(987.8, 0.08, "square", 0.3, release=0.01), tone(1318.5, 0.5, "square", 0.3, release=0.4))
    random.seed(7)
    shimmer = [random.uniform(-1, 1) * 0.08 * math.exp(-i / RATE * 6) for i in range(int(RATE * 0.6))]
    return mix(coin, shimmer)


def nom_nom():
    def nom():
        return tone(180, 0.13, "tri", 0.6, attack=0.01, release=0.05, freq_end=320)
    return cat(nom(), silence(0.06), nom(), silence(0.06), nom(), silence(0.06),
               tone(320, 0.35, "tri", 0.6, freq_end=150, release=0.2))


def sad_trombone():
    notes = [(293.7, 0.35), (277.2, 0.35), (261.6, 0.35)]
    parts = [tone(f, d, "saw", 0.35, attack=0.03, release=0.06) for f, d in notes]
    parts.append(tone(246.9, 1.1, "saw", 0.35, attack=0.03, release=0.3, vibrato=6))
    return cat(*parts)


def bonk():
    n = int(RATE * 0.5)
    random.seed(3)
    return [
        (math.sin(2 * math.pi * 520 * (i / RATE) * (1 - i / n * 0.4)) * 0.8 + random.uniform(-1, 1) * 0.15)
        * math.exp(-(i / RATE) * 14)
        for i in range(n)
    ]


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    write("power_up", power_up())
    write("the_boom", the_boom())
    write("airhorn", airhorn())
    write("microwave_done", microwave_done())
    write("ka_ching", ka_ching())
    write("nom_nom", nom_nom())
    write("sad_trombone", sad_trombone())
    write("bonk", bonk())

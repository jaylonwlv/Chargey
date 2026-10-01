#!/usr/bin/env python3
"""Cuts the setup-tutorial screenshots out of a screen recording.

    python3 tools/make_tutorial.py path/to/recording.mp4

Each shot is cropped to the part of the screen that matters, everything except
the tap target is dimmed, and the target gets a thick lime border plus a "TAP"
label so it reads at a glance on a small thumbnail.

All coordinates are in a 430px-wide copy of the frame (full frame = 430x932);
output is scaled 1.5x. Needs ffmpeg. Override the label font with FONT=/path.
"""
import os
import subprocess
import sys

SCALE = 1.5
SLIME = "0xC7FF00"
DIM = "black@0.68"
FONT = os.environ.get("FONT", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "tutorial")

# name, seconds, crop (x, y, w, h), targets [(x, y, w, h, label, side)], blurs [(x, y, w, h)]
SHOTS = [
    ("1-library-trap", 10, (0, 700, 430, 232), [(175, 850, 80, 60, "TAP ↓", "above")], []),
    ("2-new-automation", 11, (0, 400, 430, 300), [(122, 548, 186, 64, "TAP ↓", "above")], []),
    ("3-charger", 16, (0, 440, 430, 300), [(18, 538, 394, 64, "TAP ↓", "above")], []),
    ("4-run-immediately", 21, (0, 50, 430, 520), [
        (338, 76, 76, 50, "THEN THIS →", "left"),
        (20, 455, 390, 52, "PICK THIS ↓", "above"),
    ], []),
    ("5-pick-chargey", 29, (0, 290, 430, 270), [(8, 402, 414, 64, "TAP ↓", "above")], []),
    ("6-play-sound", 31, (0, 60, 430, 260), [(14, 133, 198, 114, "← TAP", "right")], []),
    ("7-done", 33, (0, 120, 430, 280), [(18, 211, 394, 146, "✓ DONE", "above")], [(85, 276, 87, 28)]),
]


def px(v):
    return int(round(v * SCALE))


def label_xy(x, y, w, h, side):
    """drawtext x/y expressions placing the label beside the target."""
    cx, cy = px(x + w / 2), px(y + h / 2)
    gap = 30
    if side == "above":
        return f"max(16\\,min(w-text_w-16\\,{cx}-text_w/2))", f"{px(y) - gap}-text_h"
    if side == "below":
        return f"max(16\\,min(w-text_w-16\\,{cx}-text_w/2))", f"{px(y + h) + gap}"
    if side == "left":
        return f"{px(x) - gap}-text_w", f"{cy}-text_h/2"
    return f"{px(x + w) + gap}", f"{cy}-text_h/2"


def build(name, t, crop, targets, blurs, video):
    chain = [f"[0:v]scale={px(430)}:-2[v0]"]
    last = "v0"
    for i, (x, y, w, h) in enumerate(blurs):
        chain.append(
            f"[{last}]split[ba{i}][bb{i}];[bb{i}]crop={px(w)}:{px(h)}:{px(x)}:{px(y)},"
            f"boxblur=luma_radius=10:luma_power=3:chroma_radius=5:chroma_power=3[bc{i}];"
            f"[ba{i}][bc{i}]overlay={px(x)}:{px(y)}[bo{i}]"
        )
        last = f"bo{i}"

    # Dim the whole frame, then paste the bright targets back on top.
    n = len(targets)
    chain.append(f"[{last}]split={n + 1}[dimsrc]" + "".join(f"[src{i}]" for i in range(n)))
    chain.append(f"[dimsrc]drawbox=x=0:y=0:w=iw:h=ih:color={DIM}:t=fill[d0]")
    for i, (x, y, w, h, _, _) in enumerate(targets):
        chain.append(f"[src{i}]crop={px(w)}:{px(h)}:{px(x)}:{px(y)}[t{i}];[d{i}][t{i}]overlay={px(x)}:{px(y)}[d{i + 1}]")

    marks = []
    for x, y, w, h, label, side in targets:
        pad = 4
        marks.append(f"drawbox=x={px(x - pad)}:y={px(y - pad)}:w={px(w + 2 * pad)}:h={px(h + 2 * pad)}:color={SLIME}:t=9")
        lx, ly = label_xy(x - pad, y - pad, w + 2 * pad, h + 2 * pad, side)
        marks.append(
            f"drawtext=fontfile='{FONT}':text='{label}':fontsize=36:fontcolor=black:"
            f"box=1:boxcolor={SLIME}:boxborderw=14:x={lx}:y={ly}"
        )
    cx, cy, cw, ch = crop
    marks.append(f"crop={px(cw)}:{px(ch)}:{px(cx)}:{px(cy)}")
    chain.append(f"[d{n}]" + ",".join(marks) + "[out]")

    out = os.path.join(OUT, f"{name}.jpg")
    subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", str(t), "-i", video, "-frames:v", "1",
         "-filter_complex", ";".join(chain), "-map", "[out]", "-q:v", "3", "-y", out],
        check=True,
    )
    print("wrote", os.path.relpath(out))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    os.makedirs(OUT, exist_ok=True)
    for shot in SHOTS:
        build(*shot, video=sys.argv[1])

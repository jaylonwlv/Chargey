#!/usr/bin/env python3
"""Draws the placeholder app icon: slime-green square, black bolt, pink drop shadow."""
import os
import struct
import zlib

SIZE = 1024
BG = (199, 255, 0)
SHADOW = (255, 61, 154)
BOLT = (15, 13, 23)
POINTS = [(600, 90), (250, 570), (480, 570), (400, 940), (780, 430), (550, 430), (650, 90)]
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "icon.png")


def inside(x, y, poly):
    hit = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            hit = not hit
        j = i
    return hit


shadow = [(x + 36, y + 36) for x, y in POINTS]
rows = []
for y in range(SIZE):
    row = bytearray([0])
    for x in range(SIZE):
        if inside(x, y, POINTS):
            row += bytes(BOLT)
        elif inside(x, y, shadow):
            row += bytes(SHADOW)
        else:
            row += bytes(BG)
    rows.append(bytes(row))


def chunk(kind, data):
    return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)


png = b"\x89PNG\r\n\x1a\n"
png += chunk(b"IHDR", struct.pack(">IIBBBBB", SIZE, SIZE, 8, 2, 0, 0, 0))
png += chunk(b"IDAT", zlib.compress(b"".join(rows), 9))
png += chunk(b"IEND", b"")
with open(OUT, "wb") as f:
    f.write(png)
print("wrote", os.path.relpath(OUT))

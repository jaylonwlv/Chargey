#!/usr/bin/env bash
# Cuts the setup-tutorial screenshots out of a screen recording and highlights
# what to tap. Box/blur coordinates are in a 430px-wide frame (scaled 1.5x).
#   tools/make_tutorial.sh path/to/recording.mp4
set -euo pipefail
VIDEO="$1"
OUT="$(dirname "$0")/../assets/tutorial"
mkdir -p "$OUT"
SLIME="0xC7FF00"

# shot <name> <seconds> <boxes "x,y,w,h;..."> [blurs "x,y,w,h;..."]
shot() {
  local name=$1 t=$2 boxes=$3 blurs=${4:-}
  local chain="[0:v]scale=645:-2[base]" last="base" i=0
  for b in ${blurs//;/ }; do
    IFS=, read -r x y w h <<<"$b"
    chain+=";[$last]split[a$i][b$i];[b$i]crop=$((w*3/2)):$((h*3/2)):$((x*3/2)):$((y*3/2)),boxblur=luma_radius=10:luma_power=3:chroma_radius=5:chroma_power=3[c$i];[a$i][c$i]overlay=$((x*3/2)):$((y*3/2))[o$i]"
    last="o$i"; i=$((i+1))
  done
  local draws=""
  for b in ${boxes//;/ }; do
    IFS=, read -r x y w h <<<"$b"
    draws+="drawbox=x=$((x*3/2)):y=$((y*3/2)):w=$((w*3/2)):h=$((h*3/2)):color=$SLIME:t=7,"
  done
  chain+=";[$last]${draws%,}[out]"
  ffmpeg -v error -ss "$t" -i "$VIDEO" -frames:v 1 -filter_complex "$chain" -map "[out]" -q:v 4 -y "$OUT/$name.jpg"
  echo "wrote assets/tutorial/$name.jpg"
}

shot 1-library-trap   10 "175,850,80,60"
shot 2-new-automation 11 "122,548,186,64"
shot 3-charger        16 "18,538,394,64"
shot 4-run-immediately 21 "20,455,390,52;338,76,76,50"
shot 5-pick-chargey   29 "8,402,414,64" "119,86,90,30"
shot 6-play-sound     31 "14,133,198,114"
shot 7-done           33 "18,211,394,146" "85,276,87,28"

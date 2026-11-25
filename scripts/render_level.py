"""Render the original profile runner. Requires Pillow; run from the repo root.

50 fps, a fixed palette and periodic world coordinates keep the motion smooth,
the loop seamless and the download small. No external artwork or fonts.
"""
from pathlib import Path
from math import sin, cos, pi
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
W, H, FPS, SECONDS = 900, 196, 50, 9
GROUND = 157
COLORS = [
    "#101b2a", "#172638", "#203748", "#2c4c59", "#4b7277",
    "#91b4ad", "#c8d8ca", "#e7e6cc", "#273d43", "#192c35",
    "#435e5b", "#70917a", "#aac19a", "#a38360", "#d0b998",
    "#e8d9b9", "#4d372e", "#78533c", "#aa7753", "#d2a17c",
    "#ebc3a0", "#334b68", "#6889a1", "#b5c8c9", "#f3cd7b",
    "#ad824d", "#f4e2ac", "#152129", "#395266", "#2b414f",
    "#698b8b", "#345c60"
]
RGB = [tuple(bytes.fromhex(c[1:])) for c in COLORS]
palette = Image.new("P", (1, 1))
palette.putpalette([v for c in RGB for v in c] + [0] * (768 - 3 * len(RGB)))

def hill(d, t, speed, baseline, color, period, height, phase):
    points = [(0, H)]
    for x in range(-8, W + 9, 8):
        world = x + speed * t
        y = baseline + height * sin(2 * pi * world / period + phase)
        y += height * .3 * sin(4 * pi * world / period + phase)
        points.append((x, round(y)))
    points += [(W, H)]
    d.polygon(points, fill=color)

def sprite(frame, x, feet, phase, airborne):
    """A small original runner with brown hair, glasses and a cream hoodie."""
    art = Image.new("RGBA", (40, 48))
    a = ImageDraw.Draw(art)
    # Leg and arm positions animate continuously, independent of world motion.
    swing = 5 * sin(phase) if not airborne else -3
    arm = -4 * sin(phase) if not airborne else -4
    a.line([(18, 31), (round(17+swing), 41), (round(14+swing), 44)], fill=COLORS[21], width=5)
    a.line([(23, 31), (round(24-swing), 41), (round(26-swing), 44)], fill=COLORS[22], width=5)
    a.rectangle((round(11+swing), 43, round(18+swing), 46), fill=COLORS[7])
    a.rectangle((round(23-swing), 43, round(30-swing), 46), fill=COLORS[23])
    a.line([(16, 22), (round(13+arm), 31)], fill=COLORS[14], width=5)
    a.rounded_rectangle((15, 18, 27, 33), radius=3, fill=COLORS[15])
    a.rectangle((16, 29, 27, 33), fill=COLORS[14])
    a.line([(25, 22), (round(28-arm), 29)], fill=COLORS[15], width=5)
    a.rectangle((round(27-arm), 28, round(30-arm), 31), fill=COLORS[19])
    a.rectangle((17, 5, 29, 18), fill=COLORS[19])
    a.rectangle((25, 10, 31, 15), fill=COLORS[20])
    a.rectangle((14, 3, 28, 9), fill=COLORS[16])
    a.rectangle((17, 1, 24, 7), fill=COLORS[17])
    a.rectangle((13, 6, 18, 14), fill=COLORS[16])
    a.rectangle((23, 6, 29, 8), fill=COLORS[17])
    a.rectangle((22, 10, 30, 13), fill=COLORS[27])
    a.rectangle((24, 11, 28, 12), fill=COLORS[23])
    a.rectangle((27, 16, 30, 17), fill=COLORS[16])
    frame.paste(art, (round(x)-20, round(feet)-47), art)

def render(i):
    t = i / FPS
    im = Image.new("RGB", (W, H), COLORS[0])
    d = ImageDraw.Draw(im)
    # Fixed sky, no flashing or randomised frames.
    for x, y in [(38,32),(91,63),(168,21),(252,52),(324,25),(385,71),
                 (453,38),(517,19),(598,57),(674,26),(741,67),(817,22),(863,54)]:
        d.point((x,y), fill=COLORS[4])
    d.ellipse((735,24,758,47), fill=COLORS[6])
    d.ellipse((742,20,762,42), fill=COLORS[0])
    # All speeds move an exact number of terrain periods in nine seconds.
    hill(d,t,25,105,COLORS[1],225,13,.3)
    hill(d,t,50,123,COLORS[2],450,17,1.2)
    hill(d,t,100,148,COLORS[3],450,9,.6)
    d.rectangle((0,GROUND,W,H), fill=COLORS[9])
    d.rectangle((0,GROUND,W,GROUND+3), fill=COLORS[11])
    d.rectangle((0,GROUND+3,W,GROUND+6), fill=COLORS[8])
    # A pair of low obstacles repeats every 450 px. Runner jumps on approach.
    xrunner = 185
    jump = 0
    for root in range(-450, 1351, 450):
        obstacle = (root - 100*t) % 900
        dx = obstacle - xrunner
        if -44 < dx < 56:
            u = (56-dx)/100
            jump = max(jump, 44*sin(pi*u))
        d.rectangle((round(obstacle),GROUND-12,round(obstacle+13),GROUND-1), fill=COLORS[4])
        d.rectangle((round(obstacle+3),GROUND-16,round(obstacle+10),GROUND-4), fill=COLORS[5])
    # Ground details repeat exactly at the loop boundary.
    for n in range(30):
        x = round((n*30+17-100*t)%900)-12
        y = 173 + (n%3)*6
        d.rectangle((x,y,x+5,y+1), fill=COLORS[8])
    # Small floating coins, collected during the jump, reappear behind the runner.
    for base in (0,450):
        cx = (base+9-100*t)%900
        dx = cx-xrunner
        if dx > 0 or dx < -65:
            cy = GROUND-52
            cw = max(1,round(3*abs(cos(t*pi*2))))
            d.ellipse((round(cx)-cw,cy-4,round(cx)+cw,cy+4),fill=COLORS[24])
            if cw>1: d.line((round(cx),cy-2,round(cx),cy+2),fill=COLORS[26])
    d.ellipse((xrunner-14,GROUND-2,xrunner+16,GROUND+1),fill=COLORS[27])
    sprite(im,xrunner,GROUND-jump,2*pi*2*t,jump>1)
    # Explicit fixed palette prevents colour flicker between frames.
    return im.quantize(palette=palette,dither=Image.Dither.NONE)

if __name__ == "__main__":
    dest = ROOT / "assets"
    dest.mkdir(exist_ok=True)
    frames = [render(i) for i in range(FPS*SECONDS)]
    frames[0].save(dest/"level.gif", save_all=True, append_images=frames[1:],
                   duration=20, loop=0, optimize=True, disposal=1)
    render(80).convert("RGB").save(dest/"level-still.png")
    # Inspection contact sheet: grounded pose, jump approach, peak and landing.
    sheet = Image.new("RGB", (W,H*4))
    for row,idx in enumerate((0,112,125,152)):
        sheet.paste(render(idx).convert("RGB"),(0,row*H))
    sheet.save(ROOT/"level-review.png")
    print(f"Saved {len(frames)} frames at {FPS} fps: {(dest/'level.gif').stat().st_size:,} bytes")

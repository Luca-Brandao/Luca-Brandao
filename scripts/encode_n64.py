"""Encode the Blender frames into the README animation and motion-free fallback.

Requires ffmpeg. Run after scripts/render_n64.py has rendered the scene.
"""
from pathlib import Path
import subprocess

ROOT=Path(__file__).resolve().parents[1]
SCENE=ROOT.parent/'n64-profile'
ASSETS=ROOT/'assets'
PALETTE=SCENE/'palette.png'
SEQUENCE=str(SCENE/'frames'/'frame-%04d.png')

def ffmpeg(*args):
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',*args],check=True)

ffmpeg('-framerate','50','-i',SEQUENCE,'-vf',
       'scale=720:336:flags=area,palettegen=max_colors=128:stats_mode=diff',
       '-frames:v','1',str(PALETTE))
ffmpeg('-framerate','50','-i',SEQUENCE,'-i',str(PALETTE),'-filter_complex',
       '[0:v]scale=720:336:flags=area[v];[v][1:v]paletteuse=dither=bayer:bayer_scale=5',
       '-loop','0','-gifflags','+transdiff',str(ASSETS/'level.gif'))
ffmpeg('-i',str(SCENE/'frames'/'frame-0001.png'),'-vf','scale=720:336:flags=area',
       '-frames:v','1',str(ASSETS/'level-still.png'))
print(f"Saved N64-style animation: {(ASSETS/'level.gif').stat().st_size:,} bytes")

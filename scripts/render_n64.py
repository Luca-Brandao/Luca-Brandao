"""Original low-poly 3D profile scene. Run with Blender 4.3 in background mode.

blender -b -t 4 --python scripts/render_n64.py -- --preview
blender -b -t 4 --python scripts/render_n64.py
"""
import bpy
import math
import random
import sys
from pathlib import Path
from mathutils import Vector

OUT = Path(__file__).resolve().parents[2] / 'n64-profile'
OUT.mkdir(exist_ok=True)
(OUT/'frames').mkdir(exist_ok=True)
random.seed(64)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(name, color):
    m=bpy.data.materials.new(name)
    m.diffuse_color=(*color,1)
    return m

M={k:material(k,c) for k,c in {
 'grass':(.36,.65,.22),'grass_light':(.47,.73,.29),
 'grass_dark':(.26,.51,.20),'soil':(.53,.33,.20),
 'soil_light':(.65,.43,.24),'rock':(.57,.59,.51),
 'rock_dark':(.37,.43,.40),'path':(.81,.70,.47),
 'water':(.20,.58,.71),'ripple':(.40,.75,.79),
 'leaf':(.16,.43,.26),'leaf_light':(.28,.58,.29),
 'bark':(.40,.27,.19),'cream':(.83,.77,.65),
 'cream_dark':(.65,.58,.47),'skin':(.76,.55,.39),
 'skin_light':(.87,.68,.49),'hair':(.20,.12,.08),
 'hair_light':(.32,.21,.13),'glasses':(.15,.22,.25),
 'lens':(.48,.65,.66),'eyes':(.12,.15,.14),
 'trousers':(.20,.28,.39),'shoes':(.89,.88,.78),
 'sole':(.35,.39,.40),'gold':(.98,.72,.15),
 'gold_light':(1.0,.88,.40),'white':(.94,.95,.88),
 'portal':(.26,.45,.52),'shadow':(.25,.40,.22),
}.items()}

def assign(o,mat):
    o.data.materials.append(M[mat]); return o

def cube(name,loc,scale,mat,parent=None,bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    o=bpy.context.object; o.name=name; o.dimensions=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if bevel:
        mod=o.modifiers.new('Simple chamfer','BEVEL'); mod.width=bevel; mod.segments=1
    assign(o,mat)
    if parent: o.parent=parent; o.location=loc
    return o

def cone(name,loc,r1,r2,depth,mat,vertices=8):
    bpy.ops.mesh.primitive_cone_add(vertices=vertices,radius1=r1,radius2=r2,
                                   depth=depth,location=loc)
    o=bpy.context.object; o.name=name; assign(o,mat); return o

def ico(name,loc,scale,mat,sub=1,parent=None):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub,radius=1,location=loc)
    o=bpy.context.object; o.name=name; o.scale=scale; assign(o,mat)
    if parent: o.parent=parent; o.location=loc
    return o

def empty(name,loc=(0,0,0),parent=None):
    o=bpy.data.objects.new(name,None); bpy.context.collection.objects.link(o)
    o.location=loc; o.parent=parent; return o

# One hand-modelled island, with flat faces and a light dirt circuit.
cone('Island cliff', (0,0,-.18),4.15,4.68,1.30,'soil',vertices=24)
cone('Grass top', (0,0,.50),4.68,4.68,.18,'grass',vertices=24)
cone('Water', (0,0,-.88),200,200,.08,'water',vertices=64)
for i in range(24):
    a=2*math.pi*i/24
    # Individual rock faces avoid a smooth modern diorama finish.
    ico('Cliff facet',(4.25*math.cos(a),4.25*math.sin(a),-.35),
        (.48,.36,.45),'soil_light' if i%3 else 'rock_dark')

verts=[]; faces=[]
for i in range(80):
    a=2*math.pi*i/80
    for r in (2.48,3.35): verts.append((r*math.cos(a),r*math.sin(a),.602))
for i in range(80):
    j=(i+1)%80; faces.append((2*i,2*i+1,2*j+1,2*j))
mesh=bpy.data.meshes.new('Circuit mesh'); mesh.from_pydata(verts,[],faces); mesh.update()
path=bpy.data.objects.new('Dirt circuit',mesh); bpy.context.collection.objects.link(path); assign(path,'path')

# Chunky trees, tiny flowers and angular rocks are all original geometry.
def tree(x,y,s=1):
    cone('Tree trunk',(x,y,.60+.5*s),.13*s,.10*s,1.0*s,'bark',vertices=6)
    for z,r in ((1.0,.70),(1.55,.57),(2.05,.39)):
        cone('Pine crown',(x,y,.60+z*s),r*s,0,.98*s,
             'leaf_light' if z==1.55 else 'leaf',vertices=7)
for xy in [(-3.1,2.4,.95),(-3.6,.8,.72),(.3,3.9,.82),(3.5,2.0,.96)]: tree(*xy)
for x,y,s in [(-1.6,.1,.42),(1.5,1,.35),(-3.8,-1.3,.25),(3.7,-1.4,.36)]:
    ico('Stone',(x,y,.65),(s,s*.8,s*.6),'rock')
for i in range(17):
    a=random.uniform(0,2*math.pi); r=random.uniform(3.6,4.1)
    x,y=r*math.cos(a),r*math.sin(a)
    ico('Flower leaves',(x,y,.65),(.12,.13,.10),'grass_dark')
    ico('Flower',(x,y,.81),(.075,.075,.075),'gold_light' if i%3 else 'white')

# A simple stone arch gives the world a focal point without slogans or panels.
for x in (-.82,.82):
    cube('Arch pillar',(x,.45,1.37),(.40,.48,1.56),'rock',bevel=.07)
    cube('Pillar base',(x,.45,.72),(.55,.62,.22),'rock_dark',bevel=.03)
cube('Arch cap',(0,.45,2.17),(2.10,.55,.38),'rock',bevel=.08)
cube('Arch top',(0,.45,2.41),(1.27,.47,.17),'grass_light',bevel=.03)
for x in (-.48,.05,.57):
    cube('Cap seam',(x,.162,2.17),(.025,.015,.28),'rock_dark')
cone('Centre pad',(0,.45,.63),.69,.69,.09,'portal',vertices=10)
centre_gem=ico('Centre crystal',(0,.45,1.35),(.21,.21,.43),'gold')

# Two distant islands read as a 1990s platformer horizon.
for x,y,s in [(-8,9,1.35),(9,12,1.9),(-12,19,2.1)]:
    cone('Distant island',(x,y,-.25),s*.6,s,1.1,'soil',vertices=9)
    cone('Distant turf',(x,y,.35),s,s,.11,'grass_dark',vertices=9)
    tree(x,y,.55*s)

for x,y in [(-7,-3),(-6,6),(7,-2),(7,7),(0,7),(-9,9)]:
    for j in range(2):
        cube('Water glint',(x+j*.24,y,-.825),(.65-j*.20,.04,.01),'ripple')

# Personal player: cream hoodie, wavy brown hair, glasses and moustache.
player=empty('Luca player')
body=empty('Body bob',parent=player)
cube('Hoodie torso',(0,0,.87),(.55,.36,.64),'cream',body,bevel=.055)
ico('Hood',(0,.10,1.18),(.32,.22,.27),'cream_dark',parent=body)
cube('Hoodie pocket',(0,-.195,.80),(.28,.025,.14),'cream_dark',body,bevel=.01)
for x in (-.075,.075): cube('Drawstring',(x,-.197,1.08),(.017,.018,.16),'white',body)
cube('Neck',(0,0,1.24),(.17,.18,.16),'skin',body)
cube('Face',(0,-.015,1.49),(.52,.43,.51),'skin_light',body,bevel=.065)
cube('Nose',(0,-.26,1.46),(.11,.11,.12),'skin',body,bevel=.025)
for x in (-.137,.137):
    cube('Glasses frame',(x,-.253,1.55),(.235,.04,.15),'glasses',body,bevel=.012)
    cube('Glasses lens',(x,-.278,1.55),(.173,.015,.095),'lens',body)
    cube('Eye',(x,-.29,1.55),(.041,.01,.055),'eyes',body)
cube('Glasses bridge',(0,-.27,1.56),(.07,.035,.035),'glasses',body)
for x in (-.265,.265): cube('Glasses arm',(x,-.02,1.55),(.025,.38,.035),'glasses',body)
cube('Moustache',(0,-.242,1.37),(.17,.018,.045),'hair',body,bevel=.01)
cube('Hair base',(0,.04,1.73),(.56,.45,.20),'hair',body,bevel=.035)
for x,y,z,s in [(-.20,-.17,1.77,.18),(-.07,-.15,1.82,.19),(.08,-.11,1.82,.19),
                 (.22,-.12,1.77,.17),(-.25,.05,1.68,.13),(.26,.07,1.69,.13)]:
    ico('Wavy hair',(x,y,z),(s,s*.9,s*.72),'hair_light' if x<0 else 'hair',parent=body)
legs=[]; arms=[]
for side in (-1,1):
    pivot=empty('Hip',(.15*side,0,.58),player); legs.append(pivot)
    cube('Trouser leg',(0,0,-.21),(.19,.23,.42),'trousers',pivot,bevel=.018)
    cube('Trainer',(0,-.065,-.47),(.23,.36,.16),'shoes',pivot,bevel=.025)
    cube('Sole',(0,-.065,-.55),(.23,.36,.035),'sole',pivot)
    shoulder=empty('Shoulder',(.35*side,0,1.09),body); arms.append(shoulder)
    cube('Sleeve',(0,0,-.19),(.20,.23,.37),'cream',shoulder,bevel=.025)
    cube('Hand',(0,-.015,-.41),(.17,.19,.17),'skin_light',shoulder,bevel=.025)

# Collectible diamonds spin continuously; a very small obstacle makes the hop legible.
gems=[]
for a in (0,2*math.pi/3,4*math.pi/3):
    gem=ico('Collectible',(2.90*math.cos(a),2.90*math.sin(a),1.55),(.14,.14,.24),'gold')
    gems.append((gem,a))
obstacle=cube('Low jump block',(-2.90,0,.73),(.38,.55,.27),'rock_dark',bevel=.045)
cube('Jump block top',(-2.90,0,.88),(.40,.57,.065),'rock',bevel=.02)
shadow=cone('Player shadow',(0,0,.61),.34,.34,.006,'shadow',vertices=16)

# Soft studio light with flat polygons and a bright simple sky.
scene=bpy.context.scene
scene.render.engine='BLENDER_WORKBENCH'
scene.display.shading.light='STUDIO'
scene.display.shading.studiolight_rotate_z=.45
scene.display.shading.color_type='MATERIAL'
scene.display.shading.show_shadows=True
scene.display.shading.show_cavity=True
scene.display.shading.cavity_type='WORLD'
scene.display.shading.curvature_ridge_factor=.6
scene.display.shading.curvature_valley_factor=.35
scene.display.shading.show_specular_highlight=False
scene.display.shading.show_object_outline=False
scene.display.shading.background_type='WORLD'
scene.world.color=(.55,.73,.84)
scene.view_settings.view_transform='Standard'
scene.display.render_aa='16'
scene.render.resolution_x=900
scene.render.resolution_y=420
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.fps=50
scene.frame_start=1; scene.frame_end=400
bpy.ops.object.camera_add(location=(10,-15.2,9.8))
camera=bpy.context.object; scene.camera=camera; camera.data.type='PERSP'; camera.data.lens=40
camera.data.clip_end=150

def point_camera(p): camera.rotation_euler=(Vector(p)-camera.location).to_track_quat('-Z','Y').to_euler()

for frame in range(1,402):
    u=(frame-1)/400
    a=2*math.pi*u-math.pi/2
    x,y=2.90*math.cos(a),2.90*math.sin(a)
    delta=abs(((a-math.pi+math.pi)%(2*math.pi))-math.pi)
    jump=.70*max(0,math.cos(delta*math.pi/.64)) if delta<.32 else 0
    player.location=(x,y,.64+jump)
    player.rotation_euler.z=a+math.pi
    player.keyframe_insert('location',frame=frame); player.keyframe_insert('rotation_euler',frame=frame)
    run=2*math.pi*16*u
    body.location.z=.032*math.cos(2*run)
    body.keyframe_insert('location',frame=frame)
    for j,p in enumerate(legs):
        p.rotation_euler.x=.55*math.sin(run+j*math.pi) if jump<.05 else -.45
        p.keyframe_insert('rotation_euler',frame=frame)
    for j,p in enumerate(arms):
        p.rotation_euler.x=-.55*math.sin(run+j*math.pi) if jump<.05 else -1.0
        p.keyframe_insert('rotation_euler',frame=frame)
    shadow.location.x=x; shadow.location.y=y
    shadow.scale=(1-jump*.25,1-jump*.25,1)
    shadow.keyframe_insert('location',frame=frame); shadow.keyframe_insert('scale',frame=frame)
    for gem,ga in gems:
        distance=abs(((a-ga+math.pi)%(2*math.pi))-math.pi)
        visible=min(1,max(0,(distance-.10)/.18))
        gem.scale=(.14*visible,.14*visible,.24*visible)
        gem.rotation_euler.z=2*math.pi*4*u
        gem.location.z=1.55+.08*math.sin(2*math.pi*2*u+ga)
        for prop in ('scale','rotation_euler','location'):gem.keyframe_insert(prop,frame=frame)
    centre_gem.rotation_euler.z=2*math.pi*2*u
    centre_gem.location.z=1.35+.09*math.sin(2*math.pi*u)
    centre_gem.keyframe_insert('rotation_euler',frame=frame); centre_gem.keyframe_insert('location',frame=frame)
    camera.location=(10+.28*math.sin(2*math.pi*u),-15.2,9.8+.12*math.cos(2*math.pi*u))
    point_camera((0,.15,.84))
    camera.keyframe_insert('location',frame=frame); camera.keyframe_insert('rotation_euler',frame=frame)

for obj in bpy.data.objects:
    if obj.animation_data and obj.animation_data.action:
        for fc in obj.animation_data.action.fcurves:
            for p in fc.keyframe_points:p.interpolation='LINEAR'

bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'luca-n64-scene.blend'))
if '--preview' in sys.argv:
    for f in (1,96,205,305):
        scene.frame_set(f);scene.render.filepath=str(OUT/f'preview-{f:03}.png')
        bpy.ops.render.render(write_still=True)
else:
    scene.render.filepath=str(OUT/'frames'/'frame-')
    bpy.ops.render.render(animation=True)

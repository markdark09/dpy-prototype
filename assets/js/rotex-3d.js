/* How it works, Rotex Sanicube: a real-time 3D cutaway in place of the flat diagram (which stays as the fallback).
   From ROTEX's operating and installation instructions (Sanicube INOX, section 2.2): the tank is polypropylene with
   PUR foam insulation, full of unpressurised tank water that only stores heat. A heat pump or boiler heats the
   "readiness zone" at the top through its own corrugated stainless steel coil (solar, where fitted, heats a zone at
   the bottom). Drinking water is not stored in the tank: it enters at the very bottom of its own corrugated stainless
   steel coil and takes up heat on the way to the top (counterflow), first in, first out, which also keeps the bottom of
   the tank the coolest. The figure's data-step (set by product.js as the steps scroll past) says
   which part of that story to show. */
const fig = document.querySelector('.hws .how-vis'), svg = fig?.querySelector('svg')
// everything runs inside start(), so a browser without WebGL can step aside quietly and keep the drawing
async function start() {
if (!fig || !svg) return
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches
const cv = document.createElement('canvas'), lblBox = document.createElement('div')
cv.className = 'r3d'; lblBox.className = 'r3d-lbls'; cv.setAttribute('aria-hidden', 'true'); lblBox.setAttribute('aria-hidden', 'true')
// starts when the section comes near, so the product page itself loads as before
await new Promise(go => new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); go() } }, { rootMargin: '120% 0px' }).observe(fig))
const breathe = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)))
let THREE, RoomEnvironment, R
try {
  THREE = await import('three'); ({ RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js'))
  R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance' })
} catch { return } // no WebGL here: the flat drawing stays, and that is all
R.debug.checkShaderErrors = false; R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05; R.outputColorSpace = THREE.SRGBColorSpace
R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.shadowMap.autoUpdate = false; R.shadowMap.needsUpdate = true // the tank never moves: its shadows are drawn once
const scene = new THREE.Scene()
await breathe()
scene.environment = new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(), .04).texture
const key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(4, 6, 6); scene.add(key)
key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0004; key.shadow.normalBias = .015; key.shadow.radius = 4
Object.assign(key.shadow.camera, { left: -2.2, right: 2.2, top: 2.4, bottom: -2.4, near: 2, far: 16 })
const rim = new THREE.DirectionalLight(0x7cc0ff, 1.2); rim.position.set(-6, 3, -4); scene.add(rim)
scene.add(new THREE.HemisphereLight(0xe4eef8, 0x0a1830, .45))
const glow = new THREE.PointLight(0xff6a2a, 0, 2.4, 1.6); scene.add(glow) // the heating coil's glow on the water
const cam = new THREE.PerspectiveCamera(26, 1, .1, 60)
await breathe()

/* ---- dimensions: the 500 liter model in DPY's photo and spec table (790 x 790 x 1,658 mm; 80 mm of foam),
   at 1 unit to about 500 mm, with rounded corners as on the real tank ---- */
const W = .79, SHI = .775, FI = .615, TI = .595 // outer, shell inner, foam inner, tank inner (half widths)
const RW = .1, RS = .085, RF = .07, RT = .055 // their corner radii
const H = 1.63, HI = 1.43, CAP = .13 // body and water half heights, top cap thickness
// the window cut into the front-right corner, as in ROTEX's own cutaway image: x > CX and z > CX, between YW0 and YW1
const CX = -.04, YW0 = -1.31, YW1 = 1.29

/* ---- materials ---- */
const tex = (fn, w = 256, h = w) => { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t }
const foamMap = tex((x, s) => { // polyurethane foam: pale ochre, fine closed cells, a little uneven
  x.fillStyle = '#DDB060'; x.fillRect(0, 0, s, s)
  for (let i = 0; i < 40; i++) { const g = x.createRadialGradient(Math.random() * s, Math.random() * s, 0, Math.random() * s, Math.random() * s, 60 + Math.random() * 80); g.addColorStop(0, Math.random() < .5 ? 'rgba(240,200,120,.25)' : 'rgba(170,120,40,.18)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, s, s) }
  for (let i = 0; i < 14000; i++) { const r = Math.random() * 1.3 + .3; x.fillStyle = Math.random() < .55 ? 'rgba(130,85,20,.32)' : 'rgba(255,236,175,.4)'; x.beginPath(); x.arc(Math.random() * s, Math.random() * s, r, 0, 7); x.fill() }
}, 512)
foamMap.repeat.set(1.6, 1.6)
const M = {
  shell: new THREE.MeshPhysicalMaterial({ color: 0xE6E9EC, roughness: .32, clearcoat: .8, clearcoatRoughness: .14, side: THREE.DoubleSide }), // glossy white polypropylene, as in the photo
  cap: new THREE.MeshPhysicalMaterial({ color: 0x3B4147, roughness: .5, clearcoat: .25, clearcoatRoughness: .4 }), // the satin charcoal top
  foam: new THREE.MeshStandardMaterial({ color: 0xffffff, map: foamMap, bumpMap: foamMap, bumpScale: 1.5, roughness: .95, side: THREE.DoubleSide }),
  tank: new THREE.MeshStandardMaterial({ color: 0xAEB5BC, roughness: .62, metalness: .02, side: THREE.DoubleSide }), // the polypropylene inner tank
  steel: new THREE.MeshStandardMaterial({ color: 0xB9C1C9, roughness: .3, metalness: 1, envMapIntensity: .95 }), // 316L stainless (its corrugation is too fine to show at this size)
  heat: new THREE.MeshStandardMaterial({ color: 0xB3BBC3, roughness: .32, metalness: 1, emissive: 0x000000, emissiveIntensity: 1, envMapIntensity: .9 }),
  pipe: new THREE.MeshStandardMaterial({ color: 0xE8ECF0, roughness: .16, metalness: 1 }),
  red: new THREE.MeshPhysicalMaterial({ color: 0xC70A0E, roughness: .35, clearcoat: .6 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x0D68C3, roughness: .4 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xC9A048, roughness: .3, metalness: 1 }),
  plug: new THREE.MeshPhysicalMaterial({ color: 0xE9ECEE, roughness: .35, clearcoat: .5 }),
}

/* ---- the tank: rounded square walls in three layers (white polypropylene, polyurethane foam, the inner tank), whole
   above and below the window, cut open at the front-right corner in between ---- */
const tank = new THREE.Group(); scene.add(tank)
// the outline of a rounded square of half width h and corner radius r, in (x, z), starting on the front face at x = CX
// and going round by the left, the back and the right; cut: stop on the right face at z = CX
function outline(h, r, cut) {
  const pts = [], arc = (cx, cz, a0, a1) => { for (let k = 0; k <= 8; k++) { const a = a0 + (a1 - a0) * k / 8; pts.push([cx + r * Math.cos(a), cz + r * Math.sin(a)]) } }
  const q = h - r, D = Math.PI / 180
  pts.push([CX, h]); arc(-q, q, 90 * D, 180 * D); arc(-q, -q, 180 * D, 270 * D); arc(q, -q, 270 * D, 360 * D)
  if (cut) pts.push([h, CX]); else { arc(q, q, 0, 90 * D); pts.push([CX, h]) }
  return pts
}
// a 2D shape in (x, z) extruded upwards from y0 to y1 (the shape's y is -z, so it reads the right way round)
function extrude(pts, holes, y0, y1, mat, bevel = 0) {
  const shape = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)))
  for (const hole of holes) shape.holes.push(new THREE.Path(hole.map(([x, z]) => new THREE.Vector2(x, -z))))
  const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0 - 2 * bevel, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * .7, bevelSegments: 3, curveSegments: 1 })
  const m = new THREE.Mesh(g, mat); m.rotation.x = -Math.PI / 2; m.position.y = y0 + bevel; m.castShadow = m.receiveShadow = true; tank.add(m); return m
}
// one layer of wall between half widths a and b: whole rings above and below the window, an L of wall beside it
function wall(a, ra, b, rb, y0, y1, mat) {
  const full = () => [outline(a, ra), [outline(b, rb)]]
  extrude(...full(), y0, YW0, mat); extrude(...full(), YW1, y1, mat)
  extrude([...outline(a, ra, true), ...outline(b, rb, true).reverse()], [], YW0, YW1, mat)
}
wall(W, RW, SHI, RS, -H, H, M.shell)
wall(SHI, RS, FI, RF, -H + .015, H, M.foam)
wall(FI, RF, TI, RT, -HI, HI, M.tank)
extrude(outline(SHI, RS), [], HI + .02, H, M.foam); extrude(outline(SHI, RS), [], -H + .015, -HI - .02, M.foam) // foam above and below the tank
extrude(outline(FI, RF), [], HI, HI + .02, M.tank); extrude(outline(FI, RF), [], -HI - .02, -HI, M.tank)
extrude(outline(W, RW), [], -H - .03, -H + .015, M.shell)
extrude(outline(W + .012, RW + .012), [], H, H + CAP, M.cap, .035) // the dark top cap, with soft edges
// on the front, as in the photo: the ROTEX name near the top left and two round plugs lower down (the name drawn as
// text, not a copy of the logo artwork)
const onFront = (mesh, x, y) => { mesh.position.set(x, y, W + .004); tank.add(mesh); return mesh }
for (const y of [-.45, -1.38]) onFront(new THREE.Mesh(new THREE.CircleGeometry(.07, 40), M.plug), -.42, y)
const label = (text, font, align) => { const t = tex((x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = '#2F3439'; x.textAlign = align; x.textBaseline = 'middle'; x.font = font; x.fillText(text, align === 'left' ? 8 : w - 8, h / 2 + 4) }, 512, 128); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return new THREE.MeshPhysicalMaterial({ map: t, transparent: true, roughness: .3, clearcoat: .8, polygonOffset: true, polygonOffsetFactor: -2 }) }
onFront(new THREE.Mesh(new THREE.PlaneGeometry(.48, .12), label('ROTEX', '900 88px "Arial Black", Arial, sans-serif', 'left')), -.4, H - .2)
onFront(new THREE.Mesh(new THREE.PlaneGeometry(.48, .12), label('Sanicube', '500 54px Arial, sans-serif', 'right')), .45, H - .2)
// a soft shadow on the floor, so the tank stands on something
const shadowTex = tex((x, s) => { const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); g.addColorStop(0, 'rgba(0,0,0,.6)'); g.addColorStop(.45, 'rgba(0,0,0,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, s, s) })
{ const m = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 2.9), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.y = -H - .032; tank.add(m) }

/* ---- the coils ---- */
const helix = (r, y0, y1, turns, th0) => { const n = Math.round(turns * 40); return Array.from({ length: n + 1 }, (_, i) => { const u = i / n, th = th0 + u * turns * Math.PI * 2; return new THREE.Vector3(r * Math.sin(th), y0 + u * (y1 - y0), r * Math.cos(th)) }) }
// the connections in a row along the front of the cap, as in ROTEX's image: drinking water in (blue) and out (red),
// heating flow (red) and return (blue), and a spare
const TOP = H + CAP + .02, FZ = .5, UNDER = H - .06 // the cap's top, the row's depth, just under the cap (inside the foam)
const FIT = { coldIn: -.42, hotOut: -.21, heatFlow: 0, heatReturn: .21, spare: .42 }
for (const [x, mat] of [[FIT.coldIn, M.blue], [FIT.hotOut, M.red], [FIT.heatFlow, M.red], [FIT.heatReturn, M.blue], [FIT.spare, M.pipe]]) {
  const part = (geo, m, y) => { const p = new THREE.Mesh(geo, m); p.position.set(x, y, FZ); p.castShadow = true; tank.add(p) }
  part(new THREE.CylinderGeometry(.03, .034, .2, 20), M.pipe, TOP + .1)
  part(new THREE.CylinderGeometry(.046, .046, .045, 24), mat, TOP + .11)
  part(new THREE.CylinderGeometry(.052, .052, .05, 6), M.brass, TOP + .19)
  part(new THREE.CylinderGeometry(.036, .036, .04, 20), M.brass, TOP + .235)
}
// the drinking water coil: large, close to the tank wall, many tight turns from bottom to top
const RC = .48, Y0 = -1.33, Y1 = 1.27, TURNS = 13, TH0 = Math.PI * 1.1
const coilPts = helix(RC, Y0, Y1, TURNS, TH0), coilStart = coilPts[0], coilEnd = coilPts.at(-1)
// its path: in at the cap, down a pipe at the back to the very bottom, up the coil, and out at the cap
const IN = new THREE.Vector3(-.12, 0, -.28)
const path = [new THREE.Vector3(FIT.coldIn, TOP + .25, FZ), new THREE.Vector3(FIT.coldIn, UNDER, FZ), new THREE.Vector3(IN.x, UNDER, IN.z), new THREE.Vector3(IN.x, Y0 + .02, IN.z),
  new THREE.Vector3((IN.x + coilStart.x) / 2, Y0 - .02, (IN.z + coilStart.z) / 2), ...coilPts,
  new THREE.Vector3(coilEnd.x, UNDER, coilEnd.z), new THREE.Vector3(FIT.hotOut, UNDER, FZ), new THREE.Vector3(FIT.hotOut, TOP + .25, FZ)]
const dhw = new THREE.CatmullRomCurve3(path, false, 'catmullrom', .02)
// the coil's own material carries the flow: a soft glow travelling along it (the tube's u runs along its length), cold
// blue at the inlet, warming up the coil, hot out at the top
const F = { uT: { value: 0 }, uFlow: { value: 0 }, uHot: { value: 0 }, uIn: { value: 0 }, uOut: { value: 1 } }
const mDhw = M.steel.clone(); mDhw.defines = { USE_UV: '' }
mDhw.onBeforeCompile = sh => {
  Object.assign(sh.uniforms, F)
  sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uT,uFlow,uHot,uIn,uOut;')
    .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
    { float u=vUv.x, w=clamp((u-uIn)/(uOut-uIn),0.,1.)*uHot; vec3 fc=mix(vec3(.16,.5,1.),vec3(1.,.36,.1),w);
      float d=fract(u*70.-uT), p=smoothstep(0.,.35,d)*smoothstep(1.,.6,d);
      totalEmissiveRadiance+=fc*uFlow*(.18+.75*p); }`)
}
mDhw.customProgramCacheKey = () => 'rotex-dhw'
{ const m = new THREE.Mesh(new THREE.TubeGeometry(dhw, 1800, .028, 12, false), mDhw); m.castShadow = m.receiveShadow = true; tank.add(m) }
// the heating coil, inside it in the hot water zone at the top (ROTEX: the heat generator heats the top zone, its water
// flowing from top to bottom), its flow and return going up to the cap
const RH = .24, HY0 = .3, HY1 = 1.15
const heatPts = helix(RH, HY0, HY1, 4.5, Math.PI * .25), hs = heatPts[0], he = heatPts.at(-1)
const heatPath = [new THREE.Vector3(FIT.heatFlow, TOP + .25, FZ), new THREE.Vector3(FIT.heatFlow, UNDER, FZ), new THREE.Vector3(he.x, UNDER, he.z), new THREE.Vector3(he.x, HY1 + .08, he.z),
  ...heatPts.slice().reverse(), new THREE.Vector3(hs.x * .35, HY0 - .06, hs.z * .35), new THREE.Vector3(hs.x * .35, UNDER, hs.z * .35), new THREE.Vector3(FIT.heatReturn, UNDER, FZ), new THREE.Vector3(FIT.heatReturn, TOP + .25, FZ)]
{ const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(heatPath, false, 'catmullrom', .02), 900, .026, 10, false), M.heat); m.castShadow = m.receiveShadow = true; tank.add(m) }
await breathe()

/* ---- the tank water: warm above the heat front, cooler below, with a shimmer; cut at the window like the tank ---- */
const U = { uTh: { value: HI }, uHot: { value: 0 }, uT: { value: 0 }, uOn: { value: 0 }, uCoil: { value: new THREE.Vector3(0, (HY0 + HY1) / 2, 0) } }
const FRAG = `uniform float uTh,uHot,uT,uOn;uniform vec3 uCoil;varying vec3 vW;
  float h(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5);}
  float ns(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);float n=i.x+i.y*57.+i.z*113.;
    return mix(mix(mix(h(vec2(n,1.)),h(vec2(n+1.,1.)),f.x),mix(h(vec2(n+57.,1.)),h(vec2(n+58.,1.)),f.x),f.y),
               mix(mix(h(vec2(n+113.,1.)),h(vec2(n+114.,1.)),f.x),mix(h(vec2(n+170.,1.)),h(vec2(n+171.,1.)),f.x),f.y),f.z);}
  void main(){
    vec3 cold=mix(vec3(.05,.22,.55),vec3(.16,.45,.82),smoothstep(-1.5,1.4,vW.y));
    vec3 hot=mix(vec3(1.,.38,.16),vec3(1.,.56,.28),smoothstep(-.5,1.4,vW.y));
    float th=uTh+.06*sin(vW.x*5.+uT*.7)+.05*sin(vW.z*6.-uT*.5)+.04*(ns(vec3(vW.xz*3.,uT*.3))-.5);
    float k=smoothstep(th-.16,th+.16,vW.y)*uHot;
    vec3 c=mix(cold,hot,k);
    // warmth rising off the heating coil while it runs
    vec2 d=vW.xz-uCoil.xz;float ax=exp(-dot(d,d)*7.);float up=smoothstep(uCoil.y-.4,uCoil.y+.3,vW.y);
    c=mix(c,vec3(1.,.6,.32),clamp(ax*up*(.4+.6*ns(vec3(vW.x*6.,vW.y*5.-uT*1.5,vW.z*6.)))*uOn*.8,0.,1.));
    c+=.05*(ns(vec3(vW.xz*8.,uT*.6))-.5);
    gl_FragColor=vec4(c,.5+k*.16);
  }`
const VERT = 'varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}'
const mWater = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: U, vertexShader: VERT, fragmentShader: FRAG })
const water = new THREE.Group(); water.renderOrder = 1; tank.add(water)
{ const m = extrude([...outline(TI - .004, RT, true), [CX, CX]], [], -HI + .005, HI - .005, mWater); tank.remove(m); water.add(m) } // the water, cut like the tank

/* ---- warm water rising off the heating coil ---- */
const NR = 40
const pm = new THREE.MeshBasicMaterial({ transparent: true, opacity: .6, depthWrite: false, toneMapped: false })
const P = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), pm, NR); P.renderOrder = 2; tank.add(P)
const WARM = new THREE.Color(0xFFC09A)
const rises = Array.from({ length: NR }, () => ({ live: 0, y: 0, a: 0, r: 0, v: 0 }))
const O = new THREE.Object3D()
const put = (i, pos, sc, col) => { O.position.copy(pos); O.scale.setScalar(sc); O.updateMatrix(); P.setMatrixAt(i, O.matrix); P.setColorAt(i, col) }
// where along the path (0 to 1, by length) the coil starts and ends, for the colour: cold until the coil, warming up
// it, hot after
const along = target => { let best = 0, bd = Infinity; for (let k = 0; k <= 2000; k++) { const d = dhw.getPointAt(k / 2000).distanceToSquared(target); if (d < bd) { bd = d; best = k / 2000 } } return best }
F.uIn.value = along(coilPts[0]); F.uOut.value = along(coilEnd)

/* ---- labels pinned to the parts, shown with their step ---- */
// the coil label sits on the turn nearest the viewer, halfway up
const mid = coilPts.filter(p => Math.abs(p.y) < .25).reduce((b, p) => p.x + p.z > b.x + b.z ? p : b)
// [number, text, where, the steps that show it, the side it prefers: neighbours go opposite ways]
const LBL = [
  ['01', 'Heat from a heat pump or boiler', new THREE.Vector3(FIT.heatFlow, TOP + .25, FZ), ['1'], 'r'],
  ['02', 'Heating coil, top of the tank', heatPts[Math.floor(heatPts.length * .5)], ['1'], 'l'],
  ['03', 'Tank water stores the heat', new THREE.Vector3(-.3, 0, .3), ['2'], 'l'],
  ['04', '80 mm polyurethane insulation', new THREE.Vector3(CX + .003, 1.2, (SHI + FI) / 2), ['2'], 'r'],
  ['05', 'Polypropylene tank', new THREE.Vector3(CX + .003, -1.2, (FI + TI) / 2), ['2'], 'r'],
  ['06', 'Stainless steel coil: drinking water', mid, ['3'], 'r'],
  ['07', 'Cold water in', new THREE.Vector3(FIT.coldIn, TOP + .25, FZ), ['3', '4'], 'l'],
  ['08', 'Hot water out to the taps', new THREE.Vector3(FIT.hotOut, TOP + .25, FZ), ['4'], 'r'],
]
const lbls = LBL.map(([n, t]) => { const e = document.createElement('div'); e.className = 'lbl'; e.innerHTML = `<i class="dot"></i><i class="ln"></i><span class="tx"><em>${n}</em>${t}</span>`; lblBox.append(e); return e })

/* ---- place the canvas over the drawing, then hide the drawing ---- */
fig.append(cv, lblBox)
let W2 = 0, H2 = 0
function size() { // an <svg> has no offsetWidth/offsetTop: measure it against the figure instead
  const f = fig.getBoundingClientRect(), r = svg.getBoundingClientRect(), t = r.top - f.top - fig.clientTop, l = r.left - f.left - fig.clientLeft
  W2 = Math.round(r.width); H2 = Math.round(r.height)
  for (const el of [cv, lblBox]) Object.assign(el.style, { top: t + 'px', left: l + 'px', width: W2 + 'px', height: H2 + 'px' })
  if (!W2 || !H2) return
  R.setSize(W2, H2, false); cam.aspect = W2 / H2; cam.updateProjectionMatrix()
}
new ResizeObserver(size).observe(svg); size()

/* ---- the loop ---- */
const DULL = new THREE.Color(0x5a0c00), BRIGHT = new THREE.Color(0xff6a1a)
const CAM = { d: 8.5, y: 2.05, look: .32 } // a product-photo view: close, from the front right, a little above the cap
let last = 0, heat = 0, hot = 0, front = HI, flow = 0, visible = true, raf = 0
function frame(ms) {
  const t = ms / 1000, dt = Math.min(.05, last ? t - last : .016); last = t
  const st = fig.dataset.step || 'all'
  // what runs in each step: the heating coil (1 and the overview), stored heat (2), drinking water flowing (3, 4)
  const charging = st === '1' || st === 'all', flowing = st === '3' || st === '4' || st === 'all'
  heat += ((charging ? 1 : 0) - heat) * Math.min(1, dt * (charging ? 1.1 : .5))
  hot += (1 - hot) * Math.min(1, dt * .8)
  // the hot zone builds down from the top while the coil runs; drawing water brings cold in at the bottom of the
  // drinking water coil, which cools the lower part of the tank and lifts the boundary
  const target = st === 'all' ? -.3 : charging ? -.4 : st === '2' ? -.45 : -.2
  front += (target - front) * Math.min(1, dt * (charging ? .35 : .5))
  flow += ((flowing ? 1 : 0) - flow) * Math.min(1, dt * 1.5)
  M.heat.emissive.copy(DULL).lerp(BRIGHT, heat); M.heat.emissiveIntensity = heat * 2.2
  glow.position.set(0, (HY0 + HY1) / 2 + .1, 0); glow.intensity = heat * 2.4
  U.uTh.value = front; U.uHot.value = hot; U.uOn.value = heat; U.uT.value = t
  // camera: from the front right and a little above, as in ROTEX's image, with a slow drift; room above the
  // connections so their labels never touch the top edge
  // on a phone the labels wrap to two lines: step back a little so those over the connections stay in the frame
  const fit = Math.max(1, .6 / cam.aspect) * (H2 < 320 ? 1.1 : 1), dist = CAM.d * fit, a = .8 + Math.sin(t * .2) * .04
  cam.position.set(Math.sin(a) * dist, CAM.y * fit + Math.sin(t * .27) * .05, Math.cos(a) * dist); cam.lookAt(0, CAM.look, 0)
  // drinking water: cold in at the bottom of the coil, warming as it climbs, hot on the way out
  F.uT.value = RM ? 0 : t * 3.15; F.uFlow.value = flow; F.uHot.value = hot
  let i = 0
  // warm water rising off the heating coil
  for (const q of rises) {
    if (!q.live && heat > .4 && Math.random() < .08 * heat) { q.live = 1; q.y = HY0 + Math.random() * (HY1 - HY0); q.a = Math.random() * 6.28; q.r = .05 + Math.random() * .2; q.v = .25 + Math.random() * .25 }
    if (q.live) { q.y += q.v * dt; q.a += dt * .4; if (q.y > HI - .05) q.live = 0 }
    put(i++, new THREE.Vector3(q.r * Math.sin(q.a), q.y, q.r * Math.cos(q.a)), q.live ? .012 : 0, WARM)
  }
  P.instanceMatrix.needsUpdate = true; if (P.instanceColor) P.instanceColor.needsUpdate = true
  R.render(scene, cam)
  LBL.forEach(([, , pos, steps, side], k) => {
    const e = lbls[k], show = steps.includes(st)
    e.classList.toggle('on', show); if (!show) return
    const v = pos.clone().project(cam), x = (v.x + 1) / 2 * W2, y = (1 - v.y) / 2 * H2, lw = e._w || (e._w = e.offsetWidth)
    let left = side === 'l'; if (left && x - lw < 4) left = false; else if (!left && x + lw > W2 - 4) left = true
    e.classList.toggle('l', left)
    e.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(${left ? '-100%' : '0'},-50%)`
  })
}
function loop(ms) { frame(ms); raf = visible && !RM ? requestAnimationFrame(loop) : 0 }
await breathe()
if (R.extensions.has('KHR_parallel_shader_compile')) { try { await R.compileAsync(scene, cam) } catch {} } else R.compile(scene, cam)
fig.classList.add('has3d') // the drawing gives way only once the scene is ready to draw
new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf && !RM) raf = requestAnimationFrame(loop) }).observe(fig)
// with reduced motion: no animation, just the step's picture, redrawn when the step changes
if (RM) { hot = 1; frame(performance.now()); new MutationObserver(() => { heat = fig.dataset.step === '1' ? 1 : 0; flow = 1; frame(performance.now()) }).observe(fig, { attributes: true, attributeFilter: ['data-step'] }) }
}
start()

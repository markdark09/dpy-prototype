// "How it works" and "How to use it" for every product page, by kind of product.
// Each kind draws one diagram (in the same style as the For Business system diagram), with numbered markers
// that match the steps beside it. Details adapt to the product (multipoint, built-in pump, heat source, ...).
// The use steps are general guidance; the product page says so, and the README lists them for DPY's engineers to check.

const W = 640, H = 400
const P = (cls, d, flow = true, slow = false) => `<path class="pipe ${cls}" d="${d}"/>` + (flow ? `<path class="flow${slow ? ' slow' : ''}" d="${d}"/>` : '')
const T = (x, y, s, a = 'start', c = 't') => `<text class="${c}" x="${x}" y="${y}" text-anchor="${a}">${s}</text>`
const M = (n, x, y) => `<g class="mk" data-n="${n}"><circle cx="${x}" cy="${y}" r="17"/><text x="${x}" y="${y + 1}">${n}</text></g>`
const BOX = (x, y, w, h, r = 16, cls = 'box') => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`
const DEFS = `<defs>
  <linearGradient id="hwTank" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#4C9BE8"/><stop offset=".55" stop-color="#F08A4B"/><stop offset="1" stop-color="#E3473B"/></linearGradient>
  <linearGradient id="hwCoil" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#F08A4B"/><stop offset="1" stop-color="#E3473B"/></linearGradient>
</defs>`
const svg = (title, body) => `<svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="hwSvgT"><title id="hwSvgT">${title}</title>${DEFS}${body}</svg>`
// small pictures used in several diagrams
const SHOWER = (x, y) => `<g class="fix"><path d="M${x - 26} ${y} h52" stroke-width="7" stroke-linecap="round"/><path d="M${x - 18} ${y + 14}l-6 16M${x - 6} ${y + 14}l-2 18M${x + 6} ${y + 14}l2 18M${x + 18} ${y + 14}l6 16" stroke-width="3" stroke-linecap="round" class="drops"/></g>`
const SINK = (x, y) => `<g class="fix"><path d="M${x - 40} ${y} h80 a40 30 0 0 1 -80 0z" stroke-width="3"/><path d="M${x} ${y - 30} v14 h14" stroke-width="5" stroke-linecap="round"/></g>`
const FAN = (x, y, r) => `<g class="fanb"><circle cx="${x}" cy="${y}" r="${r}" class="ring"/><g class="spin" style="transform-origin:${x}px ${y}px">${[0, 120, 240].map(a => `<path d="M${x} ${y} q${r * .5} ${-r * .15} ${r * .78} ${-r * .55}" transform="rotate(${a} ${x} ${y})"/>`).join('')}</g><circle cx="${x}" cy="${y}" r="5" class="hub"/></g>`
const SUN = (x, y) => `<g class="sunb"><circle cx="${x}" cy="${y}" r="26"/>${Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<path d="M${(x + Math.cos(a) * 34).toFixed(1)} ${(y + Math.sin(a) * 34).toFixed(1)}L${(x + Math.cos(a) * 46).toFixed(1)} ${(y + Math.sin(a) * 46).toFixed(1)}"/>` }).join('')}</g>`
const AIR = (x, y, n = 3, dx = 40) => Array.from({ length: n }, (_, i) => P('air', `M${x} ${y + i * 26} h${dx}`, true, true)).join('')
const COIL = (x, y, w, rows, gap) => { let d = `M${x} ${y}`; for (let i = 0; i < rows; i++) d += ` h${i % 2 ? -w : w} v${-gap}`; return `<path class="coil" d="${d}"/>` }

const has = (p, k) => (p.key || []).some(([a, b]) => `${a} ${b}`.toLowerCase().includes(k))

const KINDS = {
  instant(p) {
    const multi = /multi/i.test(p.sub), pump = has(p, 'pump')
    const body = [
      P('cold', 'M20 300 H180'),
      pump ? `<g><circle class="part" cx="100" cy="300" r="24"/><path class="tri" d="M92 288l20 12-20 12z"/></g>${T(100, 352, 'Pump', 'middle', 's')}` : '',
      BOX(180, 50, 150, 300, 22),
      COIL(205, 290, 100, 6, 34),
      `<g><circle class="part" cx="255" cy="322" r="16"/><path d="M255 322 l8 -10" class="needle"/></g>`,
      T(255, 34, 'Heater', 'middle'),
      P('hot', 'M330 90 H470 V112'),
      SHOWER(470, 120), T(470, 186, 'Shower', 'middle', 's'),
      multi ? P('hot', 'M420 90 V290 H520 V300') + SINK(540, 320) + T(540, 380, 'Sink', 'middle', 's') : '',
      T(20, pump ? 258 : 280, 'Cold water', 'start', 's'),
      M(1, 150, 266), M(2, 355, 200), M(3, 290, 352), M(4, 520, 120),
    ].join('')
    const steps = [
      ['Water starts flowing', 'Open the tap and cold water flows into the heater. A flow switch senses it and turns the heater on.' + (pump ? ' The built-in pump boosts weak water pressure, so it works on upper floors too.' : '')],
      ['Heated on its way through', "Heating elements warm the water as it passes, so it's hot within seconds. There's no tank to heat up or run out."],
      ['You set the heat', 'The dial sets the power. More power, or a gentler flow, gives hotter water.'],
      [multi ? 'Hot water at every tap' : 'Hot water at the shower', (multi ? 'One heater feeds the shower and the sink. ' : '') + 'Safety cut-outs switch it off if the water gets too hot or the flow stops.'],
    ]
    const use = [
      ['Open the tap first', 'Start the shower or tap so water is flowing before the heater comes on.'],
      ['Switch it on', 'Turn on the heater at its power switch.'],
      ['Set the dial', 'Start low and turn it up until the water feels right.'],
      ['Heater off, then the tap', 'When you finish, switch the heater off first and then close the tap, so it never heats without water flowing. It needs its own breaker and earthing.'],
    ]
    return { title: ['Hot Water the', 'Moment You Need It'], lede: 'An instant heater warms water only while it flows, so nothing is kept hot while you are not using it.', alt: `How an instant water heater works: cold water flows through heating elements and comes out hot at the ${multi ? 'shower and sink' : 'shower'}.`, body, steps, use, legend: ['cold', 'hot'] }
  },

  storage(p) {
    const preset = has(p, '60°c')
    const body = [
      `<rect class="shell" x="240" y="34" width="140" height="330" rx="34"/>`,
      `<rect x="254" y="48" width="112" height="302" rx="24" fill="url(#hwTank)" opacity=".85"/>`,
      P('cold', 'M20 330 H254'),
      COIL(272, 300, 76, 3, 14).replace('class="coil"', 'class="coil hotc"'),
      `<rect class="part" x="380" y="230" width="30" height="46" rx="6"/>`,
      T(310, 210, 'Tank', 'middle'),
      P('hot', 'M380 80 H480 V112'),
      SHOWER(480, 120), T(480, 186, 'Shower', 'middle', 's'),
      P('hot', 'M440 80 V300 H540 V306') + SINK(560, 324) + T(560, 382, 'Sink', 'middle', 's'),
      T(20, 312, 'Cold water', 'start', 's'),
      M(1, 150, 304), M(2, 310, 262), M(3, 432, 252), M(4, 410, 54),
    ].join('')
    const steps = [
      ['Cold water fills from the bottom', 'Water comes in at the bottom of the insulated tank.'],
      ['The element heats it', 'An electric element warms the water. Hot water rises, so the top of the tank is the hottest.'],
      ['The thermostat holds it', `It switches the element on and off to keep the tank at the temperature you set${preset ? ' (it comes set to 60°C)' : ''}.`],
      ['Hot water to every tap', 'Hot water is drawn from the top to several taps at once, and cold water refills the tank behind it.'],
    ]
    const use = [
      ['Give it time to heat', 'After switching it on, let the tank heat before the first shower. Bigger tanks take longer.'],
      ['Set the thermostat', 'Around 55 to 60°C is usual: hot enough to keep the tank hygienic.'],
      ['Use any hot tap', 'It refills and reheats by itself.'],
      ['Yearly check', 'Have a technician check the anode and the safety valve once a year.'],
    ]
    return { title: ['A Tank of', 'Hot Water, Ready'], lede: 'A storage heater keeps a tank of water hot, so several taps can run at once.', alt: 'How a storage water heater works: cold water enters at the bottom, an element heats it, and hot water leaves from the top to the taps.', body, steps, use, legend: ['cold', 'hot'] }
  },

  heatpump(p) {
    const src = /water-to-water/.test(p.slug) ? 'water' : 'air', pool = /pool/.test(p.slug), integral = /integral/.test(p.slug), hot60 = has(p, '60°c')
    const source = src === 'air'
      ? AIR(0, 120, 3, 34) + FAN(96, 150, 44) + T(44, 358, 'Outdoor air', 'start', 's')
      : P('green', 'M0 120 H64 V180 H0', true, true) + T(44, 358, 'Ground or river water', 'start', 's')
    const body = [
      BOX(40, 70, 240, 260, 22), source,
      `<rect class="part" x="56" y="214" width="96" height="30" rx="6"/>${[0, 1, 2, 3, 4, 5].map(i => `<path class="fin" d="M${66 + i * 15} 216v26"/>`).join('')}`,
      P('ref', 'M104 244 V280 H140'), `<g><circle class="part" cx="166" cy="280" r="26"/><path class="tri" d="M158 268l20 12-20 12z"/></g>`,
      P('ref', 'M192 280 H238 V252'), `<rect class="part" x="214" y="108" width="48" height="144" rx="8"/>`,
      P('ref', 'M238 108 V92 H104 V214'),
      T(166, 330 - 8, 'Compressor', 'middle', 's'),
      pool
        ? P('hot', 'M262 150 H380 V250') + P('cold', 'M470 300 H330 V220 H262') + `<rect class="pool" x="360" y="250" width="250" height="100" rx="18"/><path class="wave" d="M380 285 q20 -12 40 0 t40 0 t40 0 t40 0 t40 0"/>` + T(485, 330, 'Pool', 'middle')
        : P('hot', 'M262 150 H330 V110 H380') + P('cold', 'M380 300 H330 V220 H262') +
          `<rect class="shell" x="380" y="60" width="100" height="290" rx="30"/><rect x="392" y="72" width="76" height="266" rx="20" fill="url(#hwTank)" opacity=".85"/>` + T(430, 216, 'Tank', 'middle') +
          P('hot', 'M480 100 H560 V132') + SHOWER(560, 140) + T(560, 206, 'To the taps', 'middle', 's'),
      integral ? `<rect class="one" x="26" y="24" width="468" height="346" rx="28"/>` + T(260, 392, 'All in one unit', 'middle', 's') : '',
      T(160, 52, 'Heat pump', 'middle'),
      M(1, src === 'air' ? 150 : 84, src === 'air' ? 112 : 150), M(2, 196, 238), M(3, 290, 190), pool ? M(4, 610, 238) : M(4, 500, 60),
    ].join('')
    const steps = [
      src === 'air' ? ['Warmth from the air', 'A fan draws outdoor air over a coil, and a refrigerant inside picks up its warmth. Philippine air has plenty, day and night.'] : ['Warmth from water', 'Ground or river water passes through, and a refrigerant picks up its warmth.'],
      ['The compressor concentrates it', "Squeezing the refrigerant raises its temperature well above the water's."],
      ['Heat passes to the water', pool ? 'A titanium heat exchanger, which stands up to pool chemicals, passes the heat to the pool water.' : `In the heat exchanger the hot refrigerant heats your water${hot60 ? ' up to 60°C' : ''}, then goes back for more.`],
      pool ? ['Back to the pool', 'Warmed water returns to the pool and keeps it at a comfortable temperature.'] : ['Stored, ready to use', `${integral ? 'The heat pump and its insulated tank are built as one unit. ' : 'Hot water waits in an insulated tank. '}The electricity only moves heat, so it uses roughly a quarter to a third of a plain electric heater's.`],
    ]
    const use = pool ? [
      ['Set the pool temperature', 'Once, on the controller. It runs by itself after that.'],
      ['Run it with the filter pump', 'Pool water has to flow through it to be heated.'],
      ['Cover the pool at night', 'A cover keeps the heat in and saves power.'],
      ['Yearly service', 'Have it checked once a year.'],
    ] : [
      ['Set the temperature once', 'On the controller. It runs by itself after that.'],
      [src === 'air' ? 'Give it room to breathe' : 'Keep the source flowing', src === 'air' ? 'Keep the space around the unit open, so it can draw air freely.' : 'Your installer sets the flow of the ground or river water.'],
      [src === 'air' ? 'Keep the coil clean' : 'Check the controller', src === 'air' ? 'Clean the air filter and coil fins every few months.' : 'Look at the controller now and then for any alerts.'],
      ['Yearly service', 'Have it serviced once a year to keep it efficient.'],
    ]
    return { title: pool ? ['Warm Pool Water', 'From the Air'] : ['Heat Moved,', 'Not Made'], lede: 'A heat pump works like an air conditioner in reverse: it moves heat into the water instead of making it.', alt: `How a heat pump works: ${src === 'air' ? 'outdoor air' : 'ground or river water'} warms a refrigerant, the compressor makes it hotter, and a heat exchanger passes that heat to the ${pool ? 'pool' : 'water tank'}.`, body, steps, use, legend: pool ? ['cold', 'hot', 'ref'] : ['cold', 'hot', 'ref'] }
  },

  solar(p) {
    const body = [
      SUN(70, 62),
      `<path class="roof" d="M20 370 L620 370"/>`,
      `<path class="panel" d="M70 340 L330 340 L400 210 L140 210 Z"/>${[1, 2, 3, 4, 5].map(i => `<path class="fin" d="M${70 + i * 52} 340 L${140 + i * 52} 210"/>`).join('')}`,
      P('warm', 'M395 214 V160 H410', true, true),
      P('cold', 'M560 160 V346 H336', true, true),
      `<rect class="shell" x="400" y="84" width="200" height="80" rx="40"/><rect x="410" y="94" width="180" height="60" rx="30" fill="url(#hwTank)" opacity=".85"/>`,
      `<path class="coil hotc" d="M500 140 h60 v-10 h-60 v-10 h60"/>`,
      P('cold', 'M640 140 H600'), P('hot', 'M600 104 H626 V44'), T(630, 30, 'To the house', 'end', 's'),
      T(500, 76, 'Tank', 'middle'),
      M(1, 226, 300), M(2, 420, 196), M(3, 540, 104), M(4, 600, 64),
    ].join('')
    const k = (p.key || []).map(([a]) => a)
    const steps = [
      ['The sun heats the panel', `Water in the panel's tubes soaks up the sunlight${k.includes('92–96%') ? ' (the panel absorbs 92 to 96% of it)' : ''}.`],
      ['Warm water rises by itself', 'Warm water is lighter, so it rises into the tank above the panel, and cooler water sinks back to be heated. No pump needed.'],
      ['Backup for cloudy days', "An electric element in the tank tops up the heat when the sun can't."],
      ['Hot water to the house', `The insulated tank keeps it hot into the night${k.includes('<5°C') ? ', losing less than 5°C a day' : ''}.`],
    ]
    const use = [
      ['Sunny days: nothing to do', 'The sun does the work.'],
      ['Cloudy days: use the backup', 'Switch on the electric backup when the sun has not heated the tank enough.'],
      ['Keep the panel clear', 'Rinse off dust and leaves now and then.'],
      ['Yearly check', 'Have the system checked once a year.'],
    ]
    return { title: ['Free Heat', 'From the Sun'], lede: 'A solar water heater uses sunlight first and electricity only when it has to.', alt: 'How a solar water heater works: the sun heats water in the panel, it rises into the tank above, an electric element backs it up, and hot water goes to the house.', body, steps, use, legend: ['cold', 'warm', 'hot'] }
  },

  tank(p) {
    // HAASE: DPY's own diagram shows how it works (an energy store; a fresh water unit heats the showers' water)
    if (/haase/.test(p.slug)) return {
      title: ['The Heart of a', 'Hot Water System'], lede: 'A HAASE tank stores heat from several sources, and a fresh water unit turns it into hot water for the whole building.',
      image: ['haase-diagram', 'How a HAASE tank connects thermal solar, solar panels, a boiler and a chiller to the showers through a fresh water unit (diagram from DPY)'],
      steps: [
        ['Heat from several sources', 'Thermal solar panels, solar PV power, a boiler or heat recovered from a chiller all warm the water in the tank.'],
        ['Stored in layers', 'Hot water rises, so the top stays hottest, and the insulation keeps the heat with little loss.'],
        ['Fresh water heated on the way', "A fresh water unit, a heat exchanger beside the tank, passes the stored heat to clean water on its way to the showers. The tank's own water never reaches a tap."],
        ['Back for more heat', 'The cooled tank water returns to the bottom, where the heat sources warm it again.'],
      ],
      use: [
        ['Sized by our engineers', 'We size the tank to your busiest hour and connect it to the heat sources and the fresh water unit.'],
        ['Glance at the temperature', 'Check the tank temperature now and then on the system controller.'],
        ['Keep the plant room tidy', 'Keep the area around the tank dry and easy to reach.'],
        ['Yearly service', 'Valves, the fresh water unit and fittings checked once a year.'],
      ],
      legend: [],
    }
    const rotex = /rotex/.test(p.slug), coil = rotex || /enermax/.test(p.slug)
    const body = [
      BOX(20, 60, 150, 80), T(95, 96, 'Heat pump', 'middle'), T(95, 120, 'or boiler', 'middle', 's'),
      BOX(20, 250, 150, 80), T(95, 286, 'Solar', 'middle'), T(95, 310, 'panels', 'middle', 's'),
      `<rect class="shell" x="250" y="30" width="140" height="340" rx="34"/><rect x="264" y="44" width="112" height="312" rx="24" fill="url(#hwTank)" opacity=".85"/>`,
      P('hot', 'M170 100 H264'), P('warm', 'M170 290 H220 V250 H264', true, true),
      coil ? COIL(282, 320, 76, 8, 30) : '',
      coil ? P('cold', 'M520 340 H400 V330 H282', true) + P('hot', 'M358 80 H460 V90') : P('hot', 'M390 80 H460 V90') + P('cold', 'M520 330 H390'),
      `<rect class="box" x="460" y="60" width="160" height="230" rx="16"/>${[0, 1, 2].map(i => `<rect class="floor" x="476" y="${78 + i * 66}" width="128" height="48" rx="8"/>`).join('')}`,
      T(540, 312, 'Building', 'middle', 's'), T(320, 22, rotex ? 'Sanicube' : 'Storage tank', 'middle'),
      T(640, 360, coil ? 'Fresh water in' : 'Cold water in', 'end', 's'),
      M(1, 210, 70), M(2, 320, 200), M(3, 430, 52), M(4, 440, 312),
    ].join('')
    const steps = [
      ['Heat comes in', 'Heat pumps, solar panels or a boiler heat the water in the tank. One tank can take heat from several sources at once.'],
      ['Stored in layers', 'Hot water rises, so the top stays hottest, and the insulation keeps the heat for hours.'],
      rotex ? ['Drinking water heated on the way', "Your drinking water runs through stainless steel coils inside the tank and is heated as it passes. It's never stored, which keeps it fresh and hygienic."]
        : coil ? ['Fresh water heated through the coil', 'Fresh water runs through a heat exchanger coil inside the tank and picks up the stored heat on its way to the taps.']
        : ['Drawn from the top', 'The building takes hot water from the top, and circulation pumps carry it to every floor.'],
      coil ? ['Fresh water every time', 'Cold water comes in at the bottom of the coil, so what reaches the taps is always freshly heated.'] : ['Topped up from the bottom', 'Cold water refills the tank at the bottom, away from the hot layer, to be heated.'],
    ]
    const use = [
      ['Sized by our engineers', 'We size the tank to your busiest hour and connect it to the heat sources and pumps.'],
      ['Glance at the temperature', 'Check the tank temperature now and then, on its gauge or the system controller.'],
      ['Keep the plant room tidy', 'Keep the area around the tank dry and easy to reach.'],
      ['Yearly service', 'Valves, gauges and fittings checked once a year.'],
    ]
    return { title: ['The Heart of a', 'Hot Water System'], lede: 'A storage tank collects heat from one or more sources and keeps hot water ready for the whole building.', alt: `How a ${rotex ? 'hygienic heat exchanger' : 'storage'} tank works: heat sources warm the water, the hottest water sits at the top and goes to the building, and cold water comes in at the bottom.`, body, steps, use, legend: ['cold', 'warm', 'hot'] }
  },

  pump(p) {
    const body = [
      `<rect class="shell" x="30" y="70" width="120" height="270" rx="30"/><rect x="42" y="82" width="96" height="246" rx="22" fill="url(#hwTank)" opacity=".85"/>`, T(90, 56, 'Tank', 'middle'),
      P('hot', 'M150 110 H202'), `<g><circle class="part pmp" cx="232" cy="110" r="30"/><path class="tri" d="M222 96l24 14-24 14z"/></g>`, T(232, 168, 'Pump', 'middle', 's'),
      P('hot', 'M262 110 H340 V70 H430'), P('hot', 'M340 70 V310'), [130, 190, 250, 310].map(y => P('hot', `M340 ${y} H430`, false)).join(''),
      `<rect class="box" x="430" y="40" width="190" height="300" rx="16"/>${[0, 1, 2, 3, 4].map(i => `<rect class="floor" x="446" y="${54 + i * 56}" width="158" height="42" rx="8"/>${T(525, 82 + i * 56, `Floor ${5 - i}`, 'middle', 's')}`).join('')}`,
      P('cold', 'M620 340 V370 H90 V340', true, true),
      M(1, 232, 62), M(2, 380, 190), M(3, 300, 390 - 8), M(4, 640 - 24, 30),
    ].join('')
    const steps = [
      ['The pump keeps water moving', 'A circulation pump pushes hot water out of the tank in a loop.'],
      ['Up to every floor', 'The loop passes every floor, so hot water is already waiting near each tap.'],
      ['Back to be reheated', 'Water that has cooled flows back to the tank instead of down the drain.'],
      ['Pressure where it is needed', 'In tall buildings a booster set keeps the water pressure up on the top floors.'],
    ]
    const use = [
      ['Runs by itself', 'Usually on a timer or a temperature sensor our engineers set.'],
      ['Look and listen', 'Report unusual noise, vibration or leaks early.'],
      ['Keep the pump room dry', 'And well ventilated.'],
      ['Yearly service', 'The pump, its connections and its settings checked once a year.'],
    ]
    return { title: ['Hot Water on', 'Every Floor'], lede: 'Pumps keep hot water moving through a building, so nobody waits at the tap.', alt: 'How a circulation pump works: it pushes hot water from the tank up to every floor, and cooled water returns to the tank.', body, steps, use, legend: ['cold', 'hot'] }
  },

  pipe(p) {
    const body = [
      `<rect class="pp" x="30" y="100" width="190" height="44" rx="6"/>`, T(125, 86, 'Pipe', 'middle', 's'),
      `<rect class="tool" x="250" y="76" width="90" height="92" rx="12"/>`, T(295, 128, '260°C', 'middle'),
      `<rect class="pp" x="370" y="90" width="130" height="64" rx="10"/><rect class="sock" x="370" y="100" width="60" height="44" rx="4"/>`, T(435, 76, 'Fitting', 'middle', 's'),
      `<path class="arrow" d="M150 230 h110 m-14 -12 l14 12 -14 12"/><path class="arrow" d="M490 230 h-110 m14 -12 l-14 12 14 12"/>`,
      `<rect class="pp" x="100" y="290" width="280" height="44" rx="6"/><rect class="pp" x="300" y="280" width="160" height="64" rx="10"/><rect class="fuse" x="300" y="290" width="70" height="44" rx="4"/>`,
      T(320, 380, 'One solid joint', 'middle', 's'),
      M(1, 295, 54), M(2, 320, 230), M(3, 335, 266), M(4, 488, 312),
    ].join('')
    const steps = [
      ['Heat both ends', 'A fusion tool heats the pipe end and the fitting socket to about 260°C.'],
      ['Push them together', 'The softened ends are pushed together and held for a few seconds.'],
      ['One solid piece', 'As it cools, pipe and fitting fuse into one piece: no glue, no threads, nothing to work loose.'],
      ['Made for hot water', "PPR handles hot water temperatures and doesn't rust like steel pipe."],
    ]
    const use = [
      ['Installed by our technicians', 'Joints need a fusion welder and the right timing, so they are not a DIY job.'],
      ['Clipped with room to move', 'Hot pipes expand, so runs are supported with clips and allowance for movement.'],
      ['Insulated where it counts', 'Long hot runs are insulated to keep the heat in.'],
      ['Pressure-tested', 'The finished system is pressure-tested before it is used.'],
    ]
    return { title: ['Joints That', "Can't Leak"], lede: 'PPR pipes are joined by heat, so pipe and fitting become a single piece.', alt: 'How PPR pipes are joined: a fusion tool heats the pipe and fitting to about 260°C, they are pushed together, and they fuse into one piece.', body, steps, use, legend: [] }
  },

  control(p) {
    const meter = /meter/.test(p.slug)
    const body = [
      SUN(46, 46),
      `<path class="panel" d="M90 120 L250 120 L280 50 L120 50 Z"/>${[1, 2, 3].map(i => `<path class="fin" d="M${90 + i * 40} 120 L${120 + i * 40} 50"/>`).join('')}`,
      P('pow', 'M185 120 V160'), BOX(130, 160, 110, 54, 12), T(185, 194, 'Inverter', 'middle', 's'),
      P('pow', 'M240 186 H330'), `<circle class="part" cx="340" cy="186" r="10"/>`,
      P('pow', 'M350 186 H470', true, true), BOX(470, 156, 110, 60, 12), T(525, 192, 'Meter', 'middle', 's'), P('pow', 'M580 186 H640', false), T(636, 236, 'Grid', 'end', 's'),
      P('pow', 'M340 196 V260'), BOX(270, 260, 140, 60, 12), T(340, 296, 'AC·THOR', 'middle'),
      P('pow', 'M410 290 H470'), `<rect class="shell" x="470" y="250" width="90" height="130" rx="26"/><rect x="480" y="260" width="70" height="110" rx="18" fill="url(#hwTank)" opacity=".85"/><path class="coil hotc" d="M490 350 h50 v-10 h-50 v-10 h50"/>`,
      T(515, 244, 'Water heater', 'middle', 's'),
      `<path class="house" d="M300 40 l40 -30 40 30 v60 h-80z"/>`, T(330, 128, 'House', 'end', 's'), P('pow', 'M340 176 V100', false),
      M(1, 230, 30), M(2, 398, 60), M(3, 525, 140), M(4, 440, 260),
    ].join('')
    const steps = [
      ['Panels make power', 'Your solar panels and inverter make electricity during the day.'],
      ['The house uses what it needs', 'Lights, aircon and appliances use it first.'],
      ['The meter spots the spare', `${meter ? 'This power meter' : 'A power meter'} measures the power that would flow out to the grid.`],
      ['AC·THOR heats water with it', 'Instead of sending that spare power to the grid, AC·THOR feeds it smoothly into your water heater\'s element, so the sun heats your water.'],
    ]
    const use = [
      ['Set up by our installer', 'Connected to your water heater, with the target temperature set.'],
      ['Runs every sunny day', 'Nothing to switch on: it follows the spare power by itself.'],
      ['See what the sun did', 'Your installer shows you where to see how much solar power went into hot water.'],
      ['Cloudy days are covered', "The heater's own thermostat or timer keeps the water hot."],
    ]
    return { title: ['Spare Solar Power', 'Into Hot Water'], lede: 'AC·THOR uses the solar power your house does not need to heat water, instead of sending it to the grid.', alt: 'How AC·THOR works: solar panels power the house, a meter measures the spare power, and AC·THOR sends it into the water heater.', body, steps, use, legend: ['pow'] }
  },

  fan(p) {
    const body = [
      BOX(30, 60, 400, 300, 18),
      ...[0, 1, 2].map(i => `<path class="steam" d="M${120 + i * 50} 300 q-16 -30 0 -60 t0 -60"/>`),
      SHOWER(170, 120),
      FAN(430, 150, 40),
      AIR(480, 124, 3, 110),
      P('air', 'M40 340 H120', true, true), T(40, 386, 'Fresh air in', 'start', 's'),
      T(560, 230, 'Outside', 'middle', 's'),
      M(1, 260, 220), M(2, 430, 92), M(3, 600, 104), M(4, 140, 314),
    ].join('')
    const steps = [
      ['Steam and smells rise', 'Showers and cooking fill the air with moisture and odours.'],
      ['The fan draws them out', 'It pulls that air out through the wall or window.'],
      ['Outside, not on your walls', 'Moisture leaves before it can settle and grow mould.'],
      ['Fresh air comes in', 'Fresh air flows in under the door to replace it.'],
    ]
    const use = [
      ['On while you shower or cook', 'And for 10 to 15 minutes after.'],
      ['Keep the door gap clear', 'So fresh air can get in.'],
      ['Clean the grille', 'Wipe the grille and blades every few months.'],
      ['Power off first', 'Switch it off at the wall before cleaning.'],
    ]
    return { title: ['Moist Air', 'Out, Fresh Air In'], lede: 'An exhaust fan clears steam and smells before they settle.', alt: 'How an exhaust fan works: steam rises in the room, the fan draws it outside, and fresh air comes in under the door.', body, steps, use, legend: ['air'] }
  },
}

const LEG = { cold: ['#4C9BE8', 'Cold water'], hot: ['#E3473B', 'Hot water'], warm: ['#F08A4B', 'Warmed by the sun'], ref: ['#B79CFF', 'Refrigerant'], pow: ['#FFC24D', 'Electricity'], air: ['#9DB0C6', 'Air'] }

export function howto(p) {
  const k = KINDS[p.cat]
  if (!k) return null
  const h = k(p)
  return {
    ...h,
    svg: h.body ? svg(h.alt, h.body) : '',
    legendHtml: h.legend.map(l => `<span><i style="background:${LEG[l][0]}"></i>${LEG[l][1]}</span>`).join(''),
  }
}

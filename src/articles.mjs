// Blog articles (sample content for the prototype: DPY's team reviews them before launch).
// Written only from facts already on the site: product pages, spec sheets, the For Business page and the savings
// calculator (same assumptions and numbers). No client news or names are made up.
// Body blocks: ['p', text], ['h', heading], ['ul', [items]], ['ol', [items]], ['tip', text], ['nums', [[value, label], ...]].
// In text, **bold** and [link text](site/path) work; paths are relative to the site root.

export const CATS = { guides: 'Guides', tips: 'Tips', business: 'For Business', news: 'News' }

export const ARTICLES = [
  {
    slug: 'our-new-website', cat: 'news', date: '2026-11-17', img: 'assets/img/dpy/team.webp', alt: 'The DPY Mercantile team',
    title: 'Our New Website: Quotes, Service Visits and Careers Online',
    excerpt: 'Request a quote, book a service visit or apply for a job straight from our site, on any phone.',
    body: [
      ['p', 'Our new website is live. What used to take a phone call now takes a minute online: request a free quote, book a service visit, or apply for a job with your CV.'],
      ['h', "What's new"],
      ['ul', [
        'Every product has its own page with a plain description, a **How it works** diagram and its specifications. [Browse the products](water-heaters)',
        'A [savings calculator](#savings) compares a year of running costs for electric heaters, heat pumps and solar at your electricity rate.',
        'Book a repair, maintenance or warranty visit from the [Service page](service#book).',
        'See our openings and apply with your CV on the [Careers page](careers).',
        'A short quiz on the homepage suggests the right kind of water heater for your home or building.',
      ]],
      ['h', 'Still here by phone'],
      ['p', 'Sales, call or text: **0933 867 2954 / 0915 245 3528**. Customer service and repairs: **0956 416 0815**. Monday to Saturday, 8 AM to 6 PM.'],
    ],
    related: [],
  },
  {
    slug: "instant-or-storage-water-heater", cat: "guides", date: "2026-11-12", img: "assets/img/shower.webp", alt: "A bright bathroom with a glass shower and a bathtub", title: "Instant or Storage: Which Water Heater Fits Your Home?", excerpt: "One shower, or the whole family at once? How the two most common home water heaters differ, and how to choose.", related: ["aquapower-a35m-a55","rheem","gratek-aquarius-aqa-30"],
    body: [
      ["p", "Most homes choose between two kinds of electric water heater: an **instant** heater that warms water as it flows, and a **storage** heater that keeps a tank of hot water ready. Both work well. The right one depends mostly on how many taps you run at the same time."],
      ["h", "How an instant heater works"],
      ["p", "Cold water passes over heating elements and comes out hot within seconds. Nothing is stored, so nothing is kept hot while you are not using it. Our [Aquapower](products/aquapower-a35m-a55) and [Gratek Aquarius](products/gratek-aquarius-aqa-30) heaters run from 3.5 to 9.5 kW, and most switch on at just 2 liters a minute, so they work on the weak water pressure many condos have."],
      ["ul", ["Best for one shower, or a shower and a sink with a multipoint model","Compact: it mounts beside the shower","Needs its own breaker, sized for its power"]],
      ["h", "How a storage heater works"],
      ["p", "An electric element heats a tank of water, and a thermostat keeps it at the temperature you set. Hot water is drawn from the top while cold water refills the bottom, so several taps can run at once. [Rheem](products/rheem) and [Everhot](products/everhot) tanks come in sizes from 25 liters for one bathroom to over 450 liters for a small building."],
      ["ul", ["Best for families, several bathrooms, or a kitchen and laundry on the same heater","Needs space for the tank, on a wall or on the floor","Give it time to heat up after you switch it on"]],
      ["h", "A quick way to choose"],
      ["ul", ["**One bathroom, one shower at a time:** an instant heater","**Shower and sink in the same bathroom:** a multipoint instant heater","**Two or more bathrooms used at once:** a storage heater","**Weak water pressure:** an instant heater that starts at 2 liters a minute, or one with a built-in pump like the Gratek Aquarius"]],
      ["tip", "Not sure? Our free site visit checks your water pressure, wiring and space before we recommend anything. [Request a visit](contact#quote)"],
    ],
  },
  {
    slug: "heat-pump-savings-worked-example", cat: "business", date: "2026-11-05", img: "assets/img/plant.webp", alt: "A heat pump and insulated hot water tanks in a plant room", title: "How Much Can a Heat Pump Save? A Worked Example", excerpt: "A hotel with 60 showers a day, step by step: what it spends on hot water with electric heaters, and with a heat pump.", related: ["deron-air-to-water-heat-pump","5-star-integral-heat-pump","haase-energy-storage-tank"],
    body: [
      ["p", "A heat pump costs more to buy than an electric heater, so the first question every hotel and building owner asks is how much it saves each year. Here is the arithmetic our savings calculator uses, worked through for 60 showers a day."],
      ["h", "Step 1: the heat one shower needs"],
      ["p", "A typical shower uses about 40 liters of water, warmed by about 15°C: from 27°C to a comfortable 42°C. Warming 40 liters by 15°C takes about **0.7 kWh** of heat."],
      ["h", "Step 2: the electricity each system draws for that heat"],
      ["ul", ["An **electric heater** turns about 95% of its electricity into heat, so it draws about 0.73 kWh per shower.","A **heat pump** moves heat from the air instead of making it. We assume it gives 3.5 units of heat for every unit of electricity, a cautious figure for 55 to 60°C in Philippine weather. So it draws about 0.2 kWh per shower."]],
      ["h", "Step 3: a year of showers"],
      ["p", "At 60 showers a day, every day, and ₱15 per kWh:"],
      ["nums", [["₱241,000","a year with electric heaters"],["₱65,000","a year with a heat pump"],["₱176,000","saved every year"]]],
      ["p", "The heat pump's running cost is about a quarter of the electric heaters', in line with what [Deron](products/deron-air-to-water-heat-pump) states for its heat pumps."],
      ["h", "What changes the answer"],
      ["ul", ["**Your electricity rate:** the higher it is, the more a heat pump saves.","**How much hot water you use:** kitchens, laundries and pools add to the showers.","**The design:** water temperature, storage tanks, pipes and insulation all count."]],
      ["tip", "Try your own numbers in the [savings calculator](#savings), or ask us for a proposal sized for your building."],
    ],
  },
  {
    slug: "signs-your-water-heater-needs-service", cat: "tips", date: "2026-10-29", img: "assets/img/technician.webp", alt: "A technician servicing a wall-mounted water heater", title: "5 Signs Your Water Heater Needs Service", excerpt: "Lukewarm water, a tripping breaker, rust or a dripping valve: what each sign means, and what to do.", related: ["rheem","everhot","aquapower-q35m"],
    body: [
      ["p", "Water heaters usually give warnings before they fail. Catching them early is cheaper, and safer, than waiting for a cold shower."],
      ["h", "1. The water isn't as hot as it used to be"],
      ["p", "In a storage heater, a worn element or thermostat, or sediment at the bottom of the tank, can all cut the heat. In an instant heater, a weak flow or a dial that has been turned down are common causes. Check the setting first, then call us."],
      ["h", "2. The breaker trips"],
      ["p", "A heater that trips its breaker may have a failing element, a wiring fault, or a breaker too small for its power. Don't keep resetting it: switch it off and have it checked."],
      ["h", "3. Rusty water, or a leak"],
      ["p", "Rust-coloured hot water, or water around the tank, can mean corrosion inside. Storage tanks have an anode rod that protects them; it wears away over time and needs checking."],
      ["h", "4. A relief valve that keeps dripping"],
      ["p", "The pressure and temperature relief valve lets water out when either gets too high. A steady flow from it means something needs attention."],
      ["h", "5. New noises"],
      ["p", "Popping or rumbling from a storage tank usually means sediment has built up at the bottom. A yearly service flushes it out."],
      ["h", "Two safety habits"],
      ["ul", ["**Instant heaters:** switch the heater off first, then close the tap, so it never heats without water flowing.","**Before any cleaning or checks:** switch the heater off at its breaker."]],
      ["tip", "A yearly preventive maintenance visit catches most of these early. [Book a service visit](service#book)"],
    ],
  },
  {
    slug: 'low-water-pressure-condo-hot-shower', cat: 'guides', date: '2026-10-22', img: 'assets/img/dpy/tower-render.webp', alt: 'A residential tower',
    title: 'Low Water Pressure in Your Condo? What Actually Works',
    excerpt: 'Upper floors and older buildings often have weak pressure. Here is how to still get a good hot shower.',
    body: [
      ['p', 'Weak water pressure is common on upper floors and in older buildings. It matters for hot water because many instant heaters need a minimum flow before they switch on.'],
      ['h', 'Choose a heater that starts on a low flow'],
      ['p', 'Our [Aquapower instant heaters](water-heaters?type=instant) switch on at just 2 liters a minute, so they work where the pressure is weak.'],
      ['h', 'Or one with a pump built in'],
      ['p', 'The [Gratek Aquarius AQA-30 and AQA-55](products/gratek-aquarius-aqa-30) have a booster pump inside, which keeps the shower strong even on low pressure. The [AQA-30E and AQA-55E](products/gratek-aquarius-aqa-30e) do the same for a shower and a sink together.'],
      ['h', 'Check the simple things first'],
      ['ul', ['A clogged shower head or tap aerator cuts the flow: soak it in vinegar and rinse it.', 'A half-closed valve, under the sink or at the meter, is a common surprise.', 'In a building, ask the administration whether the pressure has dropped for everyone.']],
      ['h', 'When the whole building is affected'],
      ['p', 'If every unit on the upper floors has weak pressure, the building may need a booster set. We supply and install [Wilo booster sets](products/wilo-pumps) that keep the pressure even on every floor.'],
      ['tip', 'Our technicians can measure your water pressure during a free site visit and recommend the heater that fits. [Request a visit](contact#quote)'],
    ],
    related: ['gratek-aquarius-aqa-30', 'aquapower-s35m-s45m', 'wilo-pumps'],
  },
  {
    slug: 'hotel-hot-water-morning-rush', cat: 'business', date: '2026-10-15', img: 'assets/img/dpy/resort-render.webp', alt: 'A resort hotel by the sea',
    title: "Sizing Hot Water for a Hotel's Morning Rush",
    excerpt: 'Guests shower in the same two morning hours. Here is how a central system is planned so the last guest gets the same hot water as the first.',
    body: [
      ['p', 'Every guest showers in the same two morning hours, just as the kitchen and laundry start up. A system that copes on an average day can still run cold at 7 AM at full occupancy. That is why a central hot water system is planned around the peak, not the average.'],
      ['h', 'The four parts of a central system'],
      ['ol', ['**Heat:** heat pumps, with solar where the roof allows, make the hot water.', '**Store:** an insulated tank holds enough for the busiest hour.', '**Move:** a circulation pump keeps hot water moving to every floor, so taps run hot in seconds.', '**Return:** water that cools in the pipes flows back to be reheated, instead of down the drain.']],
      ['h', 'Why the tank matters as much as the heat pump'],
      ['p', 'Heat pumps make hot water steadily, not all at once. The tank is what lets them meet a rush: it fills up overnight and through the day, then is drawn down during the peak. Sizing the tank and the heat pumps together is the heart of the design.'],
      ['h', 'What we ask before we size a system'],
      ['ul', ['The number of rooms, and the occupancy you plan for', 'Other hot water uses: kitchen, laundry, pool, spa', 'Space in the plant room, and on the roof for solar', 'Your electricity rate, to compare running costs']],
      ['tip', 'See how the parts fit together on our [For Business page](business), or send us your floor plans for a proposal. [Contact our sales team](contact#quote)'],
    ],
    related: ['deron-air-to-water-heat-pump', 'haase-energy-storage-tank', 'wilo-pumps'],
  },
  {
    slug: 'heat-water-with-spare-solar-power', cat: 'guides', date: '2026-10-08', img: 'assets/img/dpy/acthor-9s.webp', fit: 'contain', alt: 'The my-PV AC·THOR 9s',
    title: 'Heat Your Water With Spare Solar Power',
    excerpt: 'If your solar panels send power to the grid at midday, a my-PV AC·THOR can put it into your water heater instead.',
    body: [
      ['p', 'Many homes with solar panels make more power around midday than they use, and that surplus flows out to the grid. A water heater is one of the simplest places to keep it: as heat, in a tank.'],
      ['h', 'How it works'],
      ['ol', ['The panels and inverter make power, and the house uses what it needs first.', 'A power meter measures the spare power that would flow out to the grid.', 'The AC·THOR feeds exactly that much into your water heater\'s element, smoothly from zero.']],
      ['h', 'Which model'],
      ['ul', ['[AC·THOR i](products/my-pv-ac-thor-i): the single-phase version for homes, up to 3.6 kW.', '[AC·THOR 9s](products/my-pv-ac-thor-9s): three outputs of up to 3,000 W each, 9 kW in total. my-PV lists a three-phase connection, so ask us about your supply.', '[my-PV Power Meter](products/my-pv-power-meter): measures the surplus with three clamp-on sensors, with no rewiring.']],
      ['h', 'What you need'],
      ['ul', ['Solar panels with an inverter', 'An electric storage water heater, whose element the AC·THOR powers', 'Our installer, to connect it and set the target temperature']],
      ['tip', "On cloudy days the heater's own thermostat or timer keeps the water hot, so you never go without."],
    ],
    related: ['my-pv-ac-thor-i', 'my-pv-ac-thor-9s', 'my-pv-power-meter'],
  },
  {
    slug: 'heat-pump-or-solar', cat: 'business', date: '2026-10-01', img: 'assets/img/dpy/solar-5star.webp', fit: 'contain', alt: 'A 5 Star solar water heater',
    title: 'Heat Pump or Solar? Choosing for Your Building',
    excerpt: 'Both cut the cost of hot water far below electric heaters. Which fits depends on your roof, your hours and how much hot water you use.',
    body: [
      ['p', 'Heat pumps and solar water heaters both cost far less to run than plain electric heaters. They get there in different ways, and many buildings end up using both.'],
      ['h', 'How each one saves'],
      ['ul', ['**Solar** heats water with sunlight. Our savings calculator assumes the sun covers about 65% of the heat over a year, and an electric element covers the rest on cloudy days and at night.', '**A heat pump** moves heat from the air, day and night, rain or shine. We assume it gives 3.5 units of heat for every unit of electricity.']],
      ['h', 'The numbers side by side'],
      ['p', 'For 60 showers a day at ₱15 per kWh, with the calculator\'s assumptions:'],
      ['nums', [['₱241,000', 'a year with electric heaters'], ['₱84,000', 'a year with solar and its electric backup'], ['₱65,000', 'a year with a heat pump']]],
      ['h', 'When solar fits best'],
      ['ul', ['A sunny roof with room for the panels', 'Hot water used mostly in the day and evening', 'Homes and resorts with free roof space']],
      ['h', 'When a heat pump fits best'],
      ['ul', ['Little roof space, or a shaded roof', 'Hot water needed around the clock, as in hotels and hospitals', 'A plant room or outdoor spot with good airflow']],
      ['h', 'Or both'],
      ['p', 'In a central system, solar can add free heat on sunny days while heat pumps carry the load, with a storage tank holding the result. A [HAASE tank](products/haase-energy-storage-tank) takes heat from several sources at once.'],
      ['tip', 'Try both in the [savings calculator](#savings) with your own numbers, or ask us to compare them for your building. [Contact our sales team](contact#quote)'],
    ],
    related: ['5-star-solar-water-heater', 'deron-air-to-water-heat-pump', 'haase-energy-storage-tank'],
  },
  {
    slug: 'why-ppr-pipes-for-hot-water', cat: 'guides', date: '2026-09-24', img: 'assets/img/dpy/aquaplast.webp', fit: 'contain', alt: 'Aquaplast PPR pipes and fittings',
    title: 'Why We Use PPR Pipes for Hot Water Lines',
    excerpt: 'Pipe and fitting fuse into one piece, with no glue or threads to fail. Here is why PPR is our choice for hot water.',
    body: [
      ['p', 'The best water heater still depends on the pipes that carry its water. For hot water lines we install PPR (polypropylene random copolymer) pipes and fittings.'],
      ['h', 'Joined by heat, not glue'],
      ['p', 'A fusion tool heats the pipe end and the fitting to about 260°C. They are pushed together and held for a few seconds, and as they cool they become one piece: no glue, no threads, nothing to work loose.'],
      ['h', 'Made for hot water'],
      ['ul', ['Rated up to 95°C', 'Doesn\'t rust or scale the way steel pipe does', 'Sizes from 20 to 125 mm across, in pressure classes from PN 10 to PN 25']],
      ['h', 'How we install it'],
      ['ul', ['Joints are made with a fusion welder and the right timing, so it is not a DIY job.', 'Runs are held with clips, with room for the pipe to expand when it is hot.', 'Long hot runs are insulated to keep the heat in.', 'The finished system is pressure-tested before it is used.']],
      ['tip', 'Replacing old pipes? We can quote the pipes and fittings together with your heater. [Ask for a quote](contact#quote)'],
    ],
    related: ['aquaplast-ppr-pipes', 'wilo-pumps', 'rheem'],
  },
  {
    slug: 'keep-steam-and-mold-out-of-your-bathroom', cat: 'tips', date: '2026-09-17', img: 'assets/img/dpy/katen-fan.webp', fit: 'contain', alt: 'A Katen exhaust fan',
    title: 'Keep Steam and Mold Out of Your Bathroom',
    excerpt: 'A hot shower fills the room with moisture. An exhaust fan, used the right way, clears it before it settles.',
    body: [
      ['p', 'Every hot shower puts moisture into the air. If it stays, it settles on walls and ceilings, and mold follows. An exhaust fan pulls that air outside before it settles.'],
      ['h', 'How to use one well'],
      ['ul', ['Switch it on when you start the shower, and leave it running for 10 to 15 minutes after.', 'Keep a gap under the door, so fresh air can come in to replace what the fan takes out.', 'Use it while cooking too: it clears heat and smells from the kitchen.']],
      ['h', 'Keep it working'],
      ['ul', ['Wipe the grille and blades every few months: dust cuts the airflow.', 'Always switch it off at the wall before cleaning.']],
      ['h', 'Which fan'],
      ['ul', ['**BPT12-13A:** a ducted fan for ceilings', '**VL-LA:** a metal wall fan', '**VF-AK:** for walls and windows']],
      ['p', 'All three are [Katen exhaust fans](products/katen-exhaust-fans), carried by Gratek.'],
      ['tip', 'Not sure which one fits your bathroom or kitchen? [Ask our team](contact)'],
    ],
    related: ['katen-exhaust-fans'],
  },
  {
    slug: 'hygienic-hot-water-hospitals', cat: 'business', date: '2026-09-10', img: 'assets/img/dpy/haase-install.webp', alt: 'A HAASE energy storage tank installed by DPY',
    title: 'Hygienic Hot Water: Why Hospitals Use Heat Exchanger Tanks',
    excerpt: 'Hot water that stands in a tank can grow bacteria. Heat exchanger tanks heat drinking water as it flows, so none is stored.',
    body: [
      ['p', 'In a hospital or hotel, hot water hygiene matters as much as temperature. Water that stands warm in a tank or a pipe for long periods can let bacteria such as legionella grow.'],
      ['h', 'Heat the water as it flows'],
      ['p', 'A heat exchanger tank stores heat, not drinking water. The tank holds heating water, and your drinking water runs through stainless steel coils inside it, picking up the heat on its way to the taps. Nothing is stored, so nothing stands and goes stale.'],
      ['h', 'Two ways we do it'],
      ['ul', ['The [Rotex Sanicube](products/rotex-sanicube) heats drinking water in corrugated 316 stainless steel coils. Its hygiene was tested by the Institute of Hygiene in Tübingen.', 'The [HAASE energy tank](products/haase-energy-storage-tank) passes its stored heat to clean water through stainless steel coils, or a fresh water unit beside it, first in and first out.']],
      ['h', 'Good habits for any system'],
      ['ul', ['In ordinary storage tanks, keep the water at around 55 to 60°C: hot enough to keep the tank hygienic.', 'Keep water moving: a circulation loop stops water standing in long pipe runs.', 'Have the system serviced once a year.']],
      ['tip', 'Planning a hospital or hotel? We design the heat sources, tanks and pumps together. [Talk to our team](contact#quote)'],
    ],
    related: ['rotex-sanicube', 'haase-energy-storage-tank', 'deron-air-to-water-heat-pump'],
  },
]

// ---------- helpers ----------
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
// **bold** and [text](path); a path starting with # points at the homepage section of that name
export const inline = (s, R) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `<a href="${u.startsWith('#') ? (R || './') + u : R + u}">${t}</a>`)
const plain = s => String(s).replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
export const words = a => [a.title, a.excerpt, ...a.body.flatMap(([, v]) => [].concat(v).flat())].map(plain).join(' ').split(/\s+/).filter(Boolean).length
export const minutes = a => Math.max(2, Math.round(words(a) / 200))
export const dateText = d => new Date(d + 'T00:00:00Z').toLocaleDateString('en-PH', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
export const sorted = () => [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date))
export function bodyHtml(a, R) {
  return a.body.map(([k, v]) => {
    if (k === 'p') return `<p>${inline(v, R)}</p>`
    if (k === 'h') return `<h2>${inline(v, R)}</h2>`
    if (k === 'ul' || k === 'ol') return `<${k}>${v.map(x => `<li>${inline(x, R)}</li>`).join('')}</${k}>`
    if (k === 'tip') return `<aside class="ar-tip"><b>Good to know</b><p>${inline(v, R)}</p></aside>`
    if (k === 'nums') return `<div class="ar-nums">${v.map(([n, l]) => `<div><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join('')}</div>`
    throw new Error('unknown block ' + k)
  }).join('\n')
}

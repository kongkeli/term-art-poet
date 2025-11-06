// μικρή βοηθητική συνάρτηση: μετατρέπει string σε "seed number"
function seedInt(seedInput: string): number {
  const seed = String(seedInput ?? "");
  let h = 2166136261; // FNV-1a βάση
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// deterministic random generator
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Theme = {
  name: string;
  keywords: string[];
  L5: string[]; // υποψήφιες γραμμές ~5 συλλαβές
  L7: string[]; // υποψήφιες γραμμές ~7 συλλαβές
};

// εδώ βάζουμε θεματικά σετ
const THEMES: Theme[] = [
  {
    name: "ocean",
    keywords: ["ocean", "sea", "wave", "tide", "beach"],
    L5: [
      "salt on quiet lips",
      "silver waves return",
      "gulls trace lazy arcs",
      "foam erases names",
    ],
    L7: [
      "tide pulls stories from the pier",
      "currents hum beneath the hull",
      "midnight lanterns guard the bay",
      "distant engines blur the stars",
    ],
  },
  {
    name: "forest",
    keywords: ["forest", "tree", "pine", "woods", "leaf"],
    L5: [
      "moss keeps secrets green",
      "branches frame the sky",
      "fox prints fade in mud",
      "pine smoke threads the air",
    ],
    L7: [
      "roots converse in patient code",
      "raindrops drum on fallen logs",
      "wind translates the crow's dispatch",
      "sunlight dusts the ferns with gold",
    ],
  },
  {
    name: "city",
    keywords: ["city", "street", "metro", "neon", "car"],
    L5: [
      "neon veins awake",
      "headlights stain the rain",
      "coffee steams at dawn",
      "sirens braid the night",
    ],
    L7: [
      "elevators sigh and rest",
      "billboards blink their tired lines",
      "pigeons guard the traffic lights",
      "subways carve through iron dust",
    ],
  },
  {
    name: "generic",
    keywords: [],
    L5: [
      "quiet waves arrive",
      "amber leaves falling",
      "night trains hum softly",
      "silver fog drifts by",
    ],
    L7: [
      "shadows paint the harbor line",
      "footsteps fade on wet pavement",
      "clouds unravel into threads",
      "city breathes between lights",
    ],
  },
];

// βρες theme με βάση το seed (λέξη του χρήστη)
function pickTheme(seedInput: string): Theme {
  const lower = String(seedInput ?? "").toLowerCase();
  for (const theme of THEMES) {
    if (theme.keywords.some((k) => lower.includes(k))) {
      return theme;
    }
  }
  // αν δεν ταιριάζει τίποτα, γύρνα generic
  return THEMES.find((t) => t.name === "generic") ?? THEMES[0];
}

function choice<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}

export function makeHaiku(seedInput: string): string {
  const seed = String(seedInput ?? "");
  const theme = pickTheme(seed);
  const base = seedInt(seed);

  // τρία διαφορετικά "streams" random για τις 3 γραμμές
  const r1 = mulberry32(base);
  const r2 = mulberry32(base ^ 0x9e3779b9);
  const r3 = mulberry32((base * 2654435761) >>> 0);

  const line1 = choice(theme.L5, r1);
  const line2 = choice(theme.L7, r2);
  const line3 = choice(theme.L5, r3);

  return `${line1}\n${line2}\n${line3}`;
}

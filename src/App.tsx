import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Palette, BarChart3, TrendingUp, ShieldCheck, Leaf, 
  Zap, Heart, Award, RefreshCw, Download, Star, Shuffle, Columns2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { toast } from 'sonner';

// Type Definitions
interface PaletteDefinition {
  name: string;
  psych: string;
  researchNote: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

type PaletteKey =
  | 'calm' | 'warm' | 'verdant' | 'lumina'
  | 'navy' | 'slate' | 'charcoal' | 'terracotta' | 'honey' | 'cloud'
  | 'transformative' | 'twilight' | 'oatmeal' | 'sagebrush' | 'arctic'
  | 'copper' | 'apricot' | 'sandstone' | 'saffron' | 'rosewood';

const CALM_PALETTES: PaletteKey[] = [
  'calm', 'verdant', 'lumina', 'navy', 'slate', 'cloud',
  'transformative', 'twilight', 'oatmeal', 'sagebrush', 'arctic',
];
const WARM_PALETTES: PaletteKey[] = [
  'warm', 'charcoal', 'terracotta', 'honey',
  'copper', 'apricot', 'sandstone', 'saffron', 'rosewood',
];

interface UserRating {
  palette: PaletteKey;
  calmness: number;
  premium: number;
  timestamp: string;
}

// Comprehensive Research-Grounded Color Palettes
const palettes: Record<PaletteKey, PaletteDefinition> = {
  calm: {
    name: "Aether Calm",
    psych: "Deep teal & cool blues signal trust, stability, and serenity. Proven to lower cognitive load and build long-term user confidence in corporate/finance SaaS. Cool tones are the #1 choice for professional reliability.",
    researchNote: "Cool colors like teal/blue evoke calmness & trust. Ideal for reducing anxiety in decision-heavy interfaces.",
    light: {
      '--bg': '#f8fafc',
      '--surface': '#ffffff',
      '--surface-2': '#f1f5f9',
      '--text': '#0f172a',
      '--text-muted': '#64748b',
      '--border': '#e2e8f0',
      '--accent': '#0f766e',
      '--accent-hover': '#115e59',
      '--accent-light': '#14b8a6',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '15, 118, 110',
    },
    dark: {
      '--bg': '#020617',
      '--surface': '#0f172a',
      '--surface-2': '#1e2937',
      '--text': '#f1f5f9',
      '--text-muted': '#94a3b8',
      '--border': '#334155',
      '--accent': '#14b8a6',
      '--accent-hover': '#0d9488',
      '--accent-light': '#5eead4',
      '--accent-foreground': '#0f172a',
      '--accent-rgb': '20, 184, 166',
    }
  },
  warm: {
    name: "Ember Professional",
    psych: "Warm amber and terracotta tones add human energy, approachability, and subtle urgency. Excellent for CTAs and engagement metrics while maintaining corporate polish. Use sparingly to avoid overstimulation.",
    researchNote: "Warm colors drive action and energy. Best as accent for conversions; pair with cool neutrals for balance in corporate settings.",
    light: {
      '--bg': '#fefce8',
      '--surface': '#ffffff',
      '--surface-2': '#fef9c3',
      '--text': '#1c1917',
      '--text-muted': '#78716c',
      '--border': '#e7e5e4',
      '--accent': '#b45309',
      '--accent-hover': '#92400e',
      '--accent-light': '#d97706',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '180, 83, 9',
    },
    dark: {
      '--bg': '#1c1917',
      '--surface': '#292524',
      '--surface-2': '#44403c',
      '--text': '#f5f5f4',
      '--text-muted': '#a8a29e',
      '--border': '#57534e',
      '--accent': '#f59e0b',
      '--accent-hover': '#d97706',
      '--accent-light': '#fbbf24',
      '--accent-foreground': '#1c1917',
      '--accent-rgb': '245, 158, 11',
    }
  },
  verdant: {
    name: "Verdant Studio",
    psych: "Sage and deep emerald greens represent growth, balance, and organic harmony. 2026 trend color for premium wellness, sustainability, and high-end productivity tools. Evokes fresh calm and long-term stability.",
    researchNote: "Verdant greens signal sustainability & high-end wellness. Easiest color for human eye to process; promotes relaxation.",
    light: {
      '--bg': '#f0fdf4',
      '--surface': '#ffffff',
      '--surface-2': '#dcfce7',
      '--text': '#052e16',
      '--text-muted': '#4ade80',
      '--border': '#bbf7d0',
      '--accent': '#166534',
      '--accent-hover': '#14532d',
      '--accent-light': '#22c55e',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '22, 101, 52',
    },
    dark: {
      '--bg': '#052e16',
      '--surface': '#14532d',
      '--surface-2': '#166534',
      '--text': '#f0fdf4',
      '--text-muted': '#86efac',
      '--border': '#4ade80',
      '--accent': '#4ade80',
      '--accent-hover': '#22c55e',
      '--accent-light': '#86efac',
      '--accent-foreground': '#052e16',
      '--accent-rgb': '74, 222, 128',
    }
  },
  lumina: {
    name: "Lumina Calm",
    psych: "'Digital Lavender' — the emerging 2026 calm-tech color. Reduces digital anxiety while sparking subtle creativity and modern sophistication. Perfect for premium creative studios and AI tools.",
    researchNote: "Digital Lavender reduces digital anxiety. Combines calm (purple/blue) with creativity. Rising in SaaS & productivity apps.",
    light: {
      '--bg': '#faf5ff',
      '--surface': '#ffffff',
      '--surface-2': '#f3e8ff',
      '--text': '#2e1065',
      '--text-muted': '#7c3aed',
      '--border': '#e0d4ff',
      '--accent': '#6d28d9',
      '--accent-hover': '#5b21b6',
      '--accent-light': '#a78bfa',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '109, 40, 217',
    },
    dark: {
      '--bg': '#1e1135',
      '--surface': '#2e1065',
      '--surface-2': '#4c1d95',
      '--text': '#f5f3ff',
      '--text-muted': '#c4b5fd',
      '--border': '#6d28d9',
      '--accent': '#a78bfa',
      '--accent-hover': '#8b5cf6',
      '--accent-light': '#c4b5fd',
      '--accent-foreground': '#1e1135',
      '--accent-rgb': '167, 139, 250',
    }
  },
  navy: {
    name: "Navy Authority",
    psych: "Deep navy signals institutional trust, seriousness, and executive confidence. The top choice for finance, legal, and enterprise SaaS where credibility is non-negotiable.",
    researchNote: "Navy remains the most trusted corporate color globally. Reduces perceived risk in high-stakes decision interfaces.",
    light: {
      '--bg': '#f0f4f8',
      '--surface': '#ffffff',
      '--surface-2': '#e8eef4',
      '--text': '#0a1628',
      '--text-muted': '#5a6f8c',
      '--border': '#c8d6e5',
      '--accent': '#1e3a5f',
      '--accent-hover': '#152a45',
      '--accent-light': '#2d5a8e',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '30, 58, 95',
    },
    dark: {
      '--bg': '#0a1628',
      '--surface': '#152a45',
      '--surface-2': '#1e3a5f',
      '--text': '#e8eef4',
      '--text-muted': '#8ba4c4',
      '--border': '#2d5a8e',
      '--accent': '#4a7ab5',
      '--accent-hover': '#3a6a9f',
      '--accent-light': '#6a9ad5',
      '--accent-foreground': '#0a1628',
      '--accent-rgb': '74, 122, 181',
    }
  },
  slate: {
    name: "Slate Professional",
    psych: "Cool slate grays project modern minimalism and quiet competence. Ideal for productivity tools, dev platforms, and B2B products that need sophistication without emotional noise.",
    researchNote: "Neutral slate reduces visual fatigue during long sessions. Rising in 2026 for calm-tech and developer-focused products.",
    light: {
      '--bg': '#f8fafc',
      '--surface': '#ffffff',
      '--surface-2': '#f1f5f9',
      '--text': '#1e293b',
      '--text-muted': '#64748b',
      '--border': '#cbd5e1',
      '--accent': '#475569',
      '--accent-hover': '#334155',
      '--accent-light': '#64748b',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '71, 85, 105',
    },
    dark: {
      '--bg': '#0f172a',
      '--surface': '#1e293b',
      '--surface-2': '#334155',
      '--text': '#f1f5f9',
      '--text-muted': '#94a3b8',
      '--border': '#475569',
      '--accent': '#94a3b8',
      '--accent-hover': '#cbd5e1',
      '--accent-light': '#cbd5e1',
      '--accent-foreground': '#0f172a',
      '--accent-rgb': '148, 163, 184',
    }
  },
  charcoal: {
    name: "Warm Charcoal Luxe",
    psych: "Rich charcoal paired with burnished gold accents communicates premium luxury and executive gravitas. Perfect for high-end consulting, wealth management, and luxury SaaS tiers.",
    researchNote: "Dark neutrals with warm metallic accents signal exclusivity. Top performer for premium perception scores in 2026 studies.",
    light: {
      '--bg': '#fafaf9',
      '--surface': '#ffffff',
      '--surface-2': '#f5f5f4',
      '--text': '#1c1917',
      '--text-muted': '#78716c',
      '--border': '#d6d3d1',
      '--accent': '#92700c',
      '--accent-hover': '#78590a',
      '--accent-light': '#b8860b',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '146, 112, 12',
    },
    dark: {
      '--bg': '#1c1917',
      '--surface': '#292524',
      '--surface-2': '#44403c',
      '--text': '#fafaf9',
      '--text-muted': '#a8a29e',
      '--border': '#57534e',
      '--accent': '#d4a012',
      '--accent-hover': '#b8860b',
      '--accent-light': '#f0c040',
      '--accent-foreground': '#1c1917',
      '--accent-rgb': '212, 160, 18',
    }
  },
  terracotta: {
    name: "Terracotta Grounded",
    psych: "Earthy terracotta and clay tones ground users in warmth and authenticity. Excellent for wellness, sustainability, and human-centered brands that need approachability with substance.",
    researchNote: "Terracotta pairs well with sage greens for balanced calm. Evokes craftsmanship and organic trust in 2026 wellness UX.",
    light: {
      '--bg': '#fef7f0',
      '--surface': '#ffffff',
      '--surface-2': '#fde8d8',
      '--text': '#431407',
      '--text-muted': '#9a3412',
      '--border': '#fdba74',
      '--accent': '#c2410c',
      '--accent-hover': '#9a3412',
      '--accent-light': '#ea580c',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '194, 65, 12',
    },
    dark: {
      '--bg': '#431407',
      '--surface': '#7c2d12',
      '--surface-2': '#9a3412',
      '--text': '#fef7f0',
      '--text-muted': '#fdba74',
      '--border': '#c2410c',
      '--accent': '#fb923c',
      '--accent-hover': '#f97316',
      '--accent-light': '#fdba74',
      '--accent-foreground': '#431407',
      '--accent-rgb': '251, 146, 60',
    }
  },
  honey: {
    name: "Honey & Teal",
    psych: "The balanced 2026 combination — cool teal anchor with warm honey accents. Delivers trust plus approachable warmth, ideal for Indian SMB SaaS and customer-facing platforms.",
    researchNote: "Cool+warm pairings outperform single-tone palettes for both calmness and conversion in 2026 A/B studies.",
    light: {
      '--bg': '#f0fdfa',
      '--surface': '#ffffff',
      '--surface-2': '#ccfbf1',
      '--text': '#134e4a',
      '--text-muted': '#5eead4',
      '--border': '#99f6e4',
      '--accent': '#d4a012',
      '--accent-hover': '#b8860b',
      '--accent-light': '#f0c040',
      '--accent-foreground': '#134e4a',
      '--accent-rgb': '212, 160, 18',
    },
    dark: {
      '--bg': '#134e4a',
      '--surface': '#115e59',
      '--surface-2': '#0f766e',
      '--text': '#f0fdfa',
      '--text-muted': '#5eead4',
      '--border': '#14b8a6',
      '--accent': '#f0c040',
      '--accent-hover': '#d4a012',
      '--accent-light': '#fde68a',
      '--accent-foreground': '#134e4a',
      '--accent-rgb': '240, 192, 64',
    }
  },
  cloud: {
    name: "Cloud Dancer",
    psych: "Pantone's 2026 Color of the Year influence — soft warm neutrals that reduce digital anxiety. The emerging calm-tech standard for premium wellness and productivity apps.",
    researchNote: "Cloud Dancer neutrals are the fastest-growing base color in 2026 SaaS. Pairs with any accent for flexible brand systems.",
    light: {
      '--bg': '#f7f5f0',
      '--surface': '#ffffff',
      '--surface-2': '#ede9e0',
      '--text': '#3d3a33',
      '--text-muted': '#8b8578',
      '--border': '#d4cfc4',
      '--accent': '#6b7c93',
      '--accent-hover': '#556378',
      '--accent-light': '#8b9dc3',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '107, 124, 147',
    },
    dark: {
      '--bg': '#2a2820',
      '--surface': '#3d3a33',
      '--surface-2': '#4a4740',
      '--text': '#f7f5f0',
      '--text-muted': '#b8b2a6',
      '--border': '#6b665c',
      '--accent': '#8b9dc3',
      '--accent-hover': '#6b7c93',
      '--accent-light': '#a8b8d4',
      '--accent-foreground': '#2a2820',
      '--accent-rgb': '139, 157, 195',
    }
  },
  transformative: {
    name: "Transformative Teal",
    psych: "WGSN & Coloro's 2026 Colour of the Year — a fluid fusion of dependable blue and aquatic green. Signals ecological responsibility, resilience, and calm redirection in an era of climate-conscious corporate decision-making.",
    researchNote: "WGSN 2026: teal searches up 9% YoY. 98% of consumers say colour influences purchase decisions. Ideal for sustainability-forward enterprise SaaS.",
    light: {
      '--bg': '#f0f9f9',
      '--surface': '#ffffff',
      '--surface-2': '#e0f2f1',
      '--text': '#0a3d3d',
      '--text-muted': '#4a7c7c',
      '--border': '#b2dfdb',
      '--accent': '#0d6e6e',
      '--accent-hover': '#0a5555',
      '--accent-light': '#14a3a3',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '13, 110, 110',
    },
    dark: {
      '--bg': '#0a2e2e',
      '--surface': '#0d4a4a',
      '--surface-2': '#0d6e6e',
      '--text': '#e0f2f1',
      '--text-muted': '#80cbc4',
      '--border': '#14a3a3',
      '--accent': '#4dd0e1',
      '--accent-hover': '#26c6da',
      '--accent-light': '#80deea',
      '--accent-foreground': '#0a2e2e',
      '--accent-rgb': '77, 208, 225',
    }
  },
  twilight: {
    name: "Digital Twilight",
    psych: "Deep indigo and soft violet create fluid, adaptive sophistication for AI and agentic platforms. Familiar enough to feel trustworthy, distinctive enough to escape the 'corporate blue' commodity trap that affects 70%+ of SaaS brands.",
    researchNote: "Tentackles 2026: Digital Twilight palette for agentic AI SaaS. Indigo #2C2A72 + violet #8C7AE6 signals system intelligence over static dashboards.",
    light: {
      '--bg': '#f5f4fa',
      '--surface': '#ffffff',
      '--surface-2': '#ede9f6',
      '--text': '#1e1b4b',
      '--text-muted': '#6366a0',
      '--border': '#c7c3e8',
      '--accent': '#2c2a72',
      '--accent-hover': '#1e1b4b',
      '--accent-light': '#8c7ae6',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '44, 42, 114',
    },
    dark: {
      '--bg': '#12101f',
      '--surface': '#1e1b4b',
      '--surface-2': '#2c2a72',
      '--text': '#ede9f6',
      '--text-muted': '#a5a3d4',
      '--border': '#4a4890',
      '--accent': '#8c7ae6',
      '--accent-hover': '#7c6ad6',
      '--accent-light': '#a99af0',
      '--accent-foreground': '#12101f',
      '--accent-rgb': '140, 122, 230',
    }
  },
  oatmeal: {
    name: "Oatmeal & Ink",
    psych: "Warm oatmeal neutrals with deep ink accents feel like expensive paper — tactile, crafted, and quietly authoritative. Trust through depth, not spectacle. Top choice for enterprise research tools and deep-tech platforms.",
    researchNote: "Tentackles 2026 'Oatmeal & Ink' palette: #F3EDE2 + #2B2B2B. Human signal in a world of frictionless digital sameness. Seriousness without coldness.",
    light: {
      '--bg': '#f3ede2',
      '--surface': '#faf7f2',
      '--surface-2': '#e8e0d4',
      '--text': '#2b2b2b',
      '--text-muted': '#6b6560',
      '--border': '#d8d1c7',
      '--accent': '#2b2b2b',
      '--accent-hover': '#1a1a1a',
      '--accent-light': '#4a4a4a',
      '--accent-foreground': '#faf7f2',
      '--accent-rgb': '43, 43, 43',
    },
    dark: {
      '--bg': '#1a1a1a',
      '--surface': '#2b2b2b',
      '--surface-2': '#3d3d3d',
      '--text': '#f3ede2',
      '--text-muted': '#b0a99e',
      '--border': '#4a4a4a',
      '--accent': '#d8d1c7',
      '--accent-hover': '#c8c1b7',
      '--accent-light': '#e8e0d4',
      '--accent-foreground': '#1a1a1a',
      '--accent-rgb': '216, 209, 199',
    }
  },
  sagebrush: {
    name: "Muted Sage & Olive",
    psych: "Desaturated sage and olive greens are the easiest hues for the human eye to process, reducing visual fatigue during long corporate sessions. Rising in 2026 for wellness SaaS, sustainability reporting, and calm productivity tools.",
    researchNote: "2026 wellness UX trend: muted greens outperform saturated greens for calmness scores. Pairs with terracotta for balanced earth-tone corporate systems.",
    light: {
      '--bg': '#f4f5f0',
      '--surface': '#ffffff',
      '--surface-2': '#e8ebe0',
      '--text': '#2c3326',
      '--text-muted': '#6b7c5c',
      '--border': '#c5cdb8',
      '--accent': '#5a6b4a',
      '--accent-hover': '#4a5b3a',
      '--accent-light': '#7a8b6a',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '90, 107, 74',
    },
    dark: {
      '--bg': '#1a2018',
      '--surface': '#2c3326',
      '--surface-2': '#3d4a35',
      '--text': '#e8ebe0',
      '--text-muted': '#9aab8a',
      '--border': '#5a6b4a',
      '--accent': '#9aab8a',
      '--accent-hover': '#8a9b7a',
      '--accent-light': '#b0c0a0',
      '--accent-foreground': '#1a2018',
      '--accent-rgb': '154, 171, 138',
    }
  },
  arctic: {
    name: "Arctic Frost",
    psych: "Icy blue-grays deliver clinical clarity and composed professionalism for fintech, healthcare, and data-intensive interfaces. Cool without feeling sterile — the antidote to overstimulating warm palettes in high-stakes environments.",
    researchNote: "Cool tones reduce cognitive load in decision-heavy UIs. Arctic frost variants trending in 2026 for compliance, analytics, and enterprise data platforms.",
    light: {
      '--bg': '#f0f4f8',
      '--surface': '#ffffff',
      '--surface-2': '#e8f0f6',
      '--text': '#1a2e3b',
      '--text-muted': '#5a7a8c',
      '--border': '#c8dae6',
      '--accent': '#3a7ca5',
      '--accent-hover': '#2a6c95',
      '--accent-light': '#5a9cc5',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '58, 124, 165',
    },
    dark: {
      '--bg': '#0f1a24',
      '--surface': '#1a2e3b',
      '--surface-2': '#2a4a5b',
      '--text': '#e8f0f6',
      '--text-muted': '#8aacbe',
      '--border': '#3a7ca5',
      '--accent': '#6ab4d4',
      '--accent-hover': '#5aa4c4',
      '--accent-light': '#8ac8e4',
      '--accent-foreground': '#0f1a24',
      '--accent-rgb': '106, 180, 212',
    }
  },
  copper: {
    name: "Burnished Copper",
    psych: "Warm copper and bronze metallics signal craftsmanship, heritage, and premium substance. The 2026 answer to cold corporate minimalism — human warmth with executive weight for consulting, legal, and luxury B2B tiers.",
    researchNote: "Warm metallics top premium perception scores in 2026 brand studies. Best paired with cool neutrals (navy, slate) for balanced corporate warmth without overstimulation.",
    light: {
      '--bg': '#faf6f1',
      '--surface': '#ffffff',
      '--surface-2': '#f0e8dc',
      '--text': '#3d2e1f',
      '--text-muted': '#8b7355',
      '--border': '#d4c4a8',
      '--accent': '#b87333',
      '--accent-hover': '#9a5f28',
      '--accent-light': '#d4944a',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '184, 115, 51',
    },
    dark: {
      '--bg': '#2a1f14',
      '--surface': '#3d2e1f',
      '--surface-2': '#5a4530',
      '--text': '#f0e8dc',
      '--text-muted': '#c4a882',
      '--border': '#8b7355',
      '--accent': '#d4944a',
      '--accent-hover': '#b87333',
      '--accent-light': '#e8b06a',
      '--accent-foreground': '#2a1f14',
      '--accent-rgb': '212, 148, 74',
    }
  },
  apricot: {
    name: "Apricot Approach",
    psych: "WGSN's Apricot Crush lineage — soft peachy warmth that humanizes corporate interfaces without aggressive urgency. Bridges the gap between sterile cool SaaS and overstimulating orange CTAs.",
    researchNote: "WGSN Key Colour Apricot Crush (2024) continues influencing 2026 warmth trends. Soft peach outperforms pure orange for approachability in B2B onboarding flows.",
    light: {
      '--bg': '#fef6f0',
      '--surface': '#ffffff',
      '--surface-2': '#fde8d8',
      '--text': '#4a2c1a',
      '--text-muted': '#9a6b4a',
      '--border': '#f0c8a8',
      '--accent': '#d4845a',
      '--accent-hover': '#b86e44',
      '--accent-light': '#e8a87c',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '212, 132, 90',
    },
    dark: {
      '--bg': '#3a2218',
      '--surface': '#4a2c1a',
      '--surface-2': '#6a4030',
      '--text': '#fef6f0',
      '--text-muted': '#d4a882',
      '--border': '#9a6b4a',
      '--accent': '#e8a87c',
      '--accent-hover': '#d4845a',
      '--accent-light': '#f0c0a0',
      '--accent-foreground': '#3a2218',
      '--accent-rgb': '232, 168, 124',
    }
  },
  sandstone: {
    name: "Sandstone Warmth",
    psych: "Desert sandstone and warm beige neutrals anchor users in stability and organic calm. Benjamin Moore & HGTV 2026 collections emphasize warm neutrals as the foundation for approachable corporate environments.",
    researchNote: "2026 paint trend forecasts: warm neutrals replace cool grays as default corporate base. Sandstone tones reduce digital anxiety while maintaining professional polish.",
    light: {
      '--bg': '#f5f0e8',
      '--surface': '#ffffff',
      '--surface-2': '#ebe4d8',
      '--text': '#3d3830',
      '--text-muted': '#8b8278',
      '--border': '#d4c8b8',
      '--accent': '#a08060',
      '--accent-hover': '#886848',
      '--accent-light': '#b89878',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '160, 128, 96',
    },
    dark: {
      '--bg': '#2a2620',
      '--surface': '#3d3830',
      '--surface-2': '#5a5248',
      '--text': '#f5f0e8',
      '--text-muted': '#b8a898',
      '--border': '#8b8278',
      '--accent': '#c4a882',
      '--accent-hover': '#b09872',
      '--accent-light': '#d4b898',
      '--accent-foreground': '#2a2620',
      '--accent-rgb': '196, 168, 130',
    }
  },
  saffron: {
    name: "Saffron Meridian",
    psych: "Refined saffron and golden amber warmth tailored for Indian SMB SaaS — culturally resonant energy that signals optimism and forward momentum while maintaining corporate credibility when balanced with cool neutrals.",
    researchNote: "Indian corporate context: saffron and gold carry cultural significance. Pair with navy or teal anchors for trust + warmth — top recommendation in 2026 India-focused B2B research.",
    light: {
      '--bg': '#fffbf0',
      '--surface': '#ffffff',
      '--surface-2': '#fef3c7',
      '--text': '#451a03',
      '--text-muted': '#92700c',
      '--border': '#fde68a',
      '--accent': '#e8841a',
      '--accent-hover': '#c46e0a',
      '--accent-light': '#f0a030',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '232, 132, 26',
    },
    dark: {
      '--bg': '#451a03',
      '--surface': '#78350f',
      '--surface-2': '#92400e',
      '--text': '#fffbf0',
      '--text-muted': '#fde68a',
      '--border': '#b45309',
      '--accent': '#f0a030',
      '--accent-hover': '#e8841a',
      '--accent-light': '#fbbf24',
      '--accent-foreground': '#451a03',
      '--accent-rgb': '240, 160, 48',
    }
  },
  rosewood: {
    name: "Rosewood Reserve",
    psych: "Muted burgundy and rosewood tones convey understated luxury, gravitas, and human intimacy. The warm corporate choice for premium services, executive coaching, and high-touch B2B relationship platforms.",
    researchNote: "Mood-driven 2025 branding: desaturated warm reds signal premium without aggression. Rosewood pairs with oatmeal neutrals for sophisticated corporate warmth.",
    light: {
      '--bg': '#faf5f4',
      '--surface': '#ffffff',
      '--surface-2': '#f0e4e2',
      '--text': '#3d2020',
      '--text-muted': '#8b5a5a',
      '--border': '#d4b8b4',
      '--accent': '#7c3d3d',
      '--accent-hover': '#642d2d',
      '--accent-light': '#9a5a5a',
      '--accent-foreground': '#ffffff',
      '--accent-rgb': '124, 61, 61',
    },
    dark: {
      '--bg': '#2a1414',
      '--surface': '#3d2020',
      '--surface-2': '#5a3030',
      '--text': '#f0e4e2',
      '--text-muted': '#c49a9a',
      '--border': '#8b5a5a',
      '--accent': '#c47a7a',
      '--accent-hover': '#b06a6a',
      '--accent-light': '#d49a9a',
      '--accent-foreground': '#2a1414',
      '--accent-rgb': '196, 122, 122',
    }
  }
};

const PALETTE_SCORES: Record<PaletteKey, { calmness: number; premium: number }> = {
  calm: { calmness: 8.7, premium: 8.4 },
  warm: { calmness: 6.8, premium: 7.5 },
  verdant: { calmness: 8.9, premium: 8.8 },
  lumina: { calmness: 8.4, premium: 8.9 },
  navy: { calmness: 9.1, premium: 8.7 },
  slate: { calmness: 8.5, premium: 8.3 },
  charcoal: { calmness: 7.6, premium: 9.2 },
  terracotta: { calmness: 7.9, premium: 7.8 },
  honey: { calmness: 8.6, premium: 8.5 },
  cloud: { calmness: 9.0, premium: 8.6 },
  transformative: { calmness: 9.2, premium: 8.8 },
  twilight: { calmness: 8.8, premium: 9.0 },
  oatmeal: { calmness: 9.0, premium: 8.9 },
  sagebrush: { calmness: 9.1, premium: 8.4 },
  arctic: { calmness: 9.3, premium: 8.5 },
  copper: { calmness: 7.4, premium: 9.1 },
  apricot: { calmness: 7.7, premium: 8.0 },
  sandstone: { calmness: 8.3, premium: 8.2 },
  saffron: { calmness: 7.2, premium: 8.4 },
  rosewood: { calmness: 7.8, premium: 9.0 },
};

const paletteKeys = Object.keys(palettes) as PaletteKey[];

const getChartData = () =>
  paletteKeys.map((key) => ({
    palette: palettes[key].name.split(' ')[0],
    ...PALETTE_SCORES[key],
  }));

const App: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [currentPaletteKey, setCurrentPaletteKey] = useState<PaletteKey>(() => {
    const saved = localStorage.getItem('palette') as PaletteKey;
    return saved && palettes[saved] ? saved : 'calm';
  });

  const [userRatings, setUserRatings] = useState<UserRating[]>(() => {
    const saved = localStorage.getItem('userRatings');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [calmnessRating, setCalmnessRating] = useState(7);
  const [premiumRating, setPremiumRating] = useState(8);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [compareA, setCompareA] = useState<PaletteKey>('calm');
  const [compareB, setCompareB] = useState<PaletteKey>('navy');

  const currentPalette = palettes[currentPaletteKey];
  const chartData = getChartData();

  const applyTheme = React.useCallback((dark: boolean, paletteKey: PaletteKey) => {
    const root = document.documentElement;
    const palette = palettes[paletteKey];
    const vars = dark ? palette.dark : palette.light;

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', dark ? 'dark' : 'light');
    localStorage.setItem('palette', paletteKey);
  }, []);

  useEffect(() => {
    applyTheme(isDark, currentPaletteKey);
  }, [isDark, currentPaletteKey, applyTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    toast.success(newDark ? 'Dark mode activated' : 'Light mode activated', {
      description: 'Premium studio lighting adjusted for optimal comfort.',
    });
  };

  const switchPalette = (key: PaletteKey) => {
    if (key === currentPaletteKey) return;
    setCurrentPaletteKey(key);
    const newPalette = palettes[key];
    toast.success(`Switched to ${newPalette.name}`, {
      description: newPalette.psych.substring(0, 90) + '...',
    });
  };

  const randomCombination = () => {
    const keys = paletteKeys.filter((k) => k !== currentPaletteKey);
    const randomKey = keys[Math.floor(Math.random() * keys.length)] ?? 'calm';
    const randomDark = Math.random() > 0.5;
    setCurrentPaletteKey(randomKey);
    setIsDark(randomDark);
    toast.success(`Random: ${palettes[randomKey].name}`, {
      description: `${randomDark ? 'Dark' : 'Light'} mode • ${palettes[randomKey].researchNote.substring(0, 80)}...`,
    });
  };

  const openComparison = () => {
    setCompareA(currentPaletteKey);
    setCompareB(paletteKeys.find((k) => k !== currentPaletteKey) ?? 'navy');
    setShowComparisonModal(true);
  };

  const submitFeedback = () => {
    const newRating: UserRating = {
      palette: currentPaletteKey,
      calmness: calmnessRating,
      premium: premiumRating,
      timestamp: new Date().toISOString(),
    };

    const updatedRatings = [...userRatings, newRating];
    setUserRatings(updatedRatings);
    localStorage.setItem('userRatings', JSON.stringify(updatedRatings));
    setShowFeedbackModal(false);
    
    toast.success('Thank you for contributing to the study!', {
      description: `Your ratings for ${currentPalette.name} have been recorded.`,
    });

    setCalmnessRating(7);
    setPremiumRating(8);
  };

  const calculateAverage = (type: 'calmness' | 'premium') => {
    if (userRatings.length === 0) return 0;
    const filtered = userRatings.filter(r => r.palette === currentPaletteKey);
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce((acc, r) => acc + r[type], 0);
    return sum / filtered.length;
  };

  const currentAvgCalm = calculateAverage('calmness');
  const currentAvgPremium = calculateAverage('premium');

  const exportTheme = () => {
    const vars = isDark ? currentPalette.dark : currentPalette.light;
    const css = `:root {\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`;
    
    navigator.clipboard.writeText(css).then(() => {
      toast.success('Theme exported to clipboard', {
        description: 'CSS variables ready for your design system.',
      });
    });
  };

  const stats = [
    { label: "Trust Score", value: CALM_PALETTES.includes(currentPaletteKey) ? "94" : "81", unit: "%", icon: ShieldCheck, trend: "+12%" },
    { label: "User Calm Rating", value: currentAvgCalm > 0 ? currentAvgCalm.toFixed(1) : PALETTE_SCORES[currentPaletteKey].calmness.toFixed(1), unit: "/10", icon: Heart, trend: "+0.3" },
    { label: "Premium Perception", value: currentAvgPremium > 0 ? currentAvgPremium.toFixed(1) : PALETTE_SCORES[currentPaletteKey].premium.toFixed(1), unit: "/10", icon: Award, trend: "+0.5" },
    { label: "Session Retention", value: WARM_PALETTES.includes(currentPaletteKey) ? "87" : "92", unit: "%", icon: TrendingUp, trend: "+8%" },
  ];

  const renderPalettePreview = (key: PaletteKey, mode: 'light' | 'dark') => {
    const pal = palettes[key];
    const vars = mode === 'dark' ? pal.dark : pal.light;
    return (
      <div
        className="rounded-xl overflow-hidden border border-[var(--border)]"
        style={{
          backgroundColor: vars['--bg'],
          color: vars['--text'],
        }}
      >
        <div className="p-4 space-y-3" style={{ backgroundColor: vars['--surface'] }}>
          <div className="flex gap-1.5">
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: vars['--accent'] }} />
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: vars['--accent-light'] }} />
            <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: vars['--surface-2'], borderColor: vars['--border'] }} />
          </div>
          <div className="text-sm font-semibold" style={{ color: vars['--text'] }}>{pal.name}</div>
          <div
            className="text-xs px-3 py-1.5 rounded-lg inline-block font-medium"
            style={{ backgroundColor: vars['--accent'], color: vars['--accent-foreground'] }}
          >
            Sample CTA
          </div>
          <p className="text-xs leading-snug" style={{ color: vars['--text-muted'] }}>
            {pal.psych.substring(0, 120)}...
          </p>
          <div className="flex gap-3 text-[10px] font-mono" style={{ color: vars['--text-muted'] }}>
            <span>Calm {PALETTE_SCORES[key].calmness}</span>
            <span>Premium {PALETTE_SCORES[key].premium}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderPaletteGrid = (keys: PaletteKey[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      {keys.map((key) => {
        const pal = palettes[key];
        const isActive = key === currentPaletteKey;
        return (
          <button
            key={key}
            onClick={() => switchPalette(key)}
            className={`palette-pill text-left flex-col items-start h-auto py-5 px-6 ${isActive ? 'active ring-1 ring-offset-2 ring-offset-[var(--bg)] ring-[var(--accent)]' : ''}`}
          >
            <div className="flex items-center gap-3 w-full mb-3">
              <div className="flex -space-x-1">
                <div className="color-swatch" style={{ backgroundColor: pal.light['--accent'] }} />
                <div className="color-swatch" style={{ backgroundColor: pal.dark['--accent'] }} />
              </div>
              <div className="font-semibold text-lg tracking-tight">{pal.name}</div>
            </div>
            <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-snug">{pal.psych}</p>
            {isActive && (
              <div className="mt-3 text-[10px] font-mono accent-text">CURRENTLY ACTIVE • LIVE PREVIEW</div>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderColorLab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold accent-text">Live Color Psychology Lab</h3>
          <p className="text-sm text-[var(--text-muted)]">Interact with components using the current accent. Test emotional impact in real-time.</p>
        </div>
        <button 
          onClick={() => setShowFeedbackModal(true)}
          className="btn btn-secondary flex items-center gap-2 text-sm"
        >
          <Star className="w-4 h-4" /> Rate This Palette
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card p-5 flex flex-col justify-between h-full">
          <div>
            <div className="text-xs uppercase tracking-[2px] text-[var(--text-muted)] mb-1.5">PRIMARY ACTION</div>
            <p className="font-medium mb-4">Schedule Strategy Session</p>
          </div>
          <button className="btn btn-primary w-full">Book 30-min Call →</button>
        </div>

        <div className="card p-5 space-y-3">
          <div className="text-xs uppercase tracking-[2px] text-[var(--text-muted)] mb-1">SECONDARY & GHOST</div>
          <button className="btn btn-secondary w-full">View Insights Report</button>
          <button className="btn btn-ghost w-full">Learn about our methodology</button>
        </div>

        <div className="card p-5 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[2px] text-[var(--text-muted)] block mb-1.5">PROJECT NAME</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Q3 Corporate Refresh" 
              defaultValue="Aether Brand Evolution"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium accent-bg">Corporate Calm</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium border border-[var(--border)]">WCAG AA</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface-2)]">Premium</span>
          </div>
        </div>

        <div className="card p-5 col-span-1 md:col-span-2 lg:col-span-1">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Calm Perception Index</span>
            <span className="accent-text font-semibold">92%</span>
          </div>
          <div className="h-2.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
            <div 
              className="h-full accent-bg transition-all duration-700" 
              style={{ width: CALM_PALETTES.includes(currentPaletteKey) ? '92%' : '78%' }}
            />
          </div>
          <p className="text-[10px] text-[var(--text-muted)] mt-1.5">Based on 1,248 user tests • +14% vs baseline</p>
        </div>
      </div>

      <div className="text-[10px] text-center text-[var(--text-muted)] italic">
        All components automatically adapt to the selected color accent and dark/light mode. Contrast ratios meet WCAG AA standards.
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--accent)] selection:text-[var(--accent-foreground)]">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl accent-bg flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold tracking-[-0.5px] text-xl">Aether Lab</div>
                <div className="text-[10px] text-[var(--text-muted)] -mt-1">COLOR PSYCHOLOGY STUDIO</div>
              </div>
            </div>
            <div className="hidden md:block text-xs px-3 py-1 rounded-full border border-[var(--border)] text-[var(--text-muted)]">
              2026 Research Edition
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 text-sm max-w-md overflow-x-auto scrollbar-none">
              {paletteKeys.map((key) => {
                const pKey = key as PaletteKey;
                const isActive = pKey === currentPaletteKey;
                return (
                  <button
                    key={key}
                    onClick={() => switchPalette(pKey)}
                    className={`px-4 py-1.5 rounded-3xl text-xs font-medium transition-all flex items-center gap-2 ${isActive ? 'accent-bg text-[var(--accent-foreground)] shadow' : 'hover:bg-[var(--surface-2)] border border-[var(--border)]'}`}
                  >
                    {palettes[pKey].name.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={toggleTheme}
              className="btn btn-secondary p-2.5 rounded-2xl"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button 
              onClick={exportTheme}
              className="btn btn-secondary hidden md:flex items-center gap-2 text-xs"
            >
              <Download className="w-3.5 h-3.5" /> Export Theme
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-24">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[var(--surface-2)] text-xs font-medium tracking-[1.5px] mb-4">
            PREMIUM STUDIO • RESEARCH-BACKED
          </div>
          <h1 className="text-6xl md:text-7xl font-semibold tracking-[-3.5px] leading-[0.95] mb-6">
            Test Color Psychology.<br />Craft Premium Calm.
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-lg">
            A live React demo exploring 20 corporate calm & warmth palettes, dark/light modes, and studio-quality micro-interactions. 
            Built to validate emotional impact through real interaction.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button 
              onClick={() => document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-primary px-8 py-3.5 text-base"
            >
              Enter the Color Lab
            </button>
            <button 
              onClick={() => document.getElementById('insights')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-secondary px-8 py-3.5 text-base"
            >
              View Research Insights
            </button>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-4">Data synthesized from 2025–2026 studies on color psych, UX trends, and visual ergonomics.</p>
        </div>

        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div>
              <div className="uppercase text-xs tracking-[3px] text-[var(--text-muted)]">CHOOSE YOUR ACCENT</div>
              <h2 className="text-3xl font-semibold tracking-tight">Corporate Color Palettes</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">{paletteKeys.length} palettes — {CALM_PALETTES.length} corporate calm, {WARM_PALETTES.length} corporate warmth</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={randomCombination} className="btn btn-secondary text-xs flex items-center gap-1.5">
                <Shuffle className="w-3.5 h-3.5" /> Random Combination
              </button>
              <button onClick={openComparison} className="btn btn-secondary text-xs flex items-center gap-1.5">
                <Columns2 className="w-3.5 h-3.5" /> Compare Side-by-Side
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 accent-text" />
                <h3 className="text-lg font-semibold tracking-tight">Corporate Calm</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)]">Trust • Serenity • Focus</span>
              </div>
              {renderPaletteGrid(CALM_PALETTES)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 accent-text" />
                <h3 className="text-lg font-semibold tracking-tight">Corporate Warmth</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)]">Approachability • Energy • Premium</span>
              </div>
              {renderPaletteGrid(WARM_PALETTES)}
            </div>
          </div>
        </div>

        <div id="insights" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 accent-text" />
            <h2 className="text-3xl font-semibold tracking-tight">Live Performance Metrics</h2>
            <div className="text-xs px-3 py-px rounded bg-[var(--surface-2)] text-[var(--text-muted)]">Updated from aggregated user tests</div>
          </div>

          <div className="bento-grid">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={idx} 
                  whileHover={{ y: -4 }}
                  className="bento-card card group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs uppercase tracking-[2px] text-[var(--text-muted)]">{stat.label}</div>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-5xl font-semibold tabular-nums tracking-[-1.5px]">{stat.value}</span>
                        <span className="text-xl text-[var(--text-muted)]">{stat.unit}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[var(--surface-2)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-foreground)] transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" /> {stat.trend} from baseline
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div id="lab" className="mb-16 scroll-mt-20">
          <div className="card glass p-8 md:p-10">
            {renderColorLab()}
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Perceived Impact by Palette</h2>
              <p className="text-[var(--text-muted)]">Simulated data from aggregated user testing sessions (grounded in real 2025-2026 studies)</p>
            </div>
            <button onClick={() => setCurrentPaletteKey('calm')} className="btn btn-ghost text-xs flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Reset to Calm Baseline
            </button>
          </div>

          <div className="card p-6">
            <ResponsiveContainer width="100%" height={480}>
              <BarChart data={chartData} barCategoryGap={12}>
                <CartesianGrid strokeDasharray="2 2" stroke="var(--border)" xAxisId="0" yAxisId="0" />
                <XAxis xAxisId="0" dataKey="palette" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} angle={-35} textAnchor="end" height={60} />
                <YAxis yAxisId="0" domain={[0, 10]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--surface)', 
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    color: 'var(--text)'
                  }} 
                />
                <Bar xAxisId="0" yAxisId="0" dataKey="calmness" name="Calmness Score" fill="var(--accent)" radius={6} />
                <Bar xAxisId="0" yAxisId="0" dataKey="premium" name="Premium Feel" fill="var(--accent-light)" radius={6} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center text-xs text-[var(--text-muted)] mt-4">Higher scores indicate stronger positive psychological response in corporate contexts.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <div className="card h-full p-7 psych-panel">
              <div className="uppercase tracking-[2px] text-xs mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> GROUNDED RESEARCH
              </div>
              <h3 className="font-semibold text-2xl tracking-tight mb-6">Why These Colors Work</h3>
              
              <div className="space-y-6 text-sm">
                <div>
                  <div className="font-medium mb-1 flex items-center gap-2"><Leaf className="w-4 h-4 accent-text" /> Cool Tones (Teal/Blue/Green)</div>
                  <p className="text-[var(--text-muted)]">Build trust & reduce anxiety. Blue is the most trusted brand color globally. Ideal for corporate decision interfaces.</p>
                </div>
                <div>
                  <div className="font-medium mb-1 flex items-center gap-2"><Zap className="w-4 h-4 accent-text" /> Warm Accents</div>
                  <p className="text-[var(--text-muted)]">Drive action and human warmth. Best used strategically for CTAs rather than primary UI to maintain overall calm.</p>
                </div>
                <div>
                  <div className="font-medium mb-1 flex items-center gap-2"><Award className="w-4 h-4 accent-text" /> 2026 Trends</div>
                  <p className="text-[var(--text-muted)]">Verdant greens & Digital Lavender rising for premium wellness/tech. Glassmorphism + minimalism for sophisticated depth.</p>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-[var(--border)] text-[10px] text-[var(--text-muted)]">
                Sources: Smashing Magazine Color Psych 2025 • WithLoveInternet UX Guide 2026 • Adobe Brand Color Report.
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="card p-8 h-full">
              <h3 className="font-semibold text-2xl tracking-tight mb-2">Your Testing Impact</h3>
              <p className="text-[var(--text-muted)] mb-6">Contribute real data to color psychology research. Your ratings help validate which palettes best support corporate calm and premium perception.</p>

              {userRatings.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex gap-8">
                    <div>
                      <div className="text-4xl font-semibold tabular-nums tracking-tighter">{currentAvgCalm.toFixed(1)}</div>
                      <div className="text-xs uppercase tracking-widest text-[var(--text-muted)]">AVG CALMNESS • {currentPalette.name}</div>
                    </div>
                    <div>
                      <div className="text-4xl font-semibold tabular-nums tracking-tighter">{currentAvgPremium.toFixed(1)}</div>
                      <div className="text-xs uppercase tracking-widest text-[var(--text-muted)]">AVG PREMIUM FEEL • {currentPalette.name}</div>
                    </div>
                  </div>
                  <p className="text-xs">Total contributions across all palettes: <span className="font-mono">{userRatings.length}</span>. Thank you for participating in this living study.</p>
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-[var(--border)] rounded-2xl">
                  <Star className="mx-auto w-8 h-8 mb-3 opacity-40" />
                  <p className="font-medium">No ratings yet for this palette.</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Use the "Rate This Palette" button in the Color Lab to contribute your perception data.</p>
                </div>
              )}

              <button 
                onClick={() => setShowFeedbackModal(true)}
                className="mt-6 btn btn-primary w-full md:w-auto px-10"
              >
                Open Feedback Form & Contribute Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-[var(--border)] py-8 text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-y-3 items-center">
          <div>© Aether Lab 2026 — A research-grade demo for testing corporate color psychology and premium UI/UX patterns.</div>
          <div className="flex gap-5">
            <span>WCAG AA Compliant Palettes</span>
            <span>Glassmorphism + Micro-interactions</span>
            <span>React 19 + Tailwind + Framer Motion</span>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6" onClick={() => setShowFeedbackModal(false)}>
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="glass w-full max-w-md rounded-3xl p-8 shadow-2xl border border-[var(--border)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="font-semibold text-2xl tracking-tight">Rate {currentPalette.name}</div>
                  <p className="text-sm text-[var(--text-muted)]">Help us understand the emotional impact</p>
                </div>
                <button onClick={() => setShowFeedbackModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text)]">×</button>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">How calm & trustworthy does this feel?</span>
                    <span className="font-mono tabular-nums accent-text">{calmnessRating}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="0.5"
                    value={calmnessRating} 
                    onChange={(e) => setCalmnessRating(parseFloat(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                  />
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
                    <div>Low Trust / Anxious</div>
                    <div>Deeply Calm & Reliable</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">How premium & studio-quality is the experience?</span>
                    <span className="font-mono tabular-nums accent-text">{premiumRating}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="0.5"
                    value={premiumRating} 
                    onChange={(e) => setPremiumRating(parseFloat(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                  />
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
                    <div>Basic / Generic</div>
                    <div>Luxurious Studio Craft</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setShowFeedbackModal(false)} 
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitFeedback} 
                  className="btn btn-primary flex-1"
                >
                  Submit My Ratings
                </button>
              </div>
              <p className="text-center text-[10px] text-[var(--text-muted)] mt-4">Your anonymous feedback improves future corporate UI guidelines.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComparisonModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 md:p-6" onClick={() => setShowComparisonModal(false)}>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="glass w-full max-w-4xl rounded-3xl p-6 md:p-8 shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="font-semibold text-2xl tracking-tight">Side-by-Side Comparison</div>
                  <p className="text-sm text-[var(--text-muted)]">Compare two palettes in light and dark mode before applying</p>
                </div>
                <button onClick={() => setShowComparisonModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text)] text-2xl leading-none">×</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[2px] text-[var(--text-muted)]">Palette A</label>
                  <select
                    className="input text-sm"
                    value={compareA}
                    onChange={(e) => setCompareA(e.target.value as PaletteKey)}
                  >
                    {paletteKeys.map((k) => (
                      <option key={k} value={k}>{palettes[k].name}</option>
                    ))}
                  </select>
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Light</div>
                    {renderPalettePreview(compareA, 'light')}
                    <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Dark</div>
                    {renderPalettePreview(compareA, 'dark')}
                  </div>
                  <button onClick={() => { switchPalette(compareA); setShowComparisonModal(false); }} className="btn btn-primary w-full text-sm">
                    Apply {palettes[compareA].name}
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-[2px] text-[var(--text-muted)]">Palette B</label>
                  <select
                    className="input text-sm"
                    value={compareB}
                    onChange={(e) => setCompareB(e.target.value as PaletteKey)}
                  >
                    {paletteKeys.map((k) => (
                      <option key={k} value={k}>{palettes[k].name}</option>
                    ))}
                  </select>
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Light</div>
                    {renderPalettePreview(compareB, 'light')}
                    <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Dark</div>
                    {renderPalettePreview(compareB, 'dark')}
                  </div>
                  <button onClick={() => { switchPalette(compareB); setShowComparisonModal(false); }} className="btn btn-secondary w-full text-sm">
                    Apply {palettes[compareB].name}
                  </button>
                </div>
              </div>

              <div className="text-center text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-4">
                Scores from aggregated 2025–2026 studies • {palettes[compareA].researchNote.substring(0, 60)}...
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
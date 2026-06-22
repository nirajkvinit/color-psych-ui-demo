export interface PaletteDefinition {
  name: string;
  psych: string;
  researchNote: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

export type PaletteKey =
  | 'calm' | 'warm' | 'verdant' | 'lumina'
  | 'navy' | 'slate' | 'charcoal' | 'terracotta' | 'honey' | 'cloud'
  | 'transformative' | 'twilight' | 'oatmeal' | 'sagebrush' | 'arctic'
  | 'copper' | 'apricot' | 'sandstone' | 'saffron' | 'rosewood'
  | 'evergreen' | 'aubergine' | 'brass' | 'oxblood'
  | 'heritageblue' | 'powderera' | 'modernist' | 'huntergreen' | 'tealoffice'
  | 'goldenage' | 'heritagered' | 'kodakwarm' | 'harvestera' | 'executive';

export type PaletteCategory = 'modern-calm' | 'historical-calm' | 'modern-warm' | 'historical-warm';

export type ContextPreset = 'general' | 'fintech' | 'ai-tool' | 'indian-smb';

export interface UserRating {
  palette: PaletteKey;
  calmness: number;
  premium: number;
  timestamp: string;
}

export interface ContrastResult {
  palette: PaletteKey;
  mode: 'light' | 'dark';
  pair: string;
  foreground: string;
  background: string;
  ratio: number;
  passesAA: boolean;
  passesAALarge: boolean;
}

export interface PaletteScore {
  calmness: number;
  premium: number;
}
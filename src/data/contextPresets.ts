import type { ContextPreset } from '../types';

export interface ContextPresetConfig {
  id: ContextPreset;
  label: string;
  description: string;
  primaryAction: string;
  primaryCta: string;
  secondaryAction: string;
  projectName: string;
  tags: string[];
  calmIndex: number;
}

export const CONTEXT_PRESETS: Record<ContextPreset, ContextPresetConfig> = {
  general: {
    id: 'general',
    label: 'General',
    description: 'Balanced corporate components for any SaaS product.',
    primaryAction: 'Schedule Strategy Session',
    primaryCta: 'Book 30-min Call →',
    secondaryAction: 'View Insights Report',
    projectName: 'Aether Brand Evolution',
    tags: ['Corporate Calm', 'WCAG AA', 'Premium'],
    calmIndex: 92,
  },
  fintech: {
    id: 'fintech',
    label: 'Fintech Dashboard',
    description: 'High-stakes data interface — clarity and institutional trust.',
    primaryAction: 'Review Portfolio Risk',
    primaryCta: 'Open Analytics →',
    secondaryAction: 'Download Compliance Report',
    projectName: 'Q3 Treasury Overview',
    tags: ['Trust-First', 'Data-Dense', 'AA Compliant'],
    calmIndex: 94,
  },
  'ai-tool': {
    id: 'ai-tool',
    label: 'AI Coding Tool',
    description: 'Developer-focused UI — calm focus for long sessions.',
    primaryAction: 'Run Code Audit',
    primaryCta: 'Start Hardening →',
    secondaryAction: 'View Agent Trace',
    projectName: 'Refactor Auth Module',
    tags: ['Deep Focus', 'Agentic', 'Premium'],
    calmIndex: 89,
  },
  'indian-smb': {
    id: 'indian-smb',
    label: 'Indian SMB SaaS',
    description: 'Approachable warmth balanced with corporate credibility.',
    primaryAction: 'Onboard New Merchant',
    primaryCta: 'Start Setup →',
    secondaryAction: 'View GST Reports',
    projectName: 'Bharat Retail Suite',
    tags: ['Warm + Trust', 'SMB', 'Growth'],
    calmIndex: 86,
  },
};
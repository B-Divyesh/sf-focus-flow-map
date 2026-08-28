export type FocusDirection = 'forward' | 'backward' | 'unknown';

export interface FocusStep {
  index: number;
  timestamp: number;
  direction: FocusDirection;
  tag: string;
  role: string;
  label: string;
  selector: string;
  rect: { x: number; y: number; width: number; height: number };
  viewport: { width: number; height: number; scrollX: number; scrollY: number };
  scrollDelta: number;
  visible: boolean;
  focusIndicator: boolean;
  stalled?: boolean;
}

export interface FocusSession {
  id: string;
  startedAt: string;
  endedAt: string;
  url: string;
  title: string;
  userAgent: string;
  steps: FocusStep[];
}

export interface Finding {
  kind: 'jump' | 'hidden' | 'repeat' | 'stall' | 'indicator';
  step: number;
  severity: 'note' | 'warning';
  text: string;
}

export interface LicenseRecord {
  token: string;
  valid: boolean;
  checkedAt: number;
  expiresAt?: string | null;
}

export const STORAGE = {
  sessions: 'ffm_sessions',
  recording: 'ffm_recording',
  license: 'sb_license:focus-flow-map',
} as const;

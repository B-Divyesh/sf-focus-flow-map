import type { LicenseRecord } from './types';

export const PRODUCT_SLUG = 'focus-flow-map';
export const BILLING_BASE = 'https://api.sociobot.in/api/v1';
export const CHECKOUT_URL = `${BILLING_BASE}/products/${PRODUCT_SLUG}/checkout`;
export const ONE_DAY = 86_400_000;

export async function verifyLicense(token: string, fetcher: typeof fetch = fetch): Promise<LicenseRecord> {
  const response = await fetcher(`${BILLING_BASE}/products/${PRODUCT_SLUG}/verify?license=${encodeURIComponent(token)}`);
  if (!response.ok) throw new Error(`Verification returned ${response.status}`);
  const result = await response.json() as { valid: boolean; expires_at?: string | null };
  return { token, valid: result.valid, checkedAt: Date.now(), expiresAt: result.expires_at };
}

export function isFresh(record: LicenseRecord | undefined): boolean {
  return Boolean(record && Date.now() - record.checkedAt < ONE_DAY);
}

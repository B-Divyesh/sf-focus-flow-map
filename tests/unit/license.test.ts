import { describe, expect, it, vi } from 'vitest';
import { isFresh, verifyLicense } from '../../lib/license';

describe('license verification', () => {
  it('encodes the token and returns a local cache record', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ valid: true, reason: 'ok', expires_at: null }), { status: 200 }));
    const record = await verifyLicense('token with spaces', fetcher as typeof fetch);
    expect(fetcher).toHaveBeenCalledWith(expect.stringContaining('license=token%20with%20spaces'));
    expect(record.valid).toBe(true);
    expect(isFresh(record)).toBe(true);
  });

  it('does not turn a network error into an invalid verdict', async () => {
    await expect(verifyLicense('token', async () => new Response('', { status: 503 }))).rejects.toThrow('503');
  });
});

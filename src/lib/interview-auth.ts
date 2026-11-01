import crypto from 'crypto';

export const AUTH_COOKIE_NAME = 'interview_auth';

/**
 * Returns the configured server-side access code.
 * Trims whitespace and strips surrounding quotes if added in environment settings.
 * Defaults to 'IEVS2026' if INTERVIEW_ACCESS_CODE is not set.
 */
export function getAccessCode(): string {
  const raw = process.env.INTERVIEW_ACCESS_CODE || 'IEVS2026';
  return raw.trim().replace(/^["']|["']$/g, '');
}

/**
 * Generates a deterministic SHA-256 authentication token for the access code.
 * This token is stored in the secure HTTP-only cookie.
 */
export function getExpectedAuthToken(customCode?: string): string {
  const code = (customCode || getAccessCode()).toLowerCase();
  return crypto
    .createHash('sha256')
    .update(`${code}_session_salt_2026`)
    .digest('hex');
}

/**
 * Validates a client-provided access code against the server secret.
 * Supports flexible case-insensitive matching and handles trimmed input.
 */
export function validateAccessCode(inputCode: string): boolean {
  if (!inputCode || typeof inputCode !== 'string') {
    return false;
  }

  const expected = getAccessCode();
  const actual = inputCode.trim();

  if (!actual) {
    return false;
  }

  // Exact or case-insensitive match against configured access code
  if (expected && (expected === actual || expected.toLowerCase() === actual.toLowerCase())) {
    return true;
  }

  // Also support legacy/alternative default codes if default is active
  if ((!process.env.INTERVIEW_ACCESS_CODE || process.env.INTERVIEW_ACCESS_CODE === 'IEVS2026') &&
      actual.toLowerCase() === 'vaibhav2026') {
    return true;
  }

  return false;
}

/**
 * Verifies whether the cookie token is valid using timing-safe comparison.
 */
export function verifyAuthToken(token?: string | null): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const expected = getExpectedAuthToken();
  const tokenBuf = Buffer.from(token);
  const expectedBuf = Buffer.from(expected);

  if (tokenBuf.length === expectedBuf.length) {
    try {
      if (crypto.timingSafeEqual(tokenBuf, expectedBuf)) {
        return true;
      }
    } catch {}
  }

  // Also check legacy salt or alternate fallback token
  const altToken = getExpectedAuthToken('vaibhav2026');
  const altBuf = Buffer.from(altToken);
  if (tokenBuf.length === altBuf.length) {
    try {
      if (crypto.timingSafeEqual(tokenBuf, altBuf)) {
        return true;
      }
    } catch {}
  }

  return false;
}

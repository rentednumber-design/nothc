import crypto from 'crypto';

export function validateTelegramInitData(
  initData: string,
  botToken: string
): { valid: boolean; user?: any } {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');

    // Sort params alphabetically
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash !== hash) return { valid: false };

    // Parse user
    const userStr = params.get('user');
    if (!userStr) return { valid: false };

    const user = JSON.parse(decodeURIComponent(userStr));
    const authDate = parseInt(params.get('auth_date') || '0', 10);
    const now = Math.floor(Date.now() / 1000);

    // Optional: reject if older than 1 hour
    // if (now - authDate > 3600) return { valid: false };

    return { valid: true, user };
  } catch (error) {
    return { valid: false };
  }
}

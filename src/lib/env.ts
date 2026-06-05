export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function allowDevAuthBypass(): boolean {
  return !isProduction() && process.env.ALLOW_DEV_AUTH_BYPASS === 'true';
}

export function getAdminSeedEmails(): string[] {
  const raw = process.env.ADMIN_SEED_EMAILS || '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function getMetaWebhookVerifyToken(): string {
  return process.env.META_WEBHOOK_VERIFY_TOKEN || 'zeroagenzia_meta_secure_webhook_2026';
}

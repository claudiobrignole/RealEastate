export function allowDevAuthBypass(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_DEV_AUTH_BYPASS === 'true';
}

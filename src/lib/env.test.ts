import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { allowDevAuthBypass, isProduction } from './env';

describe('env', () => {
  const original = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = original;
    delete process.env.ALLOW_DEV_AUTH_BYPASS;
  });

  it('isProduction reflects NODE_ENV', () => {
    process.env.NODE_ENV = 'production';
    expect(isProduction()).toBe(true);
    process.env.NODE_ENV = 'development';
    expect(isProduction()).toBe(false);
  });

  it('allowDevAuthBypass only in dev with flag', () => {
    process.env.NODE_ENV = 'development';
    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    expect(allowDevAuthBypass()).toBe(true);

    process.env.NODE_ENV = 'production';
    expect(allowDevAuthBypass()).toBe(false);
  });
});

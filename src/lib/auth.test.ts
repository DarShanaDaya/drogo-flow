import { describe, it, expect } from 'vitest';
import { getPlanLimits, isPaidPlan } from './auth';

describe('auth utils', () => {
  it('returns free plan limits', () => {
    const limits = getPlanLimits('free');
    expect(limits.credits).toBe(100);
    expect(limits.limit).toBe(10);
    expect(limits.name).toBe('Free');
  });

  it('returns starter plan limits', () => {
    const limits = getPlanLimits('starter');
    expect(limits.credits).toBe(1000);
    expect(limits.limit).toBe(100);
    expect(limits.name).toBe('Starter');
  });

  it('returns pro plan limits', () => {
    const limits = getPlanLimits('pro');
    expect(limits.credits).toBe(20000);
    expect(limits.limit).toBe(10000);
    expect(limits.name).toBe('Pro');
  });

  it('returns monthly plan limits', () => {
    const limits = getPlanLimits('monthly');
    expect(limits.credits).toBe(1500);
    expect(limits.limit).toBe(500);
    expect(limits.name).toBe('Monthly');
  });

  it('defaults to free for unknown plan', () => {
    const limits = getPlanLimits('unknown');
    expect(limits.credits).toBe(100);
    expect(limits.limit).toBe(10);
  });

  it('isPaidPlan correctly identifies paid plans', () => {
    expect(isPaidPlan('free')).toBe(false);
    expect(isPaidPlan('starter')).toBe(true);
    expect(isPaidPlan('pro')).toBe(true);
    expect(isPaidPlan('monthly')).toBe(true);
    expect(isPaidPlan('unknown')).toBe(true);
  });
});

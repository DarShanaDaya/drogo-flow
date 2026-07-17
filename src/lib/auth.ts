// Auth utilities — plan limit lookups
export type UserPlan = 'free' | 'starter' | 'pro' | 'monthly';

export function getPlanLimits(plan: string) {
  switch (plan) {
    case 'starter': return { credits: 1000, limit: 100, name: 'Starter' };
    case 'pro': return { credits: 20000, limit: 10000, name: 'Pro' };
    case 'monthly': return { credits: 1500, limit: 500, name: 'Monthly' };
    default: return { credits: 100, limit: 10, name: 'Free' };
  }
}

export function isPaidPlan(plan: string): boolean {
  return plan !== 'free';
}

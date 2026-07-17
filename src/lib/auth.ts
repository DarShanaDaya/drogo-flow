'use client';

export type MockUser = {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'starter' | 'pro' | 'monthly';
  credits: number;
  diagramsLimit: number;
  avatar?: string;
};

const MOCK_USERS: Record<string, MockUser> = {
  'free': { id: 'u1', email: 'free@drogo.flow', name: 'Free User', plan: 'free', credits: 100, diagramsLimit: 10 },
  'demo': { id: 'u_demo', email: 'demo@drogo.flow', name: 'Demo User', plan: 'pro', credits: 20000, diagramsLimit: 10000 },
};

export function getPlanLimits(plan: string) {
  switch(plan) {
    case 'starter': return { credits: 1000, limit: 100, name: 'Starter' };
    case 'pro': return { credits: 20000, limit: 10000, name: 'Pro One-time' };
    case 'monthly': return { credits: 1500, limit: 500, name: 'Monthly Pro' };
    default: return { credits: 100, limit: 10, name: 'Free' };
  }
}

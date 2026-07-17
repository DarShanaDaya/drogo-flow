'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For trying things out',
    features: [
      '10 diagrams (local storage)',
      '100 credits',
      'Exports with watermark',
      'Drag & Drop + Code editor',
      'All view modes',
      'Shareable links',
    ],
    cta: 'Get Started',
    variant: 'outline' as const,
    badge: null,
  },
  {
    name: 'Starter',
    price: '$4.90',
    period: 'one-time',
    description: 'For individual creators',
    features: [
      '1,000 credits',
      '100 diagrams',
      'All export formats, no watermark',
      '500 AI optimizations',
      '500 AI generations',
      '3D visualization',
      'Priority support',
    ],
    cta: 'Buy Starter',
    variant: 'default' as const,
    badge: 'Popular',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '$39.90',
    period: 'one-time',
    description: 'For professionals and teams',
    features: [
      '20,000 credits',
      'Unlimited diagrams',
      'All exports + Git bundle',
      '10,000 AI optimizations',
      '10,000 AI generations',
      'Custom themes',
      'Graph analytics',
      'Team sharing (coming soon)',
    ],
    cta: 'Buy Pro',
    variant: 'default' as const,
    badge: 'Best Value',
    popular: true,
  },
  {
    name: 'Monthly',
    price: '$2.90',
    period: '/month',
    description: 'Flexible monthly access',
    features: [
      '1,500 credits/month',
      '500 diagrams',
      'All exports, no watermark',
      '750 AI credits/month',
      'All view modes',
      'Cancel anytime',
      'Email support',
    ],
    cta: 'Start Monthly',
    variant: 'outline' as const,
    badge: null,
  },
];

export function PricingCards() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-lg">
          Start free, upgrade when you need to save. One-time or monthly — your choice.
        </p>
      </div>

      <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map(plan => (
          <Card key={plan.name} className={`relative flex flex-col transition-all bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:shadow-xl ${plan.popular ? 'border-zinc-900 dark:border-zinc-100 shadow-xl ring-2 ring-zinc-900/10 dark:ring-zinc-100/20' : ''}`}>
            {plan.badge && (
              <div className="absolute -top-3.5 left-6">
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${plan.popular ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 shadow-md' : 'bg-indigo-600 text-white shadow-sm'}`}>
                  {plan.badge}
                </span>
              </div>
            )}
            
            <CardHeader className="pt-6">
              <CardTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{plan.name}</CardTitle>
              <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">{plan.description}</CardDescription>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">{plan.price}</span>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{plan.period}</span>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 pt-2">
              <ul className="space-y-3">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    <svg className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter className="pt-4 pb-6">
              <Link href="/editor/new" className="w-full">
                <Button variant={plan.popular ? 'default' : plan.variant} className={`w-full rounded-full font-medium ${plan.popular ? 'h-10 text-sm shadow-md' : 'h-9 text-xs'}`}>
                  {plan.cta}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">All plans include access to all view modes (Flow, Code, 3D, Graph, Animation). Free plan stores diagrams locally.</p>
      </div>
    </div>
  );
}

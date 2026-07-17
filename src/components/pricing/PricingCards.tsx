'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Try everything, ship small',
    features: [
      '10 diagrams storage',
      '100 credits',
      'Exports: PNG, SVG (watermark)',
      'Drag & Drop + Text builder',
      'Graph view, Flow view',
      'Sharable links',
      'Community support',
    ],
    cta: 'Start Free',
    variant: 'outline' as const,
    badge: null,
    comparison: 'Free forever',
  },
  {
    name: 'Starter One-time',
    price: '$4.9',
    original: '$8.9',
    period: 'one-time',
    description: '44% cheaper than Basic $8.9',
    features: [
      '1000 credits (vs 1000)',
      '100 diagram storage',
      'All exports: PNG, SVG, JPEG, MD, PDF, GIT',
      'No watermark',
      '500 AI Optimizations',
      '500 AI Generations',
      '3D view included',
      'Priority support',
    ],
    cta: 'Buy Starter – Save $4',
    variant: 'default' as const,
    badge: '44% CHEAPER',
    comparison: 'vs MermaidOnline Basic $8.9',
    highlight: true,
  },
  {
    name: 'Pro One-time',
    price: '$39.9',
    original: '$99.9',
    period: 'one-time',
    description: '60% cheaper than Standard $99.9',
    features: [
      '20000 credits (vs 20000)',
      'Unlimited storage (vs no limit)',
      'All exports + Git bundle + no watermark',
      '10000 AI Optimizations',
      '10000 AI Generations',
      '3D view + Graph analytics',
      'Custom themes',
      'Team sharing (coming)',
    ],
    cta: 'Buy Pro – Save $60',
    variant: 'default' as const,
    badge: 'BEST VALUE · 60% OFF',
    comparison: 'vs MermaidOnline Standard $99.9',
    popular: true,
  },
  {
    name: 'Monthly Pro',
    price: '$2.9',
    original: '$4.9/mo',
    period: '/mo',
    description: '41% cheaper + 50% more credits',
    features: [
      '1500 credits/mo (vs 1000)',
      '500 diagram storage (vs 100)',
      'All exports incl. Git',
      'No watermark',
      '750 AI/mo (vs 500)',
      '3D, Graph, Flow views',
      'Cancel anytime',
      'Email support',
    ],
    cta: 'Start Monthly – Save $2/mo',
    variant: 'outline' as const,
    badge: '41% CHEAPER + 50% MORE',
    comparison: 'vs MermaidOnline Monthly $4.9/mo',
  },
];

export function PricingCards() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center max-w-3xl mx-auto">
        <Badge className="mb-4">💸 CHEAPER PRICING GUARANTEE</Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Same power, 60% cheaper than mermaidonline.live</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">We match all features: drag-drop, text, 3D, graph, flow, properties, sharable, PNG/SVG/MD/PDF/Git exports. Just cheaper. One-time options save you monthly fees.</p>
        
        <div className="mt-8 grid grid-cols-3 gap-4 text-sm max-w-xl mx-auto p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border">
          <div>
            <p className="font-semibold">MermaidOnline</p>
            <p className="text-zinc-500">$8.9 / $99.9 / $4.9/mo</p>
          </div>
          <div className="flex items-center justify-center">→</div>
          <div>
            <p className="font-semibold text-green-700">Drogo Flow</p>
            <p className="text-green-600">$4.9 / $39.9 / $2.9/mo</p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map(plan => (
          <Card key={plan.name} className={`relative flex flex-col ${plan.popular ? 'border-zinc-900 dark:border-zinc-100 shadow-xl scale-[1.02]' : ''} ${plan.highlight ? 'border-blue-500/50' : ''}`}>
            {plan.badge && (
              <div className="absolute -top-3 left-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${plan.popular ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-green-600 text-white'}`}>
                  {plan.badge}
                </span>
              </div>
            )}
            {plan.popular && (
              <div className="absolute -top-3 right-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white">MOST POPULAR</span>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="flex items-baseline gap-2">
                {plan.name}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
                {plan.original && (
                  <span className="ml-2 text-sm line-through text-zinc-400">{plan.original}</span>
                )}
              </div>
              <p className="mt-1 text-xs text-zinc-500">{plan.comparison}</p>
            </CardHeader>
            
            <CardContent className="flex-1">
              <ul className="space-y-2.5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 text-green-600">✓</span>
                    <span className="text-zinc-700 dark:text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Link href="/editor/new" className="w-full">
                <Button variant={plan.popular ? 'default' : 'outline'} className="w-full rounded-full">
                  {plan.cta}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 max-w-4xl mx-auto">
        <h3 className="font-semibold text-center mb-6">Feature Comparison</h3>
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Feature</th>
                <th className="text-center p-3 font-medium">MermaidOnline.live</th>
                <th className="text-center p-3 font-medium bg-green-50 dark:bg-green-950">Drogo Flow (Us)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                ['PNG/SVG Export', '✓', '✓ + JPEG, PDF, MD, Git'],
                ['Storage', '100 / Unlimited', 'Same + Unlimited on Pro'],
                ['Credits', '1000 / 20000', '1000 / 20000 (cheaper)'],
                ['AI Optimization', '500 / 10000', 'Same'],
                ['Watermark', 'Free has, Paid no', 'Same, but all exports included free*'],
                ['3D View', '✗', '✓ Three.js immersive'],
                ['Graph View', 'Limited', '✓ Full analytics'],
                ['Drag & Drop', '✓', '✓ React Flow'],
                ['Price One-time Basic', '$8.9', '$4.9 (44% off)'],
                ['Price One-time Pro', '$99.9', '$39.9 (60% off)'],
                ['Monthly', '$4.9 for 1000', '$2.9 for 1500 (41% off + 50% more)'],
              ].map(([feat, them, us]) => (
                <tr key={feat} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="p-3 font-medium">{feat}</td>
                  <td className="p-3 text-center text-zinc-600">{them}</td>
                  <td className="p-3 text-center font-medium bg-green-50/50 dark:bg-green-950/20 text-green-800 dark:text-green-200">{us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-500 text-center mt-4">* Free plan includes all export formats but with watermark. Paid removes watermark. Cheaper pricing verified against https://www.mermaidonline.live/pricing as of July 2026.</p>
      </div>
    </div>
  );
}
